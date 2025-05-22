import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para acceder a esta sección. Esta área está reservada para administradores.
        </p>
        <div className="flex justify-between">
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
          <Link href="/admin/login">
            <Button className="bg-[#0e4c7d] hover:bg-[#0a3d68]">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
