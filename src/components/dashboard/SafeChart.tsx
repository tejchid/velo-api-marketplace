"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SafeChart({ data }: { data: any[] }) {
  // Fallback if data is missing
  const chartData = data && data.length > 0 ? data : [
    { date: 'N/A', count: 0 },
    { date: 'N/A', count: 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
          dy={10}
        />
        <YAxis hide domain={[0, 'auto']} />
        <Tooltip 
          contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#2563eb" 
          strokeWidth={4} 
          dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 8 }}
          animationDuration={1200}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}