'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, Activity } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        // LOGIN LOGIC
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        router.push('/dashboard');
      } else {
        // REGISTER LOGIC
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! Check your email to verify.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative z-10">

        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-4 ring-1 ring-white/10">
            <Activity className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            PostureGuard <span className="text-indigo-500">AI</span>
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Welcome back, Guardian.' : 'Join the Posture Revolution.'}
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-white/5">
          <button
            onClick={() => { setIsLogin(true); setMessage(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setMessage(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={6}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Access Dashboard' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-8">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}