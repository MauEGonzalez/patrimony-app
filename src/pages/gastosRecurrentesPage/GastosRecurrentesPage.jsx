import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import styles from './GastosRecurrentesPage.module.css';
import AddRecurringExpenseForm from '../../components/addRecurringExpenseForm/AddRecurringExpenseForm.jsx';
import RecurringExpenseCard from '../../components/recurringExpenseCard/RecurringExpenseCard.jsx';

export default function GastosRecurrentesPage() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => { if (user) setUserId(user.uid); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = collection(db, `users/${userId}/recurringExpenses`);
    const unsubscribe = onSnapshot(q, (snap) => {
      setRecurringExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  const handleAddRecurring = async (expenseData) => {
    if (!expenseData.description.trim() || !expenseData.amount) {
      showErrorAlert('Faltan datos', 'La descripción y el monto son obligatorios.');
      return;
    }
    const newRecurring = {
      ...expenseData,
      amount: parseFloat(expenseData.amount),
      createdAt: new Date(),
    };
    await addDoc(collection(db, `users/${userId}/recurringExpenses`), newRecurring);
    showSuccessAlert('¡Plantilla de gasto creada!');
  };

  const handleDeleteRecurring = async (id) => {
    const result = await showConfirmDialog('¿Eliminar plantilla?', 'Esto no afectará los gastos que ya hayas registrado.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/recurringExpenses`, id));
      showSuccessAlert('Plantilla eliminada.');
    }
  };

  const handleLogExpense = async (recurringExpense) => {
    const newExpense = {
      description: recurringExpense.description,
      amount: recurringExpense.amount,
      category: recurringExpense.category,
      date: new Date().toISOString().split('T')[0], // Gasto registrado hoy
    };
    await addDoc(collection(db, `users/${userId}/expenses`), newExpense);
    showSuccessAlert('¡Gasto registrado con éxito!');
  };

  return (
    <div>
      <h1 className={styles.title}>Gastos Recurrentes</h1>
      <div className={styles.grid}>
        <div>
          <AddRecurringExpenseForm onAdd={handleAddRecurring} />
        </div>
        <div className={styles.expensesContainer}>
          {recurringExpenses.map(expense => (
            <RecurringExpenseCard
              key={expense.id}
              expense={expense}
              onLog={handleLogExpense}
              onDelete={handleDeleteRecurring}
            />
          ))}
        </div>
      </div>
    </div>
  );
}