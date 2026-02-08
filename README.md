🧘‍♂️ PostureGuard AI
Real-time AI Posture Monitor for Better Spinal Health

PostureGuard AI adalah aplikasi pemantauan postur tubuh secara real-time yang dirancang untuk mencegah kebiasaan duduk bungkuk saat bekerja di depan komputer. Menggunakan mesin AI MediaPipe yang berjalan sepenuhnya secara lokal di browser untuk menjamin privasi pengguna.

✨ Fitur Utama
- Hybrid AI Detection: Menggabungkan perhitungan Lateral Tilt Angle ($\theta$) dan Vertical Compression Ratio menggunakan titik mulut untuk akurasi tinggi.
- Local WASM Processing: Aset MediaPipe (WASM & Data) di-host secara lokal untuk inisialisasi super cepat dan latensi rendah.
- Smart Audio Alert: Alarm peringatan otomatis (alert.mp3) yang cerdas dengan sistem bypass autoplay policy browser.
- Real-time Analytics: Sinkronisasi data postur ke Supabase untuk melacak progres kesehatan tulang belakang harian.
- Privacy First: Semua pemrosesan video dilakukan di sisi client (lokal), tidak ada data video yang dikirim ke server.

🛠 Tech Stack
- Frontend: Next.js 14 (App Router), Tailwind CSS, Lucide React.
- AI Engine: Google MediaPipe Pose Detection.
- Backend & Auth: Supabase.
- State Management: Zustand.

🧠 Geometri & Logika AI
Aplikasi ini tidak hanya mendeteksi keberadaan tubuh, tetapi menghitung dua parameter krusial:
1. Neck Angle ($\theta$): Menghitung kemiringan telinga terhadap garis bahu untuk mendeteksi leher yang maju ke depan.
2. Compression Ratio: Menghitung jarak vertikal titik tengah mulut terhadap garis bahu yang dinormalisasi dengan lebar bahu untuk mendeteksi bungkuk vertikal (kepala tenggelam).

🏗 Struktur Proyek
PostureGuard-AI/
├── public/              # Aset statis (MediaPipe WASM & Audio)
├── src/
│   ├── components/      # UI Components (MainMonitor, CameraView)
│   ├── hooks/           # Custom Logic (usePoseDetection, usePostureLog)
│   ├── store/           # Global State (Zustand)
│   └── utils/           # Math & Geometry Calculations
├── .env.local           # Konfigurasi API (Hidden from Git)
└── package.json

⚙️ Setup & Instalasi
1. Clone repositori:
git clone https://github.com/username/postureguard-ai.git
cd postureguard-ai

2. Instal Dependensi
npm install

3. Konfigurasi Environment: Buat file .env.local dan masukkan kunci Supabase kamu:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

4. Jalankan aplikasi:
npm run dev

👤 Author
Khalif Umar Al Faruq
- Computer Science Student at Bina Nusantara University.
- Core Team Media Creative @ Google Developer Groups on Campus (GDGoC).
- Activist @ Data Science Indonesia.
