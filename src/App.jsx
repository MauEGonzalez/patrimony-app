import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext'; 
import ProtectedRoute from './components/protectedRoute/ProtectedRoute.jsx';

import MainLayout from './layouts/MainLayout.jsx';
import DashboardPage from './pages/dashboardPage/DashboardPage.jsx';
import IngresosPage from './pages/ingresosPage/IngresosPage.jsx';
import GastosPage from './pages/gastosPage/GastosPage.jsx';
import DeudasPage from './pages/deudasPage/DeudasPage.jsx';
import ActivosPage from './pages/activosPage/ActivosPage.jsx';
import AhorrosPage from './pages/ahorrosPage/AhorrosPage.jsx';
import GastosRecurrentesPage from './pages/gastosRecurrentesPage/GastosRecurrentesPage.jsx';
import LoginPage from './pages/loginPage/LoginPage.jsx';
import RegisterPage from './pages/registerPage/RegisterPage.jsx';
import ProfilePage from './pages/profilePage/ProfilePage.jsx'; // --- NUEVO ---
import NotFoundPage from './pages/notFoundPage/NotFoundPage.jsx'; // --- NUEVO ---

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/" 
          element={ <ProtectedRoute> <MainLayout /> </ProtectedRoute> }
        >
          <Route index element={<DashboardPage />} />
          <Route path="ingresos" element={<IngresosPage />} />
          <Route path="gastos" element={<GastosPage />} />
          <Route path="gastos-recurrentes" element={<GastosRecurrentesPage />} />
          <Route path="deudas" element={<DeudasPage />} />
          <Route path="activos" element={<ActivosPage />} />
          <Route path="ahorros" element={<AhorrosPage />} />
          <Route path="perfil" element={<ProfilePage />} /> {/* --- NUEVO --- */}
        </Route>
        <Route path="*" element={<NotFoundPage />} /> {/* --- NUEVO --- */}
      </Routes>
    </AuthProvider>
  );
}