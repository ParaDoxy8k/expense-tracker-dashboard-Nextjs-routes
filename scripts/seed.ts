import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function randomPastDate(maxDaysAgo: number) {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * maxDaysAgo)
  const date = new Date(now)
  date.setDate(now.getDate() - daysAgo)

  return date.toISOString().split("T")[0] // YYYY-MM-DD
}

async function seed() {
  const categories = [
    "food", "transport", "entertainment", "shopping",
    "bills", "health", "education", "other",
  ]

  const expenses = Array.from({ length: 40 }).map((_, i) => ({
    description: `Seed expense ${i + 1}`,
    amount: Math.round((Math.random() * 200 + 5) * 100) / 100,
    category: categories[Math.floor(Math.random() * categories.length)],
    date: randomPastDate(120), // 🔥 สุ่มย้อนหลัง 120 วัน
  }))

  const { error } = await supabase.from("expenses").insert(expenses)

  if (error) {
    console.error(error)
  } else {
    console.log("✅ Seed completed")
  }
}

seed()
