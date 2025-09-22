import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { MenuIcon, UserCircleIcon } from '../icons/Icons';
import styles from './Header.module.css';

export default function Header({ onMenuClick }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button onClick={onMenuClick} className={styles.menuButton}>
          <MenuIcon />
        </button>
      </div>
      <Link to="/" className={styles.logoLink}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logoTitle}>Patrimony</h1>
          <p className={styles.logoSubtitle}>Tu planificador financiero personal</p>
        </div>
      </Link>
      <div className={styles.userMenu} ref={dropdownRef}>
        {/* No renderizamos el menú hasta que la carga de auth haya terminado */}
        {!loading && (
          <>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className={styles.userButton}>
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Perfil" className={styles.avatar} />
              ) : (
                <UserCircleIcon />
              )}
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                {currentUser ? (
                  <>
                    <div className={styles.dropdownHeader}>
                      <p>Conectado como</p>
                      <strong>{currentUser.email}</strong>
                    </div>
                    <Link to="/perfil" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Mi Perfil
                    </Link>
                    <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}>
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Iniciar Sesión
                    </Link>
                    <Link to="/register" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Crear Cuenta
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}