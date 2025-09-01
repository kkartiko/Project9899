export interface AIAnalysisResult {
  analysis?: string
  advice?: string
  email?: {
    from: string
    subject: string
    body: string
  }
  isPhishing?: boolean
  explanation?: string
  indicators?: string[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function callAIAgent(mode: string, data: any): Promise<AIAnalysisResult> {
  const response = await fetch("/api/ai-agent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode, data }),
    cache: "no-store",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "AI analysis failed")
  }

  return response.json()
}

export function formatMarkdown(text: string): string {
  // Simple markdown formatting for display
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/^(.+)$/gm, '<p class="mb-2">$1</p>')
}
