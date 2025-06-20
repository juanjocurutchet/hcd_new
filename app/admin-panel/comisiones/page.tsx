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

      <ul className="divide-y divide-gray-200 border rounded-md">
        {comisiones.map((comision) => (
          <li key={comision.id} className="p-4">
            <Link
              href={`/admin-panel/comisiones/${comision.id}`}
              className="font-medium text-lg text-blue-700 hover:underline"
            >
              {comision.name}
            </Link>
            <p className="text-sm text-gray-500">{comision.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
