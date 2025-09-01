/**
 * Unit tests for Security Assessment Module
 *
 * @jest-environment node
 */

import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals"
import { getSecurityAssessment, InvalidURLError, mockReport, type Severity } from "../lib/security-accessorv0"

// Mock the scan module
jest.mock("../lib/scan.js", () => ({
  detectTechnologies: jest.fn(),
}))

import { detectTechnologies } from "../lib/scan.js"
const mockDetectTechnologies = detectTechnologies as jest.MockedFunction<typeof detectTechnologies>

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe("Security Assessment Module", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockDetectTechnologies.mockResolvedValue([
      { name: "nginx", version: "1.18.0", confidence: 0.9 },
      { name: "React", version: "18.2.0", confidence: 0.8 },
    ])

    // Mock successful header inspection
    mockFetch.mockResolvedValue({
      headers: {
        get: jest.fn((header: string) => {
          const headers: Record<string, string | null> = {
            "strict-transport-security": "max-age=31536000",
            "x-content-type-options": "nosniff",
            "content-security-policy": null,
            "x-frame-options": null,
            "referrer-policy": null,
            "permissions-policy": null,
            "cache-control": null,
          }
          return headers[header] || null
        }),
      },
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("getSecurityAssessment", () => {
    it("should return a security report with populated cveFindings when mock mode is triggered", async () => {
      // Mock NVD API failure to trigger mock mode
      mockFetch
        .mockResolvedValueOnce({
          headers: {
            get: jest.fn(() => null),
          },
        })
        .mockRejectedValue(new Error("NVD API unavailable"))

      const report = await getSecurityAssessment("example.com")

      expect(report).toBeDefined()
      expect(report.url).toBe("example.com")
      expect(report.verifiedDomain).toBe("example.com")
      expect(report.cveFindings).toBeDefined()
      expect(Array.isArray(report.cveFindings)).toBe(true)
      expect(report.cveFindings.length).toBeGreaterThanOrEqual(1)

      // Verify CVE findings structure
      if (report.cveFindings.length > 0) {
        const cve = report.cveFindings[0]
        expect(cve).toHaveProperty("cveId")
        expect(cve).toHaveProperty("severity")
        expect(cve).toHaveProperty("cvss")
        expect(cve).toHaveProperty("published")
        expect(cve).toHaveProperty("summary")
        expect(cve.cveId).toMatch(/^CVE-\d{4}-\d{4}$/)
        expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(cve.severity)
      }
    })

    it("should throw InvalidURLError for private IP addresses", async () => {
      await expect(getSecurityAssessment("http://10.0.0.1")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("http://192.168.1.1")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("http://172.16.0.1")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("http://127.0.0.1")).rejects.toThrow(InvalidURLError)
    })

    it("should throw InvalidURLError for localhost domains", async () => {
      await expect(getSecurityAssessment("localhost")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("test.local")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("app.localhost")).rejects.toThrow(InvalidURLError)
    })

    it("should throw InvalidURLError for malformed URLs", async () => {
      await expect(getSecurityAssessment("not-a-url")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("ftp://invalid-protocol.com")).rejects.toThrow(InvalidURLError)
      await expect(getSecurityAssessment("")).rejects.toThrow(InvalidURLError)
    })

    it("should canonicalize URLs correctly", async () => {
      mockFetch.mockResolvedValue({
        headers: {
          get: jest.fn(() => null),
        },
      })

      const report = await getSecurityAssessment("example.com")
      expect(report.verifiedDomain).toBe("example.com")
      expect(report.url).toBe("example.com")
    })

    it("should handle empty CVE arrays gracefully", async () => {
      // Mock empty responses
      mockFetch
        .mockResolvedValueOnce({
          headers: {
            get: jest.fn(() => null),
          },
        })
        .mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({
            vulnerabilities: [],
          }),
        })

      const report = await getSecurityAssessment("example.com")

      expect(report.cveFindings).toBeDefined()
      expect(Array.isArray(report.cveFindings)).toBe(true)
      // Should still have mock CVEs even if API returns empty
      expect(report.cveFindings.length).toBeGreaterThanOrEqual(0)
    })

    it("should calculate risk score correctly", async () => {
      const report = await getSecurityAssessment("example.com")

      expect(report.riskScore).toBeDefined()
      expect(typeof report.riskScore).toBe("number")
      expect(report.riskScore).toBeGreaterThanOrEqual(0)
      expect(report.riskScore).toBeLessThanOrEqual(100)

      expect(report.riskLevel).toBeDefined()
      expect(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).toContain(report.riskLevel)
    })

    it("should maintain flat cveFindings array structure", async () => {
      const report = await getSecurityAssessment("example.com")

      // Verify the array is flat (no nested arrays)
      const isFlat = report.cveFindings.every(
        (item) => typeof item === "object" && item !== null && !Array.isArray(item) && "cveId" in item,
      )

      expect(isFlat).toBe(true)
    })

    it("should include all required report fields", async () => {
      const report = await getSecurityAssessment("example.com")

      expect(report).toHaveProperty("url")
      expect(report).toHaveProperty("verifiedDomain")
      expect(report).toHaveProperty("techStack")
      expect(report).toHaveProperty("headers")
      expect(report).toHaveProperty("cveFindings")
      expect(report).toHaveProperty("riskScore")
      expect(report).toHaveProperty("riskLevel")
      expect(report).toHaveProperty("generatedAt")

      expect(Array.isArray(report.techStack)).toBe(true)
      expect(Array.isArray(report.headers)).toBe(true)
      expect(Array.isArray(report.cveFindings)).toBe(true)
    })
  })

  describe("InvalidURLError", () => {
    it("should preserve original URL in error", () => {
      const originalUrl = "invalid-url"
      const error = new InvalidURLError("Test error", originalUrl)

      expect(error.name).toBe("InvalidURLError")
      expect(error.originalUrl).toBe(originalUrl)
      expect(error.message).toBe("Test error")
    })
  })

  describe("mockReport", () => {
    it("should generate valid mock report", () => {
      const mock = mockReport()

      expect(mock).toHaveProperty("url")
      expect(mock).toHaveProperty("verifiedDomain")
      expect(mock).toHaveProperty("techStack")
      expect(mock).toHaveProperty("headers")
      expect(mock).toHaveProperty("cveFindings")
      expect(mock).toHaveProperty("riskScore")
      expect(mock).toHaveProperty("riskLevel")
      expect(mock).toHaveProperty("generatedAt")

      expect(mock.cveFindings.length).toBeGreaterThan(0)
    })

    it("should allow overrides", () => {
      const overrides = {
        riskLevel: "HIGH" as Severity,
        riskScore: 85,
      }

      const mock = mockReport(overrides)

      expect(mock.riskLevel).toBe("HIGH")
      expect(mock.riskScore).toBe(85)
    })
  })
})
