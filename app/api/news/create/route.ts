import { type NextRequest, NextResponse } from "next/server"
import { createNews } from "@/lib/services/news-service"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const excerpt = formData.get("excerpt") as string | null
    const image = formData.get("image") as File | null
    const authorId = Number.parseInt(formData.get("authorId") as string)
    const isPublished = formData.get("isPublished") === "true"

    if (!title || !content || isNaN(authorId)) {
      return NextResponse.json({ error: "Título, contenido y autor son requeridos" }, { status: 400 })
    }

    const result = await createNews({
      title,
      content,
      excerpt: excerpt || undefined,
      image,
      authorId,
      isPublished,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear la noticia" }, { status: 500 })
  }
}
