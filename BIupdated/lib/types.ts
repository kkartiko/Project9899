export type Vulnerability = {
  cve: string
  title: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN"
  published: string // ISO
  description: string
  references: string[]
}

export type ScanResult = {
  tech: string
  version?: string
  vulns: Vulnerability[]
}

export type Technology = {
  name: string
  type: string
  confidence: number
}
