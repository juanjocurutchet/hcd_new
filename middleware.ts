import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Rutas que requieren autenticación
const protectedRoutes = ["/admin", "/api/admin"]
// Rutas que deben estar excluidas de la protección
const excludedRoutes = ["/admin/login", "/admin/unauthorized"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for excluded routes
  if (excludedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar si la ruta requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Verificar token de NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  })

  if (!token) {
    // Redirigir al login si no hay token
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Verificar si la ruta requiere rol de administrador
  if (request.nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/unauthorized", request.url))
  }

  // Agregar información del usuario a los headers para uso en las rutas de API
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", token.id as string)
  requestHeaders.set("x-user-role", token.role as string)

  // Continuar con la solicitud
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
