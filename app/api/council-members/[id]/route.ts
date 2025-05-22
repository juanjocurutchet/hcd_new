import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Obtener concejal
    const members = await sql`
      SELECT cm.id, cm.name, cm.position, cm.block_id, cm.mandate, cm.image_url, cm.bio, cm.is_active,
             pb.name as block_name, pb.color as block_color
      FROM council_members cm
      LEFT JOIN political_blocks pb ON cm.block_id = pb.id
      WHERE cm.id = ${id}
    `

    if (members.length === 0) {
      return NextResponse.json({ error: "Concejal no encontrado" }, { status: 404 })
    }

    // Obtener comisiones
    const committees = await sql`
      SELECT c.id, c.name, c.description
      FROM committees c
      JOIN committee_members cm ON c.id = cm.committee_id
      WHERE cm.council_member_id = ${id}
    `

    return NextResponse.json({
      ...members[0],
      committees,
    })
  } catch (error) {
    console.error(`Error obteniendo concejal con id ${params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
