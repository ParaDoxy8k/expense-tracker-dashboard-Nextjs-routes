import { NextResponse } from "next/server"
import { deleteExpense, updateExpense } from "@/lib/expenses-store"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const success = deleteExpense(id)

  if (!success) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const updated = updateExpense(id, body)

    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
