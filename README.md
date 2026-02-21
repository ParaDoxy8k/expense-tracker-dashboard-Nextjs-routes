# 💸 Expense Tracker Dashboard

A modern full-stack expense tracking dashboard for managing and
analyzing personal finances in real-time.

Built with Next.js (Fullstack) using Next.js Route Handlers as the
backend, styled with shadcn/ui, and powered by Supabase (PostgreSQL).

------------------------------------------------------------------------

## 🚀 Tech Stack

-   Frontend: Next.js
-   Backend: Next.js Route Handlers (/app/api/\*)
-   UI Components: shadcn/ui
-   Database: Supabase
-   Database Engine: PostgreSQL
-   Deployment: Vercel (optional)

------------------------------------------------------------------------

## ✨ Features

-   Create / Update / Delete expenses
-   Real-time dashboard summary
    -   Total expenses overview
    -   Expenses grouped by category
    -   Time-based expense charts
-   Date range filtering
-   Category management
-   Fully responsive UI

------------------------------------------------------------------------

## 📁 Project Structure

expense-tracker-dashboard/ │ ├── app/ │ ├── page.tsx \# Dashboard │ ├──
expenses/ \# Expense pages │ ├── api/ \# Backend routes (Next Route
Handlers) │ │ ├── expenses/ │ │ └── summary/ │ ├── components/ │ ├── ui/
\# shadcn components │ ├── dashboard/ │ └── expenses/ │ ├── lib/ │ ├──
supabase.ts \# Supabase client │ └── utils.ts │ ├── types/ │ └──
README.md

------------------------------------------------------------------------

## 🗄 Database Schema (Example)

### expenses

  Field          Type
  -------------- -----------
  id             uuid
  description    text
  amount         numeric
  category       uuid
  date           text
  created_at     timestamp

------------------------------------------------------------------------

## 🔌 API Endpoints

### Expenses

GET /api/expenses\
POST /api/expenses\
PATCH /api/expenses/:id\
DELETE /api/expenses/:id

### Summary

GET /api/summary?from=YYYY-MM-DD&to=YYYY-MM-DD

------------------------------------------------------------------------

## ⚙️ Environment Variables

Create a `.env.local` file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

------------------------------------------------------------------------

## 🛠 Installation

# Clone repository

git clone https://github.com/ParaDoxy8k/expense-tracker-dashboard-Nextjs-routes.git

cd expense-tracker-dashboard-Nextjs-routes

# Install dependencies

pnpm install

# Run development server

pnpm run dev

Open http://localhost:3000

------------------------------------------------------------------------

## 🚀 Deployment

Recommended platform: Vercel

Connect your GitHub repository and configure environment variables.

------------------------------------------------------------------------

## 🔒 Future Improvements

-   Authentication (Supabase Auth)
-   CSV export
-   Monthly budget limits
-   Dark mode
-   Role-based access control

------------------------------------------------------------------------

## 👨‍💻 Author

Developed by Paradox -- Have fun
