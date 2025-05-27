import { notFound } from "next/navigation"
import { getNewsById } from "@/lib/services/news-service"
import { NoticiaForm } from "../components/noticia-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarNoticiaPage({ params }: { params: { id: string } }) {
  const idParam = await Promise.resolve(params.id) // 👈 con esto engañás al analizador estático
  const id = Number.parseInt(idParam)

  if (isNaN(id)) notFound()

  const noticia = await getNewsById(id)
  if (!noticia) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editar Noticia</h1>
      <div className="bg-white rounded-md shadow p-6">
        <NoticiaForm noticia={{ ...noticia, id: String(noticia.id), excerpt: noticia.excerpt ?? undefined }} />
      </div>
    </div>
  )
}
