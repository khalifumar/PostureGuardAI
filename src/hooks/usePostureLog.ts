'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';

export const usePostureLog = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Ref untuk menyimpan waktu terakhir penyimpanan guna throttling
  const lastSavedRef = useRef<number>(0);
  const SAVE_INTERVAL = 30000; // Simpan data ke cloud setiap 30 detik (30.000 ms)

  /**
   * Fungsi untuk mengirim data log postur ke Supabase.
   * Menggunakan logika throttling agar tidak membebani database dengan data per frame.
   */
  const savePostureLog = async (userId: string, status: 'GOOD' | 'SLOUCHING', angle: number) => {
    const now = Date.now();

    // Hanya simpan jika interval waktu sudah terpenuhi
    if (now - lastSavedRef.current < SAVE_INTERVAL) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('posture_logs') // Nama tabel yang sudah kita buat di Supabase
        .insert([
          { 
            user_id: userId, 
            status, 
            neck_angle: parseFloat(angle.toFixed(2)) 
          }
        ]);

      if (error) throw error;

      // Update waktu terakhir penyimpanan berhasil
      lastSavedRef.current = now;
      console.log('Log postur berhasil disimpan ke Supabase.');
    } catch (error) {
      console.error('Gagal menyimpan log postur:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Fungsi tambahan untuk mengambil ringkasan statistik (opsional)
   * Bisa digunakan untuk mengisi komponen QuickStats di Dashboard.
   */
  const getDailyStats = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('posture_logs')
      .select('status')
      .eq('user_id', userId)
      .gte('created_at', today);

    if (error) return { goodPct: 0, total: 0 };
    
    const total = data.length;
    const goodCount = data.filter(log => log.status === 'GOOD').length;
    const goodPct = total > 0 ? (goodCount / total) * 100 : 0;

    return { goodPct, total };
  };

  return { savePostureLog, getDailyStats, isSaving };
};