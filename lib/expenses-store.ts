import type { Expense, ExpenseCategory } from "./types"

// In-memory store (replace with DB later)
const expenses: Expense[] = generateSeedData()

function generateSeedData(): Expense[] {
  const now = new Date()
  const categories: ExpenseCategory[] = [
    "food", "transport", "entertainment", "shopping",
    "bills", "health", "education", "other",
  ]
  const descriptions: Record<ExpenseCategory, string[]> = {
    food: ["Grocery store", "Coffee shop", "Lunch out", "Dinner at restaurant", "Takeout order"],
    transport: ["Gas station", "Uber ride", "Monthly transit pass", "Parking fee", "Toll road"],
    entertainment: ["Movie tickets", "Streaming service", "Concert tickets", "Video game", "Book purchase"],
    shopping: ["Clothing store", "Electronics", "Home decor", "Online order", "Gift purchase"],
    bills: ["Electric bill", "Internet bill", "Phone bill", "Water bill", "Insurance payment"],
    health: ["Pharmacy", "Gym membership", "Doctor visit", "Dental checkup", "Vitamins"],
    education: ["Online course", "Textbook", "Workshop fee", "Certification exam", "School supplies"],
    other: ["Miscellaneous", "Donation", "Pet supplies", "Haircut", "Dry cleaning"],
  }

  const seed: Expense[] = []
  for (let i = 0; i < 45; i++) {
    const daysAgo = Math.floor(Math.random() * 120)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const descList = descriptions[category]
    const description = descList[Math.floor(Math.random() * descList.length)]
    const amount = Math.round((Math.random() * 200 + 5) * 100) / 100

    seed.push({
      id: `seed-${i + 1}`,
      description,
      amount,
      category,
      date: date.toISOString().split("T")[0],
      createdAt: date.toISOString(),
    })
  }

  return seed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

let nextId = 100

export function getAllExpenses(): Expense[] {
  return [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function addExpense(data: Omit<Expense, "id" | "createdAt">): Expense {
  const expense: Expense = {
    ...data,
    id: `exp-${nextId++}`,
    createdAt: new Date().toISOString(),
  }
  expenses.push(expense)
  return expense
}

export function deleteExpense(id: string): boolean {
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) return false
  expenses.splice(index, 1)
  return true
}

export function updateExpense(
  id: string,
  data: Partial<Omit<Expense, "id" | "createdAt">>
): Expense | null {
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) return null
  expenses[index] = { ...expenses[index], ...data }
  return expenses[index]
}
