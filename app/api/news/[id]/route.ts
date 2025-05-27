import { type NextRequest, NextResponse } from "next/server"
import { getNewsById, updateNews, deleteNews } from "@/lib/services/news-service"
import { isAdmin } from "@/lib/utils/server-utils"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const id = Number.parseInt(context.params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const news = await getNewsById(id)

    if (!news) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error) {
    console.error(`Error obteniendo noticia con id ${context.params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const id = Number.parseInt(context.params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string | null
    const image = formData.get("image") as File | null
    const isPublished = formData.get("isPublished") === "true"

    const result = await updateNews({
      id,
      title,
      content,
      excerpt: excerpt || undefined,
      image,
      isPublished,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error(`Error actualizando noticia con id ${context.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const id = Number.parseInt(context.params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    await deleteNews(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error eliminando noticia con id ${context.params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
