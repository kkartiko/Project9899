"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut, Home, Clock, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Phishing Quiz", href: "/tools/phishing-quiz" },
  { name: "URL Checker", href: "/tools/url-checker" },
  { name: "Input Advisor", href: "/tools/input-advisor" },
  { name: "Breach Explorer", href: "/breach-explorer" },
  { name: "Canvas Demo", href: "/canvas-landing", icon: Palette },
  { name: "Coming Soon", href: "/coming-soon", icon: Clock, isComingSoon: true },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Use Supabase hooks safely
  const supabase = useSupabaseClient()
  const user = useUser()

  useEffect(() => {
    // Check if we're in demo mode by checking environment variables
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const isValidConfig =
      url &&
      key &&
      !url.includes("your_supabase_url_here") &&
      !key.includes("your_supabase_anon_key_here") &&
      url.startsWith("https://")

    setIsDemo(!isValidConfig)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSignOut = async () => {
    if (supabase && !isDemo) {
      try {
        await supabase.auth.signOut()
        router.push("/login")
      } catch (error) {
        console.error("Sign out error:", error)
      }
    } else {
      // In demo mode, just redirect to login
      router.push("/login")
    }
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleNavigation = (href: string, isComingSoon?: boolean) => {
    if (isComingSoon) {
      // For coming soon, we can show a toast or modal instead of navigating
      // For now, we'll just prevent navigation
      return
    }
    router.push(href)
  }

  return (
    <nav
      className={`sticky top-0 z-50 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 border-b border-border/50 glassmorphism ${isLoaded ? "animate-slide-in-down" : "opacity-0"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 hover-lift group"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent cyber-text group-hover:animate-neon-glow">
              BreachIndex
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.isComingSoon)}
                disabled={item.isComingSoon}
                className={cn(
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 hover-lift ${isLoaded ? `animate-slide-in-down stagger-${index + 2}` : "opacity-0"}`,
                  item.isComingSoon
                    ? "text-muted-foreground cursor-not-allowed opacity-60 hover:opacity-80"
                    : isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 animate-glow"
                      : "text-foreground hover:text-primary hover:bg-muted/50 hover-glow",
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 hover-bounce" />}
                <span className="hover-wiggle">{item.name}</span>
                {item.isComingSoon && <div className="w-2 h-2 bg-orange-500 rounded-full animate-heartbeat" />}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <div className={`hover-rotate ${isLoaded ? "animate-rotate-in stagger-3" : "opacity-0"}`}>
              <ThemeToggle />
            </div>

            {/* User menu - show for authenticated users or demo mode */}
            {(user || isDemo) && (
              <div className={`${isLoaded ? "animate-bounce-in stagger-4" : "opacity-0"}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-xl hover-lift hover-glow">
                      <Avatar className="h-8 w-8 animate-pulse-slow">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold cyber-text">
                          {isDemo ? "D" : user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glassmorphism animate-zoom-in" align="end" forceMount>
                    <div className="flex items-center space-x-2 p-3 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold animate-glow">
                          {isDemo ? "D" : user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{isDemo ? "Demo User" : "Account"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {isDemo ? "demo@breachindex.com" : user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive focus:text-destructive hover-shake"
                    >
                      <LogOut className="mr-2 h-4 w-4 hover-wiggle" />
                      <span>{isDemo ? "Exit Demo" : "Sign out"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Sign in button for non-demo mode when not authenticated */}
            {!isDemo && !user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/login")}
                className={`hidden md:flex button-magnetic hover-glow ${isLoaded ? "animate-slide-in-right stagger-5" : "opacity-0"}`}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden rounded-xl hover:bg-muted/50 hover-rotate ${isLoaded ? "animate-roll-in stagger-6" : "opacity-0"}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5 hover-spin" /> : <Menu className="h-5 w-5 hover-wiggle" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-border/50 animate-slide-in-down">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                onClick={() => {
                  if (!item.isComingSoon) {
                    router.push(item.href)
                    setIsOpen(false)
                  }
                }}
                disabled={item.isComingSoon}
                className={cn(
                  `flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover-lift animate-slide-up stagger-${index + 1}`,
                  item.isComingSoon
                    ? "text-muted-foreground cursor-not-allowed opacity-60"
                    : isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 animate-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover-glow",
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 hover-bounce" />}
                <span className="hover-wiggle">{item.name}</span>
                {item.isComingSoon && <div className="w-2 h-2 bg-orange-500 rounded-full animate-heartbeat" />}
              </button>
            ))}

            {/* Mobile sign in/out button */}
            {!user && !isDemo && (
              <button
                onClick={() => {
                  router.push("/login")
                  setIsOpen(false)
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300 hover-lift animate-slide-up stagger-7"
              >
                <LogOut className="h-4 w-4 hover-wiggle" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
