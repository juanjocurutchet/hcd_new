import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Bloques Políticos | Concejo Deliberante de Las Flores",
  description: "Información sobre los bloques políticos que conforman el Concejo Deliberante de Las Flores",
}

export default function BloquesPage() {
  // Estos datos serían obtenidos de la base de datos en una implementación real
  const bloques = [
    {
      id: 1,
      nombre: "Frente de Todos",
      descripcion: "Bloque oficialista que representa al peronismo y sus aliados.",
      concejales: 6,
      presidente: "María González",
      color: "#2b82d4",
      imagen: "/political-group.png",
    },
    {
      id: 2,
      nombre: "Juntos por el Cambio",
      descripcion: "Principal bloque opositor que representa a la coalición de partidos no peronistas.",
      concejales: 4,
      presidente: "Carlos Rodríguez",
      color: "#ffd700",
      imagen: "/political-group.png",
    },
    {
      id: 3,
      nombre: "Consenso Federal",
      descripcion: "Bloque que representa una alternativa moderada entre oficialismo y oposición.",
      concejales: 2,
      presidente: "Laura Martínez",
      color: "#ff6b6b",
      imagen: "/political-group.png",
    },
  ]

  return (
    <main className="max-w-[1200px] mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#0e4c7d] mb-6">Bloques Políticos</h1>

      <p className="mb-8 text-gray-700">
        El Concejo Deliberante de Las Flores está compuesto por diferentes bloques políticos que representan a los
        partidos y coaliciones que obtuvieron representación en las elecciones. Cada bloque tiene un presidente que
        coordina la actividad legislativa de sus integrantes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bloques.map((bloque) => (
          <div
            key={bloque.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={bloque.imagen || "/placeholder.svg"}
                alt={`Bloque ${bloque.nombre}`}
                fill
                className="object-cover"
              />
              <div
                className="absolute bottom-0 left-0 right-0 py-2 px-4 text-white font-bold"
                style={{ backgroundColor: bloque.color }}
              >
                {bloque.nombre}
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-3">{bloque.descripcion}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Concejales: {bloque.concejales}</span>
                <span>Presidente: {bloque.presidente}</span>
              </div>
              <Link
                href={`/concejo/bloques/${bloque.id}`}
                className="mt-4 inline-block bg-[#0e4c7d] text-white py-2 px-4 rounded hover:bg-[#0a3d68] transition-colors"
              >
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
