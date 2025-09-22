import React from 'react';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, setFilters }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.inputGroup}>
        <label htmlFor="searchTerm" className={styles.label}>Buscar por descripción</label>
        <input
          type="text"
          id="searchTerm"
          name="searchTerm"
          className={styles.input}
          value={filters.searchTerm}
          onChange={handleInputChange}
          placeholder="Ej: Alquiler, Sueldo..."
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="startDate" className={styles.label}>Desde</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className={styles.dateInput}
          value={filters.startDate}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="endDate" className={styles.label}>Hasta</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          className={styles.dateInput}
          value={filters.endDate}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={clearFilters} className={styles.button}>Limpiar</button>
    </div>
  );
}