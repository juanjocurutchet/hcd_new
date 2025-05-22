import { DocumentoForm } from "../components/documento-form"

export default function NuevoDocumentoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nuevo Documento</h1>
      <DocumentoForm />
    </div>
  )
}
