import { type NextRequest, NextResponse } from "next/server"
import { getNewsById, updateNews, deleteNews } from "@/lib/services/news-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const noticia = await getNewsById(id)
    if (!noticia) return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 })

    return NextResponse.json(noticia)
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const role = request.headers.get("x-user-role")
    console.log("PUT x-user-role:", role)
    if (role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 403 })

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
    console.error("PUT error:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const role = request.headers.get("x-user-role")
  if (role !== "admin") return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  try {
    await deleteNews(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
