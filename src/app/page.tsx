'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, ArrowRight, MousePointer2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative">
        {/* Logo Section */}
        <div className="inline-flex p-4 bg-indigo-600/10 rounded-[2rem] border border-indigo-500/20 mb-4 animate-bounce">
          <Activity className="w-12 h-12 text-indigo-400" />
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
            PostureGuard <span className="text-indigo-500">AI</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Lindungi kesehatan tulang belakangmu dengan teknologi AI. 
            Deteksi postur bungkuk secara real-time langsung di browser tanpa instalasi tambahan.
          </p>
        </div>

        {/* Key Features Summary */}
        <div className="grid grid-cols-2 gap-4 py-8">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">100% Privat</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <MousePointer2 className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sekali Klik</p>
          </div>
        </div>

        {/* CTA Button */}
        <Link href="/dashboard">
          <button className="group relative px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black tracking-[0.2em] text-sm transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3 mx-auto">
            MASUK KE DASHBOARD
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </main>
  );
}