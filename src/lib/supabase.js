import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validasi sederhana agar aplikasi tidak error tanpa pesan yang jelas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Informasi Supabase (URL/Key) tidak ditemukan di environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)