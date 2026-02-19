import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"


export async function GET() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false })

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("expenses")
    .insert(body)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", params.id)

  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ success: true })
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const { data, error } = await supabase
    .from("expenses")
    .update(body)
    .eq("id", params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json(data)
}
