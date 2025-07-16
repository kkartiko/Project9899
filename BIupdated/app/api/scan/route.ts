import { type NextRequest, NextResponse } from "next/server"
import { scanStackAndVulns } from "@/lib/scan"
import type { ScanResult } from "@/lib/types"

export const runtime = "edge"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 3

  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ message: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    const { url } = await request.json()

    if (!url || typeof url !== "string") {
      return NextResponse.json({ message: "Valid URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ message: "Invalid URL format" }, { status: 400 })
    }

    const results: ScanResult[] = await scanStackAndVulns(url)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Scan API error:", error)

    if (error instanceof Error && error.message.includes("environment variable")) {
      return NextResponse.json({ message: "Server configuration error: Missing API keys." }, { status: 500 })
    }

    return NextResponse.json({ message: "Internal server error during scan." }, { status: 500 })
  }
}
