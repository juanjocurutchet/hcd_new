import { notFound } from "next/navigation"
import { getPoliticalBlockById } from "@/lib/services/political-blocks-service"
import EliminarBloqueForm from "../../components/eliminar-bloque-form"
interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarBloquePage({ params }: PageProps) {
  const id = Number.parseInt(params.id)
  if (isNaN(id)) notFound()

  const bloque = await getPoliticalBlockById(id)
  if (!bloque) notFound()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <EliminarBloqueForm bloque={bloque} />
    </div>
  )
}
