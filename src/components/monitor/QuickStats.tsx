'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePostureLog } from '@/hooks/usePostureLog';

export default function QuickStats() {
  const { user } = useAuth();
  const { getDailyStats } = usePostureLog();
  const [stats, setStats] = useState({ goodPct: 0, total: 0 });

  useEffect(() => {
    if (user) {
      getDailyStats(user.id).then(setStats);
    }
  }, [user, getDailyStats]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Daily Score</p>
        <p className="text-2xl font-black text-indigo-600">{stats.goodPct.toFixed(0)}%</p>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Logs Today</p>
        <p className="text-2xl font-black text-slate-700">{stats.total}</p>
      </div>
    </div>
  );
}