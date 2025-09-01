"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { formatNumber } from "@/lib/utils/breach"

interface ChartsProps {
  scenarios: BreachScenario[]
}

export function Charts({ scenarios }: ChartsProps) {
  // Prepare data for top 10 companies by total impact
  const topCompaniesByImpact = scenarios
    .sort((a, b) => b.totalImpact - a.totalImpact)
    .slice(0, 10)
    .map((scenario) => ({
      company: scenario.company.length > 15 ? scenario.company.substring(0, 15) + "..." : scenario.company,
      fullCompany: scenario.company,
      totalImpact: scenario.totalImpact,
      totalImpactLabel: scenario.totalImpactLabel,
      actualCost: scenario.actualCost,
      costLabel: scenario.costLabel,
    }))

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.fullCompany}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-sm">
              <span style={{ color: entry.color }}>
                {entry.dataKey === "totalImpact" ? "Total Impact: " : "Actual Cost: "}
              </span>
              <span className="font-medium">
                {entry.dataKey === "totalImpact" ? data.totalImpactLabel : data.costLabel}
              </span>
              <div className="text-xs text-muted-foreground">Raw: ${entry.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (scenarios.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data available with current filters
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actual Cost vs Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No data available with current filters
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Top Companies by Total Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Top Companies by Total Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topCompaniesByImpact}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis tickFormatter={formatNumber} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="totalImpact" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Actual Cost vs Total Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Actual Cost vs Total Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topCompaniesByImpact}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis tickFormatter={formatNumber} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="actualCost" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalImpact" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
