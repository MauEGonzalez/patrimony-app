import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { showErrorAlert } from '../../utils/alerts';
import AuthForm from '../../components/authForm/AuthForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige al dashboard después del login
    } catch (error) {
      showErrorAlert('Error de Inicio de Sesión', 'El correo o la contraseña son incorrectos.');
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.page}>
      <AuthForm 
        formType="login"
        onSubmit={handleLogin}
      />
    </div>
  );
}