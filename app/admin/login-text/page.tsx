"use client"

export default function LoginTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Página de Prueba</h1>
        <p className="text-center text-gray-600 mb-6">
          Si puedes ver esta página, el problema está en el componente de login original.
        </p>
        <div className="space-y-4">
          <p>URL actual: {typeof window !== "undefined" ? window.location.href : "Cargando..."}</p>
          <button
            onClick={() => (window.location.href = "/admin/login")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Ir a login original
          </button>
        </div>
      </div>
    </div>
  )
}
