import { type NextRequest, NextResponse } from "next/server"
import { scenarios } from "@/lib/data/breach-scenarios"
import { validateAndNormalizeScenarios, filterScenarios } from "@/lib/utils/breach"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const companies = searchParams.get("companies")?.split(",").filter(Boolean) || []
    const years = searchParams.get("years")?.split(",").filter(Boolean) || []
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || []
    const search = searchParams.get("search") || ""

    // Validate and normalize data
    const validatedScenarios = validateAndNormalizeScenarios(scenarios)

    // Apply filters
    const filteredScenarios = filterScenarios(validatedScenarios, {
      companies,
      years,
      categories,
      search,
    })

    // Return response with metadata
    return NextResponse.json({
      data: filteredScenarios,
      meta: {
        total: filteredScenarios.length,
        totalUnfiltered: validatedScenarios.length,
        filters: {
          companies: companies.length,
          years: years.length,
          categories: categories.length,
          search: search ? 1 : 0,
        },
      },
    })
  } catch (error) {
    console.error("Error in breach-scenarios API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
