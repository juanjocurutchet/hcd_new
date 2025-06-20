"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  actividad: {
    id: number
    title: string
  }
}

export default function EliminarActividadForm({ actividad }: Props) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await fetch(`/api/actividades/${actividad.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      router.push("/admin-panel/actividades")
    } catch (error) {
      console.error("Error al eliminar actividad:", error)
    }
  }

  return (
    <div className="space-y-4">
      <p>
        ¿Estás seguro de que deseas eliminar la actividad <strong>{actividad.title}</strong>? Esta acción no se puede
        deshacer.
      </p>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
      </div>
    </div>
  )
}
