import React, { useState } from 'react';
import styles from './AddGoalForm.module.css';

export default function AddGoalForm({ onAddGoal }) {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddGoal(goalName, targetAmount);
    setGoalName('');
    setTargetAmount('');
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Crear Nuevo Objetivo</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="goalName" className={styles.label}>Nombre del Objetivo</label>
          <input
            type="text"
            id="goalName"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className={styles.input}
            placeholder="Ej: Viaje a Brasil"
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className={styles.label}>Monto Objetivo</label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className={styles.input}
            placeholder="500000"
          />
        </div>
        <button type="submit" className={styles.button}>Crear Objetivo</button>
      </form>
    </div>
  );
}