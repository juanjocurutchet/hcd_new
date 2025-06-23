"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface EliminarConcejalFormProps {
  concejal: {
    id: number
    name: string
  }
}

export default function EliminarConcejalForm({ concejal }: EliminarConcejalFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/council-members/${concejal.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar el concejal")
      }

      router.push("/admin-panel/concejales")
      router.refresh()
    } catch (err) {
      console.error("Error al eliminar concejal:", err)
      setError("No se pudo eliminar el concejal.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-800">¿Estás seguro de que quieres eliminar este concejal?</h3>
        <p className="mt-2 text-sm text-red-700">
          Esta acción no se puede deshacer. Se eliminará permanentemente el concejal <strong>{concejal.name}</strong> del sistema.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Eliminando..." : "Eliminar Concejal"}
        </Button>
      </div>
    </div>
  )
}
