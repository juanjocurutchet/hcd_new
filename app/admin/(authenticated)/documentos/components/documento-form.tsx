"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"

interface Documento {
  id?: string;
  title?: string;
  number?: string;
  type?: string;
  content?: string;
  isPublished?: boolean;
  publishedAt?: string;
  fileUrl?: string;
}

export function DocumentoForm({ documento = null }: { documento?: Documento | null }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [formData, setFormData] = useState({
    title: documento?.title || "",
    number: documento?.number || "",
    type: documento?.type || "ordenanza",
    content: documento?.content || "",
    isPublished: documento?.isPublished !== false,
    publishedAt: documento?.publishedAt
      ? new Date(documento.publishedAt).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // Type guard for checkbox inputs
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const selectedFile = files[0]
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      if (!session?.user?.id) {
        throw new Error("Debes iniciar sesión para realizar esta acción")
      }

      const data = new FormData()
      data.append("title", formData.title)
      data.append("number", formData.number || "")
      data.append("type", formData.type)
      data.append("content", formData.content || "")
      data.append("isPublished", formData.isPublished.toString())
      data.append("publishedAt", formData.publishedAt)
      data.append("authorId", session.user.id.toString())

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

      setSuccess("Documento guardado correctamente")

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/admin/(authenticated)/documentos")
        router.refresh()
      }, 2000)
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
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Número del documento (ej: 1234/2023)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
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
            <Label htmlFor="publishedAt">Fecha de publicación</Label>
            <Input
              id="publishedAt"
              name="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Contenido o descripción del documento"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Archivo PDF</Label>
            <div className="border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </div>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {fileName && (
                <div className="mt-2 text-sm text-gray-500">
                  Archivo seleccionado: <span className="font-medium">{fileName}</span>
                </div>
              )}
              {documento?.fileUrl && !fileName && (
                <div className="mt-2 text-sm text-gray-500">
                  Archivo actual:{" "}
                  <a
                    href={documento.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver archivo
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onCheckedChange={(checked) => setFormData({ ...formData, isPublished: !!checked })}
            />
            <Label htmlFor="isPublished">Publicar documento</Label>
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
