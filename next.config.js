/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Mengaktifkan Strict Mode membantu mendeteksi bug pada siklus hidup komponen.
   * Sangat berguna saat menginisialisasi MediaPipe Pose agar tidak terjadi 
   * kebocoran memori atau inisialisasi ganda.
   */
  reactStrictMode: true,

  /**
   * Konfigurasi Webpack tambahan jika diperlukan untuk mendukung 
   * library Machine Learning yang menggunakan WebAssembly (WASM).
   */
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Penting agar MediaPipe tidak error saat mencari sistem file di browser.
    };
    return config;
  },

  /**
   * (Opsional) Jika nanti kamu ingin menggunakan gambar profil user 
   * dari Supabase Storage atau provider eksternal lainnya.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;