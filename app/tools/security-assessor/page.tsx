"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle, ExternalLink, Sparkles, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getSecurityAssessment, type SecurityReport } from "@/lib/security-accessorv0"
import { ToolLayout } from "@/components/tool-layout"
import { callAIAgent, formatMarkdown, type AIAnalysisResult } from "@/lib/ai-agent"

const sampleSites = [
  { name: "Example.com", url: "https://example.com" },
  { name: "GitHub", url: "https://github.com" },
  { name: "Stack Overflow", url: "https://stackoverflow.com" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
]

const severityColors = {
  LOW: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  MEDIUM:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  CRITICAL: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
}

export default function SecurityAssessorPage() {
  const [url, setUrl] = useState("")
  const [dataset, setDataset] = useState("nvd")
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<SecurityReport | null>(null)
  const { toast } = useToast()
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  const handleAssessment = async (targetUrl?: string) => {
    const assessUrl = targetUrl || url
    if (!assessUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to assess.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const assessment = await getSecurityAssessment(assessUrl)
      setReport(assessment)
      toast({
        title: "Assessment Complete",
        description: `Found ${assessment.cveFindings.length} vulnerabilities across ${assessment.techStack.length} technologies.`,
      })
    } catch (error) {
      toast({
        title: "Assessment Failed",
        description: error instanceof Error ? error.message : "An error occurred during assessment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAiAnalysis = async () => {
    if (!report) return

    setIsAiLoading(true)
    try {
      const analysis = await callAIAgent("analyze-security", { report })
      setAiAnalysis(analysis)
      toast({
        title: "AI Analysis Complete",
        description: "Security recommendations generated successfully.",
      })
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI analysis",
        variant: "destructive",
      })
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <ToolLayout
      title="Security Assessor"
      description="Comprehensive security assessment tool that analyzes web applications for vulnerabilities, security headers, and technology stack risks."
      icon={Shield}
      badge="Advanced"
    >
      <div className="space-y-8">
        {/* Assessment Configuration */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Assessment Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAssessment()}
                  className="h-12 text-lg rounded-xl border-2 focus:border-primary/50"
                />
              </div>
              <Select value={dataset} onValueChange={setDataset}>
                <SelectTrigger className="h-12 rounded-xl border-2">
                  <SelectValue placeholder="Select dataset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nvd">NVD Database</SelectItem>
                  <SelectItem value="mock">Mock Dataset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => handleAssessment()}
                disabled={isLoading}
                className="flex-1 h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Assessing...
                  </>
                ) : (
                  "Run Assessment"
                )}
              </Button>
              <Select onValueChange={(value) => handleAssessment(value)}>
                <SelectTrigger className="flex-1 h-12 rounded-xl border-2">
                  <SelectValue placeholder="Try sample sites" />
                </SelectTrigger>
                <SelectContent>
                  {sampleSites.map((site) => (
                    <SelectItem key={site.url} value={site.url}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {report && (
                <Button
                  onClick={handleAiAnalysis}
                  disabled={isAiLoading}
                  variant="outline"
                  className="h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/50 bg-transparent"
                >
                  {isAiLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Get AI Recommendations
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Risk Overview */}
            <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Risk Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mx-auto mb-3 shadow-lg ${
                        report.riskLevel === "CRITICAL"
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : report.riskLevel === "HIGH"
                            ? "bg-gradient-to-br from-orange-500 to-orange-600"
                            : report.riskLevel === "MEDIUM"
                              ? "bg-gradient-to-br from-yellow-500 to-yellow-600"
                              : "bg-gradient-to-br from-green-500 to-green-600"
                      }`}
                    >
                      {report.riskScore}
                    </div>
                    <p className="font-semibold text-lg">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <Badge className={`${severityColors[report.riskLevel]} text-lg px-4 py-2 rounded-xl`}>
                      {report.riskLevel}
                    </Badge>
                    <p className="font-semibold mt-3 text-lg">Risk Level</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{report.techStack.length}</div>
                    <p className="font-semibold text-lg">Technologies</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-destructive mb-2">{report.cveFindings.length}</div>
                    <p className="font-semibold text-lg">Vulnerabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Detected Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border/50 bg-gradient-to-br from-muted/50 to-muted/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{tech.name}</h4>
                        {tech.version && <p className="text-sm text-muted-foreground">v{tech.version}</p>}
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${tech.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {Math.round(tech.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Headers */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Security Headers Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Header</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Value</TableHead>
                        <TableHead className="font-semibold">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.headers.map((header, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm font-medium">{header.header}</TableCell>
                          <TableCell>
                            {header.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs max-w-xs truncate">
                            {header.value || <span className="text-muted-foreground italic">Not set</span>}
                          </TableCell>
                          <TableCell className="text-sm">{header.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* CVE Findings */}
            {report.cveFindings.length > 0 && (
              <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Vulnerability Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold">CVE ID</TableHead>
                          <TableHead className="font-semibold">Severity</TableHead>
                          <TableHead className="font-semibold">CVSS Score</TableHead>
                          <TableHead className="font-semibold">Published</TableHead>
                          <TableHead className="font-semibold">Summary</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.cveFindings.map((cve, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell>
                              <a
                                href={`https://nvd.nist.gov/vuln/detail/${cve.cveId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center space-x-1 font-medium"
                              >
                                <span className="font-mono text-sm">{cve.cveId}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${severityColors[cve.severity]} rounded-lg`}>{cve.severity}</Badge>
                            </TableCell>
                            <TableCell className="font-mono font-medium">{cve.cvss}</TableCell>
                            <TableCell>{new Date(cve.published).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-md">
                              <p className="text-sm line-clamp-2">{cve.summary}</p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {aiAnalysis && (
              <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <span>AI Security Analysis</span>
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
