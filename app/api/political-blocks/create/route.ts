import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const color = formData.get("color") as string
    const presidentIdStr = formData.get("presidentId") as string
    const presidentId = presidentIdStr === "-1" ? null : Number(presidentIdStr)

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO political_blocks (name, president_id, color)
      VALUES (${name}, ${presidentId}, ${color})
      RETURNING *
    `

    return NextResponse.json({ success: true, block: result[0] })
  } catch (error) {
    console.error("Error creando bloque político:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}