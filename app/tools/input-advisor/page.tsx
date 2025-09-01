"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Zap, Search, Code, Shield, CheckCircle, AlertTriangle, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ToolLayout } from "@/components/tool-layout"
import { callAIAgent, formatMarkdown, type AIAnalysisResult } from "@/lib/ai-agent"

interface InputField {
  id: string
  name: string
  type: string
  placeholder?: string
  required: boolean
  validation: string[]
  securityRisks: string[]
}

interface SecurityAdvice {
  frontend: string[]
  backend: { [key: string]: string[] }
}

const backendFrameworks = [
  { id: "nodejs", name: "Node.js/Express", icon: "🟢" },
  { id: "php", name: "PHP", icon: "🐘" },
  { id: "nextjs", name: "Next.js API Routes", icon: "▲" },
  { id: "sveltekit", name: "SvelteKit", icon: "🧡" },
  { id: "nuxt", name: "Nuxt 3", icon: "💚" },
  { id: "react-actions", name: "React Server Actions", icon: "⚛️" },
]

const securityAdviceMap: { [key: string]: SecurityAdvice } = {
  email: {
    frontend: [
      "Use HTML5 email input type for basic validation",
      "Add pattern attribute for custom email validation",
      "Implement client-side email format checking",
      "Add autocomplete='email' for better UX",
    ],
    backend: {
      nodejs: [
        "Use validator.isEmail() for server-side validation",
        "Sanitize input with DOMPurify or similar",
        "Implement rate limiting for email submissions",
        "Use parameterized queries to prevent SQL injection",
      ],
      php: [
        "Use filter_var($email, FILTER_VALIDATE_EMAIL)",
        "Sanitize with htmlspecialchars() and trim()",
        "Use prepared statements for database queries",
        "Implement CSRF token validation",
      ],
      nextjs: [
        "Use Zod or Yup for schema validation",
        "Sanitize inputs in API route handlers",
        "Implement rate limiting with next-rate-limit",
        "Use CSRF protection middleware",
      ],
      sveltekit: [
        "Use superforms for form validation",
        "Sanitize inputs in form actions",
        "Implement CSRF protection",
        "Use parameterized database queries",
      ],
      nuxt: [
        "Use @vuelidate/core for validation",
        "Sanitize inputs in server API routes",
        "Implement nuxt-security module",
        "Use Prisma or similar ORM for safe queries",
      ],
      "react-actions": [
        "Use Zod for input validation in Server Actions",
        "Sanitize inputs before processing",
        "Implement rate limiting",
        "Use ORM with parameterized queries",
      ],
    },
  },
  password: {
    frontend: [
      "Use password input type to hide characters",
      "Add minlength attribute for minimum requirements",
      "Implement password strength indicator",
      "Add autocomplete='new-password' or 'current-password'",
    ],
    backend: {
      nodejs: [
        "Hash passwords with bcrypt (min 12 rounds)",
        "Enforce strong password policies",
        "Implement account lockout after failed attempts",
        "Use secure session management",
      ],
      php: [
        "Use password_hash() with PASSWORD_ARGON2ID",
        "Implement password complexity requirements",
        "Add brute force protection",
        "Use secure session handling",
      ],
      nextjs: [
        "Hash passwords with bcryptjs",
        "Use NextAuth.js for authentication",
        "Implement password strength validation",
        "Add rate limiting for login attempts",
      ],
      sveltekit: [
        "Use @node-rs/argon2 for password hashing",
        "Implement lucia-auth for session management",
        "Add password complexity validation",
        "Use CSRF protection",
      ],
      nuxt: [
        "Use @sidebase/nuxt-auth for authentication",
        "Hash passwords with argon2",
        "Implement password policies",
        "Add brute force protection",
      ],
      "react-actions": [
        "Hash passwords in Server Actions with bcrypt",
        "Use next-auth for authentication",
        "Implement password validation",
        "Add rate limiting middleware",
      ],
    },
  },
  text: {
    frontend: [
      "Add maxlength attribute to prevent oversized inputs",
      "Use pattern attribute for format validation",
      "Implement client-side XSS prevention",
      "Add input sanitization on blur events",
    ],
    backend: {
      nodejs: [
        "Sanitize with DOMPurify or xss library",
        "Validate input length and format",
        "Use parameterized queries",
        "Implement Content Security Policy",
      ],
      php: [
        "Use htmlspecialchars() and strip_tags()",
        "Validate with filter_var() functions",
        "Use prepared statements",
        "Implement proper escaping",
      ],
      nextjs: [
        "Sanitize inputs with DOMPurify",
        "Use Zod for schema validation",
        "Implement CSP headers",
        "Add XSS protection middleware",
      ],
      sveltekit: [
        "Sanitize inputs in form actions",
        "Use superforms validation",
        "Implement CSP headers",
        "Add XSS protection",
      ],
      nuxt: [
        "Use @nuxtjs/sanitize-html",
        "Implement input validation",
        "Add CSP headers with nuxt-security",
        "Use parameterized queries",
      ],
      "react-actions": [
        "Sanitize inputs in Server Actions",
        "Use Zod for validation",
        "Implement CSP headers",
        "Add XSS protection",
      ],
    },
  },
}

export default function InputAdvisorPage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [inputFields, setInputFields] = useState<InputField[]>([])
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["nodejs"])
  const { toast } = useToast()

  const [aiAdvice, setAiAdvice] = useState<AIAnalysisResult | null>(null)
  const [isAiGenerating, setIsAiGenerating] = useState(false)

  const mockCrawlInputs = useCallback(async (targetUrl: string): Promise<InputField[]> => {
    // Simulate crawling delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock input fields based on common patterns
    const mockFields: InputField[] = [
      {
        id: "email",
        name: "email",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        validation: ["email format", "required"],
        securityRisks: ["Email injection", "XSS via email field"],
      },
      {
        id: "password",
        name: "password",
        type: "password",
        required: true,
        validation: ["minimum 8 characters", "required"],
        securityRisks: ["Weak password policy", "Password brute force"],
      },
      {
        id: "username",
        name: "username",
        type: "text",
        placeholder: "Choose a username",
        required: true,
        validation: ["alphanumeric only", "3-20 characters"],
        securityRisks: ["Username enumeration", "XSS injection"],
      },
      {
        id: "comment",
        name: "comment",
        type: "textarea",
        placeholder: "Leave a comment",
        required: false,
        validation: ["max 500 characters"],
        securityRisks: ["XSS injection", "HTML injection", "Script injection"],
      },
    ]

    return mockFields
  }, [])

  const handleCrawl = useCallback(async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const fields = await mockCrawlInputs(url)
      setInputFields(fields)
      toast({
        title: "Analysis Complete",
        description: `Found ${fields.length} input fields to analyze.`,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [url, mockCrawlInputs, toast])

  const handleFrameworkChange = useCallback((frameworkId: string, checked: boolean) => {
    setSelectedFrameworks((prev) => (checked ? [...prev, frameworkId] : prev.filter((f) => f !== frameworkId)))
  }, [])

  const getAdviceForField = useCallback((fieldType: string): SecurityAdvice => {
    return securityAdviceMap[fieldType] || securityAdviceMap.text
  }, [])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCrawl()
      }
    },
    [handleCrawl],
  )

  const generateAiAdvice = async () => {
    if (inputFields.length === 0) return

    setIsAiGenerating(true)
    try {
      const advice = await callAIAgent("generate-input-advice", {
        inputFields,
        frameworks: selectedFrameworks,
      })
      setAiAdvice(advice)
      toast({
        title: "AI Recommendations Generated",
        description: "Custom security advice created for your input fields.",
      })
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI advice",
        variant: "destructive",
      })
    } finally {
      setIsAiGenerating(false)
    }
  }

  return (
    <ToolLayout
      title="Input Security Advisor"
      description="Analyze input fields on websites and get tailored security recommendations for multiple backend frameworks."
      icon={Zap}
      badge="Smart"
    >
      <div className="space-y-8">
        {/* URL Input */}
        <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-primary" />
              <span>Website Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-4">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-12 text-lg rounded-xl border-2 focus:border-primary/50"
              />
              <Button
                onClick={handleCrawl}
                disabled={isLoading}
                className="h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Inputs"
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setUrl("https://github.com")}>
                Try GitHub
              </Button>
              <Button variant="outline" size="sm" onClick={() => setUrl("https://stackoverflow.com")}>
                Try Stack Overflow
              </Button>
              <Button variant="outline" size="sm" onClick={() => setUrl("https://example.com")}>
                Try Example.com
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backend Framework Selection */}
        {inputFields.length > 0 && (
          <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Select Your Backend Frameworks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backendFrameworks.map((framework) => (
                  <div key={framework.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={framework.id}
                      checked={selectedFrameworks.includes(framework.id)}
                      onCheckedChange={(checked) => handleFrameworkChange(framework.id, checked as boolean)}
                    />
                    <label htmlFor={framework.id} className="flex items-center space-x-2 cursor-pointer">
                      <span className="text-lg">{framework.icon}</span>
                      <span className="font-medium">{framework.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              {inputFields.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    onClick={generateAiAdvice}
                    disabled={isAiGenerating || selectedFrameworks.length === 0}
                    className="w-full bg-primary text-card hover:bg-primaryMuted"
                  >
                    {isAiGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        AI Generating Custom Advice...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate AI Security Recommendations
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Input Fields Analysis */}
        {inputFields.length > 0 && (
          <div className="space-y-6">
            {inputFields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{field.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {field.type}
                            </Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{field.securityRisks.length} security risks</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="frontend" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="frontend">Frontend Security</TabsTrigger>
                        <TabsTrigger value="backend">Backend Security</TabsTrigger>
                      </TabsList>

                      <TabsContent value="frontend" className="space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Frontend Safeguards</span>
                          </h4>
                          <ul className="space-y-2">
                            {getAdviceForField(field.type).frontend.map((advice, adviceIndex) => (
                              <li key={adviceIndex} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span>Security Risks</span>
                          </h4>
                          <ul className="space-y-2">
                            {field.securityRisks.map((risk, riskIndex) => (
                              <li key={riskIndex} className="flex items-start space-x-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="backend" className="space-y-4">
                        {selectedFrameworks.map((frameworkId) => {
                          const framework = backendFrameworks.find((f) => f.id === frameworkId)
                          const advice = getAdviceForField(field.type).backend[frameworkId] || []

                          return (
                            <div key={frameworkId} className="space-y-3">
                              <h4 className="font-semibold flex items-center space-x-2">
                                <span className="text-lg">{framework?.icon}</span>
                                <span>{framework?.name}</span>
                              </h4>
                              <ul className="space-y-2">
                                {advice.map((adviceItem, adviceIndex) => (
                                  <li key={adviceIndex} className="flex items-start space-x-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    <span>{adviceItem}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        })}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {aiAdvice && (
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI Security Recommendations</span>
                <Badge variant="secondary" className="ml-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Custom Generated
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(aiAdvice.advice || ""),
                }}
              />
              {aiAdvice.usage && (
                <div className="mt-4 text-xs text-muted-foreground">
                  AI Recommendations • {aiAdvice.usage.total_tokens} tokens used
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Card */}
        {inputFields.length > 0 && (
          <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Security Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{inputFields.length}</div>
                  <p className="font-semibold">Input Fields</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {inputFields.reduce((total, field) => total + field.securityRisks.length, 0)}
                  </div>
                  <p className="font-semibold">Security Risks</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">{selectedFrameworks.length}</div>
                  <p className="font-semibold">Frameworks</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-card/50 rounded-xl">
                <h4 className="font-semibold mb-2">General Security Recommendations:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Always validate inputs on both client and server side</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Implement proper CSRF protection for all forms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Use Content Security Policy headers to prevent XSS</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sanitize all user inputs before processing or storage</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  )
}
