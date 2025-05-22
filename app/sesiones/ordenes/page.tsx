import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Órdenes del día | HCD Las Flores",
  description: "Órdenes del día de las sesiones del Honorable Concejo Deliberante de Las Flores",
}

export default function OrdenesPage() {
  // Datos de ejemplo para órdenes del día
  const ordenes = [
    {
      id: 1,
      fecha: "2025-05-16",
      titulo: "Orden del día - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 2,
      fecha: "2025-05-02",
      titulo: "Orden del día - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 3,
      fecha: "2025-04-18",
      titulo: "Orden del día - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 4,
      fecha: "2025-04-04",
      titulo: "Orden del día - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 5,
      fecha: "2025-03-21",
      titulo: "Orden del día - Sesión Extraordinaria",
      archivo: "#",
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Órdenes del día</h1>
        <Link href="/sesiones">
          <Button variant="outline">Volver a Sesiones</Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <p>
              Las órdenes del día contienen los asuntos a tratar en cada sesión del Honorable Concejo Deliberante. Aquí
              puede consultar y descargar las órdenes del día de las sesiones realizadas.
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Órdenes del día 2025</h2>
            <select className="p-2 border border-gray-300 rounded-md">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="border-t border-gray-200">
            {ordenes.map((orden) => (
              <div key={orden.id} className="py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">
                      {new Date(orden.fecha).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-medium">{orden.titulo}</h3>
                  </div>
                  <div>
                    <Link href={orden.archivo} className="inline-flex items-center text-[#0e4c7d] hover:underline">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar PDF
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
