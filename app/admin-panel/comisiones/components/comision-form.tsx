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
import { Checkbox } from "@/components/ui/checkbox"

interface Comision {
  id?: string;
  name?: string;
  description?: string;
  presidentId?: string | number;
  isActive?: boolean;
  members?: { id: string | number }[];
}

export function ComisionForm({ comision = null }: { comision?: Comision | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [concejales, setConcejales] = useState<{ id: string | number; name: string }[]>([])
  const [formData, setFormData] = useState({
    name: comision?.name || "",
    description: comision?.description || "",
    presidentId: comision?.presidentId?.toString() || "",
    isActive: comision?.isActive ?? true,
  })
  const [selectedMembers, setSelectedMembers] = useState(comision?.members?.map((m) => m.id.toString()) || [])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked // Type guard for checkbox inputs
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

  const handleMemberToggle = (id: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((memberId) => memberId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const data = {
        ...formData,
        memberIds: selectedMembers,
      }

      const url = comision ? `/api/committees/${comision.id}` : "/api/committees/create"
      const method = comision ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al guardar la comisión")
      }

      router.push("/admin-panel/comisiones")
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre de la comisión"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción de la comisión"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presidentId">Presidente</Label>
            <Select value={formData.presidentId} onValueChange={(value: string) => handleSelectChange("presidentId", value)}>
              <SelectTrigger id="presidentId">
                <SelectValue placeholder="Seleccionar presidente" />
              </SelectTrigger>
              <SelectContent>
                {concejales.map((concejal) => (
                  <SelectItem key={concejal.id} value={concejal.id.toString()}>
                    {concejal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Miembros</Label>
            <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
              {concejales.map((concejal) => (
                <div key={concejal.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`member-${concejal.id}`}
                    checked={selectedMembers.includes(concejal.id.toString())}
                    onCheckedChange={() => handleMemberToggle(concejal.id.toString())}
                  />
                  <Label htmlFor={`member-${concejal.id}`}>{concejal.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: any) => setFormData({ ...formData, isActive: !!checked })}
            />
            <Label htmlFor="isActive">Activa</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#0e4c7d] hover:bg-[#0a3d68]" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : comision ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
