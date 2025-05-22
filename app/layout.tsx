import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ClientProviderWrapper from "@/components/providers/client-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Honorable Concejo Deliberante de Las Flores",
  description: "Sitio oficial del Honorable Concejo Deliberante de Las Flores",
    generator: 'v0.dev'
}

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientProviderWrapper>
          <Header />
          <main className="max-w-[1200px] mx-auto">{children}</main>
          <Footer />
        </ClientProviderWrapper>
      </body>
    </html>
  )
}
