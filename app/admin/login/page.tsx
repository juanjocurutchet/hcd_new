// app/admin-panel/login/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })

    const data = await res.json()

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token)
      router.push("/admin-panel")
    } else {
      setError(data.error || "Error al iniciar sesión")
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="mb-4">
        <Image
          src="/municipal-shield.png"
          alt="HCD Las Flores"
          width={60}
          height={60}
          className="mx-auto"
        />
        <h1 className="text-2xl font-bold text-gray-800 mt-2">HCD Las Flores</h1>
        <p className="text-sm text-gray-500">Panel de Administración</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Ingresar
        </button>
      </form>
    </div>
  )
}
