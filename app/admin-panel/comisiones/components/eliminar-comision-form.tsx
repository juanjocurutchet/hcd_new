"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props {
  comision: {
    id: number
    name: string
  }
}

export default function EliminarComisionForm({ comision }: Props) {
  const router = useRouter()

  const handleDelete = async () => {
    try {
      await fetch(`/api/comisiones/${comision.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      router.push("/admin-panel/comisiones")
    } catch (error) {
      console.error("Error eliminando comisión:", error)
    }
  }

  return (
    <div className="space-y-4">
      <p>
        ¿Estás seguro de que deseas eliminar la comisión <strong>{comision.name}</strong>? Esta acción no se puede
        deshacer.
      </p>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
        <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
      </div>
    </div>
  )
}
