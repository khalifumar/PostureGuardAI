'use client';

import { useState } from 'react';
import DashboardHeader from '../../components/monitor/DashboardHeader';
import MainMonitor from '../../components/monitor/MainMonitor';
import StatusCard from '../../components/monitor/StatusCard';
import QuickStats from '../../components/monitor/QuickStats';
import { Shield, Lightbulb } from 'lucide-react';

export default function DashboardPage() {
  // State global untuk koordinasi antar komponen
  const [currentStatus, setCurrentStatus] = useState<'GOOD' | 'SLOUCHING'>('GOOD');
  const [currentAngle, setCurrentAngle] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Header: Navigasi & User Profile */}
      <DashboardHeader />

      <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 2. Area Kiri: Monitoring Utama (AI Camera) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Live Posture Monitoring</h2>
                  <p className="text-sm text-slate-500">AI sedang menganalisis posisi dudukmu secara lokal.</p>
                </div>
                <div className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                  <Shield className="w-3 h-3 mr-1" />
                  Privacy Protected
                </div>
              </div>

              {/* Komponen Kamera & AI */}
              <MainMonitor
                onStatusChange={setCurrentStatus}
                onAngleChange={setCurrentAngle}
              />
            </div>
          </div>

          {/* 3. Area Kanan: Status, Stats, & Tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Indikator Status Besar */}
            <StatusCard status={currentStatus} angle={currentAngle} />

            {/* Statistik Cepat */}
            <QuickStats />

            {/* Tips Card */}
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] text-white shadow-lg shadow-indigo-200">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-white/20 rounded-lg mr-3">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="font-bold">Posture Tip</h4>
              </div>
              <p className="text-sm leading-relaxed opacity-90">
                Posisikan monitor sejajar dengan mata. Jika monitor terlalu rendah, lehermu akan otomatis menekuk ke depan sebesar $20^\circ$ hingga $30^\circ$, meningkatkan beban pada tulang belakang.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}