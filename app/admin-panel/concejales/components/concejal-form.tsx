"use client"

import { useState, useEffect, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Concejal {
  id?: string;
  name?: string;
  position?: string;
  blockId?: number;
  mandate?: string;
  bio?: string;
  isActive?: boolean;
}

export function ConcejalForm({ concejal = null }: { concejal?: Concejal | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [bloques, setBloques] = useState<{ id: number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: concejal?.name || "",
    position: concejal?.position || "",
    blockId: concejal?.blockId?.toString() || "",
    mandate: concejal?.mandate || "",
    bio: concejal?.bio || "",
    isActive: concejal?.isActive ?? true,
  })
  const [image, setImage] = useState<File | null>(null)

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
    const checked = (e.target as HTMLInputElement).checked; // Only relevant for checkboxes
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
      setImage(files[0])
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

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

      router.push("/admin-panel/concejales")
      router.refresh()
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
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: Boolean(checked) })}
            />
            <Label htmlFor="isActive">Activo</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : concejal ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
