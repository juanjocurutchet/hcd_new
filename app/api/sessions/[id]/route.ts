import { type NextRequest, NextResponse } from "next/server"
import { getSessionById, updateSession, deleteSession } from "@/lib/services/session-service"
import { isAdmin } from "@/lib/utils/server-utils"

async function validateAdminAndId(request: NextRequest, idParam: string) {
  if (!(await isAdmin(request))) {
    return { error: NextResponse.json({ error: "No autorizado" }, { status: 403 }) }
  }

  const id = Number.parseInt(idParam)
  if (isNaN(id)) {
    return { error: NextResponse.json({ error: "ID inválido" }, { status: 400 }) }
  }

  return { id }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const session = await getSessionById(id)

    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error(`Error obteniendo sesión con id ${params.id}:`, error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id, error } = await validateAdminAndId(request, params.id)
    if (error) return error

    const formData = await request.formData()

    const dateStr = formData.get("date") as string
    const type = formData.get("type") as "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
    const agendaFile = formData.get("agendaFile") as File | null
    const minutesFile = formData.get("minutesFile") as File | null
    const audioFile = formData.get("audioFile") as File | null
    const videoUrl = formData.get("videoUrl") as string | null
    const isPublished = formData.get("isPublished") === "true"

    const date = new Date(dateStr)

    const result = await updateSession({
      id,
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
    console.error(`Error actualizando sesión con id ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id, error } = await validateAdminAndId(request, params.id)
    if (error) return error

    await deleteSession(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error eliminando sesión con id ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}
