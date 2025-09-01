"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { getYearStart } from "@/lib/utils/breach"

interface BreachTableProps {
  scenarios: BreachScenario[]
}

type SortField = "company" | "year"
type SortOrder = "asc" | "desc"

export function BreachTable({ scenarios }: BreachTableProps) {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("company")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Filter scenarios based on search
  const filteredScenarios = useMemo(() => {
    if (!search) return scenarios

    const searchLower = search.toLowerCase()
    return scenarios.filter((scenario) => {
      const searchableText = [scenario.company, scenario.scenario, scenario.impact].join(" ").toLowerCase()

      return searchableText.includes(searchLower)
    })
  }, [scenarios, search])

  // Sort scenarios
  const sortedScenarios = useMemo(() => {
    return [...filteredScenarios].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      if (sortField === "company") {
        aValue = a.company
        bValue = b.company
      } else {
        aValue = getYearStart(a.year)
        bValue = getYearStart(b.year)
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue
        return sortOrder === "asc" ? comparison : -comparison
      }

      return 0
    })
  }, [filteredScenarios, sortField, sortOrder])

  // Paginate scenarios
  const paginatedScenarios = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedScenarios.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedScenarios, currentPage])

  const totalPages = Math.ceil(sortedScenarios.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const getSourcesCount = (sources: BreachScenario["sources"]) => {
    return Array.isArray(sources) ? sources.length : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breach Scenarios</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scenarios..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8"
              aria-label="Search breach scenarios"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {sortedScenarios.length} of {scenarios.length} scenarios
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("company")}
                    className="h-auto p-0 font-semibold hover:bg-transparent focus:ring-2 focus:ring-primary"
                    aria-label="Sort by company"
                  >
                    Company
                    {getSortIcon("company")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("year")}
                    className="h-auto p-0 font-semibold hover:bg-transparent focus:ring-2 focus:ring-primary"
                    aria-label="Sort by year"
                  >
                    Year
                    {getSortIcon("year")}
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actual Cost</TableHead>
                <TableHead>Total Impact</TableHead>
                <TableHead>Sources</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedScenarios.map((scenario, index) => (
                <TableRow key={`${scenario.company}-${index}`}>
                  <TableCell className="font-medium">{scenario.company}</TableCell>
                  <TableCell>{scenario.year}</TableCell>
                  <TableCell className="capitalize">{scenario.category}</TableCell>
                  <TableCell>{scenario.costLabel}</TableCell>
                  <TableCell>{scenario.totalImpactLabel}</TableCell>
                  <TableCell>{getSourcesCount(scenario.sources)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
