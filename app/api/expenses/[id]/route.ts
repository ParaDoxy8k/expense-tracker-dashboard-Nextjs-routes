import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  if (!id) {
    return new Response("Invalid id", { status: 400 })
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(error)
    return new Response("Delete failed", { status: 500 })
  }

  return new Response("Deleted", { status: 200 })
}


export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("expenses")
    .update(body)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data, { status: 200 })
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  if (!id) {
    return new Response("Invalid id", { status: 400 })
  }

  const { data, error } = await supabase
    .from("expenses")
    .update(body)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return new Response(JSON.stringify(error), { status: 500 })
  }

  return new Response(JSON.stringify(data), { status: 200 })
}


