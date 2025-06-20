import { notFound } from "next/navigation"
import { getSessionById } from "@/lib/services/session-service"
import { SesionForm } from "../components/sesion-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarSesionPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const sesion = await getSessionById(id)
  if (!sesion) notFound()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Sesión</h1>
        <p className="text-gray-600">Modifica la información de la sesión</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
      <SesionForm
        sesion={{
          ...sesion,
          id: String(sesion.id),
          date: sesion.date.toISOString().split("T")[0],
          videoUrl: sesion.videoUrl ?? undefined,
        }}
      />
      </div>
    </div>
  )
}
