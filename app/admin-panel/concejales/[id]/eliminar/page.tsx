import { notFound } from "next/navigation"
import { getCouncilMemberById } from "@/lib/services/session-service"
import EliminarConcejalForm from "../../components/eliminar-concejal-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarConcejalPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const concejal = await getCouncilMemberById(id)
  if (!concejal) notFound()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <EliminarConcejalForm concejal={{ id: concejal.id, name: concejal.name }} />
    </div>
  )
}
