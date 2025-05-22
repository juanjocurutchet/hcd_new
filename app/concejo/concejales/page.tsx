import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Concejales | HCD Las Flores",
  description: "Concejales del Honorable Concejo Deliberante de Las Flores",
}

export default function ConcejalesPage() {
  const concejales = [
    {
      nombre: "Juan Pérez",
      bloque: "Unión por Las Flores",
      cargo: "Presidente",
      imagen: "/diverse-group.png",
    },
    {
      nombre: "María González",
      bloque: "Juntos por Las Flores",
      cargo: "Vicepresidente 1°",
      imagen: "/diverse-group.png",
    },
    {
      nombre: "Carlos Rodríguez",
      bloque: "Unión por Las Flores",
      cargo: "Concejal",
      imagen: "/diverse-group.png",
    },
    {
      nombre: "Laura Fernández",
      bloque: "Juntos por Las Flores",
      cargo: "Concejal",
      imagen: "/diverse-group.png",
    },
    {
      nombre: "Roberto Gómez",
      bloque: "Frente Renovador",
      cargo: "Concejal",
      imagen: "/diverse-group.png",
    },
    {
      nombre: "Ana Martínez",
      bloque: "Frente Renovador",
      cargo: "Concejal",
      imagen: "/diverse-group.png",
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0e4c7d]">Concejales</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concejales.map((concejal, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={concejal.imagen || "/placeholder.svg"}
                  alt={concejal.nombre}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-1">{concejal.nombre}</h2>
              <p className="text-[#0e4c7d] font-medium mb-1">{concejal.cargo}</p>
              <p className="text-gray-600">{concejal.bloque}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
