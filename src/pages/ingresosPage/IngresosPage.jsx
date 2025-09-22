import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext.jsx';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EditModal from '../../components/editModal/EditModal.jsx';
import FilterBar from '../../components/filterBar/FilterBar.jsx';
import styles from './IngresosPage.module.css';

export default function IngresosPage() {
  const { currentUser } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', startDate: '', endDate: '' });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState('income');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setIncomes([]);
      return;
    };
    const userId = currentUser.uid;
    const q = query(collection(db, `users/${userId}/incomes`));
    const unsubscribe = onSnapshot(q, (snap) => setIncomes(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [currentUser]);

  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.date + 'T00:00:00');
      const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
      const endDate = filters.endDate ? new Date(filters.endDate + 'T00:00:00') : null;
      return income.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
             (startDate ? incomeDate >= startDate : true) &&
             (endDate ? incomeDate <= endDate : true);
    });
  }, [incomes, filters]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser?.uid;
    if (!userId) { showErrorAlert('Error', 'Refresca la página.'); return; };
    if (!description.trim() || !amount) { showErrorAlert('Faltan datos', 'Descripción y monto son obligatorios.'); return; };
    await addDoc(collection(db, `users/${userId}/incomes`), { description, amount: parseFloat(amount), date });
    showSuccessAlert('¡Ingreso añadido!');
    setDescription(''); setAmount('');
  };

  const handleDelete = async (type, id) => {
    const userId = currentUser?.uid;
    if (!userId) return;
    const result = await showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/incomes`, id));
      showSuccessAlert('¡Eliminado!');
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const formProps = {
    formData: { formType, description, amount, date },
    handleFormChange: { setDescription, setAmount, setDate, setFormType },
    handleFormSubmit
  };

  return (
    <>
      <div>
        <h1 className={styles.title}>Gestión de Ingresos</h1>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
          <div>
            <AddTransactionForm {...formProps} />
          </div>
          <div>
            <FilterBar filters={filters} setFilters={setFilters} />
            <ItemList title="Historial de Ingresos" items={filteredIncomes} type="incomes" onDelete={handleDelete} onEdit={handleOpenEditModal} color="green" />
          </div>
        </div>
      </div>
      <EditModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={editingItem}
          type="incomes"
          userId={currentUser?.uid}
      />
    </>
  );
}