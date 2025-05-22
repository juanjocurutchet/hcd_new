import type { NextRequest } from "next/server"

// Función para obtener el ID del usuario desde los headers
export function getUserIdFromRequest(request: NextRequest): number | null {
  const userId = request.headers.get("x-user-id")
  return userId ? Number.parseInt(userId) : null
}

// Función para obtener el rol del usuario desde los headers
export function getUserRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-user-role")
}

// Función para verificar si el usuario es administrador
export function isAdmin(request: NextRequest): boolean {
  const role = getUserRoleFromRequest(request)
  return role === "admin"
}
