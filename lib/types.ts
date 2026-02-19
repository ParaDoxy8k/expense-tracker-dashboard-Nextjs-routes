export type ExpenseCategory =
  | "food"
  | "transport"
  | "entertainment"
  | "shopping"
  | "bills"
  | "health"
  | "education"
  | "other"

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  date: string // ISO date string
  createdAt: string
}

export type TimePeriod = "7d" | "30d" | "90d" | "12m" | "all"

export type SortField = "date" | "amount" | "category"
export type SortDirection = "asc" | "desc"

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food & Dining",
  transport: "Transportation",
  entertainment: "Entertainment",
  shopping: "Shopping",
  bills: "Bills & Utilities",
  health: "Health & Medical",
  education: "Education",
  other: "Other",
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: "#4A7CF7",
  transport: "#34B89A",
  entertainment: "#C87DD4",
  shopping: "#E8843C",
  bills: "#5B6ABF",
  health: "#E05D5D",
  education: "#3DAFCF",
  other: "#8E8E93",
}
