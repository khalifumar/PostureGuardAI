import { createClient } from '@supabase/supabase-js';

/**
 * Mengambil environment variables yang sudah kamu siapkan di file .env.local.
 * Penggunaan tanda seru (!) di akhir memberitahu TypeScript bahwa 
 * kita menjamin variabel ini tidak akan bernilai undefined.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Inisialisasi Supabase Client.
 * Objek 'supabase' ini akan digunakan di seluruh aplikasi (hooks & components)
 * untuk melakukan operasi autentikasi dan database (CRUD).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);