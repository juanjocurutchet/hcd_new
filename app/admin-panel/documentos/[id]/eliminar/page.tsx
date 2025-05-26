import { notFound } from "next/navigation"
import { getDocumentById } from "@/actions/document-actions"
import EliminarDocumentoForm from "../../components/eliminar-documento-form"

interface PageProps {
  params: {
    id: string
  }
}

export default async function EliminarDocumentoPage({ params }: PageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const documento = await getDocumentById(id)

  if (!documento) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Eliminar Documento</h1>
      </div>

      <div className="bg-white rounded-md shadow p-6">
        <EliminarDocumentoForm documento={documento} />
      </div>
    </div>
  )
}
