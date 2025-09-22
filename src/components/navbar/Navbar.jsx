import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';
import { XIcon } from '../icons/Icons'; // Importamos el nuevo icono X

export default function Navbar({ isOpen, onClose }) {
  // Cuando se hace clic en un enlace, también cerramos el menú
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <aside 
      className={`${styles.navbar} ${isOpen ? styles.open : ''}`}
    >
      <div className={styles.header}>
        <Link to="/" className={styles.titleLink} onClick={handleLinkClick}>
          <h1 className={styles.title}>Patrimony</h1>
        </Link>
        <button onClick={onClose} className={styles.closeButton}>
          <XIcon />
        </button>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Dashboard
        </NavLink>
        <NavLink to="/ingresos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Ingresos
        </NavLink>
        <NavLink to="/gastos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Gastos
        </NavLink>
        <NavLink to="/gastos-recurrentes" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Gastos Recurrentes
        </NavLink>
        <NavLink to="/deudas" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Deudas
        </NavLink>
        <NavLink to="/activos" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Activos
        </NavLink>
        <NavLink to="/ahorros" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link} onClick={handleLinkClick}>
          Objetivos de Ahorro
        </NavLink>
      </nav>
    </aside>
  );
}