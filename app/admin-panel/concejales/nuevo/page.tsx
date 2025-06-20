import { getAllPoliticalBlocks } from "@/lib/services/session-service"
import ConcejalForm from "../components/concejal-form"

export default async function NuevoConcejalPage() {
  const bloques = await getAllPoliticalBlocks()

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Concejal</h1>
        <p className="text-gray-600">Complete el formulario para agregar un nuevo concejal</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ConcejalForm bloques={bloques} />
      </div>
    </div>
  )
}
