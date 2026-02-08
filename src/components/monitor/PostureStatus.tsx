'use client';

import { CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface PostureStatusProps {
  status: 'GOOD' | 'SLOUCHING';
  angle: number;
}

export default function PostureStatus({ status, angle }: PostureStatusProps) {
  const isGood = status === 'GOOD';

  return (
    <div className={`p-8 rounded-[2rem] border-2 transition-all duration-500 shadow-lg ${
      isGood 
        ? 'bg-emerald-50 border-emerald-100 shadow-emerald-100/50' 
        : 'bg-red-50 border-red-100 shadow-red-100/50 animate-pulse'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${isGood ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-lg`}>
          {isGood ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest uppercase">Live Telemetry</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className={`text-3xl font-black ${isGood ? 'text-emerald-700' : 'text-red-700'}`}>
          {isGood ? 'Postur Bagus!' : 'Segera Tegakkan!'}
        </h3>
        <p className="text-slate-500 font-medium">
          {isGood 
            ? 'Posisi dudukmu sudah optimal untuk kesehatan tulang.' 
            : 'Lehermu terlalu condong ke depan. Bahaya laten bungkuk!'}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200/60">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Neck Angle ($\theta$)</p>
            <p className={`text-4xl font-mono font-bold ${isGood ? 'text-slate-700' : 'text-red-600'}`}>
              {angle.toFixed(1)}°
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Threshold ($\tau$)</p>
            <p className="text-xl font-mono font-bold text-slate-400">8.0°</p>
          </div>
        </div>
        
        {/* Progress Bar Visualization */}
        <div className="mt-4 w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${isGood ? 'bg-emerald-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min((angle / 45) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}