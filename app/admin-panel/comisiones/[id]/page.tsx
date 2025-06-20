import { notFound } from "next/navigation"
import { ComisionForm } from "../components/comision-form"
import { getCommissionById } from "@/lib/services/commission-service"


interface PageProps {
  params: {
    id: string
  }
}

export default async function EditarComisionPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const comision = await getCommissionById(id)
  if (!comision) notFound()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Comisión</h1>
        <p className="text-gray-600">Modifica la información de la comisión</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
      <ComisionForm
        comision={{
          ...comision,
          id: String(comision.id),
          description: comision.description ?? undefined,
          presidentId: comision.presidentId ?? undefined
        }}
      />
      </div>
    </div>
  )
}
