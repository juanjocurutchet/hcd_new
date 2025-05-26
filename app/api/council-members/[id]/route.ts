import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = Number.parseInt(idParam)

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
    console.error(`Error obteniendo concejal con id ${(await params).id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = Number.parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Manejar FormData
    const formData = await request.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const blockId = formData.get("blockId") as string
    const mandate = formData.get("mandate") as string
    const bio = formData.get("bio") as string
    const isActive = formData.get("isActive") === "true"
    const image = formData.get("image") as File | null

    // Convertir blockId a número o null
    const block_id = blockId && blockId !== "-1" ? Number.parseInt(blockId) : null

    // TODO: Manejar subida de imagen si existe
    const image_url = null
    if (image && image.size > 0) {
      // Aquí iría la lógica de subida de imagen (Cloudinary, etc.)
      console.log("Imagen recibida:", image.name)
    }

    const result = await sql`
      UPDATE council_members
      SET name = ${name},
          position = ${position},
          block_id = ${block_id},
          mandate = ${mandate},
          bio = ${bio},
          is_active = ${isActive}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Concejal no encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Error actualizando concejal con id ${(await params).id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = Number.parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM council_members
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Concejal no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Concejal eliminado correctamente" })
  } catch (error) {
    console.error(`Error eliminando concejal con id ${(await params).id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
