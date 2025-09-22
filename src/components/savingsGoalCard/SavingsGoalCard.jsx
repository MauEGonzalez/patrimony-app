import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import { TrashIcon } from '../icons/Icons';
import styles from './SavingsGoalCard.module.css';

export default function SavingsGoalCard({ goal, onDelete, onAddContribution, onWithdrawContribution }) {
  const [contribution, setContribution] = useState('');
  const [withdrawal, setWithdrawal] = useState('');
  
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  const handleAddClick = () => {
    onAddContribution(goal.id, contribution);
    setContribution('');
  };

  const handleWithdrawClick = () => {
    onWithdrawContribution(goal.id, withdrawal);
    setWithdrawal('');
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.goalName}>{goal.name}</h3>
        <button onClick={() => onDelete(goal.id)} className={styles.deleteButton} title="Eliminar Objetivo">
          <TrashIcon />
        </button>
      </div>
      
      <div>
        <div className={styles.amounts}>
          <span className={styles.currentAmount}>{formatCurrency(goal.currentAmount)}</span>
          <span>de {formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.actions}>
        <input 
          type="number"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          className={styles.input}
          placeholder="Añadir ahorro"
        />
        <button onClick={handleAddClick} className={styles.button}>Añadir</button>
      </div>

      {/* --- NUEVA SECCIÓN PARA RETIROS --- */}
      <div className={styles.actions}>
        <input 
          type="number"
          value={withdrawal}
          onChange={(e) => setWithdrawal(e.target.value)}
          className={styles.input}
          placeholder="Retirar ahorro"
        />
        <button onClick={handleWithdrawClick} className={`${styles.button} ${styles.withdrawButton}`}>Retirar</button>
      </div>
    </div>
  );
}