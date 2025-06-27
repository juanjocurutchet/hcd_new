"use client"

import type { CouncilMember } from "@/actions/council-actions"
import { useApiRequest } from "@/hooks/useApiRequest"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface BloqueFormProps {
  bloque?: {
    id: number
    name: string
    color: string | null
    president: CouncilMember | null
  } | null
  concejales: CouncilMember[]
  miembrosActuales?: CouncilMember[]
}

export default function BloqueForm({ bloque, concejales, miembrosActuales = [] }: BloqueFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [miembrosSeleccionados, setMiembrosSeleccionados] = useState<number[]>([])
  const router = useRouter()
  const { apiRequest, isAuthenticated } = useApiRequest()

  // Memoizar los concejales disponibles para evitar recálculos innecesarios
  const concejalesDisponibles = useMemo(() => {
    return concejales.filter(concejal => concejal.isActive)
  }, [concejales])

  // Inicializar miembros seleccionados solo una vez
  useEffect(() => {
    if (bloque && miembrosActuales.length > 0) {
      const ids = miembrosActuales.map(m => m.id)
      setMiembrosSeleccionados(ids)
    }
  }, [bloque?.id, miembrosActuales.length]) // Solo dependencias estables

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError("No hay sesión activa")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)

    // Agregar los miembros seleccionados al FormData
    formData.append("miembros", JSON.stringify(miembrosSeleccionados))

    try {
      const url = bloque ? `/api/political-blocks/${bloque.id}` : "/api/political-blocks/create"
      const method = bloque ? "PUT" : "POST"

      await apiRequest(url, {
        method,
        body: formData,
        headers: {}
      })

      setSuccess(bloque ? "Bloque actualizado correctamente" : "Bloque creado correctamente")

      if (!bloque) {
        router.push("/admin-panel/bloques")
      }
      router.refresh()
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message || "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const agregarConcejal = (concejalId: number) => {
    if (!miembrosSeleccionados.includes(concejalId)) {
      setMiembrosSeleccionados(prev => [...prev, concejalId])
    }
  }

  const quitarConcejal = (concejalId: number) => {
    setMiembrosSeleccionados(prev => prev.filter(id => id !== concejalId))
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-600">No autorizado. Por favor, inicia sesión.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Bloque *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={bloque?.name || ""}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="presidentId" className="block text-sm font-medium text-gray-700">
          Presidente del Bloque
        </label>
        <select
          id="presidentId"
          name="presidentId"
          defaultValue={bloque?.president?.id?.toString() || "-1"}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="-1">Sin presidente asignado</option>
          {concejales.map((concejal) => (
            <option key={concejal.id} value={concejal.id.toString()}>
              {concejal.name} - {concejal.position || "Concejal"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color del Bloque
        </label>
        <input
          type="color"
          id="color"
          name="color"
          defaultValue={bloque?.color || "#3B82F6"}
          className="mt-1 block w-20 h-10 border border-gray-300 rounded-md"
        />
      </div>

      {/* Sección de gestión de miembros */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Miembros del Bloque</h3>

        {/* Miembros actuales */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Miembros actuales:</h4>
          <div className="space-y-2">
            {concejalesDisponibles
              .filter(concejal => miembrosSeleccionados.includes(concejal.id))
              .map((concejal) => (
                <div key={concejal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">{concejal.name} - {concejal.position || "Concejal"}</span>
                  <button
                    type="button"
                    onClick={() => quitarConcejal(concejal.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            {concejalesDisponibles.filter(concejal => miembrosSeleccionados.includes(concejal.id)).length === 0 && (
              <p className="text-sm text-gray-500">No hay miembros asignados</p>
            )}
          </div>
        </div>

        {/* Agregar nuevos miembros */}
        <div>
          <label htmlFor="miembrosSelect" className="block text-sm font-medium text-gray-700 mb-2">
            Agregar miembros:
          </label>
          <select
            id="miembrosSelect"
            multiple
            size={5}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value))
              selectedOptions.forEach(id => {
                if (!miembrosSeleccionados.includes(id)) {
                  agregarConcejal(id)
                }
              })
              // Limpiar selección
              e.target.selectedIndex = -1
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {concejalesDisponibles
              .filter(concejal => !miembrosSeleccionados.includes(concejal.id))
              .map((concejal) => (
                <option key={concejal.id} value={concejal.id}>
                  {concejal.name} - {concejal.position || "Concejal"}
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples concejales
          </p>
          {concejalesDisponibles.filter(concejal => !miembrosSeleccionados.includes(concejal.id)).length === 0 && (
            <p className="text-sm text-gray-500 mt-2">Todos los concejales disponibles ya están en el bloque</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : bloque ? "Actualizar Bloque" : "Crear Bloque"}
        </button>
      </div>
    </form>
  )
}