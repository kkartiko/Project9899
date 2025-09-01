"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { BreachQuiz } from "@/components/breach-quiz"
import { Kpis } from "@/components/breach/kpis"
import { Filters } from "@/components/breach/filters"
import { Charts } from "@/components/breach/charts"
import { BreachTable } from "@/components/breach/table"
import { DetailsSheet } from "@/components/breach/details-sheet"
import { useToast } from "@/hooks/use-toast"
import { scenarios } from "@/lib/data/breach-scenarios"
import { validateAndNormalizeScenarios, filterScenarios } from "@/lib/utils/breach"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { TrendingDown, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BreachExplorerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(true)
  const [quizScore, setQuizScore] = useState<number | null>(null)

  // State
  const [validatedScenarios, setValidatedScenarios] = useState<BreachScenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<BreachScenario | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Filters state
  const [filters, setFilters] = useState({
    companies: [] as string[],
    years: [] as string[],
    categories: [] as string[],
    search: "",
  })

  // Check if user has completed quiz recently (localStorage) - only run once
  useEffect(() => {
    const quizCompleted = localStorage.getItem("breach-quiz-completed")
    const lastScore = localStorage.getItem("breach-quiz-score")

    if (quizCompleted) {
      const completedTime = Number.parseInt(quizCompleted)
      const oneHour = 60 * 60 * 1000

      if (Date.now() - completedTime < oneHour) {
        setShowQuiz(false)
        setQuizScore(lastScore ? Number.parseInt(lastScore) : null)
      } else {
        // Clear expired quiz data
        localStorage.removeItem("breach-quiz-completed")
        localStorage.removeItem("breach-quiz-score")
      }
    }
  }, []) // Empty dependency array - only run once

  // Initialize data and parse URL params - separate from quiz check
  useEffect(() => {
    if (showQuiz) return // Don't initialize data until quiz is complete

    // Only initialize once
    if (isInitialized) return

    const validated = validateAndNormalizeScenarios(scenarios)
    setValidatedScenarios(validated)

    if (validated.length < scenarios.length) {
      toast({
        title: "Data validation warning",
        description: `${scenarios.length - validated.length} scenarios were skipped due to validation errors`,
        variant: "destructive",
      })
    }

    // Parse URL parameters only once on mount
    const urlCompanies = searchParams.get("companies")?.split(",").filter(Boolean) || []
    const urlYears = searchParams.get("years")?.split(",").filter(Boolean) || []
    const urlCategories = searchParams.get("categories")?.split(",").filter(Boolean) || []
    const urlSearch = searchParams.get("search") || ""

    setFilters({
      companies: urlCompanies,
      years: urlYears,
      categories: urlCategories,
      search: urlSearch,
    })

    setIsInitialized(true)
  }, [showQuiz, isInitialized, searchParams, toast])

  // Update URL when filters change - memoized callback
  const updateUrl = useCallback(
    (newFilters: typeof filters) => {
      if (!isInitialized) return

      const params = new URLSearchParams()

      if (newFilters.companies.length > 0) {
        params.set("companies", newFilters.companies.join(","))
      }
      if (newFilters.years.length > 0) {
        params.set("years", newFilters.years.join(","))
      }
      if (newFilters.categories.length > 0) {
        params.set("categories", newFilters.categories.join(","))
      }
      if (newFilters.search) {
        params.set("search", newFilters.search)
      }

      const newUrl = params.toString() ? `?${params.toString()}` : "/breach-explorer"
      router.replace(newUrl, { scroll: false })
    },
    [router, isInitialized],
  )

  // Debounced URL update - only when filters actually change
  useEffect(() => {
    if (!isInitialized) return

    const timeoutId = setTimeout(() => {
      updateUrl(filters)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [filters, updateUrl, isInitialized])

  // Filter scenarios - memoized
  const filteredScenarios = useMemo(() => {
    if (validatedScenarios.length === 0) return []
    return filterScenarios(validatedScenarios, filters)
  }, [validatedScenarios, filters])

  const handleQuizComplete = useCallback(
    (score: number) => {
      setQuizScore(score)
      setShowQuiz(false)

      // Store completion in localStorage
      localStorage.setItem("breach-quiz-completed", Date.now().toString())
      localStorage.setItem("breach-quiz-score", score.toString())

      // Show congratulatory toast
      toast({
        title: "Quiz completed! 🎉",
        description: `You scored ${score}/5. Welcome to the Breach Explorer!`,
      })
    },
    [toast],
  )

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
  }, [])

  const handleRowClick = useCallback((scenario: BreachScenario) => {
    setSelectedScenario(scenario)
    setIsDetailsOpen(true)
  }, [])

  // Show quiz if not completed
  if (showQuiz) {
    return <BreachQuiz onComplete={handleQuizComplete} />
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Quiz Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <TrendingDown className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Breach Explorer</h1>
              <p className="text-muted-foreground">Explore and analyze major data breach scenarios and their impacts</p>
            </div>
          </div>

          {quizScore !== null && (
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <Badge variant="secondary">Quiz Score: {quizScore}/5</Badge>
            </div>
          )}
        </div>

        {/* KPIs */}
        <Kpis scenarios={filteredScenarios} />

        {/* Filters */}
        <Filters scenarios={validatedScenarios} filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Charts */}
        <Charts scenarios={filteredScenarios} />

        {/* Table */}
        <BreachTable scenarios={filteredScenarios} onRowClick={handleRowClick} />

        {/* Details Sheet */}
        <DetailsSheet scenario={selectedScenario} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      </div>
    </div>
  )
}
