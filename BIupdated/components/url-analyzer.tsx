"use client"

import type React from "react"

import { useState } from "react"
import { Link, Search, Code, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useScan } from "@/hooks/use-scan"
import type { ScanResult } from "@/lib/types"

// Helper functions for risk calculation
function calculateRiskScore(scanResults: ScanResult[]): number {
  if (!scanResults.length || scanResults.every((r) => r.vulns.length === 0)) {
    return 25 // Low risk if no tech detected or no vulnerabilities found
  }

  let totalScore = 0
  let hasVulnerabilities = false

  scanResults.forEach((result) => {
    result.vulns.forEach((vuln) => {
      hasVulnerabilities = true
      switch (vuln.severity) {
        case "CRITICAL":
          totalScore += 25
          break
        case "HIGH":
          totalScore += 15
          break
        case "MEDIUM":
          totalScore += 8
          break
        case "LOW":
          totalScore += 3
          break
        case "UNKNOWN":
          totalScore += 1 // Minimal impact for unknown severity
          break
      }
    })
  })

  if (!hasVulnerabilities) return 25 // Still low risk if no vulnerabilities after all checks

  // Cap at 99, minimum at 30 if vulnerabilities exist
  return Math.min(99, Math.max(30, totalScore))
}

function getRiskLevel(score: number): { text: string; class: string } {
  if (score >= 80) return { text: "Critical Risk 🚨", class: "bg-destructive" }
  if (score >= 60) return { text: "High Risk ⚠️", class: "bg-destructive" }
  if (score >= 40) return { text: "Medium Risk ⚠️", class: "bg-yellow-500" }
  return { text: "Low Risk 👍", class: "bg-success" }
}

export function UrlAnalyzer() {
  const [url, setUrl] = useState("")
  const { scanResults, isLoading, error, scanUrl } = useScan()
  const { toast } = useToast()

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to scan.",
        variant: "destructive",
      })
      return
    }

    if (!/^https?:\/\//.test(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    await scanUrl(url)

    if (error) {
      toast({
        title: "Scan Failed",
        description: error,
        variant: "destructive",
      })
    } else if (scanResults) {
      const totalVulns = scanResults.reduce((acc, r) => acc + r.vulns.length, 0)
      toast({
        title: "Scan Complete",
        description: `Found ${scanResults.length} technologies with ${totalVulns} vulnerabilities.`,
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan()
    }
  }

  const allVulnerabilities = scanResults ? scanResults.flatMap((r) => r.vulns) : []
  const calculatedScore = scanResults ? calculateRiskScore(scanResults) : 0
  const riskLevel = getRiskLevel(calculatedScore)

  return (
    <Card className="max-w-4xl mx-auto -mt-16 relative z-10 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url-input" className="text-base font-semibold flex items-center gap-2">
            <Link className="h-4 w-4" />
            Paste the web app URL:
          </Label>
          <Input
            id="url-input"
            type="url"
            placeholder="https://yourapp.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-base"
          />
        </div>

        <Button onClick={handleScan} disabled={isLoading} className="w-full text-base font-semibold" size="lg">
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Scan
            </>
          )}
        </Button>

        {/* Results */}
        <div className="min-h-[100px] flex items-center justify-center">
          {isLoading && (
            <div className="text-center space-y-2">
              <div className="loading-spinner mx-auto" />
              <p className="text-sm text-muted-foreground">Analyzing security and tech stack...</p>
            </div>
          )}

          {error && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-destructive space-y-2"
            >
              <AlertTriangle className="h-8 w-8 mx-auto" />
              <p className="font-semibold">Scan Error:</p>
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {scanResults && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 w-full"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto ${riskLevel.class}`}
              >
                {calculatedScore}
              </div>

              <div>
                <h3 className="text-lg font-bold">{riskLevel.text}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Security assessment for <strong>{url}</strong> ({allVulnerabilities.length} vulnerabilities found)
                </p>
              </div>

              {/* Tech Stack Section */}
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Detected Tech Stack
                </h3>
                {scanResults.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {scanResults.map((result, index) => (
                      <Badge
                        key={index}
                        variant={result.vulns.length > 0 ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {result.tech} {result.version && `v${result.version}`}
                        {result.vulns.length > 0 && ` (${result.vulns.length} CVEs)`}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No relevant technologies detected</p>
                )}
              </div>

              {/* Vulnerabilities Section */}
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Vulnerabilities (Last 12 Months)
                </h3>
                {allVulnerabilities.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px] min-w-[100px]">CVE ID</TableHead>
                          <TableHead className="w-[80px] min-w-[70px]">Tech</TableHead>
                          <TableHead className="w-[100px] min-w-[90px]">Severity</TableHead>
                          <TableHead className="w-[100px] min-w-[90px]">Date</TableHead>
                          <TableHead className="min-w-[200px]">Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scanResults.flatMap((result) =>
                          result.vulns.map((vuln, vulnIndex) => (
                            <TableRow
                              key={`${result.tech}-${vuln.cve}-${vulnIndex}`}
                              className={vulnIndex % 2 === 0 ? "bg-muted/50" : ""}
                            >
                              <TableCell>
                                <a
                                  href={vuln.references[0] || `https://nvd.nist.gov/vuln/detail/${vuln.cve}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-xs font-mono"
                                >
                                  {vuln.cve}
                                </a>
                              </TableCell>
                              <TableCell className="text-xs font-medium">{result.tech}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    vuln.severity === "CRITICAL" || vuln.severity === "HIGH"
                                      ? "destructive"
                                      : vuln.severity === "MEDIUM"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {vuln.severity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs">{new Date(vuln.published).toLocaleDateString()}</TableCell>
                              <TableCell className="text-xs">
                                {vuln.description.length > 80
                                  ? `${vuln.description.substring(0, 80)}...`
                                  : vuln.description}
                              </TableCell>
                            </TableRow>
                          )),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent vulnerabilities found</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
