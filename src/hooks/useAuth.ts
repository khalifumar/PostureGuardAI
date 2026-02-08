'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Cek sesi user saat pertama kali aplikasi dimuat
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 2. Mendengarkan perubahan status auth secara real-time
    // (Misal: User login, logout, atau session expired)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Jika user logout, otomatis arahkan kembali ke halaman login
      if (_event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    // Cleanup subscription saat hook tidak digunakan lagi
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Fungsi pembantu untuk logout
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return { user, loading, signOut };
};