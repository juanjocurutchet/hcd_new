"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Noticia = {
  id: number
  title: string
}

export default function EliminarNoticiaForm({ noticia }: { noticia: Noticia }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEliminar = async () => {
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`/api/news/${noticia.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error al eliminar la noticia")
      }

      router.push("/admin/noticias")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-lg">
            ¿Está seguro que desea eliminar la noticia <strong>{noticia.title}</strong>?
          </p>
          <p className="text-gray-500">Esta acción no se puede deshacer.</p>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/noticias")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleEliminar} disabled={isLoading}>
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
