import type { Metadata } from "next"
import Image from "next/image"
import { getActiveCouncilMembersByBlock } from "@/actions/council-actions"

export const metadata: Metadata = {
  title: "Concejales | HCD Las Flores",
  description: "Listado de concejales del Honorable Concejo Deliberante de Las Flores",
}

type Concejal = {
  id: number
  name: string
  position: string | null
  imageUrl: string | null
  bio: string | null
  mandate: string | null
  blockId: number | null
  blockName: string | null
  blockColor: string | null
}

export default async function ConcejalesPage() {
  const concejales: Concejal[] = await getActiveCouncilMembersByBlock()

  const bloques = Array.from(
    concejales.reduce((map, concejal) => {
      const bloque = concejal.blockName ?? "Sin bloque"
      if (!map.has(bloque)) map.set(bloque, [])
      map.get(bloque)?.push(concejal)
      return map
    }, new Map<string, Concejal[]>())
  )

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0e4c7d]">Concejales</h1>

      {bloques.map(([bloque, miembros]) => (
        <div key={bloque} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-[#0e4c7d]">{bloque}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {miembros.map((concejal) => (
              <div
                key={concejal.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
              >
                {concejal.imageUrl && (
                  <Image
                    src={concejal.imageUrl}
                    alt={concejal.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-3 object-cover"
                  />
                )}

                <h3 className="text-lg font-semibold">{concejal.name}</h3>
                {concejal.position && <p className="text-sm text-gray-600">{concejal.position}</p>}
                {concejal.mandate && <p className="text-xs text-gray-500 mb-2">Mandato: {concejal.mandate}</p>}
                {concejal.bio && <p className="text-sm mt-2 text-gray-700">{concejal.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
