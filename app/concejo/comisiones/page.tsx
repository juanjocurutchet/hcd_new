import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Comisiones Internas | Concejo Deliberante de Las Flores",
  description: "Información sobre las comisiones internas del Concejo Deliberante de Las Flores",
}

export default function ComisionesPage() {
  // Estos datos serían obtenidos de la base de datos en una implementación real
  const comisiones = [
    {
      id: 1,
      nombre: "Legislación, Interpretación y Reglamento",
      descripcion:
        "Se encarga de dictaminar sobre todo asunto o proyecto relacionado con normas legales, interpretación de las mismas y reglamentos.",
      presidente: "María González",
      integrantes: ["María González", "Carlos Rodríguez", "Juan Pérez", "Ana López"],
      reuniones: "Lunes 10:00 hs",
    },
    {
      id: 2,
      nombre: "Hacienda y Presupuesto",
      descripcion:
        "Dictamina sobre el presupuesto general de la Municipalidad, impuestos, tasas, derechos, contribuciones y todo otro asunto referente a finanzas.",
      presidente: "Carlos Rodríguez",
      integrantes: ["Carlos Rodríguez", "Laura Martínez", "Pedro Sánchez", "Lucía García"],
      reuniones: "Martes 10:00 hs",
    },
    {
      id: 3,
      nombre: "Obras y Servicios Públicos",
      descripcion:
        "Dictamina sobre todo asunto o proyecto relacionado con obras públicas, transporte, comunicaciones y servicios públicos en general.",
      presidente: "Laura Martínez",
      integrantes: ["Laura Martínez", "Juan Pérez", "Ana López", "Pedro Sánchez"],
      reuniones: "Miércoles 10:00 hs",
    },
    {
      id: 4,
      nombre: "Salud Pública y Acción Social",
      descripcion:
        "Dictamina sobre todo asunto o proyecto relacionado con la salud pública, higiene, moralidad, educación, cultura y asistencia social.",
      presidente: "Juan Pérez",
      integrantes: ["Juan Pérez", "Ana López", "Lucía García", "María González"],
      reuniones: "Jueves 10:00 hs",
    },
    {
      id: 5,
      nombre: "Ecología y Medio Ambiente",
      descripcion:
        "Dictamina sobre todo asunto o proyecto relacionado con la preservación del medio ambiente, recursos naturales y desarrollo sustentable.",
      presidente: "Ana López",
      integrantes: ["Ana López", "Pedro Sánchez", "Lucía García", "Carlos Rodríguez"],
      reuniones: "Viernes 10:00 hs",
    },
  ]

  return (
    <main className="max-w-[1200px] mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-[#0e4c7d] mb-6">Comisiones Internas</h1>

      <p className="mb-8 text-gray-700">
        Las comisiones internas son grupos de trabajo especializados que estudian los proyectos presentados en el
        Concejo Deliberante antes de su tratamiento en el recinto. Cada comisión está integrada por concejales de los
        distintos bloques políticos y se especializa en un área temática específica.
      </p>

      <div className="space-y-6">
        {comisiones.map((comision) => (
          <div
            key={comision.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-xl font-bold text-[#0e4c7d] mb-2">{comision.nombre}</h2>
            <p className="text-gray-700 mb-4">{comision.descripcion}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-[#0a3d68]">Presidente</h3>
                <p>{comision.presidente}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#0a3d68]">Reuniones</h3>
                <p>{comision.reuniones}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-[#0a3d68] mb-2">Integrantes</h3>
              <ul className="list-disc list-inside">
                {comision.integrantes.map((integrante, index) => (
                  <li key={index}>{integrante}</li>
                ))}
              </ul>
            </div>

            <Link
              href={`/concejo/comisiones/${comision.id}`}
              className="mt-4 inline-block bg-[#0e4c7d] text-white py-2 px-4 rounded hover:bg-[#0a3d68] transition-colors"
            >
              Ver proyectos tratados
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
