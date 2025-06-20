import { getDocuments } from "@/lib/services/document-service"
import Link from "next/link"
import { format } from "date-fns"

export default async function DocumentosPage() {
  const documentos = await getDocuments({})

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documentos</h1>
        <Link href="/admin-panel/documentos/nuevo" className="text-blue-600 hover:underline">
          Agregar documento
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 border rounded-md">
        {documentos.map((doc) => (
          <li key={doc.id} className="p-4">
            <Link href={`/admin-panel/documentos/${doc.id}`} className="font-medium text-lg text-blue-700 hover:underline">
              {doc.title}
            </Link>
            <p className="text-sm text-gray-500">
              {doc.type} — Publicado el {doc.published_at ? format(new Date(doc.published_at), "dd/MM/yyyy") : "Sin publicar"}

            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
