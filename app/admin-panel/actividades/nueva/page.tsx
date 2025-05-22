import type { Metadata } from "next"
import { ActividadForm } from "../components/actividad-form"

export const metadata: Metadata = {
  title: "Nueva Actividad | Panel de Administración",
  description: "Crear una nueva actividad",
}

export default function NuevaActividadPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nueva Actividad</h1>
      </div>
      <ActividadForm />
    </div>
  )
}
