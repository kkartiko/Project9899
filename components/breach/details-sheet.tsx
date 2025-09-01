"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ExternalLink, Copy, Download, AlertTriangle, Calendar, Building2, DollarSign } from "lucide-react"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { formatNumber, normalizeSources } from "@/lib/utils/breach"

interface DetailsSheetProps {
  scenario: BreachScenario | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetailsSheet({ scenario, open, onOpenChange }: DetailsSheetProps) {
  const { toast } = useToast()
  const [copying, setCopying] = useState(false)

  if (!scenario) return null

  const sources = normalizeSources(scenario.sources)
  const hasAnomaly = scenario.totalImpact < scenario.actualCost

  const copySourceUrls = async () => {
    setCopying(true)
    try {
      const urls = sources.map((source) => source.url).join("\n")
      await navigator.clipboard.writeText(urls)
      toast({
        title: "Sources copied!",
        description: `${sources.length} source URLs copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy sources to clipboard",
        variant: "destructive",
      })
    } finally {
      setCopying(false)
    }
  }

  const exportToJson = () => {
    const dataStr = JSON.stringify(scenario, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${scenario.company.toLowerCase().replace(/[^a-z0-9]/g, "-")}-breach-data.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful!",
      description: "Scenario data downloaded as JSON",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-xl flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {scenario.company}
                {hasAnomaly && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Anomaly
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {scenario.year}
                </div>
                <Badge variant="outline" className="capitalize">
                  {scenario.category}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold">Actual Cost</h3>
              </div>
              <div className="text-2xl font-bold">{formatNumber(scenario.actualCost)}</div>
              <div className="text-sm text-muted-foreground">{scenario.costLabel}</div>
              <div className="text-xs text-muted-foreground mt-1">Exact: ${scenario.actualCost.toLocaleString()}</div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <h3 className="font-semibold">Total Impact</h3>
              </div>
              <div className="text-2xl font-bold">{formatNumber(scenario.totalImpact)}</div>
              <div className="text-sm text-muted-foreground">{scenario.totalImpactLabel}</div>
              <div className="text-xs text-muted-foreground mt-1">Exact: ${scenario.totalImpact.toLocaleString()}</div>
            </div>
          </div>

          {/* Scenario Description */}
          <div>
            <h3 className="font-semibold mb-3">Breach Scenario</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{scenario.scenario}</p>
          </div>

          <Separator />

          {/* Impact Summary */}
          <div>
            <h3 className="font-semibold mb-3">Impact Summary</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{scenario.impact}</p>
          </div>

          <Separator />

          {/* Sources */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Sources ({sources.length})</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copySourceUrls} disabled={copying}>
                  <Copy className="mr-1 h-3 w-3" />
                  {copying ? "Copying..." : "Copy URLs"}
                </Button>
                <Button variant="outline" size="sm" onClick={exportToJson}>
                  <Download className="mr-1 h-3 w-3" />
                  Export JSON
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {sources.map((source, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-lg hover:bg-muted/50">
                  <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline text-primary"
                    >
                      {source.label}
                    </a>
                    <div className="text-xs text-muted-foreground mt-1 break-all">{source.url}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Warning */}
          {hasAnomaly && (
            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="font-semibold text-destructive">Data Anomaly Detected</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The total impact ({formatNumber(scenario.totalImpact)}) is less than the actual cost (
                {formatNumber(scenario.actualCost)}). This may indicate incomplete impact assessment or data entry
                issues.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
