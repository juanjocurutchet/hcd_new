import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  try {
    await sql`DELETE FROM political_blocks WHERE id = ${numericId}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar bloque:", error)
    return NextResponse.json({ error: "Error al eliminar bloque" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const numericId = Number(id)
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const color = formData.get("color") as string
    const presidentIdStr = formData.get("presidentId") as string
    const presidentId = presidentIdStr === "-1" ? null : Number.parseInt(presidentIdStr)

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    await sql`
      UPDATE political_blocks
      SET
        name = ${name},
        color = ${color},
        president_id = ${presidentId}
      WHERE id = ${numericId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error actualizando bloque político:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
