import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Función temporal para obtener comisiones (reemplazar con la función real)
async function getAllCommittees() {
  return [
    { id: 1, name: "Hacienda y Presupuesto", description: "Comisión encargada de temas financieros", memberCount: 5 },
    { id: 2, name: "Obras Públicas", description: "Comisión encargada de infraestructura", memberCount: 4 },
    { id: 3, name: "Legislación", description: "Comisión encargada de asuntos legales", memberCount: 6 },
  ]
}

export default async function ComisionesPage() {
  const comisiones = await getAllCommittees()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Comisiones</h1>
        <Link href="/admin-panel/comisiones/nueva">
          <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva comisión
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
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Miembros
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
            {comisiones.map((comision) => (
              <tr key={comision.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{comision.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{comision.description || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{comision.memberCount || 0}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin-panel/comisiones/${comision.id}`}
                    className="text-[#0e4c7d] hover:text-[#0a3d68] mr-4"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin-panel/comisiones/${comision.id}/eliminar`}
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
