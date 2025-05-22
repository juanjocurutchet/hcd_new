import { Button } from "@/components/ui/button"
import { Download, Play } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Audios | HCD Las Flores",
  description: "Audios de las sesiones del Honorable Concejo Deliberante de Las Flores",
}

export default function AudiosPage() {
  // Datos de ejemplo para audios
  const audios = [
    {
      id: 1,
      fecha: "2025-05-16",
      titulo: "Audio - Sesión Ordinaria",
      duracion: "2:15:30",
      archivo: "#",
    },
    {
      id: 2,
      fecha: "2025-05-02",
      titulo: "Audio - Sesión Ordinaria",
      duracion: "1:45:20",
      archivo: "#",
    },
    {
      id: 3,
      fecha: "2025-04-18",
      titulo: "Audio - Sesión Ordinaria",
      duracion: "2:30:15",
      archivo: "#",
    },
    {
      id: 4,
      fecha: "2025-04-04",
      titulo: "Audio - Sesión Ordinaria",
      duracion: "1:55:40",
      archivo: "#",
    },
    {
      id: 5,
      fecha: "2025-03-21",
      titulo: "Audio - Sesión Extraordinaria",
      duracion: "3:10:05",
      archivo: "#",
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audios de sesiones</h1>
        <Link href="/sesiones">
          <Button variant="outline">Volver a Sesiones</Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <p>
              Aquí puede acceder a los audios completos de las sesiones del Honorable Concejo Deliberante. Puede
              escucharlos en línea o descargarlos para su posterior consulta.
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Audios 2025</h2>
            <select className="p-2 border border-gray-300 rounded-md">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div className="border-t border-gray-200">
            {audios.map((audio) => (
              <div key={audio.id} className="py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">
                      {new Date(audio.fecha).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-medium">{audio.titulo}</h3>
                    <p className="text-sm text-gray-500">Duración: {audio.duracion}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={audio.archivo} className="inline-flex items-center text-[#0e4c7d] hover:underline">
                      <Play className="h-4 w-4 mr-1" />
                      Escuchar
                    </Link>
                    <Link href={audio.archivo} className="inline-flex items-center text-[#0e4c7d] hover:underline">
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
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
