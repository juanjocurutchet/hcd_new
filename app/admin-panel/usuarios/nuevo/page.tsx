import type { Metadata } from "next"
import { UsuarioForm } from "../components/usuario-form"

export const metadata: Metadata = {
  title: "Nuevo Usuario | Panel de Administración",
  description: "Crear un nuevo usuario",
}

export default function NuevoUsuarioPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nuevo Usuario</h1>
      </div>
      <UsuarioForm />
    </div>
  )
}
