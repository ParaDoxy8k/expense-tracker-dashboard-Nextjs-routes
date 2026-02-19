"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  Expense,
  ExpenseCategory,
  SortField,
  SortDirection,
} from "@/lib/types"
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/types"

interface ExpenseTableProps {
  expenses: Expense[]
  sortField: SortField
  setSortField: (v: SortField) => void
  sortDirection: SortDirection
  setSortDirection: (v: SortDirection) => void
  onDelete: (id: string) => Promise<void>
  onEdit: (
    id: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>
  ) => Promise<void>
}

export function ExpenseTable({
  expenses,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  onDelete,
  onEdit,
}: ExpenseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    category: "" as ExpenseCategory,
    date: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  function openEdit(expense: Expense) {
    setEditExpense(expense)
    setEditForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setIsSubmitting(true)
    try {
      await onDelete(deleteId)
    } finally {
      setDeleteId(null)
      setIsSubmitting(false)
    }
  }

  async function handleEditSubmit() {
    if (!editExpense) return
    setIsSubmitting(true)
    try {
      await onEdit(editExpense.id, {
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        date: editForm.date,
      })
    } finally {
      setEditExpense(null)
      setIsSubmitting(false)
    }
  }

  function SortButton({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) {
    return (
      <button
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => handleSort(field)}
      >
        {children}
        <ArrowUpDown className="size-3.5" />
        {sortField === field && (
          <span className="sr-only">
            {sortDirection === "asc" ? "ascending" : "descending"}
          </span>
        )}
      </button>
    )
  }

  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-muted-foreground">No expenses found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or add a new expense
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <SortButton field="date">Date</SortButton>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <SortButton field="category">Category</SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="amount">Amount</SortButton>
              </TableHead>
              <TableHead className="w-12.5">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="font-medium text-card-foreground">
                  {expense.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="font-normal"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[expense.category]}15`,
                      color: CATEGORY_COLORS[expense.category],
                      borderColor: `${CATEGORY_COLORS[expense.category]}30`,
                    }}
                  >
                    {CATEGORY_LABELS[expense.category]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-card-foreground">
                  {expense.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ฿
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(expense)}>
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(expense.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editExpense} onOpenChange={() => setEditExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of this expense.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Description
              </label>
              <Input
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Category
              </label>
              <Select
                value={editForm.category}
                onValueChange={(v) =>
                  setEditForm({
                    ...editForm,
                    category: v as ExpenseCategory,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Date
              </label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExpense(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
