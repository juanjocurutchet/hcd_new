"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteNews } from "@/actions/news-actions"

interface EliminarNoticiaFormProps {
  noticia: {
    id: number
    title: string
  }
}

export default function EliminarNoticiaForm({ noticia }: EliminarNoticiaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteNews(noticia.id)
      router.push("/admin-panel/noticias")
    } catch (error) {
      console.error("Error al eliminar noticia:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-lg font-medium text-red-800">¿Estás seguro de que quieres eliminar esta noticia?</h3>
        <p className="mt-2 text-sm text-red-700">
          Esta acción no se puede deshacer. Se eliminará permanentemente la noticia <strong>{noticia.title}</strong> del
          sistema.
        </p>
      </div>

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
