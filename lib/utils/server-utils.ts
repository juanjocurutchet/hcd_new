import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

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

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) return false

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // Asegúrate que el token incluya un campo "role"
    return payload.role === "admin"
  } catch (error) {
    console.error("Error al verificar el token:", error)
    return false
  }
}