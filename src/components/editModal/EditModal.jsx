import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';
import { showSuccessAlert, showErrorAlert } from '../../utils/alerts.js';
import AddTransactionForm from '../addTransactionForm/AddTransactionForm.jsx';
import styles from './EditModal.module.css';

export default function EditModal({ isOpen, onClose, item, type, userId }) {
  // --- LOS HOOKS SE DECLARAN SIEMPRE PRIMERO ---
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Varios');

  // Actualizar el estado interno si el item a editar cambia
  useEffect(() => {
    if (item) {
      setDescription(item.description || '');
      setAmount(item.amount || '');
      setDate(item.date || '');
      setDueDate(item.dueDate || '');
      setCategory(item.category || 'Varios');
    }
  }, [item]);

  // --- LA CONDICIÓN DE SALIDA VA DESPUÉS DE LOS HOOKS ---
  if (!isOpen || !item) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      showErrorAlert('Error', 'Descripción y monto no pueden estar vacíos.');
      return;
    }

    const itemRef = doc(db, `users/${userId}/${type}`, item.id);
    const updatedData = { description, amount: parseFloat(amount) };

    if (type === 'incomes' || type === 'expenses') updatedData.date = date;
    if (type === 'expenses' || type === 'assets') updatedData.category = category;
    if (type === 'debts') updatedData.dueDate = dueDate;

    await updateDoc(itemRef, updatedData);
    showSuccessAlert('¡Actualizado!');
    onClose();
  };
  
  const formProps = {
    formData: { formType: type.slice(0, -1), description, amount, date, dueDate, category },
    handleFormChange: { setDescription, setAmount, setDate, setDueDate, setCategory },
    handleFormSubmit: handleUpdate
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <AddTransactionForm {...formProps} />
      </div>
    </div>
  );
}