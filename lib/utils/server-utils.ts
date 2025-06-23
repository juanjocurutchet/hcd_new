import { jwtVerify } from "jose"
import { NextRequest } from "next/server"

export async function isAdmin(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    console.error("Token no encontrado en el encabezado Authorization")
    return false
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload.role === "admin"
  } catch (error) {
    console.error("Error al verificar el token:", error)
    return false
  }
}