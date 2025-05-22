import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Actas | HCD Las Flores",
  description: "Actas de las sesiones del Honorable Concejo Deliberante de Las Flores",
}

export default function ActasPage() {
  // Datos de ejemplo para actas
  const actas = [
    {
      id: 1,
      fecha: "2025-05-16",
      titulo: "Acta - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 2,
      fecha: "2025-05-02",
      titulo: "Acta - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 3,
      fecha: "2025-04-18",
      titulo: "Acta - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 4,
      fecha: "2025-04-04",
      titulo: "Acta - Sesión Ordinaria",
      archivo: "#",
    },
    {
      id: 5,
      fecha: "2025-03-21",
      titulo: "Acta - Sesión Extraordinaria",
      archivo: "#",
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Actas de sesiones</h1>
        <Link href="/sesiones">
          <Button variant="outline">Volver a Sesiones</Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <p>
              Las actas contienen el registro detallado de lo tratado y resuelto en cada sesión del Honorable Concejo
              Deliberante. Aquí puede consultar y descargar las actas de las sesiones realizadas.
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Actas 2025</h2>
            <select className="p-2 border border-gray-300 rounded-md">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="border-t border-gray-200">
            {actas.map((acta) => (
              <div key={acta.id} className="py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">
                      {new Date(acta.fecha).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-medium">{acta.titulo}</h3>
                  </div>
                  <div>
                    <Link href={acta.archivo} className="inline-flex items-center text-[#0e4c7d] hover:underline">
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
