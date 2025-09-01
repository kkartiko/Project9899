import { NextRequest, NextResponse } from 'next/server'

// Check if OpenAI is configured
const isOpenAIConfigured = !!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_')

export async function POST(request: NextRequest) {
  if (!isOpenAIConfigured) {
    return NextResponse.json({
      error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.',
      configured: false
    }, { status: 400 })
  }

  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'generate-phishing-emails':
        return await generatePhishingEmails(data)
      case 'analyze-security-scan':
        return await analyzeSecurityScan(data)
      case 'assess-url-threat':
        return await assessUrlThreat(data)
      case 'generate-input-advice':
        return await generateInputAdvice(data)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('AI Agent error:', error)
    return NextResponse.json({ 
      error: 'AI processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function generatePhishingEmails(data: { count: number; difficulty: string }) {
  const { count, difficulty } = data
  const emails = []

  for (let i = 1; i <= count; i++) {
    try {
      // Mock email generation for demo purposes
      const mockEmail = {
        id: `email-${Date.now()}-${i}`,
        subject: `${difficulty} Phishing Email ${i}`,
        sender: `suspicious${i}@fake-domain.com`,
        content: `This is a mock ${difficulty.toLowerCase()} phishing email for demonstration purposes.`,
        isPhishing: Math.random() > 0.3,
        difficulty,
        explanation: `This email demonstrates ${difficulty.toLowerCase()} phishing techniques.`,
        createdAt: new Date().toISOString()
      }
      
      emails.push(mockEmail)
    } catch (error) {
      console.error(`Failed to generate email ${i}:`, error)
      // Continue with other emails even if one fails
    }
  }

  return NextResponse.json({
    success: true,
    emails,
    tokensUsed: count * 150 // Mock token usage
  })
}

async function analyzeSecurityScan(data: { vulnerabilities: any[]; url: string }) {
  const { vulnerabilities, url } = data
  
  // Mock analysis for demo purposes
  const analysis = {
    summary: `Analyzed ${vulnerabilities.length} vulnerabilities for ${url}`,
    criticalIssues: vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    recommendations: [
      'Update all dependencies to latest versions',
      'Implement proper input validation',
      'Enable security headers',
      'Regular security audits recommended'
    ],
    riskScore: Math.min(100, vulnerabilities.length * 10),
    actionPlan: [
      'Immediate: Fix critical vulnerabilities',
      'Short-term: Address high-priority issues',
      'Long-term: Implement security monitoring'
    ]
  }

  return NextResponse.json({
    success: true,
    analysis,
    tokensUsed: 200
  })
}

async function assessUrlThreat(data: { url: string; scanResults: any }) {
  const { url, scanResults } = data
  
  // Mock threat assessment for demo purposes
  const assessment = {
    threatLevel: scanResults.reputation < 30 ? 'HIGH' : 'MEDIUM',
    riskFactors: [
      'Low domain reputation',
      'Suspicious SSL certificate',
      'Recently registered domain'
    ],
    recommendations: [
      'Avoid entering sensitive information',
      'Use caution when downloading files',
      'Consider using a VPN',
      'Report suspicious activity'
    ],
    details: `Threat assessment for ${url} based on reputation score of ${scanResults.reputation}`
  }

  return NextResponse.json({
    success: true,
    assessment,
    tokensUsed: 100
  })
}

async function generateInputAdvice(data: { inputs: any[]; framework: string }) {
  const { inputs, framework } = data
  
  // Mock advice generation for demo purposes
  const advice = {
    framework,
    inputCount: inputs.length,
    recommendations: [
      `Use ${framework}-specific validation libraries`,
      'Implement CSRF protection',
      'Sanitize all user inputs',
      'Use parameterized queries'
    ],
    securityTips: [
      'Never trust user input',
      'Validate on both client and server',
      'Use whitelist validation when possible',
      'Log security events'
    ],
    codeExamples: [
      `// ${framework} input validation example`,
      'const validator = require("validator");',
      'if (!validator.isEmail(email)) {',
      '  throw new Error("Invalid email");',
      '}'
    ]
  }

  return NextResponse.json({
    success: true,
    advice,
    tokensUsed: 150
  })
}
