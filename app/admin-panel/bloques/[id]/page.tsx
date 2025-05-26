import { notFound } from "next/navigation"
import { getPoliticalBlockById, getAllCouncilMembers } from "@/actions/council-actions"
import BloqueForm from "../components/bloque-form"



interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarBloquePage({ params }: PageProps) {
  const { id } = await params
  const blockId = Number.parseInt(id)

  if (isNaN(blockId)) {
    notFound()
  }

  const [bloque, concejales] = await Promise.all([getPoliticalBlockById(blockId), getAllCouncilMembers()])

  if (!bloque) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Bloque Político</h1>
        <p className="text-gray-600">Modifica la información del bloque político</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <BloqueForm bloque={bloque} concejales={concejales} />
      </div>
    </div>
  )
}
