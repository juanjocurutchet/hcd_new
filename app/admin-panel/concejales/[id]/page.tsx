import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getAllCouncilMembers } from "@/actions/council-actions"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default async function ConcejalesPage() {
  const concejales = await getAllCouncilMembers()

  console.log("Concejales en la página:", concejales)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Concejales</h1>
        <Link href="/admin-panel/concejales/nuevo">
          <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo concejal
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        {concejales.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No hay concejales registrados.</p>
            <Link href="/admin-panel/concejales/nuevo" className="text-[#0e4c7d] hover:underline mt-2 inline-block">
              Crear el primer concejal
            </Link>
          </div>
        ) : (
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
                  Bloque
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cargo
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
              {concejales.map((concejal: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; blockName: any; position: any; isActive: any }) => (
                <tr key={concejal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{concejal.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{concejal.blockName || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{concejal.position || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        concejal.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {concejal.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin-panel/concejales/${concejal.id}`}
                      className="text-[#0e4c7d] hover:text-[#0a3d68] mr-4"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin-panel/concejales/${concejal.id}/eliminar`}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
