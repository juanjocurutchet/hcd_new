import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (
    ["/admin/login", "/admin/unauthorized", "/api/auth", "/_next", "/favicon.ico", "/public"]
      .some(route => path.startsWith(route))
  ) {
    return NextResponse.next()
  }

  const isProtectedRoute = path.startsWith("/admin-panel") || path.startsWith("/api/news")

  if (!isProtectedRoute) return NextResponse.next()

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== "admin") {
    const url = new URL("/admin/unauthorized", request.url)
    return NextResponse.redirect(url)
  }

  const headers = new Headers(request.headers)
  headers.set("x-user-id", token.id as string)
  headers.set("x-user-role", token.role)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
