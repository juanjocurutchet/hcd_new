import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Obtener actividad
    const activities = await sql`
      SELECT id, title, description, date, image_url, is_published
      FROM activities
      WHERE id = ${id}
    `

    if (activities.length === 0) {
      return NextResponse.json({ error: "Actividad no encontrada" }, { status: 404 })
    }

    // Obtener participantes
    const participants = await sql`
      SELECT cm.id, cm.name, cm.position, cm.block_id, pb.name as block_name
      FROM activity_participants ap
      JOIN council_members cm ON ap.council_member_id = cm.id
      LEFT JOIN political_blocks pb ON cm.block_id = pb.id
      WHERE ap.activity_id = ${id}
      ORDER BY cm.name
    `

    return NextResponse.json({
      ...activities[0],
      participants,
    })
  } catch (error) {
    console.error(`Error obteniendo actividad con id ${params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
