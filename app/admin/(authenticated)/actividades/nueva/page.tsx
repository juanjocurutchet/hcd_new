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
import { Checkbox } from "@/components/ui/checkbox"

type CouncilMember = {
  id: number
  name: string
}

export default function NuevaActividad() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    isPublished: true,
  })

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])

  useEffect(() => {
    // Cargar concejales
    const fetchCouncilMembers = async () => {
      try {
        const response = await fetch("/api/council-members?isActive=true")
        if (response.ok) {
          const data = await response.json()
          setCouncilMembers(data)
        }
      } catch (error) {
        console.error("Error fetching council members:", error)
      }
    }

    fetchCouncilMembers()
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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleParticipantToggle = (memberId: number) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId)
      } else {
        return [...prev, memberId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("date", formData.date)
      formDataToSend.append("isPublished", formData.isPublished.toString())
      formDataToSend.append("participants", JSON.stringify(selectedParticipants))

      if (image) {
        formDataToSend.append("image", image)
      }

      const res = await fetch("/api/activities/create", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
      })

      if (!res.ok) {
        throw new Error("Error al crear la actividad")
      }

      setSuccess("Actividad creada correctamente")
      setTimeout(() => {
        router.push("/admin/actividades")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nueva Actividad</h1>
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
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />

              {previewUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                  <div className="relative h-48 w-full overflow-hidden rounded-md">
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Concejales participantes</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                {councilMembers.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay concejales disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {councilMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`participant-${member.id}`}
                          checked={selectedParticipants.includes(member.id)}
                          onCheckedChange={() => handleParticipantToggle(member.id)}
                        />
                        <Label htmlFor={`participant-${member.id}`} className="cursor-pointer">
                          {member.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                onClick={() => router.push("/admin/actividades")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Actividad"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
