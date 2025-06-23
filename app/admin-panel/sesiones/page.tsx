import { getSessions } from "@/lib/services/session-service"
import { formatDate } from "@/lib/utils/format" // ✅ Usar tu función existente
import Link from "next/link"

export default async function SesionesPage() {
  const sesiones = await getSessions()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sesiones</h1>
        <Link href="/admin-panel/sesiones/nueva" className="text-blue-600 hover:underline">
          Agregar sesión
        </Link>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <ul className="divide-y divide-gray-200">
          {sesiones.map((sesion) => (
            <li key={sesion.id} className="flex justify-between items-center px-4 py-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-lg">
                  {formatDate(sesion.date)} — {sesion.type}
                </div>
                <div className="text-sm text-gray-500">
                  {sesion.isPublished ? "Publicada" : "No publicada"}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin-panel/sesiones/${sesion.id}`}
                  className="text-blue-600 hover:underline"
                  prefetch={false}
                >
                  Editar
                </Link>
                <Link
                  href={`/admin-panel/sesiones/${sesion.id}/eliminar`}
                  className="text-red-600 hover:underline"
                  prefetch={false}
                >
                  Eliminar
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {sesiones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay sesiones creadas aún.</p>
            <Link
              href="/admin-panel/sesiones/nueva"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Crear la primera sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}