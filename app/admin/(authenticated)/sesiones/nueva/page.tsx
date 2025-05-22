"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NuevaSesionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "ordinaria",
    videoUrl: "",
    isPublished: true,
  })

  const [agendaFile, setAgendaFile] = useState<File | null>(null)
  const [minutesFile, setMinutesFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
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
      formDataToSend.append("date", formData.date)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("videoUrl", formData.videoUrl)
      formDataToSend.append("isPublished", formData.isPublished.toString())

      if (agendaFile) {
        formDataToSend.append("agendaFile", agendaFile)
      }

      if (minutesFile) {
        formDataToSend.append("minutesFile", minutesFile)
      }

      if (audioFile) {
        formDataToSend.append("audioFile", audioFile)
      }

      const res = await fetch("/api/sessions/create", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error al crear la sesión")
      }

      setSuccess("Sesión creada correctamente")
      setTimeout(() => {
        router.push("/admin/sesiones")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nueva Sesión</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
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
              <Label htmlFor="agendaFile">Archivo de Orden del Día (opcional)</Label>
              <Input
                id="agendaFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, setAgendaFile)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minutesFile">Archivo de Acta (opcional)</Label>
              <Input
                id="minutesFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange(e, setMinutesFile)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audioFile">Archivo de Audio (opcional)</Label>
              <Input
                id="audioFile"
                type="file"
                accept=".mp3,.wav"
                onChange={(e) => handleFileChange(e, setAudioFile)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL de Video (opcional)</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={formData.isPublished}
                onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
              />
              <Label htmlFor="isPublished">Publicar</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/sesiones")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
