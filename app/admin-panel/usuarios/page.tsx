import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

// Función temporal para obtener usuarios (reemplazar con la función real)
async function getAllUsers() {
  return [
    { id: 1, name: "Admin", email: "admin@example.com", role: "admin", isActive: true },
    { id: 2, name: "Editor", email: "editor@example.com", role: "editor", isActive: true },
    { id: 3, name: "Viewer", email: "viewer@example.com", role: "viewer", isActive: false },
  ]
}

export default async function UsuariosPage() {
  const usuarios = await getAllUsers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Link href="/admin-panel/usuarios/nuevo">
          <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo usuario
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
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rol
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{usuario.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{usuario.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usuario.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin-panel/usuarios/${usuario.id}`}
                    className="text-[#0e4c7d] hover:text-[#0a3d68] mr-4"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin-panel/usuarios/${usuario.id}/eliminar`}
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
