import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Obtener bloque político
    const blocks = await sql`
      SELECT pb.id, pb.name, pb.president_id, pb.color,
             cm.name as president_name
      FROM political_blocks pb
      LEFT JOIN council_members cm ON pb.president_id = cm.id
      WHERE pb.id = ${id}
    `

    if (blocks.length === 0) {
      return NextResponse.json({ error: "Bloque político no encontrado" }, { status: 404 })
    }

    // Obtener miembros
    const members = await sql`
      SELECT id, name, position, mandate, image_url, is_active
      FROM council_members
      WHERE block_id = ${id}
      ORDER BY 
        CASE 
          WHEN position = 'Presidente' THEN 1
          WHEN position LIKE 'Vicepresidente%' THEN 2
          ELSE 3
        END,
        name
    `

    return NextResponse.json({
      ...blocks[0],
      members,
    })
  } catch (error) {
    console.error(`Error obteniendo bloque político con id ${params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
