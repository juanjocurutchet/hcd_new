"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface EliminarNoticiaFormProps {
  noticia: {
    id: number
    title: string
  }
}

export default function EliminarNoticiaForm({ noticia }: EliminarNoticiaFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/news/${noticia.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": session?.user?.id ?? "",
          "x-user-role": session?.user?.role ?? "",
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al eliminar la noticia")
      }

      router.push("/admin-panel/noticias")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error inesperado")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-800">¿Estás seguro de que quieres eliminar esta noticia?</h3>
        <p className="mt-2 text-sm text-red-700">
          Esta acción no se puede deshacer. Se eliminará permanentemente la noticia <strong>{noticia.title}</strong>.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Eliminando..." : "Eliminar Noticia"}
        </Button>
      </div>
    </div>
  )
}
