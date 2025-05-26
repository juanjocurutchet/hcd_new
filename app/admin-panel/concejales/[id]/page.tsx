import { notFound } from "next/navigation"
import { getCouncilMemberById } from "@/actions/council-actions"
import { ConcejalForm } from "../components/concejal-form"


interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditarConcejalPage({ params }: PageProps) {
  const { id: idParam } = await params
  const id = Number.parseInt(idParam)

  if (isNaN(id)) {
    notFound()
  }

  const concejal = await getCouncilMemberById(id)

  if (!concejal) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editar Concejal</h1>
      </div>

      <div className="bg-white rounded-md shadow p-6">
        <ConcejalForm concejal={concejal} />
      </div>
    </div>
  )
}
