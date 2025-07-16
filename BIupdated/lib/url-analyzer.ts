export interface AnalysisResult {
  score: number
  riskLevel: "Low Risk 👍" | "Medium Risk ⚠️" | "High Risk 🚨"
  riskClass: "safe" | "warning" | "danger"
  tips: string[]
}

export function analyzeUrl(url: string): AnalysisResult {
  const hasHttps = url.startsWith("https://")
  const lengthScore = Math.max(0, 100 - url.length * 1.3)
  let score = Math.round((hasHttps ? 75 : 40) + lengthScore / 2 + Math.random() * 25)
  score = Math.max(10, Math.min(99, score)) // clamp between 10-99

  let riskLevel: AnalysisResult["riskLevel"]
  let riskClass: AnalysisResult["riskClass"]

  if (score > 70) {
    riskLevel = "High Risk 🚨"
    riskClass = "danger"
  } else if (score > 45) {
    riskLevel = "Medium Risk ⚠️"
    riskClass = "warning"
  } else {
    riskLevel = "Low Risk 👍"
    riskClass = "safe"
  }

  const tips = [
    "Enforce HTTPS everywhere",
    "Validate all user inputs",
    "Implement Content Security Policy (CSP)",
    "Keep dependencies updated",
    "Use secure authentication methods",
    "Enable security headers",
  ]

  return {
    score,
    riskLevel,
    riskClass,
    tips: tips.slice(0, 3), // Show top 3 tips
  }
}
