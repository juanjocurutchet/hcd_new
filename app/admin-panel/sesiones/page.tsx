import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getSessions, Session } from "@/lib/services/session-service"
import { formatDate } from "@/lib/utils/format"
import { Key } from "react"

export default async function SesionesPage() {
  const sesiones = await getSessions()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sesiones</h1>
        <Link href="/admin-panel/sesiones/nueva">
          <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva sesión
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
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Archivos
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
          {sesiones.map((sesion: Session) => (
              <tr key={sesion.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sesion.date ? formatDate(sesion.date) : "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {sesion.type.charAt(0).toUpperCase() + sesion.type.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {sesion.agendaFileUrl || sesion.minutesFileUrl || sesion.audioFileUrl ? "Sí" : "No"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sesion.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {sesion.isPublished ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin-panel/sesiones/${sesion.id}`}
                    className="text-[#0e4c7d] hover:text-[#0a3d68] mr-4"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin-panel/sesiones/${sesion.id}/eliminar`}
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
