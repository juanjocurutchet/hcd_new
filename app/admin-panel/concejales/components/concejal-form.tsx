"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CouncilMember } from "@/actions/council-actions"

export function ConcejalForm({ concejal = null }: { concejal?: CouncilMember | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [bloques, setBloques] = useState<{ id: number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: concejal?.name || "",
    position: concejal?.position || "",
    blockId: concejal?.block_id?.toString() || "",
    mandate: concejal?.mandate || "",
    bio: concejal?.bio || "",
    isActive: concejal?.isActive ?? true,
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(concejal?.image_url || null)

  useEffect(() => {
    const fetchBloques = async () => {
      try {
        const response = await fetch("/api/political-blocks")
        if (!response.ok) {
          throw new Error("Error al cargar los bloques políticos")
        }
        const data = await response.json()
        setBloques(data)
      } catch (err) {
        console.error("Error:", err)
      }
    }

    fetchBloques()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setImage(file)

      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("position", formData.position)
      data.append("blockId", formData.blockId)
      data.append("mandate", formData.mandate)
      data.append("bio", formData.bio)
      data.append("isActive", formData.isActive.toString())
      if (image) {
        data.append("image", image)
      }

      const url = concejal ? `/api/council-members/${concejal.id}` : "/api/council-members/create"
      const method = concejal ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el concejal")
      }

      setSuccess(concejal ? "Concejal actualizado correctamente" : "Concejal creado correctamente")

      // Redirigir después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push("/admin-panel/concejales")
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre completo"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Cargo en el Concejo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockId">Bloque</Label>
              <Select value={formData.blockId} onValueChange={(value: string) => handleSelectChange("blockId", value)}>
                <SelectTrigger id="blockId">
                  <SelectValue placeholder="Seleccionar bloque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Sin bloque</SelectItem>
                  {bloques.map((bloque) => (
                    <SelectItem key={bloque.id} value={bloque.id.toString()}>
                      {bloque.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mandate">Mandato</Label>
            <Input
              id="mandate"
              name="mandate"
              value={formData.mandate}
              onChange={handleChange}
              placeholder="Período de mandato (ej: 2023-2027)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Biografía o descripción"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Foto</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
              {imagePreview && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive">Activo</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : concejal ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
