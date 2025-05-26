import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Rutas que NUNCA deben ser interceptadas por el middleware
  const publicRoutes = [
    "/admin/login",
    "/admin/unauthorized",
    "/api/auth",
    "/admin/api/auth",
    "/_next",
    "/favicon.ico",
    "/public",
  ]

  // Si la ruta es pública, permitir acceso directo
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Solo proteger rutas específicas del panel de administración
  const protectedRoutes = ["/admin-panel"]

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Si no es una ruta protegida, permitir acceso
  if (!isProtectedRoute) {
    const response = NextResponse.next()
    response.headers.set("x-pathname", request.nextUrl.pathname)
    return response
  }

  // Verificar token solo para rutas protegidas
  try {
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

    // Verificar rol de administrador
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/unauthorized", request.url))
    }

    // Agregar información del usuario a los headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", token.id as string)
    requestHeaders.set("x-user-role", token.role as string)
    requestHeaders.set("x-pathname", request.nextUrl.pathname)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error("Error en middleware:", error)
    const response = NextResponse.next()
    response.headers.set("x-pathname", request.nextUrl.pathname)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
