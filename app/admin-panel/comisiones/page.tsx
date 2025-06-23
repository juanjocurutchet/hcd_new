// app/admin-panel/comisiones/page.tsx
import { getAllCommissions } from "@/lib/services/commission-service"
import Link from "next/link"

export default async function ComisionesPage() {
  const comisiones = await getAllCommissions()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comisiones</h1>
        <Link href="/admin-panel/comisiones/nueva" className="text-blue-600 hover:underline">
          Agregar comisión
        </Link>
      </div>

      <div className="bg-white border rounded shadow-sm">
        <ul className="divide-y divide-gray-200">
          {comisiones.map((comision) => (
            <li key={comision.id} className="flex justify-between items-center px-4 py-4 hover:bg-gray-50">
              <div className="flex-1">
                <div className="font-medium text-lg">{comision.name}</div>
                <div className="text-sm text-gray-500">{comision.description}</div>
                {comision.presidentName && (
                  <div className="text-xs text-gray-400 mt-1">
                    Presidente: {comision.presidentName}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/admin-panel/comisiones/${comision.id}`}
                  className="text-blue-600 hover:underline"
                  prefetch={false}
                >
                  Editar
                </Link>
                <Link
                  href={`/admin-panel/comisiones/${comision.id}/eliminar`}
                  className="text-red-600 hover:underline"
                  prefetch={false}
                >
                  Eliminar
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {comisiones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay comisiones creadas aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}