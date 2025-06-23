"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CouncilMember, PoliticalBlockWithPresident } from "@/actions/council-actions"

interface ConcejalFormProps {
  bloques: PoliticalBlockWithPresident[]
  concejal?: CouncilMember | null
}

export default function ConcejalForm({ concejal, bloques }: ConcejalFormProps) {
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
    const url = concejal?.id ? `/api/council-members/${concejal.id}` : "/api/council-members/create"
    const method = concejal?.id ? "PUT" : "POST"

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(url, {
        method,
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el concejal")
      }

      setSuccess(concejal ? "Concejal actualizado correctamente" : "Concejal creado correctamente")
      router.push("/admin-panel/concejales")
      router.refresh()
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message || "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre *</label>
        <input type="text" id="name" name="name" required defaultValue={concejal?.name || ""}
               className="mt-1 block w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700">Cargo</label>
        <input type="text" id="position" name="position" defaultValue={concejal?.position || ""}
               className="mt-1 block w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label htmlFor="blockId" className="block text-sm font-medium text-gray-700">Bloque Político</label>
        <select id="blockId" name="blockId" defaultValue={concejal?.blockId?.toString() || "-1"}
                className="mt-1 block w-full border rounded-md px-3 py-2">
          <option value="-1">Sin bloque asignado</option>
          {bloques.map((bloque) => (
            <option key={bloque.id} value={bloque.id}>{bloque.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mandate" className="block text-sm font-medium text-gray-700">Mandato</label>
        <input type="text" id="mandate" name="mandate" defaultValue={concejal?.mandate || ""}
               className="mt-1 block w-full border rounded-md px-3 py-2" />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografía</label>
        <textarea id="bio" name="bio" defaultValue={concejal?.bio || ""}
                  className="mt-1 block w-full border rounded-md px-3 py-2" rows={4}></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Foto</label>
        <input type="file" id="image" name="image"
               className="mt-1 block w-full" accept="image/*" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="isActive" name="isActive" defaultChecked={concejal?.isActive ?? true}
               className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Activo</label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => router.back()}
                className="px-4 py-2 border rounded-md bg-white text-gray-700">Cancelar</button>
        <button type="submit" disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
          {isLoading ? "Guardando..." : concejal ? "Actualizar Concejal" : "Crear Concejal"}
        </button>
      </div>
    </form>
  )
}
