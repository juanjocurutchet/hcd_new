import { getActivityById } from "@/lib/services/activity-service"
import { notFound } from "next/navigation"
import EliminarActividadForm from "../../components/eliminar-actividad-form"


interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarActividadPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const actividad = await getActivityById(id)
  if (!actividad) notFound()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <EliminarActividadForm actividad={{ id: actividad.id, title: actividad.title }} />
    </div>
  )
}

