// src/pages/dashboardPage/DashboardPage.jsx (CON LÓGICA MEJORADA)

import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, onSnapshot, query } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext.jsx';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import { today, formatCurrency } from '../../utils/helpers.js';

import ActionPlan from '../../components/actionPlan/ActionPlan.jsx';
import Summary from '../../components/summary/Summary.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EvolutionChart from '../../components/evolutionChart/EvolutionChart.jsx';
// Los componentes de formulario y modal no se necesitan en este archivo, se gestionan en sus propias páginas
// import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
// import EditModal from '../../components/editModal/EditModal.jsx';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
    const { currentUser } = useAuth();

    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [debts, setDebts] = useState([]);
    const [assets, setAssets] = useState([]);
  
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

    // --- LÓGICA MEJORADA: Resumen y totales ahora son para el MES ACTUAL ---
    const monthlyTotals = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filterByCurrentMonth = (item) => {
            const itemDate = new Date(item.date + 'T00:00:00');
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        };
        
        const monthlyIncomes = incomes.filter(filterByCurrentMonth);
        const monthlyExpenses = expenses.filter(filterByCurrentMonth);

        const totalIncome = monthlyIncomes.reduce((sum, item) => sum + item.amount, 0);
        const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
        const balance = totalIncome - totalExpenses;
        const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
        const totalDebts = debts.reduce((sum, item) => sum + item.amount, 0);
        const netWorth = totalAssets - totalDebts;
        return { totalIncome, totalExpenses, balance, netWorth };
    }, [incomes, expenses, debts, assets]);
    
    // --- LÓGICA MEJORADA: El Plan de Acción ahora considera el balance del mes ---
    const actionPlan = useMemo(() => {
        const upcomingDebts = debts.filter(d => new Date(d.dueDate + 'T00:00:00') >= today).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        if (upcomingDebts.length === 0) return { debts: [], totalDailyTarget: 0 };
        
        const calculatedDebts = upcomingDebts.map(debt => {
          const dueDateObj = new Date(debt.dueDate + 'T00:00:00');
          const daysUntilDue = Math.max(1, Math.ceil((dueDateObj - today) / (1000 * 60 * 60 * 24)));
          let dailyTarget = debt.amount / daysUntilDue;
          return { ...debt, daysUntilDue, dailyTarget };
        });

        const rawTotalDailyTarget = calculatedDebts.reduce((sum, debt) => sum + debt.dailyTarget, 0);

        // Calculamos el "excedente" diario basado en el balance del mes
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const dailySurplus = monthlyTotals.balance / daysInMonth;

        // El objetivo diario final es el objetivo de deudas MENOS el excedente que ya generas.
        // Usamos Math.max(0, ...) para que no muestre un objetivo negativo.
        const totalDailyTarget = Math.max(0, rawTotalDailyTarget - dailySurplus);
        
        return { debts: calculatedDebts, totalDailyTarget };
    }, [debts, monthlyTotals.balance]); // Ahora depende del balance mensual
    
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
    
    return (
        <>
            <div className={styles.mainGrid}>
              <div className={styles.column}>
                {/* Pasamos los datos actualizados a los componentes */}
                <ActionPlan plan={actionPlan} />
                <Summary totals={monthlyTotals} />
                {/* El formulario de "Añadir Movimiento" ya no vive en el Dashboard para simplificarlo */}
              </div>
              <div className={styles.column}>
                <ItemList title="Ingresos Recientes" items={[...incomes].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5)} type="incomes" color="green" path="/ingresos" />
                <ItemList title="Gastos Recientes" items={[...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5)} type="expenses" color="red" path="/gastos" />
                <ItemList title="Deudas Próximas" items={[...debts].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0,5)} type="debts" color="yellow" isDebt={true} path="/deudas" />
              </div>
              <div className={styles.chartSection}>
                <EvolutionChart data={evolutionChartData} />
              </div>
            </div>
            {/* El modal de edición tampoco es necesario aquí, ya que no hay botones para activarlo */}
        </>
    );
}