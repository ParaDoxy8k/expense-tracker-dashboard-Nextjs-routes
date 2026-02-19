"use client"

import useSWR from "swr"
import type { Expense, ExpenseCategory, TimePeriod, SortField, SortDirection } from "@/lib/types"
import { useState, useMemo } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useExpenses() {
  const { data, error, isLoading, mutate } = useSWR<Expense[]>(
    "/api/expenses",
    fetcher
  )

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d")
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredExpenses = useMemo(() => {
    if (!data) return []

    let filtered = [...data]

    // Time period filter
    if (timePeriod !== "all") {
      const now = new Date()
      let startDate: Date

      switch (timePeriod) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        case "12m":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0)
      }

      filtered = filtered.filter(
        (e) => new Date(e.date) >= startDate
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((e) => e.category === categoryFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "date":
          comparison =
            new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [data, timePeriod, categoryFilter, sortField, sortDirection, searchQuery])

  const summary = useMemo(() => {
    if (!filteredExpenses.length) {
      return {
        total: 0,
        average: 0,
        count: 0,
        byCategory: {} as Record<ExpenseCategory, number>,
        monthlyTrend: [] as { month: string; total: number }[],
        topCategory: "other" as ExpenseCategory,
      }
    }

    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)
    const average = total / filteredExpenses.length

    const byCategory = filteredExpenses.reduce(
      (acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount
        return acc
      },
      {} as Record<string, number>
    ) as Record<ExpenseCategory, number>

    // Monthly trend
    const monthlyMap = new Map<string, number>()
    filteredExpenses.forEach((e) => {
      const date = new Date(e.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + e.amount)
    })

    const monthlyTrend = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => {
        const [year, m] = month.split("-")
        const monthName = new Date(
          Number(year),
          Number(m) - 1
        ).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        return { month: monthName, total: Math.round(total * 100) / 100 }
      })

    const topCategory = Object.entries(byCategory).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0] as ExpenseCategory || "other"

    return { total, average, count: filteredExpenses.length, byCategory, monthlyTrend, topCategory }
  }, [filteredExpenses])

  async function addExpense(expense: {
    description: string
    amount: number
    category: ExpenseCategory
    date: string
  }) {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    })
    if (!res.ok) throw new Error("Failed to add expense")
    await mutate()
  }

  async function removeExpense(id: string) {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete expense")
    await mutate()
  }

  async function editExpense(
    id: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>
  ) {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update expense")
    await mutate()
  }

  return {
    expenses: filteredExpenses,
    allExpenses: data ?? [],
    summary,
    isLoading,
    error,
    timePeriod,
    setTimePeriod,
    categoryFilter,
    setCategoryFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    addExpense,
    removeExpense,
    editExpense,
  }
}
