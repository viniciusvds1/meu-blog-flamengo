import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zcytcowvuxconxeqqnnz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjeXRjb3d2dXhjb254ZXFxbm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTQzNzksImV4cCI6MjA1Mzk5MDM3OX0.IdkR6Kq4wJtkfjyI8ay1-nMZQv7hSfAN1WLaw4URz1c";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    }
  }
);
