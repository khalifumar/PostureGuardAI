'use client';

import { CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusCardProps {
  status: 'GOOD' | 'SLOUCHING';
  angle: number;
}

export default function StatusCard({ status, angle }: StatusCardProps) {
  const isGood = status === 'GOOD';

  return (
    <div className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
      isGood ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100 animate-pulse'
    }`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-2xl ${isGood ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
          {isGood ? <CheckCircle /> : <AlertTriangle />}
        </div>
        <h3 className={`text-xl font-bold ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>
          {isGood ? 'Postur Bagus' : 'Segera Tegakkan!'}
        </h3>
      </div>
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Neck Angle ($\theta$)</span>
        <span className="text-3xl font-mono font-bold">{angle.toFixed(1)}°</span>
      </div>
    </div>
  );
}