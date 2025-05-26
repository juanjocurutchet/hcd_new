import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ClientProviderWrapper from "@/components/providers/client-provider-wrapper"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Honorable Concejo Deliberante de Las Flores",
  description: "Sitio oficial del Honorable Concejo Deliberante de Las Flores",
  generator: "v0.dev",
}

import type { ReactNode } from "react"

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""

  // No mostrar header y footer en rutas del admin panel
  const isAdminPanel = pathname.startsWith("/admin-panel")

  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviderWrapper>
          {!isAdminPanel && <Header />}
          <main className={isAdminPanel ? "" : "max-w-[1200px] mx-auto"}>{children}</main>
          {!isAdminPanel && <Footer />}
        </ClientProviderWrapper>
      </body>
    </html>
  )
}
