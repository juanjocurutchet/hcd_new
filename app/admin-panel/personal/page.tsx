import { getAllStaff } from "@/lib/services/staff-service"
import Image from "next/image"
import Link from "next/link"

export default async function PersonalPage() {
  const personal = await getAllStaff()
  // Agrupar por cargo
  const personalPorCargo = personal.reduce<Record<string, typeof personal>>((acc, p) => {
    const cargo = p.position || "Sin cargo"
    if (!acc[cargo]) acc[cargo] = []
    acc[cargo].push(p)
    return acc
  }, {})

  // Mapeo de cargos internos a nombres legibles
  const cargoLegible = (cargo: string) => {
    switch (cargo) {
      case "secretario_hcd":
        return "Secretaria/o H. Concejo Deliberante"
      case "maestranza":
        return "Maestranza"
      case "administrativo":
        return "Administrativo"
      case "secretario_bloque":
        return "Secretario/a de Bloque"
      default:
        return cargo.charAt(0).toUpperCase() + cargo.slice(1)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal H. Concejo Deliberante</h1>
        <Link href="/admin-panel/personal/nuevo" className="text-blue-600 hover:underline">
          Agregar personal
        </Link>
      </div>
      <div className="space-y-6">
        {Object.entries(personalPorCargo).map(([cargo, personas]) => (
          <div key={cargo} className="bg-white border rounded shadow-sm">
            <h2 className="px-4 py-3 font-semibold bg-gray-100 border-b">{cargoLegible(cargo)}</h2>
            <ul>
              {personas.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center px-4 py-3 border-t hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      {p.blockName && (
                        <div className="text-gray-500 text-sm mb-1">{p.blockName}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin-panel/personal/${p.id}`}
                      className="text-blue-600 hover:underline"
                      prefetch={false}
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin-panel/personal/${p.id}/eliminar`}
                      className="text-red-600 hover:underline"
                      prefetch={false}
                    >
                      Eliminar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}