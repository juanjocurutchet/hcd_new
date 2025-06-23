import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { uploadFile } from "@/lib/storage"
import { isAdmin } from "@/lib/utils/server-utils"

async function validateAdminAndId(request: NextRequest, idParam: string) {
  if (!(await isAdmin(request))) {
    return { error: NextResponse.json({ error: "No autorizado" }, { status: 403 }) }
  }

  const id = Number.parseInt(idParam)
  if (isNaN(id)) {
    return { error: NextResponse.json({ error: "ID inválido" }, { status: 400 }) }
  }

  return { id }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const idParam = params.id;
    const { id: numericId, error } = await validateAdminAndId(request, idParam)
    if (error) return error

    const formData = await request.formData()
    const name = formData.get("name") as string
    const position = formData.get("position") as string
    const blockId = formData.get("blockId") as string
    const mandate = formData.get("mandate") as string
    const bio = formData.get("bio") as string
    const isActive = formData.get("isActive") === "true"
    const image = formData.get("image") as File | null

    const block_id = blockId && blockId !== "-1" ? Number.parseInt(blockId) : null

    const current = await sql`SELECT image_url FROM council_members WHERE id = ${numericId}`
    let image_url = current[0]?.image_url || null

    if (image && image.size > 0) {
      image_url = await uploadFile(image, "concejales")
    }

    const result = await sql`
      UPDATE council_members
      SET name = ${name},
          position = ${position},
          block_id = ${block_id},
          mandate = ${mandate},
          image_url = ${image_url},
          bio = ${bio},
          is_active = ${isActive}
      WHERE id = ${numericId}
      RETURNING *
    `

    return result.length
      ? NextResponse.json(result[0])
      : NextResponse.json({ error: "Concejal no encontrado" }, { status: 404 })

  } catch (error) {
    console.error("Error en PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const idParam = params.id;
    const { id: numericId, error } = await validateAdminAndId(request, idParam)
    if (error) return error

    const result = await sql`
      DELETE FROM council_members WHERE id = ${numericId}
      RETURNING *
    `

    return result.length
      ? NextResponse.json({ message: "Concejal eliminado correctamente" })
      : NextResponse.json({ error: "Concejal no encontrado" }, { status: 404 })
  } catch (error) {
    console.error("Error al eliminar:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}