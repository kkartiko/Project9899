"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils/breach"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { Building2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

interface KpisProps {
  scenarios: BreachScenario[]
}

export function Kpis({ scenarios }: KpisProps) {
  const totalScenarios = scenarios.length
  const sumActualCost = scenarios.reduce((sum, s) => sum + s.actualCost, 0)
  const sumTotalImpact = scenarios.reduce((sum, s) => sum + s.totalImpact, 0)

  const highestImpactCompany = scenarios.reduce(
    (max, current) => (current.totalImpact > max.totalImpact ? current : max),
    scenarios[0] || { company: "N/A", totalImpact: 0, totalImpactLabel: "N/A" },
  )

  const kpis = [
    {
      title: "Total Scenarios",
      value: totalScenarios.toString(),
      description: "Data breach cases analyzed",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Total Actual Costs",
      value: formatNumber(sumActualCost),
      description: `$${sumActualCost.toLocaleString()} exact`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Impact",
      value: formatNumber(sumTotalImpact),
      description: `$${sumTotalImpact.toLocaleString()} exact`,
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Highest Impact",
      value: highestImpactCompany.company,
      description: highestImpactCompany.totalImpactLabel,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  if (scenarios.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">No scenarios match current filters</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground" title={kpi.description}>
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
