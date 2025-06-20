
import Link from "next/link"
import { format } from "date-fns"
import { getAllMessages } from "@/lib/services/message-service"

export default async function MensajesPage() {
  const mensajes = await getAllMessages()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mensajes de Contacto</h1>
      </div>

      <ul className="divide-y divide-gray-200 border rounded-md">
        {mensajes.map((msg) => (
          <li key={msg.id} className="p-4">
            <Link
              href={`/admin-panel/mensajes/${msg.id}`}
              className="font-medium text-lg text-blue-700 hover:underline"
            >
              {msg.subject}
            </Link>
            <p className="text-sm text-gray-500">
              {msg.name} — {msg.email} — {format(new Date(msg.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
