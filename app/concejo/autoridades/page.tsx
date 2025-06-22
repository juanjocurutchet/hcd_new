import type { Metadata } from "next"
import { getAuthorities } from "@/actions/council-actions"

export const metadata: Metadata = {
  title: "Autoridades | HCD Las Flores",
  description: "Autoridades del Honorable Concejo Deliberante de Las Flores",
}

type Autoridad = {
  id: number
  name: string
  position: string | null
  email: string | null
  blockName: string | null
}

export default async function AutoridadesPage() {
  const autoridades: Autoridad[] = await getAuthorities()

  const findByPosition = (position: string) =>
    autoridades.find((a) => a.position?.toLowerCase() === position.toLowerCase())

  const presidente = findByPosition("Presidente")
  const vicepresidente = findByPosition("Vicepresidente 1°")
  const secretario = findByPosition("Secretario Legislativo")
  const prosecretaria = findByPosition("Prosecretaria Administrativa")

  return (
    <div className="max-w-[1200px] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#0e4c7d]">Autoridades</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#0e4c7d]">Autoridades del Concejo Deliberante</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {presidente && (
            <div className="border-b pb-4 md:border-b-0 md:border-r md:pr-4">
              <h3 className="text-xl font-semibold mb-2">Presidente</h3>
              <p className="text-lg mb-1">{presidente.name}</p>
              <p className="text-gray-600 mb-4">{presidente.blockName ?? "Sin bloque"}</p>
              <p className="text-sm">
                <strong>Contacto:</strong> {presidente.email ?? "No disponible"}
              </p>
            </div>
          )}

          {vicepresidente && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Vicepresidente 1°</h3>
              <p className="text-lg mb-1">{vicepresidente.name}</p>
              <p className="text-gray-600 mb-4">{vicepresidente.blockName ?? "Sin bloque"}</p>
              <p className="text-sm">
                <strong>Contacto:</strong> {vicepresidente.email ?? "No disponible"}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Secretaría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {secretario && (
              <div>
                <h4 className="text-lg font-medium mb-2">Secretario Legislativo</h4>
                <p className="mb-1">{secretario.name}</p>
                <p className="text-sm">
                  <strong>Contacto:</strong> {secretario.email ?? "No disponible"}
                </p>
              </div>
            )}

            {prosecretaria && (
              <div>
                <h4 className="text-lg font-medium mb-2">Prosecretaria Administrativa</h4>
                <p className="mb-1">{prosecretaria.name}</p>
                <p className="text-sm">
                  <strong>Contacto:</strong> {prosecretaria.email ?? "No disponible"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
