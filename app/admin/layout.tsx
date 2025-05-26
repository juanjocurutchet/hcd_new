import type { ReactNode } from "react"

export const metadata = {
  title: "Panel de Administración | HCD Las Flores",
  description: "Panel de administración del Honorable Concejo Deliberante de Las Flores",
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Remover la verificación de sesión del layout
  // La verificación se hará en las páginas individuales que la necesiten
  return <div className="min-h-screen bg-gray-50">{children}</div>
}
