import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from "firebase/firestore";
import { useAuth } from '../../context/AuthContext.jsx';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import { formatCurrency } from '../../utils/helpers.js';
import AddTransactionForm from '../../components/addTransactionForm/AddTransactionForm.jsx';
import ItemList from '../../components/itemList/ItemList.jsx';
import EditModal from '../../components/editModal/EditModal.jsx';
import FilterBar from '../../components/filterBar/FilterBar.jsx';
import styles from './DeudasPage.module.css';

export default function DeudasPage() {
  const { currentUser } = useAuth();
  const [debts, setDebts] = useState([]);
  const [filters, setFilters] = useState({ searchTerm: '', startDate: '', endDate: '' });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [formType, setFormType] = useState('debt');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setDebts([]);
      return;
    };
    const userId = currentUser.uid;
    const q = query(collection(db, `users/${userId}/debts`));
    const unsubscribe = onSnapshot(q, (snap) => setDebts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [currentUser]);

  const filteredDebts = useMemo(() => {
    return debts.filter(debt => {
      const debtDate = new Date(debt.dueDate + 'T00:00:00');
      const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
      const endDate = filters.endDate ? new Date(filters.endDate + 'T00:00:00') : null;
      return debt.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
             (startDate ? debtDate >= startDate : true) &&
             (endDate ? debtDate <= endDate : true);
    });
  }, [debts, filters]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser?.uid;
    if (!userId) { showErrorAlert('Error', 'Refresca la página.'); return; }
    if (!description.trim() || !amount || !dueDate) { showErrorAlert('Faltan datos', 'Todos los campos son obligatorios.'); return; };
    await addDoc(collection(db, `users/${userId}/debts`), { description, amount: parseFloat(amount), dueDate });
    showSuccessAlert('¡Deuda añadida!');
    setDescription(''); setAmount(''); setDueDate('');
  };

  const handleDelete = async (type, id) => {
    const userId = currentUser?.uid;
    if (!userId) return;
    const result = await showConfirmDialog('¿Estás seguro?', 'Esta acción no se puede deshacer.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/debts`, id));
      showSuccessAlert('¡Eliminado!');
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const handlePayDebt = async (debt) => {
    const userId = currentUser?.uid;
    if (!userId) return;
    const result = await showConfirmDialog('¿Marcar como pagada?', `Esto creará un gasto por ${formatCurrency(debt.amount)} y eliminará la deuda.`);
    if (result.isConfirmed) {
        const newExpense = {
            description: `Pago: ${debt.description}`,
            amount: debt.amount,
            category: 'Pago de Deudas',
            date: new Date().toISOString().split('T')[0]
        };
        await addDoc(collection(db, `users/${userId}/expenses`), newExpense);
        await deleteDoc(doc(db, `users/${userId}/debts`, debt.id));
        showSuccessAlert('¡Deuda pagada!');
    }
  };
  
  const formProps = {
    formData: { formType, description, amount, dueDate },
    handleFormChange: { setDescription, setAmount, setDueDate, setFormType },
    handleFormSubmit
  };

  return (
    <>
      <div>
        <h1 className={styles.title}>Gestión de Deudas</h1>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
          <div>
            <AddTransactionForm {...formProps} />
          </div>
          <div>
            <FilterBar filters={filters} setFilters={setFilters} />
            <ItemList title="Historial de Deudas" items={filteredDebts} type="debts" onDelete={handleDelete} onEdit={handleOpenEditModal} onPay={handlePayDebt} color="yellow" isDebt={true} />
          </div>
        </div>
      </div>
      <EditModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={editingItem}
          type="debts"
          userId={currentUser?.uid}
      />
    </>
  );
}