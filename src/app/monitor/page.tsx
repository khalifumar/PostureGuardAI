'use client';

import React, { useState } from 'react';
import MainMonitor from '@/components/monitor/MainMonitor';
import { Activity, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * MonitorPage Component
 * Ini adalah Entry Point untuk rute /monitor.
 * Vercel mewajibkan adanya 'export default' agar dianggap sebagai modul valid.
 */
export default function MonitorPage() {
  const [status, setStatus] = useState<'GOOD' | 'SLOUCHING'>('GOOD');
  const [angle, setAngle] = useState(0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
              <ArrowLeft className="text-slate-400" size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <Activity className="text-indigo-500" />
                PostureGuard <span className="text-indigo-500">AI</span>
              </h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                Active Protection Mode
              </p>
            </div>
          </div>
          
          <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-500 ${
            status === 'GOOD' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
          }`}>
            Status: {status}
          </div>
        </div>

        {/* Komponen AI Monitor */}
        <div className="relative">
          <MainMonitor 
            onStatusChange={setStatus} 
            onAngleChange={setAngle} 
          />
        </div>

        {/* Footer Info */}
        <div className="flex flex-col items-center gap-2 text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-center">
              Secured by Local AI Processing
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
