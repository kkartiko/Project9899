"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Mail, CheckCircle, XCircle, Trophy, Users, Clock, Brain, Sparkles, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ToolLayout } from "@/components/tool-layout"
import { callAIAgent } from "@/lib/ai-agent"
import { Badge } from "@/components/ui/badge"

interface PhishingEmail {
  id: number
  from: string
  subject: string
  body: string
  isPhishing: boolean
  explanation: string
  indicators: string[]
}

const sampleEmails: PhishingEmail[] = [
  {
    id: 1,
    from: "security@paypal.com",
    subject: "Urgent: Verify Your Account Now",
    body: "Dear Customer,\n\nYour PayPal account has been temporarily suspended due to suspicious activity. Click here to verify your account immediately: http://paypal-security.tk/verify\n\nFailure to verify within 24 hours will result in permanent account closure.\n\nBest regards,\nPayPal Security Team",
    isPhishing: true,
    explanation: "This is a classic phishing email with urgency tactics, suspicious domain, and threatening language.",
    indicators: [
      "Suspicious domain (.tk instead of .com)",
      "Creates false urgency",
      "Threatens account closure",
      "Generic greeting",
      "Suspicious URL structure",
    ],
  },
  {
    id: 2,
    from: "notifications@github.com",
    subject: "New pull request in your repository",
    body: "Hi there,\n\nA new pull request has been opened in your repository 'awesome-project'.\n\nPull Request: Fix security vulnerability in authentication\nAuthor: john-doe\n\nView pull request: https://github.com/your-username/awesome-project/pull/42\n\nBest,\nThe GitHub Team",
    isPhishing: false,
    explanation: "This appears to be a legitimate GitHub notification with proper domain and realistic content.",
    indicators: [
      "Legitimate GitHub domain",
      "Specific repository information",
      "Realistic pull request details",
      "Professional tone",
      "Proper GitHub URL structure",
    ],
  },
  {
    id: 3,
    from: "admin@company-it.com",
    subject: "IT Security Update Required",
    body: "All employees must update their passwords immediately due to a security breach. Click the link below to update your credentials:\n\nhttp://company-password-reset.net/update\n\nThis is mandatory and must be completed by end of day.\n\nIT Department",
    isPhishing: true,
    explanation: "Internal phishing attempt using company context but suspicious external domain.",
    indicators: [
      "External domain for internal process",
      "Creates false urgency",
      "Vague security breach claim",
      "Mandatory language",
      "Suspicious URL domain",
    ],
  },
  {
    id: 4,
    from: "support@microsoft.com",
    subject: "Your Microsoft 365 subscription expires today",
    body: "Dear Valued Customer,\n\nYour Microsoft 365 subscription will expire in 24 hours. To avoid service interruption, please renew immediately by clicking below:\n\nhttp://microsoft-renewal.co/renew-now\n\nFailure to renew will result in data loss and account suspension.\n\nMicrosoft Support Team",
    isPhishing: true,
    explanation: "Fake Microsoft email using urgency and threatening data loss with suspicious domain.",
    indicators: [
      "Suspicious domain (.co instead of .com)",
      "Threatens data loss",
      "Creates false urgency",
      "Generic customer greeting",
      "Unofficial renewal process",
    ],
  },
  {
    id: 5,
    from: "noreply@google.com",
    subject: "Security alert: New sign-in from Chrome on Windows",
    body: "Hi John,\n\nWe noticed a new sign-in to your Google Account on a Windows device.\n\nTime: Today, 2:30 PM\nLocation: San Francisco, CA, USA\nDevice: Chrome on Windows\n\nIf this was you, you don't need to do anything. If not, secure your account: https://myaccount.google.com/security\n\nThe Google Accounts team",
    isPhishing: false,
    explanation: "Legitimate Google security alert with proper domain, specific details, and official security link.",
    indicators: [
      "Official Google domain",
      "Specific sign-in details",
      "Personalized greeting",
      "Official Google security URL",
      "Professional formatting",
    ],
  },
  {
    id: 6,
    from: "billing@amazon.com",
    subject: "Unusual activity detected on your account",
    body: "Dear Amazon Customer,\n\nWe've detected unusual activity on your account. Your account has been temporarily locked for security.\n\nTo unlock your account, verify your identity here: http://amazon-verify.net/unlock\n\nPlease complete verification within 12 hours to avoid permanent suspension.\n\nAmazon Security",
    isPhishing: true,
    explanation: "Fake Amazon email using account lockout scare tactics with suspicious verification domain.",
    indicators: [
      "Suspicious domain (.net instead of .com)",
      "Account lockout threat",
      "Generic customer greeting",
      "Creates false urgency",
      "Unofficial verification process",
    ],
  },
  {
    id: 7,
    from: "jobs-noreply@linkedin.com",
    subject: "You have 3 new job recommendations",
    body: "Hi Sarah,\n\nBased on your profile, we found 3 new job opportunities that might interest you:\n\n• Senior Software Engineer at TechCorp\n• Full Stack Developer at StartupXYZ\n• Lead Developer at Innovation Labs\n\nView all recommendations: https://www.linkedin.com/jobs/recommendations\n\nBest regards,\nLinkedIn Jobs Team",
    isPhishing: false,
    explanation: "Legitimate LinkedIn job notification with proper domain, personalized content, and official URLs.",
    indicators: [
      "Official LinkedIn domain",
      "Personalized greeting with name",
      "Specific job recommendations",
      "Official LinkedIn URL structure",
      "Professional tone and formatting",
    ],
  },
  {
    id: 8,
    from: "security@bankofamerica.com",
    subject: "Immediate Action Required: Suspicious Login Detected",
    body: "URGENT SECURITY ALERT\n\nWe detected a suspicious login attempt from an unrecognized device in Russia. Your account has been temporarily frozen.\n\nClick here to verify your identity and restore access: http://boa-security.org/verify-account\n\nYou have 2 hours to complete verification or your account will be permanently closed.\n\nBank of America Security Team",
    isPhishing: true,
    explanation: "Fake bank email using fear tactics, suspicious domain, and extreme urgency to steal credentials.",
    indicators: [
      "Suspicious domain (.org instead of .com)",
      "Extreme urgency (2 hours)",
      "Fear-inducing language",
      "Threatens permanent closure",
      "All caps urgent alert",
    ],
  },
  {
    id: 9,
    from: "team@slack.com",
    subject: "Your workspace 'DevTeam' has new activity",
    body: "Hi Alex,\n\nThere's been new activity in your DevTeam workspace:\n\n• 5 new messages in #general\n• 2 files shared in #project-alpha\n• Sarah Johnson mentioned you in #code-review\n\nCatch up on Slack: https://devteam.slack.com/messages\n\nThe Slack Team",
    isPhishing: false,
    explanation:
      "Legitimate Slack notification with proper domain, specific workspace details, and official Slack URL.",
    indicators: [
      "Official Slack domain",
      "Specific workspace name",
      "Detailed activity summary",
      "Personalized content",
      "Official Slack URL structure",
    ],
  },
]

export default function PhishingQuizPage() {
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(new Array(sampleEmails.length).fill(false))
  const [userAnswers, setUserAnswers] = useState<boolean[]>(new Array(sampleEmails.length).fill(false))
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizMode, setQuizMode] = useState<"solo" | "org">("solo")
  const [orgName, setOrgName] = useState("")
  const [userName, setUserName] = useState("")
  const [quizCompleted, setQuizCompleted] = useState(false)
  const { toast } = useToast()

  const [aiEmails, setAiEmails] = useState<PhishingEmail[]>([])
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  const allEmails = [...sampleEmails, ...aiEmails]
  const currentEmail = allEmails[currentEmailIndex]
  const progress = ((currentEmailIndex + 1) / allEmails.length) * 100

  const handleAnswer = async (isPhishing: boolean) => {
    const correct = isPhishing === currentEmail.isPhishing
    const newAnswered = [...answered]
    const newUserAnswers = [...userAnswers]

    newAnswered[currentEmailIndex] = true
    newUserAnswers[currentEmailIndex] = isPhishing

    setAnswered(newAnswered)
    setUserAnswers(newUserAnswers)

    if (correct) {
      setScore(score + 1)
    }

    setShowExplanation(true)

    toast({
      title: correct ? "Correct!" : "Incorrect",
      description: correct ? "Good eye for security!" : "Review the explanation below",
      variant: correct ? "default" : "destructive",
    })
  }

  const nextEmail = () => {
    if (currentEmailIndex < allEmails.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1)
      setShowExplanation(false)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    setQuizCompleted(true)

    if (quizMode === "org" && orgName && userName) {
      try {
        await fetch("/api/scoreboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org: orgName,
            name: userName,
            score,
            timestamp: new Date().toISOString(),
          }),
        })

        toast({
          title: "Score Submitted!",
          description: "Your score has been added to the organization leaderboard.",
        })
      } catch (error) {
        toast({
          title: "Submission Failed",
          description: "Could not submit score to leaderboard.",
          variant: "destructive",
        })
      }
    }
  }

  const generateAiEmail = async (difficulty: "easy" | "medium" | "hard" = "medium") => {
    setIsGeneratingAi(true)
    try {
      const result = await callAIAgent("generate-phishing", { difficulty, category: "general" })

      if (result.email && result.isPhishing !== undefined) {
        const newEmail: PhishingEmail = {
          id: Date.now(),
          from: result.email.from,
          subject: result.email.subject,
          body: result.email.body,
          isPhishing: result.isPhishing,
          explanation: result.explanation || "",
          indicators: result.indicators || [],
        }

        setAiEmails((prev) => [...prev, newEmail])
        toast({
          title: "AI Email Generated!",
          description: "New phishing email created for training.",
        })
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate AI email",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const resetQuiz = () => {
    setCurrentEmailIndex(0)
    setScore(0)
    setAnswered(new Array(allEmails.length).fill(false))
    setUserAnswers(new Array(allEmails.length).fill(false))
    setShowExplanation(false)
    setQuizCompleted(false)
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-success"
    if (percentage >= 60) return "text-primary"
    return "text-destructive"
  }

  if (quizCompleted) {
    return (
      <ToolLayout
        title="Phishing Quiz"
        description="Test your ability to identify phishing emails and improve your security awareness."
        icon={Target}
        badge="Interactive"
      >
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 bg-card backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-3xl text-fg">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div>
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(score, allEmails.length)}`}>
                  {score}/{allEmails.length}
                </div>
                <p className="text-lg text-muted-foreground">
                  {score === allEmails.length
                    ? "Perfect! You're a phishing detection expert!"
                    : score >= allEmails.length * 0.8
                      ? "Great job! You have strong security awareness."
                      : score >= allEmails.length * 0.6
                        ? "Good work! Consider reviewing phishing indicators."
                        : "Keep practicing! Phishing detection takes time to master."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-success">{score}</div>
                  <div className="text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{allEmails.length - score}</div>
                  <div className="text-muted-foreground">Incorrect</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{Math.round((score / allEmails.length) * 100)}%</div>
                  <div className="text-muted-foreground">Accuracy</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={resetQuiz} size="lg" className="rounded-xl bg-primary text-card hover:bg-primaryMuted">
                  Take Quiz Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-border hover:bg-primary/10 bg-transparent"
                >
                  Share Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    )
  }

  return (
    <ToolLayout
      title="Phishing Quiz"
      description="Test your ability to identify phishing emails and improve your security awareness."
      icon={Target}
      badge="Interactive"
    >
      <div className="space-y-8">
        {/* Quiz Configuration */}
        <Card className="border-0 bg-card backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-fg">
              <Users className="h-5 w-5 text-primary" />
              <span>Quiz Mode</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={quizMode} onValueChange={(value: "solo" | "org") => setQuizMode(value)}>
                <SelectTrigger className="h-12 rounded-xl border-border bg-card">
                  <SelectValue placeholder="Select quiz mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo Practice</SelectItem>
                  <SelectItem value="org">Organization Challenge</SelectItem>
                </SelectContent>
              </Select>

              {quizMode === "org" && (
                <>
                  <input
                    type="text"
                    placeholder="Organization name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="h-12 px-4 rounded-xl border-2 border-border bg-card text-fg"
                  />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="h-12 px-4 rounded-xl border-2 border-border bg-card text-fg"
                  />
                </>
              )}
            </div>
            <div className="mt-4 p-4 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span>AI Email Generator</span>
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Beta
                  </Badge>
                </h4>
                <div className="text-xs text-muted-foreground">{aiEmails.length} AI emails generated</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => generateAiEmail("easy")}
                  disabled={isGeneratingAi}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Easy Email
                </Button>
                <Button
                  onClick={() => generateAiEmail("medium")}
                  disabled={isGeneratingAi}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Medium Email
                </Button>
                <Button
                  onClick={() => generateAiEmail("hard")}
                  disabled={isGeneratingAi}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Hard Email
                </Button>
              </div>

              {isGeneratingAi && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2" />
                  AI is crafting a new phishing email...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="border-0 bg-card backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fg">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentEmailIndex + 1} of {allEmails.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>
                Score: {score}/{allEmails.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Email Display */}
        <motion.div
          key={currentEmailIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 bg-card backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-fg">
                <Mail className="h-5 w-5 text-primary" />
                <span>Email {currentEmailIndex + 1}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-xl space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-fg">From:</span>
                  <span className="text-sm font-mono text-fg">{currentEmail.from}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-fg">Subject:</span>
                  <span className="text-sm text-fg">{currentEmail.subject}</span>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border-2 border-border">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-fg">{currentEmail.body}</pre>
              </div>

              {!answered[currentEmailIndex] && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleAnswer(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl border-2 border-success/30 hover:bg-success/10 hover:border-success/50"
                  >
                    <CheckCircle className="mr-2 h-5 w-5 text-success" />
                    Legitimate Email
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl border-2 border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
                  >
                    <XCircle className="mr-2 h-5 w-5 text-destructive" />
                    Phishing Email
                  </Button>
                </div>
              )}

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      {currentEmail.isPhishing ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      <span className="font-semibold text-fg">
                        {currentEmail.isPhishing ? "This is a phishing email" : "This is a legitimate email"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{currentEmail.explanation}</p>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-fg">Key Indicators:</h4>
                      <ul className="space-y-1">
                        {currentEmail.indicators.map((indicator, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{indicator}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={nextEmail}
                      size="lg"
                      className="rounded-xl bg-primary text-card hover:bg-primaryMuted"
                    >
                      {currentEmailIndex < allEmails.length - 1 ? (
                        <>
                          Next Email
                          <Clock className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete Quiz
                          <Trophy className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ToolLayout>
  )
}
