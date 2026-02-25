'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Shield, Lightbulb, ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

// Import MainMonitor secara dinamis untuk menghindari SSR error pada Webcam
const MainMonitor = dynamic(() => import('../../components/monitor/MainMonitor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] bg-slate-900 rounded-[2.5rem] flex items-center justify-center border-4 border-white/5">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Loading Modules...</p>
      </div>
    </div>
  )
});

// Mock components (Ganti dengan file aslimu jika sudah ada)
function StatusCard({ status, angle }: { status: string, angle: number }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
      status === 'GOOD' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Status Sekarang</h3>
      <p className="text-4xl font-black italic uppercase tracking-tighter mb-4">{status}</p>
      <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-current transition-all duration-300" 
          style={{ width: `${Math.min(angle * 5, 100)}%` }} 
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [currentStatus, setCurrentStatus] = useState<'GOOD' | 'SLOUCHING'>('GOOD');
  const [currentAngle, setCurrentAngle] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      {/* Mini Header */}
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/20 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <ArrowLeft size={16} /> Home
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <LayoutDashboard size={16} className="text-indigo-500" /> Dashboard
          </h1>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest">
          AI Monitoring Live
        </div>
      </header>

      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Area Kiri: AI Camera */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative">
              <MainMonitor
                onStatusChange={setCurrentStatus}
                onAngleChange={setCurrentAngle}
              />
            </div>
          </div>

          {/* Area Kanan: Status & Tips */}
          <div className="lg:col-span-4 space-y-8">
            <StatusCard status={currentStatus} angle={currentAngle} />

            <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 rounded-2xl mr-4">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-xs">Posture Tip</h4>
              </div>
              <p className="text-sm leading-relaxed font-medium opacity-90 italic">
                Posisikan monitor sejajar dengan mata. Jika monitor terlalu rendah, lehermu akan menekuk ke depan sebesar $20^\circ$ hingga $30^\circ$, meningkatkan beban pada tulang belakang.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-3xl flex items-center gap-4">
              <Shield className="w-8 h-8 text-slate-600" />
              <p className="text-[10px] text-slate-500 font-bold leading-tight uppercase tracking-widest">
                Data diproses secara lokal. Kami tidak merekam atau menyimpan gambar wajahmu ke cloud.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}