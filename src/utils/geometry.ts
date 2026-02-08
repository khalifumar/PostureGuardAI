/**
 * Definisi tipe data koordinat 2D/3D dari MediaPipe Pose
 */
interface Point {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Menghitung sudut kemiringan leher (Neck Angle)
 * Sudut dihitung antara titik Telinga (Ear) dan Bahu (Shoulder) 
 * relatif terhadap garis horizontal.
 */
export const calculateNeckAngle = (ear: Point, shoulder: Point, aspectRatio: number = 1): number => {
  // 1. Menghitung selisih koordinat (Delta)
  const dy = shoulder.y - ear.y;
  const dx = (shoulder.x - ear.x) * aspectRatio; // Koreksi rasio aspek (default 1 jika tidak ditentukan)

  // 2. Menggunakan fungsi Arc Tangent 2 untuk mendapatkan radian
  // Atan2 memberikan sudut antara sumbu X positif dan titik (dx, dy)
  const radians = Math.atan2(dy, dx);

  // 3. Konversi Radian ke Derajat
  const degrees = Math.abs((radians * 180.0) / Math.PI);

  /**
   * Normalisasi: 
   * Jika posisi tegak lurus sempurna, sudutnya mendekati 90 derajat.
   * Kita ingin 0 derajat adalah posisi tegak, maka kita hitung selisihnya dari 90.
   */
  const normalizedAngle = Math.abs(90 - degrees);

  return normalizedAngle;
};

/**
 * Menghitung jarak Euclidean antar dua titik (Opsional)
 * Bisa digunakan untuk mendeteksi seberapa dekat user dengan kamera.
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2)
  );
};

/**
 * Menghitung Posture Ratio (Vertical Neck / Shoulder Width)
 * Digunakan untuk mendeteksi Forward Head Posture (Slouching Depan).
 * 
 * - Tegak: Ratio Tinggi (> 0.4 - 0.5)
 * - Bungkuk: Ratio Rendah (< 0.3)
 */
export const calculateSlouchRatio = (earMid: Point, leftShoulder: Point, rightShoulder: Point): number => {
  // 1. Hitung lebar bahu (referensi jarak)
  const shoulderWidth = calculateDistance(leftShoulder, rightShoulder);

  if (shoulderWidth === 0) return 0;

  // 2. Hitung jarak VERTIKAL (sumbu Y) antara tengah telinga dan tengah bahu
  // Kita hanya peduli "pemendekan leher" secara visual
  const shoulderMidY = (leftShoulder.y + rightShoulder.y) / 2;
  const neckVerticalHeight = Math.abs(shoulderMidY - earMid.y);

  // 3. Ratio
  return neckVerticalHeight / shoulderWidth;
};