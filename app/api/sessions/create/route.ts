import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/services/session-service"
import { isAdmin } from "@/lib/utils/server-utils"

export async function POST(request: NextRequest) {
  try {
    // Verificar permisos
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()

    const dateStr = formData.get("date") as string
    const type = formData.get("type") as "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
    const agendaFile = formData.get("agendaFile") as File | null
    const minutesFile = formData.get("minutesFile") as File | null
    const audioFile = formData.get("audioFile") as File | null
    const videoUrl = formData.get("videoUrl") as string | null
    const isPublished = formData.get("isPublished") === "true"

    if (!dateStr || !type) {
      return NextResponse.json({ error: "Fecha y tipo son requeridos" }, { status: 400 })
    }

    const date = new Date(dateStr)

    const result = await createSession({
      date,
      type,
      agendaFile,
      minutesFile,
      audioFile,
      videoUrl: videoUrl || undefined,
      isPublished,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear la sesión" }, { status: 500 })
  }
}
