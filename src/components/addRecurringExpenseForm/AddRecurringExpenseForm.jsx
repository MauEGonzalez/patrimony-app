import React, { useState } from 'react';
import styles from './AddRecurringExpenseForm.module.css';

const expenseCategories = ["Comida", "Servicios", "Transporte", "Vivienda", "Salud", "Ocio", "Educación", "Ropa", "Varios"];

export default function AddRecurringExpenseForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Varios');
  const [frequency, setFrequency] = useState('Semanal');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ description, amount, category, frequency });
    setDescription('');
    setAmount('');
    setCategory('Varios');
    setFrequency('Semanal');
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Definir Gasto Recurrente</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            placeholder="Ej: Alquiler de auto"
          />
        </div>
        <div>
          <label className={styles.label}>Monto</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.input}
            placeholder="15000"
          />
        </div>
        <div>
          <label className={styles.label}>Categoría</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.label}>Frecuencia</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={styles.select}>
            <option>Diario</option>
            <option>Semanal</option>
            <option>Quincenal</option>
            <option>Mensual</option>
          </select>
        </div>
        <button type="submit" className={styles.button}>Guardar Plantilla</button>
      </form>
    </div>
  );
}