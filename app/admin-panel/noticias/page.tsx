// app/admin-panel/noticias/page.tsx
import Link from "next/link"
import { format } from "date-fns"
import { getAllNews } from "@/lib/services/news-service"

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

      <div className="bg-white border rounded shadow-sm">
        <ul className="divide-y divide-gray-200">
          {noticias.map((noticia) => (
            <li key={noticia.id} className="flex justify-between items-center px-4 py-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-lg">{noticia.title}</div>
                <div className="text-sm text-gray-500">
                  {noticia.excerpt || "Sin resumen"} — {noticia.isPublished ? "Publicada" : "No publicada"} el {format(new Date(noticia.createdAt), "dd/MM/yyyy")}
                </div>
              </div>

              {/* ✅ Botones de acción (igual que en actividades) */}
              <div className="flex gap-2">
                <Link
                  href={`/admin-panel/noticias/${noticia.id}`}
                  className="text-blue-600 hover:underline"
                  prefetch={false}
                >
                  Editar
                </Link>
                <Link
                  href={`/admin-panel/noticias/${noticia.id}/eliminar`}
                  className="text-red-600 hover:underline"
                  prefetch={false}
                >
                  Eliminar
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {noticias.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay noticias creadas aún.</p>
            <Link
              href="/admin-panel/noticias/nueva"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Crear la primera noticia
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}