import { notFound } from "next/navigation"
import { getPoliticalBlockById } from "@/lib/services/political-blocks-service"
import BloqueForm from "../components/bloque-form"
import { getAllCouncilMembers } from "@/lib/services/session-service"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarBloquePage({ params }: PageProps) {
  const blockId = Number.parseInt(params.id)
  if (isNaN(blockId)) notFound()

  const [bloque, concejales] = await Promise.all([
    getPoliticalBlockById(blockId),
    getAllCouncilMembers(),
  ])

  if (!bloque) notFound()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Bloque Político</h1>
        <p className="text-gray-600">Modifica la información del bloque político</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <BloqueForm bloque={{ ...bloque, memberCount: bloque.memberCount ?? 0 }} concejales={concejales} />
      </div>
    </div>
  )
}
