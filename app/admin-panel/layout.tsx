import type { ReactNode } from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import AdminPanelLayoutClient from "./AdminPanelLayoutClient"

export const metadata = {
  title: "Panel de Administración | HCD Las Flores",
  description: "Panel de administración del Honorable Concejo Deliberante de Las Flores",
}

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode
}) {
  // Verificar sesión en el servidor
  const session = await getServerSession(authOptions)

  // Si no hay sesión, redirigir a login
  if (!session) {
    redirect("/admin/login")
  }

  return <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>
}
