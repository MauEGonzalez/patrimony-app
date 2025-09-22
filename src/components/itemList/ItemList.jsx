import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, EditIcon, CheckCircleIcon } from '../icons/Icons.jsx';
import { formatDate, formatCurrency, today } from '../../utils/helpers.js';
import styles from './ItemList.module.css';

export default function ItemList({ title, items, type, onDelete, onEdit, onPay, color, isDebt = false, isAsset = false, path }) {
    const sortedItems = [...items].sort((a, b) => {
        if (isDebt || !isAsset) return new Date(isDebt ? a.dueDate : a.date) - new Date(isDebt ? b.dueDate : b.date);
        return b.amount - a.amount;
    });

    const getDebtStatusClass = (dueDateString) => {
        if (!isDebt) return '';

        const dueDate = new Date(dueDateString + 'T00:00:00');
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilDue < 0) {
            return styles.overdue; // Vencida
        }
        if (daysUntilDue <= 7) {
            return styles.dueSoon; // Próxima a vencer
        }
        return '';
    };

    const TitleComponent = path ? (
        <Link to={path} className={styles.titleLink}>
            <h2 className={styles.title}>{title} &rarr;</h2>
        </Link>
    ) : (
        <h2 className={styles.title}>{title}</h2>
    );
    
    return (
        <div className={styles.card}>
            {TitleComponent}
            {sortedItems.length > 0 ? (
                <ul className={styles.list}>
                    {sortedItems.map(item => (
                        <li key={item.id} className={`${styles.listItem} ${styles[color]} ${getDebtStatusClass(item.dueDate)}`}>
                            <div>
                                <p className={styles.description}>
                                    {item.description}
                                    {(type === 'expenses' || isAsset) && <span className={styles.category}>{item.category}</span>}
                                </p>
                                {!isAsset && (
                                    <p className={styles.date}>
                                        {isDebt ? `Vence: ${formatDate(item.dueDate)}` : `Fecha: ${formatDate(item.date)}`}
                                    </p>
                                )}
                            </div>
                            <div className={styles.amountWrapper}>
                               <span className={styles.amount}>{formatCurrency(item.amount)}</span>
                               {isDebt && onPay && (
                                  <button onClick={() => onPay(item)} className={`${styles.actionButton} ${styles.payButton}`} title="Marcar como Pagada">
                                      <CheckCircleIcon />
                                  </button>
                               )}
                               {onEdit && (
                                <button onClick={() => onEdit(item, type)} className={`${styles.actionButton} ${styles.editButton}`} title="Editar">
                                   <EditIcon/>
                                </button>
                               )}
                               <button onClick={() => onDelete(type, item.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Eliminar">
                                   <TrashIcon/>
                               </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.emptyText}>No hay {title.toLowerCase()} registrados.</p>
            )}
        </div>
    );
}