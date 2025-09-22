import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext.jsx';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import { today, formatCurrency } from '../../utils/helpers.js';

import ActionPlan from '../../components/actionPlan/ActionPlan.jsx';
import Summary from '../../components/summary/Summary.jsx';
import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EditModal from '../../components/editModal/EditModal.jsx';
import EvolutionChart from '../../components/evolutionChart/EvolutionChart.jsx';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
    const { currentUser } = useAuth();

    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]);
    const [assets, setAssets] = useState([]);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState('');

    const [formType, setFormType] = useState('income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('Varios');

    useEffect(() => {
        if (!currentUser) {
            setIncomes([]);
            setExpenses([]);
            setDebts([]);
            setAssets([]);
            return;
        };

        const userId = currentUser.uid;
        const setupListener = (collectionName, setState) => {
          const q = query(collection(db, `users/${userId}/${collectionName}`));
          const unsubscribe = onSnapshot(q, (snap) => setState(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
          return unsubscribe;
        };

        const unsubs = [
          setupListener('incomes', setIncomes),
          setupListener('expenses', setExpenses),
          setupListener('debts', setDebts),
          setupListener('assets', setAssets),
        ];
        
        return () => unsubs.forEach(unsub => unsub());
    }, [currentUser]);

    const totals = useMemo(() => {
        const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
        const balance = totalIncome - totalExpenses;
        const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
        const totalDebts = debts.reduce((sum, item) => sum + item.amount, 0);
        const netWorth = totalAssets - totalDebts;
        return { totalIncome, totalExpenses, balance, netWorth };
    }, [incomes, expenses, debts, assets]);
    
    const actionPlan = useMemo(() => {
        const upcomingDebts = debts.filter(d => new Date(d.dueDate + 'T00:00:00') >= today).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        if (upcomingDebts.length === 0) return { debts: [], totalDailyTarget: 0 };
        const calculatedDebts = upcomingDebts.map(debt => {
          const dueDateObj = new Date(debt.dueDate + 'T00:00:00');
          const daysUntilDue = Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24));
          let dailyTarget = daysUntilDue > 0 ? debt.amount / daysUntilDue : debt.amount;
          return { ...debt, daysUntilDue, dailyTarget };
        });
        const totalDailyTarget = calculatedDebts.reduce((sum, debt) => sum + debt.dailyTarget, 0);
        return { debts: calculatedDebts, totalDailyTarget };
    }, [debts]);
    
    const evolutionChartData = useMemo(() => {
        const monthlyData = {};
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const processTransactions = (transactions, type) => {
            transactions.forEach(t => {
                const transactionDate = new Date(t.date + 'T00:00:00');
                const year = transactionDate.getFullYear();
                const month = transactionDate.getMonth();
                const key = `${year}-${String(month).padStart(2, '0')}`;
                if (!monthlyData[key]) {
                    monthlyData[key] = { month: `${monthNames[month]} ${year}`, ingresos: 0, gastos: 0, };
                }
                monthlyData[key][type] += t.amount;
            });
        };
        processTransactions(incomes, 'ingresos');
        processTransactions(expenses, 'gastos');
        return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
    }, [incomes, expenses]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const userId = currentUser?.uid;
        if (!userId) { showErrorAlert('Error de Conexión', 'Refresca la página.'); return; }
        if (!description.trim() || !amount) { showErrorAlert('Campos Incompletos', 'Descripción y monto son obligatorios.'); return; }
        if (formType === 'debt' && !dueDate) { showErrorAlert('Campo Requerido', 'Fecha de vencimiento es obligatoria.'); return; }
        const newEntry = { description, amount: parseFloat(amount) };
        let collectionName = '';
        if (formType === 'income') { collectionName = 'incomes'; Object.assign(newEntry, { date }); }
        else if (formType === 'expense') { collectionName = 'expenses'; Object.assign(newEntry, { date, category }); }
        else if (formType === 'debt') { collectionName = 'debts'; Object.assign(newEntry, { dueDate }); }
        await addDoc(collection(db, `users/${userId}/${collectionName}`), newEntry);
        showSuccessAlert('¡Añadido con éxito!');
        setDescription(''); setAmount(''); setDate(new Date().toISOString().split('T')[0]); setDueDate(''); setCategory('Varios');
    };
    const handleDelete = async (type, id) => {
        const userId = currentUser?.uid;
        if (!userId) return;
        const result = await showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer.');
        if (result.isConfirmed) {
          await deleteDoc(doc(db, `users/${userId}/${type}`, id));
          showSuccessAlert('¡Eliminado!');
        }
    };
    const handleOpenEditModal = (item, type) => {
        setEditingItem(item);
        setEditingType(type);
        setIsModalOpen(true);
    };
    const handlePayDebt = async (debt) => {
        const userId = currentUser?.uid;
        if (!userId) return;
        const result = await showConfirmDialog('¿Marcar como pagada?', `Esto creará un gasto por ${formatCurrency(debt.amount)} y eliminará la deuda.`);
        if (result.isConfirmed) {
            const newExpense = {
                description: `Pago: ${debt.description}`,
                amount: debt.amount,
                category: 'Pago de Deudas',
                date: new Date().toISOString().split('T')[0]
            };
            await addDoc(collection(db, `users/${userId}/expenses`), newExpense);
            await deleteDoc(doc(db, `users/${userId}/debts`, debt.id));
            showSuccessAlert('¡Deuda pagada!');
        }
    };
    
    return (
        <>
            <div className={styles.mainGrid}>
              <div className={styles.column}>
                <ActionPlan plan={actionPlan} />
                <Summary totals={totals} />
                <AddTransactionForm 
                  formData={{ formType, description, amount, date, dueDate, category }}
                  handleFormChange={{ setFormType, setDescription, setAmount, setDate, setDueDate, setCategory }}
                  handleFormSubmit={handleFormSubmit} />
              </div>
              <div className={styles.column}>
                <ItemList title="Ingresos" items={incomes} type="incomes" onDelete={handleDelete} onEdit={handleOpenEditModal} color="green" path="/ingresos" />
                <ItemList title="Gastos" items={expenses} type="expenses" onDelete={handleDelete} onEdit={handleOpenEditModal} color="red" path="/gastos" />
                <ItemList title="Deudas" items={debts} type="debts" onDelete={handleDelete} onEdit={handleOpenEditModal} onPay={handlePayDebt} color="yellow" isDebt={true} path="/deudas" />
              </div>
              <div className={styles.chartSection}>
                <EvolutionChart data={evolutionChartData} />
              </div>
            </div>

            <EditModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={editingItem}
                type={editingType}
                userId={currentUser?.uid}
            />
        </>
    );
}