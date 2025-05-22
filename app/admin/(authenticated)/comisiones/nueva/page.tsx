"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type CouncilMember = {
  id: number
  name: string
}

export default function NuevaComision() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    presidentId: "",
  })

  const [selectedMembers, setSelectedMembers] = useState<number[]>([])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) => {
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
      const response = await fetch("/api/committees/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session?.user as any)?.jwt}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          presidentId: formData.presidentId ? Number.parseInt(formData.presidentId) : null,
          memberIds: selectedMembers,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear la comisión")
      }

      setSuccess("Comisión creada correctamente")
      setTimeout(() => {
        router.push("/admin/comisiones")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Ocurrió un error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nueva Comisión</h1>
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
              <Label htmlFor="name">Nombre de la comisión</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presidentId">Presidente de la comisión</Label>
              <Select value={formData.presidentId} onValueChange={(value) => handleSelectChange("presidentId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un concejal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Ninguno</SelectItem>
                  {councilMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Miembros de la comisión</Label>
              <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                {councilMembers.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay concejales disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {councilMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                        />
                        <Label htmlFor={`member-${member.id}`} className="cursor-pointer">
                          {member.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/comisiones")}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Crear Comisión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
