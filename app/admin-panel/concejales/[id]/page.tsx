import { notFound } from "next/navigation"
import { getCouncilMemberById, getAllPoliticalBlocks } from "@/lib/services/session-service"
import ConcejalForm from "../components/concejal-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarConcejalPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const concejal = await getCouncilMemberById(id)
  if (!concejal) notFound()

  const bloques = await getAllPoliticalBlocks()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Concejal</h1>
        <p className="text-gray-600">Modifica la información del concejal</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ConcejalForm concejal={{ ...concejal, is_active: concejal.isActive }} bloques={bloques} />
      </div>
    </div>
  )
}
