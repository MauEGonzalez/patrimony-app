import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { showErrorAlert } from '../../utils/alerts';
import AuthForm from '../../components/authForm/AuthForm';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige al dashboard después del registro
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showErrorAlert('Error de Registro', 'Este correo electrónico ya está en uso.');
      } else {
        showErrorAlert('Error de Registro', 'Ocurrió un error. Inténtalo de nuevo.');
      }
      console.error("Register error:", error);
    }
  };

  return (
    <div className={styles.page}>
      <AuthForm 
        formType="register"
        onSubmit={handleRegister}
      />
    </div>
  );
}