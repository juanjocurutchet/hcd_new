"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDateTime } from "@/lib/utils/format"
import { Mail, ArrowLeft, Trash2 } from "lucide-react"

type ContactMessage = {
  id: number
  name: string
  email: string
  phone: string | null
  organization: string | null
  subject: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export default function MensajeDetallePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [mensaje, setMensaje] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMensaje = async () => {
      try {
        const response = await fetch(`/api/admin/contact/${params.id}`, {
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.jwt}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar el mensaje")
        }

        const data = await response.json()
        setMensaje(data)

        // Marcar como leído si no lo está
        if (!data.is_read) {
          await fetch(`/api/admin/contact/${params.id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${(session?.user as any)?.jwt}`,
            },
          })
        }
      } catch (error: any) {
        setError(error.message || "Error al cargar el mensaje")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchMensaje()
    }
  }, [params.id, session])

  const handleDelete = async () => {
    if (!confirm("¿Está seguro que desea eliminar este mensaje?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/contact/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el mensaje")
      }

      router.push("/admin/mensajes")
    } catch (error: any) {
      setError(error.message || "Error al eliminar el mensaje")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando mensaje...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin/mensajes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Error</h1>
        </div>

        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!mensaje) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin/mensajes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Mensaje no encontrado</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin/mensajes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Detalle del Mensaje</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{mensaje.subject}</h2>
                <p className="text-gray-500">
                  Recibido el {formatDateTime(mensaje.created_at)} - Tipo: {mensaje.type || "Contacto"}
                </p>
              </div>
              <Button variant="outline" onClick={() => (window.location.href = `mailto:${mensaje.email}`)}>
                <Mail className="mr-2 h-4 w-4" />
                Responder
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Remitente</p>
                <p className="font-medium">{mensaje.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="font-medium">{mensaje.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="font-medium">{mensaje.phone || "No proporcionado"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Organización</p>
                <p className="font-medium">{mensaje.organization || "No proporcionada"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Mensaje</p>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{mensaje.message}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
