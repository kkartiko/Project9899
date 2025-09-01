import { z } from "zod"
import type { BreachScenario, Source } from "@/lib/data/breach-scenarios"

// Zod schema for validation
const SourceSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

const BreachScenarioSchema = z.object({
  company: z.string(),
  year: z.union([z.number(), z.string()]),
  scenario: z.string(),
  actualCost: z.number(),
  costLabel: z.string(),
  totalImpact: z.number(),
  totalImpactLabel: z.string(),
  impact: z.string(),
  sources: z.union([z.array(SourceSchema), z.array(z.string())]),
  category: z.string(),
})

export type ValidatedBreachScenario = z.infer<typeof BreachScenarioSchema>

// Helper function to get year start from number or range string
export function getYearStart(year: number | string): number {
  if (typeof year === "number") {
    return year
  }

  // Handle range strings like "2016-2018" or "2021-2023"
  const match = year.match(/^(\d{4})/)
  if (match) {
    return Number.parseInt(match[1], 10)
  }

  // Fallback - try to parse as number
  const parsed = Number.parseInt(year.toString(), 10)
  return isNaN(parsed) ? 0 : parsed
}

// Helper function to normalize sources
export function normalizeSources(sources: Source[] | string[]): { label: string; url: string }[] {
  return sources.map((source) => {
    if (typeof source === "string") {
      return { label: source, url: source }
    }
    return source
  })
}

// Helper function to format numbers compactly
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  return num.toString()
}

// Helper function to calculate totals
export function totals(scenarios: BreachScenario[]): {
  sumActual: number
  sumImpact: number
} {
  return scenarios.reduce(
    (acc, scenario) => ({
      sumActual: acc.sumActual + scenario.actualCost,
      sumImpact: acc.sumImpact + scenario.totalImpact,
    }),
    { sumActual: 0, sumImpact: 0 },
  )
}

// Validation function
export function validateAndNormalizeScenarios(scenarios: BreachScenario[]): BreachScenario[] {
  return scenarios
    .map((scenario) => {
      try {
        const validated = BreachScenarioSchema.parse(scenario)
        return {
          ...validated,
          sources: normalizeSources(validated.sources),
        }
      } catch (error) {
        console.warn(`Validation failed for scenario: ${scenario.company}`, error)
        return null
      }
    })
    .filter((scenario): scenario is BreachScenario => scenario !== null)
}

// Filter function
export function filterScenarios(
  scenarios: BreachScenario[],
  filters: {
    companies: string[]
    years: string[]
    categories: string[]
    search: string
  },
): BreachScenario[] {
  return scenarios.filter((scenario) => {
    // Company filter
    if (filters.companies.length > 0 && !filters.companies.includes(scenario.company)) {
      return false
    }

    // Year filter
    if (filters.years.length > 0) {
      const yearStart = getYearStart(scenario.year)
      const yearMatches = filters.years.some((filterYear) => {
        if (filterYear === "All") return true
        if (filterYear.includes("–")) {
          const [start, end] = filterYear.split("–").map((y) => Number.parseInt(y.trim(), 10))
          return yearStart >= start && yearStart <= end
        }
        return yearStart === Number.parseInt(filterYear, 10)
      })
      if (!yearMatches) return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(scenario.category)) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchableText = [scenario.company, scenario.scenario, scenario.impact].join(" ").toLowerCase()

      if (!searchableText.includes(searchLower)) {
        return false
      }
    }

    return true
  })
}

// Sort function
export function sortScenarios(
  scenarios: BreachScenario[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): BreachScenario[] {
  return [...scenarios].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case "company":
        aValue = a.company
        bValue = b.company
        break
      case "year":
        aValue = getYearStart(a.year)
        bValue = getYearStart(b.year)
        break
      case "actualCost":
        aValue = a.actualCost
        bValue = b.actualCost
        break
      case "totalImpact":
        aValue = a.totalImpact
        bValue = b.totalImpact
        break
      default:
        return 0
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue)
      return sortOrder === "asc" ? comparison : -comparison
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })
}

// Export to CSV
export function exportToCSV(scenarios: BreachScenario[], filename = "breach-scenarios.csv"): void {
  const headers = [
    "Company",
    "Year",
    "Category",
    "Actual Cost",
    "Cost Label",
    "Total Impact",
    "Total Impact Label",
    "Scenario",
    "Impact",
    "Sources Count",
  ]

  const csvContent = [
    headers.join(","),
    ...scenarios.map((scenario) =>
      [
        `"${scenario.company}"`,
        `"${scenario.year}"`,
        `"${scenario.category}"`,
        scenario.actualCost,
        `"${scenario.costLabel}"`,
        scenario.totalImpact,
        `"${scenario.totalImpactLabel}"`,
        `"${scenario.scenario.replace(/"/g, '""')}"`,
        `"${scenario.impact.replace(/"/g, '""')}"`,
        normalizeSources(scenario.sources).length,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
