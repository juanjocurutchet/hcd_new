"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { createCouncilMember, updateCouncilMember } from "@/actions/council-actions"


interface Concejal {
  id?: number
  name: string
  position?: string | null
  block_id?: number | null
  mandate?: string | null
  image_url?: string | null
  bio?: string | null
  is_active: boolean
}

interface Block {
  id: number
  name: string
}

interface Props {
  concejal?: Concejal
  bloques: Block[]
}

export default function ConcejalForm({ concejal, bloques }: Props) {
  const [formData, setFormData] = useState({
    name: concejal?.name || "",
    position: concejal?.position || "",
    blockId: concejal?.block_id?.toString() || "-1",
    mandate: concejal?.mandate || "",
    bio: concejal?.bio || "",
    isActive: concejal?.is_active ?? true,
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckbox = (checked: boolean) => {
    setFormData({ ...formData, isActive: checked })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) setImage(files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    data.append("name", formData.name)
    data.append("position", formData.position)
    data.append("blockId", formData.blockId)
    data.append("mandate", formData.mandate)
    data.append("bio", formData.bio)
    data.append("isActive", String(formData.isActive))
    if (image) data.append("image", image)

    try {
      if (concejal?.id) {
        await updateCouncilMember(concejal.id, data, session?.user?.id ?? "", session?.user?.role ?? "")
      } else {
        await createCouncilMember(data, session?.user?.id ?? "", session?.user?.role ?? "")
      }
      router.push("/admin-panel/concejales")
    } catch (err) {
      console.error("Error al guardar concejal:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Cargo</Label>
        <Input id="position" name="position" value={formData.position} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blockId">Bloque</Label>
        <select
          id="blockId"
          name="blockId"
          value={formData.blockId}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="-1">Sin bloque asignado</option>
          {bloques.map((b) => (
            <option key={b.id} value={b.id.toString()}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mandate">Mandato</Label>
        <Input id="mandate" name="mandate" value={formData.mandate} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagen</Label>
        <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="isActive" name="isActive" checked={formData.isActive} onCheckedChange={handleCheckbox} />
        <Label htmlFor="isActive">Activo</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : concejal ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}