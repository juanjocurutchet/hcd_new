"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

type Noticia = {
  id: number
  title: string
  content: string
  excerpt?: string | null
  imageUrl?: string | null
  isPublished: boolean
}

export default function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    title: noticia?.title || "",
    content: noticia?.content || "",
    excerpt: noticia?.excerpt || "",
    isPublished: noticia?.isPublished ?? true,
  })

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(noticia?.imageUrl || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("content", formData.content)
      formDataToSend.append("excerpt", formData.excerpt || "")
      formDataToSend.append("isPublished", formData.isPublished.toString())

      if (image) {
        formDataToSend.append("image", image)
      }

      if (noticia) {
        // Actualizar noticia existente
        const res = await fetch(`/api/news/${noticia.id}`, {
          method: "PUT",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.jwt}`,
          },
        })

        if (!res.ok) {
          throw new Error("Error al actualizar la noticia")
        }

        setSuccess("Noticia actualizada correctamente")
      } else {
        // Crear nueva noticia
        formDataToSend.append("authorId", (session?.user as any)?.id.toString())

        const res = await fetch("/api/news/create", {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${(session?.user as any)?.jwt}`,
          },
        })

        if (!res.ok) {
          throw new Error("Error al crear la noticia")
        }

        router.push("/admin/noticias")
      }
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

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extracto (opcional)</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Si no se proporciona, se generará automáticamente a partir del contenido.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />

            {previewUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Vista previa"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
            />
            <Label htmlFor="isPublished">Publicar</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/noticias")} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
              {isLoading ? "Guardando..." : noticia ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
