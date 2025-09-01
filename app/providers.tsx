'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { ThemeProvider } from "@/lib/theme-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Check if we have valid Supabase credentials
    const isValidConfig = url && 
      key && 
      !url.includes('your_supabase_url_here') && 
      !key.includes('your_supabase_anon_key_here') &&
      url.startsWith('https://')
    
    if (!isValidConfig) {
      // Create a mock client that satisfies the SessionContextProvider
      return {
        auth: {
          signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode' } }),
          signUp: async () => ({ data: null, error: { message: 'Demo mode' } }),
          signOut: async () => ({ error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: (callback: any) => {
            // Call callback immediately with null session for demo mode
            callback('SIGNED_OUT', null)
            return { data: { subscription: { unsubscribe: () => {} } } }
          },
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
        }),
        channel: () => ({
          on: () => ({ subscribe: () => {} }),
          unsubscribe: () => {},
        }),
      }
    }
    
    try {
      return createBrowserClient(url, key)
    } catch (error) {
      console.warn('Failed to create Supabase client:', error)
      // Return the same mock client on error
      return {
        auth: {
          signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode' } }),
          signUp: async () => ({ data: null, error: { message: 'Demo mode' } }),
          signOut: async () => ({ error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: (callback: any) => {
            callback('SIGNED_OUT', null)
            return { data: { subscription: { unsubscribe: () => {} } } }
          },
        },
        from: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          insert: () => Promise.resolve({ data: null, error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null }),
        }),
        channel: () => ({
          on: () => ({ subscribe: () => {} }),
          unsubscribe: () => {},
        }),
      }
    }
  })

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      <SessionContextProvider supabaseClient={supabase as any}>
        {children}
      </SessionContextProvider>
    </ThemeProvider>
  )
}
