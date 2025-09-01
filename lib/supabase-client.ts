import { createClient } from '@supabase/supabase-js'

// Check if we have valid environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
const isValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_url_here') && 
  !supabaseAnonKey.includes('your_supabase_anon_key_here') &&
  supabaseUrl.startsWith('https://')

let supabase: ReturnType<typeof createClient> | null = null

if (isValidConfig) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    supabase = null
  }
} else {
  console.warn('Supabase not configured. Running in demo mode.')
}

export { supabase }

// Export a function that returns the client or null
export const getSupabaseClient = () => supabase

// Export demo mode status
export const isDemoMode = !isValidConfig
