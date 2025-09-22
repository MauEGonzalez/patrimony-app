import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Si todavía está cargando la información de autenticación,
  // mostramos una pantalla de carga para no redirigir prematuramente.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: 'white' }}>
        <h2>Cargando Patrimony...</h2>
      </div>
    );
  }

  // Una vez que ha terminado de cargar, si NO hay usuario, redirigimos al login.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Si terminó de cargar y SÍ hay un usuario, mostramos la página solicitada.
  return children;
}