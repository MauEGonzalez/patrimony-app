import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import styles from './EvolutionChart.module.css';

export default function EvolutionChart({ data }) {
  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.title}>Evolución Mensual (Últimos 6 Meses)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 30, // Más espacio para los números del eje Y
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis 
            stroke="#9ca3af" 
            tickFormatter={(value) => new Intl.NumberFormat('es-AR', { notation: 'compact' }).format(value)}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
            contentStyle={{ 
              backgroundColor: '#111827', 
              border: '1px solid #374151', 
              borderRadius: '0.5rem' 
            }}
          />
          <Legend />
          <Bar dataKey="ingresos" fill="#4ade80" name="Ingresos" />
          <Bar dataKey="gastos" fill="#f87171" name="Gastos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}