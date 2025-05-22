"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Bloque {
  id?: string;
  name?: string;
  description?: string;
  color?: string;
  presidentId?: string | number;
}

export function BloqueForm({ bloque = null }: { bloque?: Bloque | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [concejales, setConcejales] = useState<{ id: string | number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: bloque?.name || "",
    description: bloque?.description || "",
    color: bloque?.color || "#0e4c7d",
    presidentId: bloque?.presidentId?.toString() || "",
  })

  useEffect(() => {
    const fetchConcejales = async () => {
      try {
        const response = await fetch("/api/council-members")
        if (!response.ok) {
          throw new Error("Error al cargar los concejales")
        }
        const data = await response.json()
        setConcejales(data)
      } catch (err) {
        console.error("Error:", err)
      }
    }

    fetchConcejales()
  }, [])

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const url = bloque ? `/api/political-blocks/${bloque.id}` : "/api/political-blocks/create"
      const method = bloque ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el bloque político")
      }

      router.push("/admin-panel/bloques")
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
              placeholder="Nombre del bloque político"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del bloque político"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex space-x-2">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="presidentId">Presidente</Label>
              <Select value={formData.presidentId} onValueChange={(value: string) => handleSelectChange("presidentId", value)}>
                <SelectTrigger id="presidentId">
                  <SelectValue placeholder="Seleccionar presidente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">Sin presidente</SelectItem>
                  {concejales.map((concejal) => (
                    <SelectItem key={concejal.id} value={concejal.id.toString()}>
                      {concejal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : bloque ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
