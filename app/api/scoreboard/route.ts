import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a proper database
const orgScoreboards = new Map<
  string,
  Array<{
    name: string
    score: number
    timestamp: string
  }>
>()

export async function POST(request: NextRequest) {
  try {
    const { org, name, score, timestamp } = await request.json()

    if (!org || !name || typeof score !== "number" || !timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get or create org scoreboard
    const orgBoard = orgScoreboards.get(org) || []

    // Add new score
    orgBoard.push({ name, score, timestamp })

    // Sort by score (highest first) and keep top 50
    orgBoard.sort((a, b) => b.score - a.score)
    orgBoard.splice(50)

    // Update storage
    orgScoreboards.set(org, orgBoard)

    return NextResponse.json({ success: true, leaderboard: orgBoard })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const org = searchParams.get("org")

    if (!org) {
      return NextResponse.json({ error: "Organization parameter required" }, { status: 400 })
    }

    const leaderboard = orgScoreboards.get(org) || []
    return NextResponse.json({ leaderboard })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
