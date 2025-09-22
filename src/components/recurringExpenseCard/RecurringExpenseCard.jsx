import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import { TrashIcon } from '../icons/Icons';
import styles from './RecurringExpenseCard.module.css';

export default function RecurringExpenseCard({ expense, onLog, onDelete }) {
  return (
    <div className={styles.card}>
      <div>
        <div className={styles.header}>
            <h3 className={styles.description}>{expense.description}</h3>
            <span className={styles.amount}>{formatCurrency(expense.amount)}</span>
        </div>
        <div className={styles.details}>
            <span className={styles.category}>{expense.category}</span>
            <span>{expense.frequency}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => onLog(expense)} className={styles.logButton}>
          Registrar Gasto de Hoy
        </button>
        <button onClick={() => onDelete(expense.id)} className={styles.deleteButton} title="Eliminar Plantilla">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}