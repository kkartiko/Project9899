"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isDemoMode } from "@/lib/supabase-client"
import { Shield } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      // In demo mode, always allow access
      if (isDemoMode) {
        setIsAuthenticated(true)
        return
      }

      try {
        const user = await getCurrentUser()
        setIsAuthenticated(!!user)
        
        if (!user && pathname !== "/login") {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // On auth check failure, enable demo mode
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [router, pathname])

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Shield className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-lg font-semibold">BreachIndex</div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
