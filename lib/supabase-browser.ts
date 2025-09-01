import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const isValidConfig = url && 
  key && 
  !url.includes('your_supabase_url_here') && 
  !key.includes('your_supabase_anon_key_here') &&
  url.startsWith('https://')

if (!isValidConfig) {
  console.warn('Supabase environment variables not configured. Running in demo mode.')
}

export const supabaseBrowser = () => {
  if (!isValidConfig) {
    // Return a mock client for demo mode
    return {
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode' } }),
        signUp: async () => ({ data: null, error: { message: 'Demo mode' } }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    }
  }
  
  return createClient(url!, key!)
}

export const isDemoMode = !isValidConfig
