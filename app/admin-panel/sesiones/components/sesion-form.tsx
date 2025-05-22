"use client"

import { ChangeEvent, SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Sesion {
  id?: string;
  date?: string;
  type?: string;
  videoUrl?: string;
  isPublished?: boolean;
}

export function SesionForm({ sesion = null }: { sesion?: Sesion | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    date: sesion?.date ? new Date(sesion.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    type: sesion?.type || "ordinaria",
    videoUrl: sesion?.videoUrl || "",
    isPublished: sesion?.isPublished || false,
  })
  const [agendaFile, setAgendaFile] = useState(null)
  const [minutesFile, setMinutesFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: { (value: SetStateAction<null>): void; (value: SetStateAction<null>): void; (value: SetStateAction<null>): void; (arg0: any): void }) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const data = new FormData()
      data.append("date", formData.date)
      data.append("type", formData.type)
      data.append("videoUrl", formData.videoUrl)
      data.append("isPublished", formData.isPublished.toString())
      if (agendaFile) {
        data.append("agendaFile", agendaFile)
      }
      if (minutesFile) {
        data.append("minutesFile", minutesFile)
      }
      if (audioFile) {
        data.append("audioFile", audioFile)
      }

      const url = sesion ? `/api/sessions/${sesion.id}` : "/api/sessions/create"
      const method = sesion ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar la sesión")
      }

      router.push("/admin-panel/sesiones")
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value: any) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinaria">Ordinaria</SelectItem>
                  <SelectItem value="extraordinaria">Extraordinaria</SelectItem>
                  <SelectItem value="especial">Especial</SelectItem>
                  <SelectItem value="preparatoria">Preparatoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agendaFile">Orden del día</Label>
            <Input
              id="agendaFile"
              name="agendaFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, setAgendaFile)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutesFile">Acta</Label>
            <Input
              id="minutesFile"
              name="minutesFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileChange(e, setMinutesFile)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioFile">Audio</Label>
            <Input
              id="audioFile"
              name="audioFile"
              type="file"
              accept=".mp3,.wav,.ogg"
              onChange={(e) => handleFileChange(e, setAudioFile)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">URL del video</Label>
            <Input
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="URL del video (YouTube, Vimeo, etc.)"
            />
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
              {isSubmitting ? "Guardando..." : sesion ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
