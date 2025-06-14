
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oampddkpuybkbwqggrty.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hbXBkZGtwdXlia2J3cWdncnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2OTMyMzcsImV4cCI6MjA2MzI2OTIzN30.JDLVGgm_lgTDxOWWys2IssWOVqd6tTFpfMhXzhoZv3w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})
