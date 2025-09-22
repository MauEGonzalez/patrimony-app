import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext.jsx';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import ExpensesChart from '../../components/expensesChart/ExpensesChart.jsx';
import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EditModal from '../../components/editModal/EditModal.jsx';
import FilterBar from '../../components/filterBar/FilterBar.jsx';
import styles from './GastosPage.module.css';

export default function GastosPage() {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', startDate: '', endDate: '' });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Varios');
  const [formType, setFormType] = useState('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      return;
    };
    const userId = currentUser.uid;
    const q = query(collection(db, `users/${userId}/expenses`));
    const unsubscribe = onSnapshot(q, (snap) => setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [currentUser]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date + 'T00:00:00');
      const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
      const endDate = filters.endDate ? new Date(filters.endDate + 'T00:00:00') : null;
      return expense.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
             (startDate ? expenseDate >= startDate : true) &&
             (endDate ? expenseDate <= endDate : true);
    });
  }, [expenses, filters]);

  const chartData = useMemo(() => {
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    }, {});
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser?.uid;
    if (!userId) { showErrorAlert('Error', 'Refresca la página.'); return; };
    if (!description.trim() || !amount) { showErrorAlert('Faltan datos', 'Descripción y monto son obligatorios.'); return; };
    await addDoc(collection(db, `users/${userId}/expenses`), { description, amount: parseFloat(amount), date, category });
    showSuccessAlert('¡Gasto añadido!');
    setDescription(''); setAmount(''); setCategory('Varios');
  };

  const handleDelete = async (type, id) => {
    const userId = currentUser?.uid;
    if (!userId) return;
    const result = await showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/expenses`, id));
      showSuccessAlert('¡Eliminado!');
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const formProps = {
    formData: { formType, description, amount, date, category },
    handleFormChange: { setDescription, setAmount, setDate, setCategory, setFormType },
    handleFormSubmit
  };

  return (
    <>
      <div>
        <h1 className={styles.title}>Gestión de Gastos</h1>
        <div className={styles.grid}>
          <div className={styles.column}>
            <AddTransactionForm {...formProps} />
            <ExpensesChart data={chartData} />
          </div>
          <div className={styles.column}>
            <FilterBar filters={filters} setFilters={setFilters} />
            <ItemList title="Historial de Gastos" items={filteredExpenses} type="expenses" onDelete={handleDelete} onEdit={handleOpenEditModal} color="red" />
          </div>
        </div>
      </div>
      <EditModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={editingItem}
          type="expenses"
          userId={currentUser?.uid}
      />
    </>
  );
}