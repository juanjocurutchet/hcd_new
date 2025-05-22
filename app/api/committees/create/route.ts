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
    const { name, description, presidentId, memberIds } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Crear comisión
    const result = await sql`
      INSERT INTO committees (
        name, description, president_id
      ) VALUES (
        ${name}, ${description}, ${presidentId}
      )
      RETURNING id
    `

    const committeeId = result[0].id

    // Agregar miembros si existen
    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        await sql`
          INSERT INTO committee_members (
            committee_id, council_member_id
          ) VALUES (
            ${committeeId}, ${memberId}
          )
        `
      }
    }

    return NextResponse.json({
      success: true,
      id: committeeId,
    })
  } catch (error: any) {
    console.error("Error al crear comisión:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
