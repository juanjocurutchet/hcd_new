import { notFound } from "next/navigation"
import { getPoliticalBlockById } from "@/actions/council-actions"
import EliminarBloqueForm from "../../components/eliminar-bloque-form"


interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EliminarBloquePage({ params }: PageProps) {
  const { id } = await params
  const blockId = Number.parseInt(id)

  if (isNaN(blockId)) {
    notFound()
  }

  const bloque = await getPoliticalBlockById(blockId)

  if (!bloque) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Eliminar Bloque Político</h1>
        <p className="text-gray-600">Esta acción no se puede deshacer</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <EliminarBloqueForm bloque={bloque} />
      </div>
    </div>
  )
}
