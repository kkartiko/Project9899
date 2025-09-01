import { type NextRequest, NextResponse } from "next/server"
import type { ScanResult, Vulnerability, Technology } from "@/lib/types"

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY
const NVD_API_KEY = process.env.NVD_API_KEY

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

async function detectTechStack(url: string): Promise<Technology[]> {
  // First try Firecrawl if API key is available
  if (FIRECRAWL_API_KEY) {
    try {
      const response = await fetch("https://api.firecrawl.dev/v0/scrape", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          pageOptions: {
            onlyMainContent: false,
            includeHtml: true,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const html = data.data?.html || ""
        return analyzeHtmlForTech(html, url)
      } else {
        console.warn(`Firecrawl API returned status ${response.status}, falling back to direct fetch.`)
      }
    } catch (error) {
      console.warn("Firecrawl API failed, falling back to direct fetch:", error)
    }
  }

  // Fallback: Direct fetch and analysis
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BreachIndex/1.0)",
      },
      cache: 'no-store'
    })

    if (response.ok) {
      const html = await response.text()
      return analyzeHtmlForTech(html, url)
    } else {
      console.warn(`Direct fetch returned status ${response.status}, falling back to URL analysis.`)
    }
  } catch (error) {
    console.warn("Direct fetch failed:", error)
  }

  // Final fallback: URL-based detection
  return analyzeUrlForTech(url)
}

function analyzeHtmlForTech(html: string, url: string): Technology[] {
  const technologies: Technology[] = []

  // Detect common frameworks and libraries from HTML content
  const techPatterns = [
    { name: "React", type: "Frontend Framework", patterns: [/react/i, /_react/i, /__react/i, /data-reactroot/i] },
    { name: "Next.js", type: "Frontend Framework", patterns: [/next\.js/i, /_next/i, /__next/i, /next-head/i] },
    { name: "Vue.js", type: "Frontend Framework", patterns: [/vue\.js/i, /vue/i, /__vue/i, /v-if|v-for|v-model/i] },
    { name: "Angular", type: "Frontend Framework", patterns: [/angular/i, /ng-/i, /\[ng/i, /\(ng/i] },
    { name: "Svelte", type: "Frontend Framework", patterns: [/svelte/i, /svelte-/i] },
    {
      name: "Tailwind CSS",
      type: "CSS Framework",
      patterns: [/tailwind/i, /tw-/i, /class="[^"]*\b(bg-|text-|p-|m-|flex|grid)/i],
    },
    {
      name: "Bootstrap",
      type: "CSS Framework",
      patterns: [/bootstrap/i, /bs-/i, /class="[^"]*\b(btn|container|row|col)/i],
    },
    { name: "jQuery", type: "JavaScript Library", patterns: [/jquery/i, /\$\(/i, /jquery\.min\.js/i] },
    { name: "WordPress", type: "CMS", patterns: [/wp-content/i, /wordpress/i, /wp-includes/i] },
    { name: "Shopify", type: "E-commerce", patterns: [/shopify/i, /cdn\.shopify/i, /myshopify\.com/i] },
    { name: "Webflow", type: "Website Builder", patterns: [/webflow/i, /wf-/i] },
    { name: "Squarespace", type: "Website Builder", patterns: [/squarespace/i, /static1\.squarespace/i] },
  ]

  techPatterns.forEach((tech) => {
    const matches = tech.patterns.filter((pattern) => pattern.test(html)).length
    if (matches > 0) {
      technologies.push({
        name: tech.name,
        type: tech.type,
        confidence: Math.min(0.9, 0.5 + matches * 0.2), // Higher confidence for multiple matches
      })
    }
  })

  // Add URL-based detection
  const urlTech = analyzeUrlForTech(url)
  urlTech.forEach((tech) => {
    if (!technologies.find((t) => t.name === tech.name)) {
      technologies.push(tech)
    }
  })

  return technologies
}

function analyzeUrlForTech(url: string): Technology[] {
  const technologies: Technology[] = []

  // Hosting platform detection
  const hostingPatterns = [
    { name: "Vercel", type: "Hosting Platform", pattern: /vercel\.app$/i },
    { name: "Netlify", type: "Hosting Platform", pattern: /netlify\.app$/i },
    { name: "GitHub Pages", type: "Hosting Platform", pattern: /github\.io$/i },
    { name: "Heroku", type: "Hosting Platform", pattern: /herokuapp\.com$/i },
    { name: "Firebase", type: "Hosting Platform", pattern: /firebaseapp\.com$/i },
    { name: "AWS CloudFront", type: "CDN", pattern: /cloudfront\.net$/i },
  ]

  hostingPatterns.forEach((hosting) => {
    if (hosting.pattern.test(url)) {
      technologies.push({
        name: hosting.name,
        type: hosting.type,
        confidence: 0.95,
      })
    }
  })

  return technologies
}

async function fetchVulnerabilities(technologies: Technology[]): Promise<Map<string, Vulnerability[]>> {
  const techVulnsMap = new Map<string, Vulnerability[]>()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  if (!NVD_API_KEY) {
    return NextResponse.json({ error: "Missing NVD_API_KEY configuration" }, { status: 500 }) as any
  }

  try {
    // Limit to first 5 technologies for NVD query to avoid excessive API calls
    for (const tech of technologies.slice(0, 5)) {
      const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(tech.name)}&pubStartDate=${oneYearAgo.toISOString().split("T")[0]}T00:00:00.000&resultsPerPage=5`,
        {
          headers: {
            apiKey: NVD_API_KEY,
          },
          cache: 'no-store'
        },
      )

      if (response.ok) {
        const data = await response.json()
        const techSpecificVulns: Vulnerability[] = []
        if (data.vulnerabilities) {
          data.vulnerabilities.forEach((vuln: any) => {
            const cve = vuln.cve
            techSpecificVulns.push({
              cve: cve.id,
              title: cve.descriptions?.[0]?.value || "No title available",
              severity: cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || "UNKNOWN",
              published: cve.published,
              description: cve.descriptions?.[0]?.value || "No description available",
              references: cve.references?.map((ref: any) => ref.url) || [],
            })
          })
        }
        techVulnsMap.set(tech.name, techSpecificVulns)
      } else {
        console.warn(`NVD API error for ${tech.name}: ${response.status}. Using empty results.`)
        techVulnsMap.set(tech.name, [])
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay for NVD rate limits
    }
  } catch (error) {
    console.error("Vulnerability fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch vulnerability data" }, { status: 500 }) as any
  }

  return techVulnsMap
}

async function scanStackAndVulns(url: string): Promise<ScanResult[]> {
  const technologies = await detectTechStack(url)
  const techVulnsMap = await fetchVulnerabilities(technologies)

  let finalScanResults: ScanResult[] = []
  technologies.forEach((tech) => {
    const vulnsForTech = techVulnsMap.get(tech.name) || []
    finalScanResults.push({
      tech: tech.name,
      vulns: vulnsForTech,
    })
  })

  // Filter out generic CSS libs like Tailwind/Bootstrap unless they're the ONLY hits.
  const nonGenericTechFound = finalScanResults.some((r) => !["Tailwind CSS", "Bootstrap"].includes(r.tech))

  if (nonGenericTechFound) {
    finalScanResults = finalScanResults.filter((r) => !["Tailwind CSS", "Bootstrap"].includes(r.tech))
  }

  return finalScanResults
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

    if (error instanceof Error && error.message.includes("Missing NVD_API_KEY")) {
      return NextResponse.json({ message: "Server configuration error: Missing API keys." }, { status: 500 })
    }

    return NextResponse.json({ message: "Internal server error during scan." }, { status: 500 })
  }
}
