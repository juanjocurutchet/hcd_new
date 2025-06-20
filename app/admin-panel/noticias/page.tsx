import { getAllNews } from "@/lib/services/news-service"
import Link from "next/link"
import { format } from "date-fns"

export default async function NoticiasPage() {
  const noticias = await getAllNews()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Link href="/admin-panel/noticias/nueva" className="text-blue-600 hover:underline">
          Crear nueva noticia
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 border rounded-md">
        {noticias.map((noticia) => (
          <li key={noticia.id} className="p-4">
            <Link href={`/admin-panel/noticias/${noticia.id}`} className="font-medium text-lg text-blue-700 hover:underline">
              {noticia.title}
            </Link>
            <p className="text-sm text-gray-500">
              {noticia.excerpt || "Sin resumen"} — Publicada el {format(new Date(noticia.createdAt), "dd/MM/yyyy")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
