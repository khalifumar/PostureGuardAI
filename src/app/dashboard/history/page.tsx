'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { ArrowLeft, Calendar, BarChart2 } from 'lucide-react';

interface PostureLog {
  id: string;
  status: 'GOOD' | 'SLOUCHING';
  neck_angle: number;
  created_at: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<PostureLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Mengambil data dari tabel posture_logs di Supabase
      const { data, error } = await supabase
        .from('posture_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Monitor
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Postur</h1>
        </div>

        {/* Kartu Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center text-slate-500 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Total Catatan</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{logs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center text-slate-500 mb-2">
              <BarChart2 className="w-4 h-4 mr-2" />
              <span>Rata-rata Sudut Leher</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {logs.length > 0 
                ? (logs.reduce((acc, curr) => acc + curr.neck_angle, 0) / logs.length).toFixed(1) 
                : 0}°
            </p>
          </div>
        </div>

        {/* Tabel Riwayat */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Waktu</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Sudut Leher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">Memuat data...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400">Belum ada data tercatat.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        log.status === 'GOOD' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'GOOD' ? 'Tegak' : 'Bungkuk'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {log.neck_angle.toFixed(1)}°
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}