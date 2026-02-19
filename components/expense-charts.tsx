"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ExpenseCategory,
} from "@/lib/types"

interface CategoryChartProps {
  byCategory: Record<ExpenseCategory, number>
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    payload: { name: string; value: number; fill: string }
  }>
}) {
  if (!active || !payload?.length) return null
  const data = payload[0]
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-card-foreground">{data.payload.name}</p>
      <p className="text-muted-foreground">
        ${data.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  )
}

export function CategoryChart({ byCategory }: CategoryChartProps) {
  const data = Object.entries(byCategory)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key as ExpenseCategory],
      value: Math.round(value * 100) / 100,
      fill: CATEGORY_COLORS[key as ExpenseCategory],
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((sum, d) => sum + d.value, 0)

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>No data for the selected period</CardDescription>
        </CardHeader>
        <CardContent className="flex h-75 items-center justify-center">
          <p className="text-muted-foreground">No expenses to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Breakdown of expenses across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="mx-auto h-60 w-60 lg:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              {data.map((item) => {
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0"
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <div
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="flex-1 text-sm text-card-foreground">{item.name}</span>
                    <span className="text-sm font-medium tabular-nums text-card-foreground">
                      {item.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ฿
                    </span>
                    <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                      {percentage}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TrendChartProps {
  monthlyTrend: { month: string; total: number }[]
}

function TrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-card-foreground">{label}</p>
      <p className="text-muted-foreground">
        ${payload[0].value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  )
}

export function TrendChart({ monthlyTrend }: TrendChartProps) {
  if (!monthlyTrend.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <CardDescription>No data for the selected period</CardDescription>
        </CardHeader>
        <CardContent className="flex h-75 items-center justify-center">
          <p className="text-muted-foreground">No expenses to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <CardDescription>Your spending over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-70">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val} ฿`}
              />
              <Tooltip content={<TrendTooltip />} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {monthlyTrend.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === monthlyTrend.length - 1 ? "#4A7CF7" : "#94B4FB"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
