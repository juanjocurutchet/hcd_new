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

    const name = formData.get("name") as string
    const position = formData.get("position") as string | null
    const blockId = formData.get("blockId") ? Number.parseInt(formData.get("blockId") as string) : null
    const mandate = formData.get("mandate") as string | null
    const bio = formData.get("bio") as string | null
    const image = formData.get("image") as File | null
    const isActive = formData.get("isActive") === "true"

    if (!name) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Subir imagen si existe
    let imageUrl = null
    if (image) {
      imageUrl = await uploadFile(image, "council-members")
    }

    // Crear concejal
    const result = await sql`
      INSERT INTO council_members (
        name, position, block_id, mandate, image_url, bio, is_active
      ) VALUES (
        ${name}, ${position}, ${blockId}, ${mandate}, ${imageUrl}, ${bio}, ${isActive}
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      id: result[0].id,
    })
  } catch (error: any) {
    console.error("Error al crear concejal:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
