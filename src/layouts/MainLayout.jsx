import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar.jsx';
import Header from '../components/header/Header.jsx';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Overlay para cerrar el menú al hacer clic afuera */}
      {isNavOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <Navbar 
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
      />

      <div className={styles.mainContent}>
        <Header onMenuClick={() => setIsNavOpen(true)} />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}