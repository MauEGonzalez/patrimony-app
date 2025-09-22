import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.title}>Página no encontrada</h2>
      <p className={styles.text}>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className={styles.link}>
        Volver al Dashboard
      </Link>
    </div>
  );
}