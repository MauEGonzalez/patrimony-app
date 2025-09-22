import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import { UserCircleIcon } from '../../components/icons/Icons';
import AvatarSelector from '../../components/avatarSelector/AvatarSelector';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { currentUser, loading } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Efecto para rellenar los campos una vez que currentUser esté disponible
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setSelectedAvatar(currentUser.photoURL || '');
    }
  }, [currentUser]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (displayName === currentUser?.displayName && selectedAvatar === currentUser?.photoURL) {
      showErrorAlert('Sin cambios', 'No has modificado tu nombre o avatar.');
      return;
    }
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: selectedAvatar,
      });
      showSuccessAlert('¡Perfil actualizado!', 'Los cambios se reflejarán en toda la app.');
    } catch (error) {
      console.error("Profile update error:", error);
      showErrorAlert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showErrorAlert('Campos vacíos', 'Debes ingresar tu contraseña actual y la nueva.');
      return;
    }
    if (newPassword.length < 6) {
      showErrorAlert('Contraseña débil', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      showSuccessAlert('¡Contraseña cambiada!', 'La próxima vez que inicies sesión, usa tu nueva contraseña.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error("Password change error:", error);
      showErrorAlert('Error', 'La contraseña actual es incorrecta o ocurrió un error.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Mientras carga la información del usuario, mostramos un mensaje
  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Cargando Perfil...</h1>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Mi Perfil</h1>
      <div className={styles.card}>
        <form onSubmit={handleProfileUpdate}>
          <div className={styles.profileHeader}>
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="Avatar actual" className={styles.currentAvatar} />
            ) : (
              <UserCircleIcon />
            )}
          </div>
          <AvatarSelector 
            selectedAvatar={selectedAvatar}
            onSelectAvatar={setSelectedAvatar}
          />
          <div className={styles.field}>
            <label>Nombre a mostrar</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Tu nombre o apodo" />
          </div>
          <div className={styles.field}>
            <label>Correo Electrónico</label>
            <input type="email" value={currentUser?.email || ''} disabled />
            <p className={styles.emailHelpText}>El correo electrónico no se puede cambiar.</p>
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Cambios de Perfil'}
          </button>
        </form>

        <hr className={styles.divider} />

        <form onSubmit={handleChangePassword}>
          <h2 className={styles.passwordTitle}>Cambiar Contraseña</h2>
          <div className={styles.field}>
            <label>Contraseña Actual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Nueva Contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button type="submit" className={styles.button} disabled={isChangingPassword}>
            {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}