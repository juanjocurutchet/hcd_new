// app/admin-panel/actividades/page.tsx
import Link from "next/link"
import { format } from "date-fns"
import { getAllActivities } from "@/lib/services/activity-service"

export default async function ActividadesPage() {
  const actividades = await getAllActivities()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Actividades</h1>
        <Link href="/admin-panel/actividades/nueva" className="text-blue-600 hover:underline">
          Agregar actividad
        </Link>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <ul className="divide-y divide-gray-200">
          {actividades.map((actividad) => (
            <li key={actividad.id} className="flex justify-between items-center px-4 py-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-lg">{actividad.title}</div>
                <div className="text-sm text-gray-500">
                  {format(new Date(actividad.date), "dd/MM/yyyy")} — {actividad.isPublished ? "Publicada" : "No publicada"}
                </div>
              </div>

              {/* ✅ Botones de acción */}
              <div className="flex gap-2">
                <Link
                  href={`/admin-panel/actividades/${actividad.id}`}
                  className="text-blue-600 hover:underline"
                  prefetch={false}
                >
                  Editar
                </Link>
                <Link
                  href={`/admin-panel/actividades/${actividad.id}/eliminar`}
                  className="text-red-600 hover:underline"
                  prefetch={false}
                >
                  Eliminar
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {actividades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay actividades creadas aún.</p>
            <Link
              href="/admin-panel/actividades/nueva"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Crear la primera actividad
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}