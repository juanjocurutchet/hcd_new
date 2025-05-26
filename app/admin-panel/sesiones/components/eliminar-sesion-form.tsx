"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils/format"

interface EliminarSesionFormProps {
  sesion: {
    id: number
    date: string | Date
    type: string
  }
}

export default function EliminarSesionForm({ sesion }: EliminarSesionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/sessions/${sesion.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la sesión")
      }

      router.push("/admin-panel/sesiones")
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-800 mb-2">Confirmar eliminación</h3>
        <p className="text-red-700">Estás a punto de eliminar la siguiente sesión:</p>
        <div className="mt-4 p-4 bg-white rounded border">
          <p>
            <strong>Fecha:</strong> {formatDate(sesion.date)}
          </p>
          <p>
            <strong>Tipo:</strong> {sesion.type.charAt(0).toUpperCase() + sesion.type.slice(1)}
          </p>
        </div>
        <p className="text-red-700 mt-4">
          Esta acción no se puede deshacer. Todos los archivos asociados también serán eliminados.
        </p>
      </div>

      <div className="flex space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Eliminando..." : "Eliminar sesión"}
        </Button>
      </div>
    </div>
  )
}
