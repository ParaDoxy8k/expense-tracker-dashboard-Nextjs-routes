import { NextResponse } from "next/server"
import { getAllExpenses, addExpense } from "@/lib/expenses-store"

export async function GET() {
  const expenses = getAllExpenses()
  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { description, amount, category, date } = body

    if (!description || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const expense = addExpense({
      description,
      amount: Number(amount),
      category,
      date,
    })

    return NextResponse.json(expense, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
