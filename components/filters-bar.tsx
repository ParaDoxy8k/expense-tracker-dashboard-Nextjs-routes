"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ExpenseCategory, TimePeriod } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

interface FiltersBarProps {
  timePeriod: TimePeriod
  setTimePeriod: (v: TimePeriod) => void
  categoryFilter: ExpenseCategory | "all"
  setCategoryFilter: (v: ExpenseCategory | "all") => void
  searchQuery: string
  setSearchQuery: (v: string) => void
}

const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  all: "All time",
}

export function FiltersBar({
  timePeriod,
  setTimePeriod,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="hidden size-4 text-muted-foreground sm:block" />
        <Select
          value={timePeriod}
          onValueChange={(v) => setTimePeriod(v as TimePeriod)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TIME_PERIOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={categoryFilter}
          onValueChange={(v) =>
            setCategoryFilter(v as ExpenseCategory | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
