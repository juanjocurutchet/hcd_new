"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PoliticalBlock, CouncilMember } from "@/actions/council-actions"

interface BloqueFormProps {
  bloque?: PoliticalBlock | null
  concejales: CouncilMember[]
}

export default function BloqueForm({ bloque, concejales }: BloqueFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)

    try {
      const url = bloque ? `/api/political-blocks/${bloque.id}` : "/api/political-blocks/create"

      const method = bloque ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el bloque")
      }

      setSuccess(bloque ? "Bloque actualizado correctamente" : "Bloque creado correctamente")

      if (!bloque) {
        router.push("/admin-panel/bloques")
      }
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
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
          defaultValue={bloque?.president_id?.toString() || "-1"}
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
