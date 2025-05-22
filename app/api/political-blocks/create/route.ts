import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isAdmin } from "@/lib/utils/server-utils"

export async function POST(request: NextRequest) {
  try {
    // Verificar permisos
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { name, color, presidentId } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Crear bloque político
    const result = await sql`
      INSERT INTO political_blocks (
        name, color, president_id
      ) VALUES (
        ${name}, ${color}, ${presidentId}
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      id: result[0].id,
    })
  } catch (error: any) {
    console.error("Error al crear bloque político:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
