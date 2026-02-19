"use client"

import {
  DollarSign,
  TrendingUp,
  Receipt,
  Tag,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_LABELS } from "@/lib/types"
import type { ExpenseCategory } from "@/lib/types"

interface SummaryCardsProps {
  total: number
  average: number
  count: number
  topCategory: ExpenseCategory
}

export function SummaryCards({
  total,
  average,
  count,
  topCategory,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Expenses",
      value: `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: "Average Expense",
      value: `$${average.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      accent: "bg-chart-2/10 text-chart-2",
    },
    {
      title: "Total Transactions",
      value: count.toString(),
      icon: Receipt,
      accent: "bg-chart-3/10 text-chart-3",
    },
    {
      title: "Top Category",
      value: CATEGORY_LABELS[topCategory],
      icon: Tag,
      accent: "bg-chart-4/10 text-chart-4",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.accent}`}>
              <card.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
