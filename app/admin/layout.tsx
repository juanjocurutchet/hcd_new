import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export const metadata = {
  title: "Panel de Administración | HCD Las Flores",
  description: "Panel de administración del Honorable Concejo Deliberante de Las Flores",
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Verificar sesión en el servidor
  const session = await getServerSession(authOptions)

  // Si no hay sesión y no estamos en la página de login o unauthorized, redirigir a login
  if (!session) {
    // Obtener la ruta actual
    const currentPath = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000").pathname

    // Si no estamos en login o unauthorized, redirigir a login
    if (currentPath !== "/admin/login" && currentPath !== "/admin/unauthorized") {
      redirect("/admin/login")
    }
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>
}
