"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"
import type { BreachScenario } from "@/lib/data/breach-scenarios"
import { getYearStart } from "@/lib/utils/breach"

interface FiltersProps {
  scenarios: BreachScenario[]
  filters: {
    companies: string[]
    years: string[]
    categories: string[]
    search: string
  }
  onFiltersChange: (filters: {
    companies: string[]
    years: string[]
    categories: string[]
    search: string
  }) => void
}

export function Filters({ scenarios, filters, onFiltersChange }: FiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Extract unique values from scenarios
  const companies = Array.from(new Set(scenarios.map((s) => s.company))).sort()
  const categories = Array.from(new Set(scenarios.map((s) => s.category))).sort()

  // Create year buckets
  const years = Array.from(new Set(scenarios.map((s) => getYearStart(s.year)))).sort((a, b) => b - a)

  const yearBuckets = ["All", "2023–2024", "2021–2022", "2016–2020", ...years.map((y) => y.toString())]

  const handleCompanyChange = (company: string, checked: boolean) => {
    const newCompanies = checked ? [...filters.companies, company] : filters.companies.filter((c) => c !== company)

    onFiltersChange({ ...filters, companies: newCompanies })
  }

  const handleYearChange = (year: string, checked: boolean) => {
    const newYears = checked ? [...filters.years, year] : filters.years.filter((y) => y !== year)

    onFiltersChange({ ...filters, years: newYears })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)

    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const clearFilters = () => {
    onFiltersChange({
      companies: [],
      years: [],
      categories: [],
      search: "",
    })
  }

  const activeFilterCount =
    filters.companies.length + filters.years.length + filters.categories.length + (filters.search ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search companies, scenarios, impacts..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Companies */}
      <div className="space-y-2">
        <Label>Companies ({filters.companies.length} selected)</Label>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {companies.map((company) => (
            <div key={company} className="flex items-center space-x-2">
              <Checkbox
                id={`company-${company}`}
                checked={filters.companies.includes(company)}
                onCheckedChange={(checked) => handleCompanyChange(company, checked as boolean)}
              />
              <Label htmlFor={`company-${company}`} className="text-sm font-normal cursor-pointer">
                {company}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Years */}
      <div className="space-y-2">
        <Label>Years ({filters.years.length} selected)</Label>
        <div className="space-y-2">
          {yearBuckets.map((year) => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={filters.years.includes(year)}
                onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
              />
              <Label htmlFor={`year-${year}`} className="text-sm font-normal cursor-pointer">
                {year}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories ({filters.categories.length} selected)</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer capitalize">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative min-w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies, scenarios..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Quick Filters */}
            <Select
              value=""
              onValueChange={(company) => handleCompanyChange(company, !filters.companies.includes(company))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value="" onValueChange={(year) => handleYearChange(year, !filters.years.includes(year))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Add Year" />
              </SelectTrigger>
              <SelectContent>
                {yearBuckets.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3 w-3" />
                Clear ({activeFilterCount})
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.companies.map((company) => (
                <Badge key={company} variant="secondary" className="gap-1">
                  {company}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleCompanyChange(company, false)} />
                </Badge>
              ))}
              {filters.years.map((year) => (
                <Badge key={year} variant="secondary" className="gap-1">
                  {year}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleYearChange(year, false)} />
                </Badge>
              ))}
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1 capitalize">
                  {category}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(category, false)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Breach Scenarios</SheetTitle>
                <SheetDescription>Refine your search using the filters below</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
