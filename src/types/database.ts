export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posture_logs: {
        Row: {
          id: string // UUID: Primary Key
          user_id: string // UUID: Foreign Key ke auth.users
          status: 'GOOD' | 'SLOUCHING' // Label status postur
          neck_angle: number // Nilai sudut leher dalam derajat
          created_at: string // Timestamp saat data tercatat
        }
        Insert: {
          id?: string // Opsional: Dibuat otomatis oleh Supabase
          user_id: string
          status: 'GOOD' | 'SLOUCHING'
          neck_angle: number
          created_at?: string // Opsional: Default ke now()
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'GOOD' | 'SLOUCHING'
          neck_angle?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types untuk digunakan di Hooks dan Components
export type PostureLog = Database['public']['Tables']['posture_logs']['Row'];
export type InsertPostureLog = Database['public']['Tables']['posture_logs']['Insert'];