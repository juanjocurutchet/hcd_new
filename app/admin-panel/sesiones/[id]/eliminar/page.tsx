import { notFound } from "next/navigation"
import { getSessionById } from "@/lib/services/session-service"
import EliminarSesionForm from "../../components/eliminar-sesion-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarSesionPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const sesion = await getSessionById(id)

  if (!sesion) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Eliminar Sesión</h1>
      </div>

      <div className="bg-white rounded-md shadow p-6">
        <EliminarSesionForm sesion={sesion} />
      </div>
    </div>
  )
}
