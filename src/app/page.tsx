'use client';

import React, { useState } from 'react';
import MainMonitor from '@/components/monitor/MainMonitor';
import { Activity, ShieldCheck } from 'lucide-react';

export default function MonitorPage() {
  const [status, setStatus] = useState<'GOOD' | 'SLOUCHING'>('GOOD');
  const [angle, setAngle] = useState(0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="text-indigo-500" />
              PostureGuard <span className="text-indigo-500">AI</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">Real-time Spinal Health Protection</p>
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border ${
            status === 'GOOD' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            Status: {status}
          </div>
        </div>

        {/* Komponen Utama Monitor */}
        <div className="grid grid-cols-1 gap-8">
          <MainMonitor 
            onStatusChange={setStatus} 
            onAngleChange={setAngle} 
          />
        </div>

        {/* Simple Footer Info */}
        <div className="flex justify-center items-center gap-2 text-slate-600">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            In-Browser AI Processing • Privacy Secured
          </span>
        </div>
      </div>
    </main>
  );
}