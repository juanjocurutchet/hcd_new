import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blockId = Number.parseInt(id)

    if (isNaN(blockId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Obtener bloque político
    const blocks = await sql`
      SELECT pb.id, pb.name, pb.president_id, pb.color,
             cm.name as president_name
      FROM political_blocks pb
      LEFT JOIN council_members cm ON pb.president_id = cm.id
      WHERE pb.id = ${blockId}
    `

    if (blocks.length === 0) {
      return NextResponse.json({ error: "Bloque político no encontrado" }, { status: 404 })
    }

    // Obtener miembros
    const members = await sql`
      SELECT id, name, position, mandate, image_url, is_active
      FROM council_members
      WHERE block_id = ${blockId}
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
    const { id } = await params
    console.error(`Error obteniendo bloque político con id ${id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blockId = Number.parseInt(id)

    if (isNaN(blockId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const color = formData.get("color") as string
    const presidentIdStr = formData.get("presidentId") as string

    const presidentId = presidentIdStr === "-1" ? null : Number.parseInt(presidentIdStr)

    const result = await sql`
      UPDATE political_blocks
      SET name = ${name},
          president_id = ${presidentId},
          color = ${color}
      WHERE id = ${blockId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Bloque político no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, block: result[0] })
  } catch (error) {
    console.error("Error actualizando bloque político:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const blockId = Number.parseInt(id)

    if (isNaN(blockId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await sql`DELETE FROM political_blocks WHERE id = ${blockId}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error eliminando bloque político:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
