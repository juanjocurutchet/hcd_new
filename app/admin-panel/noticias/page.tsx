import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getAllNews } from "@/lib/services/news-service"
import { formatDate } from "@/lib/utils/format"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import { News } from "@/types/news"

export default async function NoticiasPage() {
  const noticias = await getAllNews(10, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Noticias</h1>
        <Link href="/admin-panel/noticias/nueva">
          <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva noticia
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Título
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {noticias.map((noticia: News) => (
              <tr key={noticia.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{noticia.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                  {noticia.publishedAt ? formatDate(noticia.publishedAt) : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      noticia.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {noticia.isPublished ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin-panel/noticias/${noticia.id}`}
                    className="text-[#0e4c7d] hover:text-[#0a3d68] mr-4"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin-panel/noticias/${noticia.id}/eliminar`}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
