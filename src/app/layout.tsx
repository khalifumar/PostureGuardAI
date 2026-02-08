import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter yang modern dan bersih
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PostureGuard AI - Solusi Kesehatan Tulang Belakang",
  description: "Aplikasi web inovatif untuk memantau postur duduk secara real-time dengan teknologi Computer Vision dan privasi terjamin.",
  keywords: ["AI", "Posture Correction", "Computer Vision", "Health Tech", "Next.js", "Supabase"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        {/* Konten Utama Aplikasi */}
        {children}
        
        {/* Container untuk Notifikasi/Toaster bisa ditambahkan di sini nanti */}
      </body>
    </html>
  );
}