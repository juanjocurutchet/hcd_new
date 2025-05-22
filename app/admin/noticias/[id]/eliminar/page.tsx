import { getNewsById } from "@/lib/services/news-service"
import { notFound } from "next/navigation"
import EliminarNoticiaForm from "../../components/eliminar-noticia-form"

export default async function EliminarNoticiaPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const noticia = await getNewsById(id)

  if (!noticia) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Eliminar Noticia</h1>
      <EliminarNoticiaForm noticia={noticia} />
    </div>
  )
}
