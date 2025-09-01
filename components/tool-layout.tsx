"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export function ToolLayout({ children, title, description, icon: Icon, badge }: ToolLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    return [
      { name: "Dashboard", href: "/" },
      { name: "Tools", href: "/tools" },
      { name: title, href: pathname },
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2 text-sm text-muted-foreground mb-8"
        >
          {getBreadcrumbs().map((crumb, index) => (
            <div key={crumb.href} className="flex items-center space-x-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <button
                onClick={() => router.push(crumb.href)}
                className={`hover:text-foreground transition-colors ${
                  index === getBreadcrumbs().length - 1 ? "text-foreground font-medium" : ""
                }`}
              >
                {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
                {crumb.name}
              </button>
            </div>
          ))}
        </motion.nav>

        {/* Tool Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <Icon className="h-12 w-12 text-primary" />
            </div>
            {badge && (
              <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                {badge}
              </div>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
        </motion.div>

        {/* Tool Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
