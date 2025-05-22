import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autoridades | HCD Las Flores",
  description: "Autoridades del Honorable Concejo Deliberante de Las Flores",
}

export default function AutoridadesPage() {
  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0e4c7d]">Autoridades</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Autoridades del Concejo Deliberante</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-b pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-xl font-semibold mb-2">Presidente</h3>
            <p className="text-lg mb-1">Dr. Juan Pérez</p>
            <p className="text-gray-600 mb-4">Bloque Unión por Las Flores</p>
            <p className="text-sm">
              <strong>Contacto:</strong> presidente@hcdlasflores.gob.ar
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Vicepresidente 1°</h3>
            <p className="text-lg mb-1">Lic. María González</p>
            <p className="text-gray-600 mb-4">Bloque Juntos por Las Flores</p>
            <p className="text-sm">
              <strong>Contacto:</strong> vicepresidente@hcdlasflores.gob.ar
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Secretaría</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium mb-2">Secretario Legislativo</h4>
              <p className="mb-1">Dr. Roberto Rodríguez</p>
              <p className="text-sm">
                <strong>Contacto:</strong> secretaria@hcdlasflores.gob.ar
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Prosecretaria Administrativa</h4>
              <p className="mb-1">Sra. Laura Martínez</p>
              <p className="text-sm">
                <strong>Contacto:</strong> prosecretaria@hcdlasflores.gob.ar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
