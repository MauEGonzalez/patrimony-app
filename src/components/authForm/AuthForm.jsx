import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

export default function AuthForm({ formType, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLogin = formType === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Correo Electrónico</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Contraseña</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className={styles.button}>
          {isLogin ? 'Ingresar' : 'Registrarse'}
        </button>
      </form>
      <p className={styles.linkText}>
        {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
        <Link to={isLogin ? '/register' : '/login'} className={styles.link}>
          {isLogin ? 'Regístrate' : 'Inicia Sesión'}
        </Link>
      </p>
    </div>
  );
}