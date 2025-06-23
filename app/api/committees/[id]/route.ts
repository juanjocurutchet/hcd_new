import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
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
    const params = await context.params
    const idParam = params.id
    const { id: numericId, error } = await validateAdminAndId(request, idParam)
    if (error) return error

    const body = await request.json()
    const { name, description, presidentId, secretaryId, memberIds, isActive } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Actualizar comisión
    const result = await sql`
      UPDATE committees
      SET name = ${name},
          description = ${description},
          president_id = ${presidentId || null},
          secretary_id = ${secretaryId || null},
          is_active = ${isActive ?? true}
      WHERE id = ${numericId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Comisión no encontrada" }, { status: 404 })
    }

    // Actualizar miembros - eliminar existentes y agregar nuevos
    await sql`DELETE FROM committee_members WHERE committee_id = ${numericId}`

    if (memberIds && memberIds.length > 0) {
      for (const memberId of memberIds) {
        await sql`
          INSERT INTO committee_members (
            committee_id, council_member_id
          ) VALUES (
            ${numericId}, ${memberId}
          )
        `
      }
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error en PUT:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const params = await context.params
    const idParam = params.id
    const { id: numericId, error } = await validateAdminAndId(request, idParam)
    if (error) return error

    // Eliminar primero los miembros de la comisión
    await sql`DELETE FROM committee_members WHERE committee_id = ${numericId}`

    // Eliminar la comisión
    const result = await sql`
      DELETE FROM committees WHERE id = ${numericId}
      RETURNING *
    `

    return result.length
      ? NextResponse.json({ message: "Comisión eliminada correctamente" })
      : NextResponse.json({ error: "Comisión no encontrada" }, { status: 404 })
  } catch (error) {
    console.error("Error al eliminar:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}