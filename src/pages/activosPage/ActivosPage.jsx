import React, { useState, useEffect, useMemo } from 'react';
import { db, auth } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from "firebase/firestore";
import { formatCurrency } from '../../utils/helpers.js';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EditModal from '../../components/editModal/EditModal.jsx';
import FilterBar from '../../components/filterBar/FilterBar.jsx';
import styles from './ActivosPage.module.css';

export default function ActivosPage() {
  const [assets, setAssets] = useState([]);
  const [userId, setUserId] = useState(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    startDate: '', // Los filtros de fecha no se usarán aquí pero el componente los espera
    endDate: '',
  });

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Vehículo');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => { if (user) setUserId(user.uid); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, `users/${userId}/assets`));
    const unsubscribe = onSnapshot(q, (snap) => {
      setAssets(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  const filteredAssets = useMemo(() => {
    // Para activos, solo filtramos por descripción
    return assets.filter(asset =>
      asset.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
  }, [assets, filters.searchTerm]);

  const totalAssets = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.amount, 0);
  }, [assets]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { showErrorAlert('Error', 'Refresca la página.'); return; }
    if (!description.trim() || !amount) { showErrorAlert('Faltan datos', 'Descripción y valor son obligatorios.'); return; };
    
    const newAsset = { description, amount: parseFloat(amount), category };
    await addDoc(collection(db, `users/${userId}/assets`), newAsset);
    showSuccessAlert('¡Activo añadido!');
    
    setDescription(''); setAmount(''); setCategory('Vehículo');
  };

  const handleDelete = async (type, id) => {
    const result = await showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/assets`, id));
      showSuccessAlert('¡Eliminado!');
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const formProps = {
    formData: { formType: 'asset', description, amount, category },
    handleFormChange: { setDescription, setAmount, setCategory },
    handleFormSubmit
  };

  return (
    <>
      <div>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Gestión de Activos</h1>
          <p>Añade los bienes de valor que posees para calcular tu patrimonio neto.</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.column}>
            <AddTransactionForm {...formProps} />
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Total de Activos</h2>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8'}}>
                {formatCurrency(totalAssets)}
              </p>
            </div>
          </div>
          <div className={styles.column}>
            <FilterBar filters={filters} setFilters={setFilters} />
            <ItemList title="Mis Activos" items={filteredAssets} type="assets" onDelete={handleDelete} onEdit={handleOpenEditModal} color="blue" isAsset={true} />
          </div>
        </div>
      </div>
      <EditModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={editingItem}
          type="assets"
          userId={userId}
      />
    </>
  );
}