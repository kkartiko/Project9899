import { getSupabaseClient, isDemoMode } from './supabase-client'

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase || isDemoMode) {
    // Demo mode - simulate successful login
    return {
      data: { user: { email, id: 'demo-user' } },
      error: null
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

export async function signUp(email: string, password: string) {
  const supabase = getSupabaseClient()
  
  if (!supabase || isDemoMode) {
    // Demo mode - simulate successful signup
    return {
      data: { user: { email, id: 'demo-user' } },
      error: null
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

export async function signOut() {
  const supabase = getSupabaseClient()
  
  if (!supabase || isDemoMode) {
    // Demo mode - just return success
    return { error: null }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient()
  
  if (!supabase || isDemoMode) {
    // Demo mode - return null (no user)
    return { data: { user: null }, error: null }
  }

  try {
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  } catch (error) {
    console.error('Get user error:', error)
    return { data: { user: null }, error }
  }
}
