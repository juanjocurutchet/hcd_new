import { getCommissionById } from "@/lib/services/commission-service"
import { notFound } from "next/navigation"
import EliminarComisionForm from "../../components/eliminar-comision-form"


interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarComisionPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const comision = await getCommissionById(id)
  if (!comision) notFound()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <EliminarComisionForm comision={{ id: comision.id, name: comision.name }} />
    </div>
  )
}
