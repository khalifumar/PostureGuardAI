'use client';

import { Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardHeader() {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 rounded-xl text-white">
          <Activity className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">PostureGuard AI</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <User className="w-6 h-6" />
        </button>
        <button 
          onClick={signOut}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}