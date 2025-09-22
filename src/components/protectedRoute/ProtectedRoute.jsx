// src/components/protectedRoute/ProtectedRoute.jsx (SIMPLIFICADO)

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth(); // Ya no necesitamos 'loading' aquí

  // Como el AuthProvider ya esperó, aquí solo verificamos si hay usuario o no.
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}