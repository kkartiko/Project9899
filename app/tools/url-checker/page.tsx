"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Link, Shield, AlertTriangle, CheckCircle, Copy, ChevronDown, ChevronUp, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { ToolLayout } from "@/components/tool-layout"
import { callAIAgent, formatMarkdown, type AIAnalysisResult } from "@/lib/ai-agent"

interface UrlScanResult {
  url: string
  status: "Safe" | "Suspicious" | "Dangerous"
  reasons: string[]
  whoisData?: {
    registrar: string
    created: string
    expires: string
    nameServers: string[]
  }
  sslInfo?: {
    issuer: string
    expires: string
    valid: boolean
  }
  reputation?: {
    score: number
    categories: string[]
  }
}

export default function UrlCheckerPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UrlScanResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const { toast } = useToast()
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)

  const mockScanUrl = useCallback(async (targetUrl: string): Promise<UrlScanResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock dangerous sites
    const dangerousPatterns = [
      /totally-legit\.uk/i,
      /free-money/i,
      /click-here-now/i,
      /urgent-update/i,
      /paypal-security/i,
    ]

    // Mock suspicious patterns
    const suspiciousPatterns = [/\.tk$/i, /\.ml$/i, /\.ga$/i, /bit\.ly/i, /tinyurl/i]

    const isDangerous = dangerousPatterns.some((pattern) => pattern.test(targetUrl))
    const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(targetUrl))

    let status: UrlScanResult["status"] = "Safe"
    let reasons: string[] = []

    if (isDangerous) {
      status = "Dangerous"
      reasons = [
        "Domain associated with phishing campaigns",
        "Recently registered domain",
        "Suspicious URL structure",
        "No valid SSL certificate",
      ]
    } else if (isSuspicious) {
      status = "Suspicious"
      reasons = ["Uses URL shortener service", "Uncommon top-level domain", "Limited reputation data"]
    } else {
      reasons = [
        "Domain has good reputation",
        "Valid SSL certificate",
        "Established registration date",
        "No known malicious activity",
      ]
    }

    return {
      url: targetUrl,
      status,
      reasons,
      whoisData: {
        registrar: "Mock Registrar Inc.",
        created: "2020-01-15",
        expires: "2025-01-15",
        nameServers: ["ns1.mockdns.com", "ns2.mockdns.com"],
      },
      sslInfo: {
        issuer: "Let's Encrypt",
        expires: "2024-06-15",
        valid: !isDangerous,
      },
      reputation: {
        score: isDangerous ? 15 : isSuspicious ? 60 : 95,
        categories: isDangerous ? ["Phishing", "Malware"] : isSuspicious ? ["Suspicious"] : ["Safe"],
      },
    }
  }, [])

  const handleScan = useCallback(async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to check.",
        variant: "destructive",
      })
      return
    }

    let checkUrl = url
    if (!checkUrl.startsWith("http://") && !checkUrl.startsWith("https://")) {
      checkUrl = `https://${checkUrl}`
    }

    setIsLoading(true)
    try {
      const scanResult = await mockScanUrl(checkUrl)
      setResult(scanResult)

      if (scanResult.status === "Dangerous") {
        setShowDetails(true)
      }

      toast({
        title: "Scan Complete",
        description: `URL classified as ${scanResult.status}`,
        variant: scanResult.status === "Dangerous" ? "destructive" : "default",
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Unable to scan the URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [url, mockScanUrl, toast])

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied",
          description: "Information copied to clipboard",
        })
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "Safe":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Suspicious":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "Dangerous":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Shield className="h-5 w-5 text-gray-500" />
    }
  }, [])

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
      case "Suspicious":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
      case "Dangerous":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
    }
  }, [])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleScan()
      }
    },
    [handleScan],
  )

  const handleAiAnalysis = async () => {
    if (!result) return

    setIsAiAnalyzing(true)
    try {
      const analysis = await callAIAgent("analyze-url", { url, scanResult: result })
      setAiAnalysis(analysis)
      toast({
        title: "AI Analysis Complete",
        description: "Detailed threat analysis generated.",
      })
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI analysis",
        variant: "destructive",
      })
    } finally {
      setIsAiAnalyzing(false)
    }
  }

  return (
    <ToolLayout
      title="URL Checker"
      description="Analyze URLs for potential threats, phishing attempts, and security risks. Get detailed WHOIS and SSL information for suspicious domains."
      icon={Link}
      badge="Real-time"
    >
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>URL Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="https://example.com or example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleScan} disabled={isLoading}>
                  {isLoading ? "Scanning..." : "Check URL"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setUrl("http://totally-legit.uk")}>
                  Try Dangerous URL
                </Button>
                <Button variant="outline" size="sm" onClick={() => setUrl("bit.ly/3example")}>
                  Try Suspicious URL
                </Button>
                <Button variant="outline" size="sm" onClick={() => setUrl("https://github.com")}>
                  Try Safe URL
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Main Result */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span>Scan Result</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <Badge className={`${getStatusColor(result.status)} text-lg px-4 py-2`}>{result.status}</Badge>
                  <p className="text-sm text-muted-foreground break-all">{result.url}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Analysis Results:</h4>
                  <ul className="space-y-1">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.reputation && (
                  <>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reputation Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.reputation.score >= 80
                                  ? "bg-green-500"
                                  : result.reputation.score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${result.reputation.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono">{result.reputation.score}/100</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleAiAnalysis}
                      disabled={isAiAnalyzing}
                      variant="outline"
                      className="w-full mt-4 bg-transparent border-primary/20 hover:border-primary/50"
                    >
                      {isAiAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                          AI Analyzing Threat...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-4 w-4" />
                          Get AI Threat Analysis
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Card className="max-w-2xl mx-auto">
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <span>Detailed Information</span>
                      {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    {/* WHOIS Data */}
                    {result.whoisData && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">WHOIS Information</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(JSON.stringify(result.whoisData, null, 2))}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Registrar:</strong>
                            <p className="text-muted-foreground">{result.whoisData.registrar}</p>
                          </div>
                          <div>
                            <strong>Created:</strong>
                            <p className="text-muted-foreground">{result.whoisData.created}</p>
                          </div>
                          <div>
                            <strong>Expires:</strong>
                            <p className="text-muted-foreground">{result.whoisData.expires}</p>
                          </div>
                          <div>
                            <strong>Name Servers:</strong>
                            <div className="text-muted-foreground">
                              {result.whoisData.nameServers.map((ns, index) => (
                                <p key={index}>{ns}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SSL Information */}
                    {result.sslInfo && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">SSL Certificate</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Issuer:</strong>
                            <p className="text-muted-foreground">{result.sslInfo.issuer}</p>
                          </div>
                          <div>
                            <strong>Expires:</strong>
                            <p className="text-muted-foreground">{result.sslInfo.expires}</p>
                          </div>
                          <div className="md:col-span-2">
                            <strong>Status:</strong>
                            <div className="flex items-center space-x-2 mt-1">
                              {result.sslInfo.valid ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-muted-foreground">
                                {result.sslInfo.valid ? "Valid Certificate" : "Invalid Certificate"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {aiAnalysis && (
              <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>AI Threat Analysis</span>
                    <Badge variant="secondary" className="ml-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(aiAnalysis.analysis || ""),
                    }}
                  />
                  {aiAnalysis.usage && (
                    <div className="mt-4 text-xs text-muted-foreground">
                      AI Analysis • {aiAnalysis.usage.total_tokens} tokens used
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </ToolLayout>
  )
}
