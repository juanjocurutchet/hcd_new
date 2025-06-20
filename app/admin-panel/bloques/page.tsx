import { getAllPoliticalBlocks } from "@/lib/services/session-service"
import Link from "next/link"

export default async function BloquesPage() {
  const bloques = await getAllPoliticalBlocks()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bloques Políticos</h1>
        <Link href="/admin-panel/bloques/nuevo" className="text-blue-600 hover:underline">
          Agregar bloque
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 border rounded-md">
        {bloques.map((bloque) => (
          <li key={bloque.id} className="p-4">
            <Link href={`/admin-panel/bloques/${bloque.id}`} className="font-medium text-lg text-blue-700 hover:underline">
              {bloque.name}
            </Link>
            <p className="text-sm text-gray-500">
              Miembros activos: {bloque.memberCount}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
