import { type NextRequest, NextResponse } from "next/server"
import { getDocumentById, updateDocument, deleteDocument } from "@/lib/services/document-service"
import { isAdmin } from "@/lib/utils/server-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const document = await getDocumentById(id)

    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error(`Error obteniendo documento con id ${params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

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
    const publishedAtStr = formData.get("publishedAt") as string | null
    const isPublished = formData.get("isPublished") === "true"

    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined

    const result = await updateDocument({
      id,
      title,
      number: number || undefined,
      type,
      content: content || undefined,
      file,
      publishedAt,
      isPublished,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error(`Error actualizando documento con id ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Verificar permisos
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await deleteDocument(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error eliminando documento con id ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
