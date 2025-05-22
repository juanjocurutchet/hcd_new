"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PoliticalBlock = {
  id: number
  name: string
}

export default function NuevoConcejal() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [blocks, setBlocks] = useState<PoliticalBlock[]>([])

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    blockId: "",
    mandate: "",
    bio: "",
    isActive: true,
  })

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Cargar bloques políticos
    const fetchBlocks = async () => {
      try {
        const response = await fetch("/api/political-blocks")
        if (response.ok) {
          const data = await response.json()
          setBlocks(data)
        }
      } catch (error) {
        console.error("Error fetching political blocks:", error)
      }
    }

    fetchBlocks()
  }, [])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("position", formData.position)
      formDataToSend.append("blockId", formData.blockId)
      formDataToSend.append("mandate", formData.mandate)
      formDataToSend.append("bio", formData.bio)
      formDataToSend.append("isActive", formData.isActive.toString())

      if (image) {
        formDataToSend.append("image", image)
      }

      const res = await fetch("/api/council-members/create", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error al crear el concejal")
      }

      setSuccess("Concejal creado correctamente")
      setTimeout(() => {
        router.push("/admin/concejales")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nuevo Concejal</h1>
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
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Select value={formData.position} onValueChange={(value) => handleSelectChange("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presidente">Presidente</SelectItem>
                    <SelectItem value="Vicepresidente 1°">Vicepresidente 1°</SelectItem>
                    <SelectItem value="Vicepresidente 2°">Vicepresidente 2°</SelectItem>
                    <SelectItem value="Concejal">Concejal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockId">Bloque político</Label>
                <Select value={formData.blockId} onValueChange={(value) => handleSelectChange("blockId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un bloque" />
                  </SelectTrigger>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem key={block.id} value={block.id.toString()}>
                        {block.name}
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
                placeholder="Ej: 2023-2027"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={5} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />

              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                  <div className="relative h-48 w-48 overflow-hidden rounded-md">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
              />
              <Label htmlFor="isActive">Activo</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/concejales")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Concejal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
