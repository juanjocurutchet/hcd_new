import type { ReactNode } from "react"
import ClientProviderWrapper from "@/components/providers/client-provider-wrapper"
import AdminPanelLayoutClient from "../../AdminPanelLayoutClient"

export const metadata = {
  title: "Panel de Administración | HCD Las Flores",
  description: "Panel de administración del Honorable Concejo Deliberante de Las Flores",
}

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ClientProviderWrapper>
          <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>
        </ClientProviderWrapper>
      </body>
    </html>
  )
}
