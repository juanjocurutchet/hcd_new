import { type NextRequest, NextResponse } from "next/server"
import { createDocument } from "@/lib/services/document-service"
import { isAdmin } from "@/lib/utils/server-utils"

export async function POST(request: NextRequest) {
  try {
    // Verificar permisos
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()

    const title = formData.get("title") as string
    const number = formData.get("number") as string | null
    const type = formData.get("type") as "ordenanza" | "decreto" | "resolucion" | "comunicacion"
    const content = formData.get("content") as string | null
    const file = formData.get("file") as File | null
    const authorId = Number.parseInt(formData.get("authorId") as string)
    const isPublished = formData.get("isPublished") === "true"
    const publishedAtStr = formData.get("publishedAt") as string | null
    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : new Date()

    if (!title || !type || isNaN(authorId)) {
      return NextResponse.json({ error: "Título, tipo y autor son requeridos" }, { status: 400 })
    }

    const result = await createDocument({
      title,
      number: number || undefined,
      type,
      content: content || undefined,
      file,
      authorId,
      isPublished,
      publishedAt,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error al crear documento:", error)
    return NextResponse.json({ error: error.message || "Error al crear el documento" }, { status: 500 })
  }
}
