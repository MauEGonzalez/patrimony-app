import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './ExpensesChart.module.css';

// Colores vibrantes para cada segmento del gráfico
const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#eab308', '#8b5cf6', '#ec4899', '#64748b', '#ef4444'];

export default function ExpensesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h2 className={styles.title}>Gastos por Categoría</h2>
        <div className={styles.noDataText}>
          <p>Añade algunos gastos para ver el gráfico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.title}>Gastos por Categoría</h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}