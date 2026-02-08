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