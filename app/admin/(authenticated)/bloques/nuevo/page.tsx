"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CouncilMember = {
  id: number
  name: string
}

export default function NuevoBloque() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([])

  const [formData, setFormData] = useState({
    name: "",
    color: "#2E86C1",
    presidentId: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/political-blocks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
        body: JSON.stringify({
          name: formData.name,
          color: formData.color,
          presidentId: formData.presidentId ? Number.parseInt(formData.presidentId) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el bloque político")
      }

      setSuccess("Bloque político creado correctamente")
      setTimeout(() => {
        router.push("/admin/bloques")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nuevo Bloque Político</h1>
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
              <Label htmlFor="name">Nombre del bloque</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  placeholder="#RRGGBB"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="presidentId">Presidente del bloque (opcional)</Label>
              <Select value={formData.presidentId} onValueChange={(value) => handleSelectChange("presidentId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un concejal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {councilMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/bloques")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Bloque"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
