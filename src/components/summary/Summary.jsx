import React from 'react';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './Summary.module.css';

export default function Summary({ totals }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Resumen Financiero</h2>
      <div className={styles.row}>
        <span className={styles.incomeText}>Ingresos del Mes</span>
        <span className={`${styles.incomeText} ${styles.amount}`}>{formatCurrency(totals.totalIncome)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.expenseText}>Gastos del Mes</span>
        {/* --- LÍNEA CORREGIDA --- */}
        <span className={`${styles.expenseText} ${styles.amount}`}>{formatCurrency(totals.totalExpenses)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.balanceText}>Balance Mensual</span>
        <span className={`${styles.balanceAmount} ${styles.amount} ${totals.balance >= 0 ? styles.balanceText : styles.negativeBalanceText}`}>
          {formatCurrency(totals.balance)}
        </span>
      </div>
      <hr className={styles.divider}/>
      <div className={styles.row}>
        <span className={styles.netWorthText}>Patrimonio Neto</span>
        <span className={`${styles.balanceAmount} ${styles.netWorthText}`}>
          {formatCurrency(totals.netWorth)}
        </span>
      </div>
    </div>
  );
}