// app/api/auth/login/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const { user, token } = await loginUser(email, password)

    // Retornar token para almacenarlo en localStorage
    return NextResponse.json({ user, token }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Credenciales inválidas" }, { status: 401 })
  }
}
