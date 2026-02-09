// Tipe data Point sederhana
export interface Point {
  x: number;
  y: number;
}

/**
 * Menghitung jarak Euclidean antara dua titik.
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Menghitung Rasio Kompresi Tubuh.
 * Semakin KECIL nilainya, semakin dekat kepala ke bahu (semakin bungkuk).
 * * Rumus: Jarak(MulutTengah ke BahuTengah) / LebarBahu
 */
export const calculateCompressionRatio = (
  mouthMid: Point,
  shoulderMid: Point,
  shoulderWidth: number
): number => {
  // Kita hanya peduli jarak vertikal (sumbu Y) untuk kompresi
  const verticalDistance = Math.abs(mouthMid.y - shoulderMid.y);

  // Hindari pembagian dengan nol jika bahu tidak terdeteksi
  if (shoulderWidth === 0) return 1.0;

  return verticalDistance / shoulderWidth;
};

// ... biarkan fungsi calculateNeckAngle yang lama tetap ada di bawahnya

/**
 * Menghitung sudut kemiringan leher (Neck Angle)
 * Berdasarkan posisi telinga (ear) dan bahu (shoulder).
 * Menggunakan atan2 untuk menghitung sudut garis penghubung relatif terhadap sumbu vertikal.
 * 0 derajat = tegak lurus (ear.x == shoulder.x)
 */
export const calculateNeckAngle = (ear: Point, shoulder: Point): number => {
  const dx = ear.x - shoulder.x;
  const dy = ear.y - shoulder.y; // y increases downwards in image coords

  // Angle in radians relative to horizontal
  const angleRad = Math.atan2(dy, dx);

  // Convert to degrees
  let angleDeg = angleRad * (180 / Math.PI);

  // Adjust so that -90 degrees (up) becomes 0 degrees
  // We want deviation from vertical.
  let neckAngle = angleDeg + 90;

  return neckAngle;
};
