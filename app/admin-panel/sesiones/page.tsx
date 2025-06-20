import { getSessions } from "@/lib/services/session-service"
import Link from "next/link"
import { format } from "date-fns"

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

      <ul className="divide-y divide-gray-200 border rounded-md">
        {sesiones.map((sesion) => (
          <li key={sesion.id} className="p-4">
            <Link
              href={`/admin-panel/sesiones/${sesion.id}`}
              className="font-medium text-lg text-blue-700 hover:underline"
            >
              {format(new Date(sesion.date), "dd/MM/yyyy")} — {sesion.type}
            </Link>
            <p className="text-sm text-gray-500">
              {sesion.isPublished ? "Publicada" : "No publicada"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
