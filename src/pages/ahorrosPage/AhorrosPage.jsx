import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig.js';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../utils/alerts.js';
import styles from './AhorrosPage.module.css';
import SavingsGoalCard from '../../components/savingsGoalCard/SavingsGoalCard.jsx';
import AddGoalForm from '../../components/addGoalForm/AddGoalForm.jsx';

export default function AhorrosPage() {
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => { if (user) setUserId(user.uid); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const q = collection(db, `users/${userId}/savingsGoals`);
    const unsubscribe = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  const handleAddGoal = async (goalName, targetAmount) => {
    if (!goalName.trim() || !targetAmount) {
      showErrorAlert('Faltan datos', 'El nombre y el monto objetivo son obligatorios.');
      return;
    }
    const newGoal = {
      name: goalName,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      createdAt: new Date(),
    };
    await addDoc(collection(db, `users/${userId}/savingsGoals`), newGoal);
    showSuccessAlert('¡Objetivo creado!');
  };

  const handleDeleteGoal = async (goalId) => {
    const result = await showConfirmDialog('¿Eliminar objetivo?', 'Perderás todo el progreso de ahorro para esta meta.');
    if (result.isConfirmed) {
      await deleteDoc(doc(db, `users/${userId}/savingsGoals`, goalId));
      showSuccessAlert('Objetivo eliminado.');
    }
  };

  const handleAddContribution = async (goalId, amount) => {
    if (!amount) {
      showErrorAlert('Falta el monto', 'Debes ingresar un monto para añadir.');
      return;
    }
    const goalRef = doc(db, `users/${userId}/savingsGoals`, goalId);
    await updateDoc(goalRef, {
      currentAmount: increment(parseFloat(amount))
    });
    showSuccessAlert('¡Ahorro añadido!');
  };

  // --- NUEVA FUNCIÓN PARA RETIRAR AHORROS ---
  const handleWithdrawContribution = async (goalId, amount) => {
    if (!amount) {
      showErrorAlert('Falta el monto', 'Debes ingresar un monto para retirar.');
      return;
    }

    const goal = goals.find(g => g.id === goalId);
    const withdrawalAmount = parseFloat(amount);
    
    // Verificamos que no se retire más de lo que hay
    if (withdrawalAmount > goal.currentAmount) {
      showErrorAlert('Monto inválido', 'No puedes retirar más de lo que tienes ahorrado.');
      return;
    }

    const goalRef = doc(db, `users/${userId}/savingsGoals`, goalId);
    await updateDoc(goalRef, {
      currentAmount: increment(-withdrawalAmount) // Usamos un número negativo para restar
    });
    showSuccessAlert('¡Ahorro retirado!');
  };

  return (
    <div>
      <h1 className={styles.title}>Objetivos de Ahorro</h1>
      <div className={styles.grid}>
        <div>
          <AddGoalForm onAddGoal={handleAddGoal} />
        </div>
        <div className={styles.goalsContainer}>
          {goals.map(goal => (
            <SavingsGoalCard 
              key={goal.id} 
              goal={goal} 
              onDelete={handleDeleteGoal}
              onAddContribution={handleAddContribution}
              onWithdrawContribution={handleWithdrawContribution} // --- Pasamos la nueva función ---
            />
          ))}
        </div>
      </div>
    </div>
  );
}