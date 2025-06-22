// app/admin-panel/bloques/page.tsx

import Link from "next/link"
import Image from "next/image"
import { getAllPoliticalBlocksWithPresident } from "@/actions/council-actions"

export default async function BloquesListPage() {
  const bloques = await getAllPoliticalBlocksWithPresident()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bloques</h1>
        <Link
          href="/admin-panel/bloques/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Crear nuevo bloque
        </Link>
      </div>

      <ul className="space-y-4">
        {bloques.map((bloque) => (
          <li
            key={bloque.id}
            className="flex justify-between items-center p-4 bg-white shadow rounded border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div
                className="w-2 h-10 rounded bg-gray-300"
                style={{ backgroundColor: bloque.color || "#ccc" }}
              />
              <div>
                <p className="text-lg font-semibold">{bloque.name}</p>
                <p className="text-sm text-gray-500">
                  Miembros activos: {bloque.memberCount}
                </p>

                {bloque.president ? (
                  <div className="flex items-center space-x-2 mt-1">
                    {bloque.president.imageUrl && (
                      <Image
                        src={bloque.president.imageUrl}
                        alt={bloque.president.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <p className="text-sm text-gray-700">{bloque.president.name}</p>
                      <p className="text-xs text-gray-500">{bloque.president.position}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mt-1">Sin presidente asignado</p>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <Link
                href={`/admin-panel/bloques/${bloque.id}`}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Editar
              </Link>
              <Link
                href={`/admin-panel/bloques/${bloque.id}/eliminar`}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Eliminar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
