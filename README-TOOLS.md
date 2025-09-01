# 🔧 Tools Pages

This section describes the four security tools available in BreachIndex and how to extend them.

## Security Assessor

**Location**: `/tools/security-assessor`

Comprehensive security assessment tool that analyzes web applications for vulnerabilities, security headers, and technology stack risks using the existing `getSecurityAssessment()` function.

**Features**:
- URL validation and canonicalization
- HTTP security header inspection  
- Technology detection and CVE correlation
- Risk scoring and assessment
- Sample site testing

**Extending**: To add new datasets, modify the dataset selector in the component and extend the `getSecurityAssessment()` function in `lib/security-accessorv0.ts` to handle different data sources.

## Phishing Email Quiz & Detector

**Location**: `/tools/phishing-quiz`

Interactive quiz that tests users' ability to identify phishing emails with both solo and enterprise modes.

**Features**:
- Email viewer with realistic phishing examples
- Scoring system with explanations
- Local leaderboard (solo mode)
- Enterprise leaderboard via API (org mode)
- Progress tracking

**Extending Quizzes**: Add new email examples to the `sampleEmails` array in the component. Each email should include:
\`\`\`typescript
{
  id: number,
  from: string,
  subject: string, 
  body: string,
  isPhishing: boolean,
  explanation: string,
  indicators: string[]
}
\`\`\`

## URL Validity / Scam Checker

**Location**: `/tools/url-checker`

URL safety analysis tool that validates URLs and provides detailed security information.

**Features**:
- URL syntax validation
- Safety classification (Safe/Suspicious/Dangerous)
- WHOIS data display
- SSL certificate information
- Reputation scoring

**Extending**: Modify the `mockScanUrl` function to integrate with real threat intelligence APIs. Add new danger/suspicious patterns to the pattern arrays for better detection.

## Input-Field Security Advisor

**Location**: `/tools/input-advisor`

Website crawler that analyzes input fields and provides tailored security recommendations for multiple backend frameworks.

**Features**:
- Input field detection and analysis
- Frontend security recommendations
- Backend-specific security advice
- Multi-framework support (Node.js, PHP, SvelteKit, Next.js, React Server Actions, Nuxt 3)

**Extending Datasets**: 
1. **Add new backend frameworks**: Extend the `backendFrameworks` array and add corresponding advice in `securityAdviceMap`
2. **Add new field types**: Create new entries in `securityAdviceMap` with frontend and backend-specific recommendations
3. **Improve field detection**: Enhance the `mockCrawlInputs` function to better identify input patterns

## API Endpoints

- `/api/scoreboard` - Handles enterprise quiz scoring (POST/GET)

## Common Patterns

All tools follow these patterns:
- Responsive design with mobile-first approach
- Loading states and error handling
- Toast notifications for user feedback
- Framer Motion animations
- Consistent card-based layouts
- Dark/light mode support
- Accessibility features (ARIA labels, keyboard navigation)

## Development

To add a new tool:
1. Create `/app/(tools)/[tool-name]/page.tsx`
2. Add navigation link in `components/navbar.tsx`
3. Follow existing patterns for loading states, error handling, and responsive design
4. Add any required API routes under `/app/api/`
5. Update this README with extension instructions
