"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText } from "lucide-react"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { exportToCSV } from "@/lib/utils/breach"

interface ExportButtonsProps {
  scenarios: BreachScenario[]
  filteredScenarios: BreachScenario[]
}

export function ExportButtons({ scenarios, filteredScenarios }: ExportButtonsProps) {
  const { toast } = useToast()

  const handleExportFiltered = () => {
    if (filteredScenarios.length === 0) {
      toast({
        title: "No data to export",
        description: "No scenarios match your current filters",
        variant: "destructive",
      })
      return
    }

    exportToCSV(filteredScenarios, "filtered-breach-scenarios.csv")
    toast({
      title: "Export successful!",
      description: `${filteredScenarios.length} scenarios exported to CSV`,
    })
  }

  const handleExportAll = () => {
    exportToCSV(scenarios, "all-breach-scenarios.csv")
    toast({
      title: "Export successful!",
      description: `${scenarios.length} scenarios exported to CSV`,
    })
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportFiltered} disabled={filteredScenarios.length === 0}>
        <Download className="mr-1 h-3 w-3" />
        Export Filtered ({filteredScenarios.length})
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportAll}>
        <FileText className="mr-1 h-3 w-3" />
        Export All ({scenarios.length})
      </Button>
    </div>
  )
}
