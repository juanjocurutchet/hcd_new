import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { uploadFile } from "@/lib/storage"
import { isAdmin } from "@/lib/utils/server-utils"

export async function POST(request: NextRequest) {
  try {
    // Verificar permisos
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const image = formData.get("image") as File | null
    const isPublished = formData.get("isPublished") === "true"
    const participantsJson = formData.get("participants") as string
    const participants = participantsJson ? JSON.parse(participantsJson) : []

    if (!title || !description || !date) {
      return NextResponse.json({ error: "Título, descripción y fecha son requeridos" }, { status: 400 })
    }

    // Subir imagen si existe
    let imageUrl = null
    if (image) {
      imageUrl = await uploadFile(image, "activities")
    }

    // Crear actividad
    const result = await sql`
      INSERT INTO activities (
        title, description, date, image_url, is_published
      ) VALUES (
        ${title}, ${description}, ${date}, ${imageUrl}, ${isPublished}
      )
      RETURNING id
    `

    const activityId = result[0].id

    // Agregar participantes si existen
    if (participants && participants.length > 0) {
      for (const participantId of participants) {
        await sql`
          INSERT INTO activity_participants (
            activity_id, council_member_id
          ) VALUES (
            ${activityId}, ${participantId}
          )
        `
      }
    }

    return NextResponse.json({
      success: true,
      id: activityId,
    })
  } catch (error: any) {
    console.error("Error al crear actividad:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
