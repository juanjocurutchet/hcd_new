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

      <ul className="divide-y divide-gray-200 border rounded-md">
        {actividades.map((act) => (
          <li key={act.id} className="p-4">
            <Link href={`/admin-panel/actividades/${act.id}`} className="font-medium text-lg text-blue-700 hover:underline">
              {act.title}
            </Link>
            <p className="text-sm text-gray-500">
              {format(new Date(act.date), "dd/MM/yyyy")} — {act.isPublished ? "Publicada" : "No publicada"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
