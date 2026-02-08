import Link from 'next/link';
import { Camera, ShieldCheck, BarChart3, ArrowRight, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-600 rounded-xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">PostureGuard AI</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-6 py-2.5 font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Masuk
          </Link>
          <Link href="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            Mulai Sekarang
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="px-6 pt-16 pb-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-8 animate-fade-in">
          🚀 Solusi AI untuk Kesehatan Tulang Belakang
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Perbaiki Postur Dudukmu <br />
          <span className="text-indigo-600">Secara Real-Time.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Gunakan kekuatan Computer Vision untuk mendeteksi bungkuk secara instan tanpa mengorbankan privasi. Lindungi kesehatan leher dan punggungmu saat bekerja di depan layar.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center group shadow-xl shadow-indigo-200">
            Aktifkan Monitoring
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full md:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            Lihat Cara Kerja
          </button>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih PostureGuard?</h2>
            <p className="text-slate-500">Teknologi mutakhir yang dirancang untuk kenyamanan kerjamu.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privasi Terjamin</h3>
              <p className="text-slate-500 leading-relaxed">
                Pemrosesan AI dilakukan sepenuhnya di browsermu. Tidak ada data video yang pernah dikirim ke server kami.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Deteksi Presisi</h3>
              <p className="text-slate-500 leading-relaxed">
                Menggunakan MediaPipe Pose untuk melacak titik koordinat tubuh dengan tingkat akurasi tinggi secara milidetik.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analitik Terpadu</h3>
              <p className="text-slate-500 leading-relaxed">
                Pantau progres kesehatan posturmu setiap harinya melalui statistik yang tersimpan aman di cloud Supabase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer Simple */}
      <footer className="py-12 px-6 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2026 PostureGuard AI. Dibuat dengan dedikasi untuk kesehatan digital.</p>
      </footer>
    </div>
  );
}