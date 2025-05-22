import type { Metadata } from "next"
import { ComisionForm } from "../components/comision-form"

export const metadata: Metadata = {
  title: "Nueva Comisión | Panel de Administración",
  description: "Crear una nueva comisión",
}

export default function NuevaComisionPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Comisión</h1>
      </div>
      <ComisionForm />
    </div>
  )
}
