"use client"

import { useState, useCallback } from "react"
import type { ScanResult } from "@/lib/types"

interface UseScanResult {
  scanResults: ScanResult[] | null
  isLoading: boolean
  error: string | null
  scanUrl: (url: string) => Promise<void>
}

export function useScan(): UseScanResult {
  const [scanResults, setScanResults] = useState<ScanResult[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scanUrl = useCallback(async (url: string) => {
    setIsLoading(true)
    setError(null)
    setScanResults(null)

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch scan results.")
      }

      const data: ScanResult[] = await response.json()
      setScanResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
      setScanResults([]) // Set to empty array on error to clear previous results
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { scanResults, isLoading, error, scanUrl }
}
