import { getAllCouncilMembers } from "@/lib/services/session-service"
import Link from "next/link"

export default async function ConcejalesPage() {
  const concejales = await getAllCouncilMembers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Concejales</h1>
        <Link href="/admin-panel/concejales/nuevo" className="text-blue-600 hover:underline">
          Agregar concejal
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 border rounded-md">
        {concejales.map((c) => (
          <li key={c.id} className="p-4">
            <Link href={`/admin-panel/concejales/${c.id}`} className="font-medium text-lg text-blue-700 hover:underline">
              {c.name} {c.position ? `— ${c.position}` : ""}
            </Link>
            {c.blockName && <p className="text-sm text-gray-500">Bloque: {c.blockName}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
