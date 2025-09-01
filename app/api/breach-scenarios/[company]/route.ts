import { type NextRequest, NextResponse } from "next/server"
import { scenarios } from "@/lib/data/breach-scenarios"
import { validateAndNormalizeScenarios } from "@/lib/utils/breach"

export async function GET(request: NextRequest, { params }: { params: { company: string } }) {
  try {
    const companyName = decodeURIComponent(params.company)

    // Validate and normalize data
    const validatedScenarios = validateAndNormalizeScenarios(scenarios)

    // Find scenario by company name (case-insensitive)
    const scenario = validatedScenarios.find((s) => s.company.toLowerCase() === companyName.toLowerCase())

    if (!scenario) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      data: scenario,
      meta: {
        company: scenario.company,
        year: scenario.year,
        category: scenario.category,
      },
    })
  } catch (error) {
    console.error("Error in company-specific breach API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
