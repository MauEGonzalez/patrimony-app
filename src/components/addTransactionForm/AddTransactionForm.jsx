import React from 'react';
import { PlusCircleIcon } from '../icons/Icons.jsx';
import styles from './AddTransactionForm.module.css';

const expenseCategories = ["Comida", "Servicios", "Transporte", "Vivienda", "Salud", "Ocio", "Educación", "Ropa", "Varios"];
const assetCategories = ["Vehículo", "Propiedad", "Herramientas", "Inversiones", "Otro"];

export default function AddTransactionForm({ formData, handleFormChange, handleFormSubmit }) {
  const { formType, description, amount, date, dueDate, category } = formData;
  const { setFormType, setDescription, setAmount, setDate, setDueDate, setCategory } = handleFormChange;

  const isAssetForm = formType === 'asset';

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{isAssetForm ? 'Añadir Activo' : 'Añadir Movimiento'}</h2>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        {!isAssetForm && (
            <div>
              <label className={styles.label}>Tipo</label>
              <select value={formType} onChange={(e) => setFormType(e.target.value)} className={styles.select}>
                <option value="income">Ingreso</option>
                <option value="expense">Gasto</option>
                <option value="debt">Deuda</option>
              </select>
            </div>
        )}
        <div>
          <label className={styles.label}>Descripción</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={isAssetForm ? "Ej: Coche, Casa..." : "Ej: Sueldo, Alquiler..."} className={styles.input}/>
        </div>
        <div>
          <label className={styles.label}>{isAssetForm ? 'Valor Estimado' : 'Monto'}</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" className={styles.input}/>
        </div>
        
        {formType === 'expense' && (
          <div>
            <label className={styles.label}>Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
              {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        )}
        
        {isAssetForm && (
            <div>
              <label className={styles.label}>Categoría del Activo</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                {assetCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
        )}

        {formType === 'debt' && (
          <div>
            <label className={styles.label}>Fecha de Vencimiento</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={styles.input} />
          </div>
        )}

        {(formType === 'income' || formType === 'expense') && (
            <div>
                <label className={styles.label}>Fecha</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} />
            </div>
        )}

        <button type="submit" className={styles.button}>
            <PlusCircleIcon />
            {isAssetForm ? 'Añadir Activo' : 'Añadir'}
        </button>
      </form>
    </div>
  );
}