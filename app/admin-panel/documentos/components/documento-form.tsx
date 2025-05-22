"use client"

import { SetStateAction, useState } from "react"
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

interface Documento {
  id?: string;
  title?: string;
  number?: string;
  type?: string;
  content?: string;
  isPublished?: boolean;
}

export function DocumentoForm({ documento = null }: { documento?: Documento | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: documento?.title || "",
    number: documento?.number || "",
    type: documento?.type || "ordenanza",
    content: documento?.content || "",
    isPublished: documento?.isPublished || false,
  })
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: { target: { name: any; value: any; type: any; checked: any } }) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("number", formData.number)
      data.append("type", formData.type)
      data.append("content", formData.content)
      data.append("isPublished", formData.isPublished.toString())
      data.append("authorId", "1") // Temporal, debería venir del usuario autenticado
      if (file) {
        data.append("file", file)
      }

      const url = documento ? `/api/documents/${documento.id}` : "/api/documents/create"
      const method = documento ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar el documento")
      }

      router.push("/admin-panel/documentos")
      router.refresh()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
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
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Título del documento"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Número del documento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value: any) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordenanza">Ordenanza</SelectItem>
                  <SelectItem value="decreto">Decreto</SelectItem>
                  <SelectItem value="resolucion">Resolución</SelectItem>
                  <SelectItem value="comunicacion">Comunicación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Contenido del documento"
              rows={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo</Label>
            <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked: any) => setFormData({ ...formData, isPublished: checked })}
            />
            <Label htmlFor="isPublished">Publicar inmediatamente</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : documento ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
