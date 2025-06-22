import { getAllPoliticalBlocks } from "@/lib/services/session-service"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function EliminarBloquePage({ params }: Props) {
  const bloques = await getAllPoliticalBlocks()
  const maybeBloque = bloques.find((b) => b.id === Number(params.id))
  if (!maybeBloque) return notFound()

  const bloque = maybeBloque

  async function handleDelete() {
    "use server"
    await fetch(`/api/political-blocks/${bloque.id}`, { method: "DELETE" })
    redirect("/admin-panel/bloques")
  }

  return (
    <form action={handleDelete} className="space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Eliminar bloque</h1>
      <p>
        ¿Estás seguro que deseas eliminar el bloque{" "}
        <strong className="text-red-700">{bloque.name}</strong>? Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-4">
        <a
          href="/admin-panel/bloques"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Cancelar
        </a>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar definitivamente
        </button>
      </div>
    </form>
  )
}
