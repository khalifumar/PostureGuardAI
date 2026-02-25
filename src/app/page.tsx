'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, ArrowRight, MousePointer2, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Efek Cahaya Latar Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center space-y-8 relative">
        {/* Logo Section */}
        <div className="inline-flex p-5 bg-indigo-600/10 rounded-[2.5rem] border border-indigo-500/20 mb-4 animate-in fade-in zoom-in duration-700">
          <Activity className="w-12 h-12 text-indigo-400" />
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic">
            PostureGuard <span className="text-indigo-500 font-black">AI</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-lg mx-auto">
            Solusi cerdas berbasis AI untuk memantau postur dudukmu secara real-time. 
            Mencegah bungkuk, melindungi kesehatan tulang belakang.
          </p>
        </div>

        {/* Fitur Utama */}
        <div className="grid grid-cols-2 gap-4 py-8">
          <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Privasi Terjamin</p>
            <p className="text-[9px] text-slate-600 mt-1">Lokal di Browser</p>
          </div>
          <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hybrid Sensor</p>
            <p className="text-[9px] text-slate-600 mt-1">Akurasi Tinggi</p>
          </div>
        </div>

        {/* Tombol Navigasi ke Dashboard */}
        <Link href="/dashboard">
          <button className="group relative px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black tracking-[0.2em] text-sm transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-3 mx-auto active:scale-95">
            BUKA DASHBOARD MONITORING
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
        
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          No Login Required • Open Source Project
        </p>
      </div>
    </main>
  );
}