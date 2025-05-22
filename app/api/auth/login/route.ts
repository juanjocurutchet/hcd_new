import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Autenticar usuario
    const { user, token } = await loginUser(email, password)

    // Crear respuesta con cookie
    const response = NextResponse.json({ user })

    // Establecer cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // La expiración se maneja en el token JWT
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Credenciales inválidas" }, { status: 401 })
  }
}
