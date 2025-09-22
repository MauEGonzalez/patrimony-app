import React from 'react';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './ActionPlan.module.css';

export default function ActionPlan({ plan }) {
  const { debts, totalDailyTarget } = plan;

  const getDaysText = (days) => {
    if (days < 0) return <span style={{ color: '#f87171' }}>Vencido</span>;
    if (days === 0) return <span style={{ color: '#facc15' }}>Vence Hoy</span>;
    return `Vence en ${days} día(s)`;
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Plan de Acción de Deudas</h2>
      {debts && debts.length > 0 ? (
        <>
          <ul className={styles.debtList}>
            {debts.map(debt => (
              <li key={debt.id} className={styles.debtItem}>
                <div className={styles.debtInfo}>
                  <div>
                    <p className={styles.debtDescription}>{debt.description}</p>
                    <p className={styles.debtDays}>{getDaysText(debt.daysUntilDue)}</p>
                  </div>
                  <p className={styles.debtTarget}>{formatCurrency(debt.dailyTarget)}/día</p>
                </div>
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
          <div className={styles.totalSection}>
            <p className={styles.totalLabel}>Objetivo Diario Total</p>
            <p className={styles.totalAmount}>{formatCurrency(totalDailyTarget)}/día</p>
          </div>
        </>
      ) : (
        <p className={styles.noDebts}>¡Felicitaciones! No tienes deudas próximas a vencer.</p>
      )}
    </div>
  );
}