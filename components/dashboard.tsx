"use client"

import { Wallet } from "lucide-react"
import { useExpenses } from "@/hooks/use-expenses"
import { SummaryCards } from "@/components/summary-cards"
import { CategoryChart, TrendChart } from "@/components/expense-charts"
import { FiltersBar } from "@/components/filters-bar"
import { ExpenseTable } from "@/components/expense-table"
import { AddExpenseDialog } from "@/components/add-expense-dialog"

export function Dashboard() {
  const {
    expenses,
    summary,
    isLoading,
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
  } = useExpenses()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground leading-none">
                Expense Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your spending
              </p>
            </div>
          </div>
          <AddExpenseDialog onAdd={addExpense} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {/* Summary Cards */}
          <SummaryCards
            total={summary.total}
            average={summary.average}
            count={summary.count}
            topCategory={summary.topCategory}
          />

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryChart byCategory={summary.byCategory} />
            <TrendChart monthlyTrend={summary.monthlyTrend} />
          </div>

          {/* Filters & Table */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Transactions
              </h2>
              <span className="text-sm text-muted-foreground">
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
              </span>
            </div>
            <FiltersBar
              timePeriod={timePeriod}
              setTimePeriod={setTimePeriod}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <ExpenseTable
              expenses={expenses}
              sortField={sortField}
              setSortField={setSortField}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              onDelete={removeExpense}
              onEdit={editExpense}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
