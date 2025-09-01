export interface AutomationConfig {
  phishingQuiz: {
    autoGenerate: boolean
    generateCount: number
    difficulty: "easy" | "medium" | "hard" | "mixed"
    interval: number // minutes
  }
  securityAssessor: {
    autoAnalyze: boolean
    criticalThreshold: number
    autoNotify: boolean
  }
  urlChecker: {
    autoScan: boolean
    batchSize: number
    autoBlock: boolean
  }
  inputAdvisor: {
    autoAdvice: boolean
    frameworkDetection: boolean
  }
}

export const defaultAutomationConfig: AutomationConfig = {
  phishingQuiz: {
    autoGenerate: true,
    generateCount: 3,
    difficulty: "mixed",
    interval: 30, // 30 minutes
  },
  securityAssessor: {
    autoAnalyze: true,
    criticalThreshold: 80,
    autoNotify: true,
  },
  urlChecker: {
    autoScan: true,
    batchSize: 10,
    autoBlock: false,
  },
  inputAdvisor: {
    autoAdvice: true,
    frameworkDetection: true,
  },
}

export class AIAutomation {
  private config: AutomationConfig
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  constructor(config: AutomationConfig = defaultAutomationConfig) {
    this.config = config
  }

  async startPhishingQuizAutomation(onNewEmails: (emails: any[]) => void) {
    if (!this.config.phishingQuiz.autoGenerate) return

    const generateEmails = async () => {
      try {
        const response = await fetch("/api/ai-agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "auto-generate-quiz",
            data: {
              count: this.config.phishingQuiz.generateCount,
              difficulty: this.config.phishingQuiz.difficulty,
            },
          }),
        })

        if (response.ok) {
          const result = await response.json()
          onNewEmails(result.emails)
        }
      } catch (error) {
        console.error("Auto-generation failed:", error)
      }
    }

    // Generate initial batch
    await generateEmails()

    // Set up interval for continuous generation
    const intervalId = setInterval(generateEmails, this.config.phishingQuiz.interval * 60 * 1000)
    this.intervals.set("phishing-quiz", intervalId)
  }

  async startSecurityAssessorAutomation(onCriticalVulnerabilities: (analysis: any) => void) {
    if (!this.config.securityAssessor.autoAnalyze) return

    // This would be called automatically when vulnerabilities are detected
    const analyzeVulnerabilities = async (vulnerabilities: any[], techStack: any[]) => {
      const criticalCount = vulnerabilities.filter((v) => v.severity === "CRITICAL").length

      if (criticalCount >= this.config.securityAssessor.criticalThreshold / 20) {
        // Adjust threshold
        try {
          const response = await fetch("/api/ai-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "auto-analyze-vulnerabilities",
              data: { vulnerabilities, techStack },
            }),
          })

          if (response.ok) {
            const result = await response.json()
            onCriticalVulnerabilities(result)
          }
        } catch (error) {
          console.error("Auto-analysis failed:", error)
        }
      }
    }

    return analyzeVulnerabilities
  }

  async startUrlCheckerAutomation(onThreatDetected: (assessment: any) => void) {
    if (!this.config.urlChecker.autoScan) return

    const assessThreat = async (url: string, scanResult: any) => {
      if (scanResult.status === "Dangerous" || scanResult.reputation?.score < 30) {
        try {
          const response = await fetch("/api/ai-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mode: "auto-threat-assessment",
              data: {
                url,
                domain: new URL(url).hostname,
                riskFactors: scanResult.reasons,
              },
            }),
          })

          if (response.ok) {
            const result = await response.json()
            onThreatDetected(result)
          }
        } catch (error) {
          console.error("Auto-threat assessment failed:", error)
        }
      }
    }

    return assessThreat
  }

  stopAutomation(type?: string) {
    if (type) {
      const intervalId = this.intervals.get(type)
      if (intervalId) {
        clearInterval(intervalId)
        this.intervals.delete(type)
      }
    } else {
      // Stop all automations
      this.intervals.forEach((intervalId) => clearInterval(intervalId))
      this.intervals.clear()
    }
  }

  updateConfig(newConfig: Partial<AutomationConfig>) {
    this.config = { ...this.config, ...newConfig }
  }
}

export const aiAutomation = new AIAutomation()
