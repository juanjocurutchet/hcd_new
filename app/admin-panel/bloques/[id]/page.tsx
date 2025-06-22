import { getAllCouncilMembers, getAllPoliticalBlocks } from "@/lib/services/session-service"
import { notFound } from "next/navigation"
import BloqueForm from "../components/bloque-form"

export default async function EditBloquePage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const bloques = await getAllPoliticalBlocks()
  const concejales = await getAllCouncilMembers()

  const bloque = bloques.find((b) => b.id === id)
  if (!bloque) return notFound()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Bloque</h1>
      <BloqueForm bloque={bloque} concejales={concejales} />
    </div>
  )
}
