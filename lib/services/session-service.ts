import { db } from "@/lib/db"
import { sessions } from "@/lib/db/schema"
import { eq, desc, and, sql } from "drizzle-orm"
import { uploadFile, deleteFile } from "@/lib/storage"

export type SessionInput = {
  date: Date
  type: "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
  agendaFile?: File | null
  minutesFile?: File | null
  audioFile?: File | null
  videoUrl?: string
  isPublished?: boolean
}

export type SessionUpdateInput = Partial<SessionInput> & {
  id: number
}

export async function createSession(input: SessionInput) {
  let agendaFileUrl = null
  let minutesFileUrl = null
  let audioFileUrl = null

  if (input.agendaFile) {
    agendaFileUrl = await uploadFile(input.agendaFile, "sessions/agendas")
  }

  if (input.minutesFile) {
    minutesFileUrl = await uploadFile(input.minutesFile, "sessions/minutes")
  }

  if (input.audioFile) {
    audioFileUrl = await uploadFile(input.audioFile, "sessions/audios")
  }

  const result = await db
    .insert(sessions)
    .values({
      date: input.date,
      type: input.type,
      agendaFileUrl,
      minutesFileUrl,
      audioFileUrl,
      videoUrl: input.videoUrl,
      isPublished: input.isPublished ?? true,
    })
    .returning()

  return result[0]
}

export async function updateSession(input: SessionUpdateInput) {
  const currentSession = await db.select().from(sessions).where(eq(sessions.id, input.id)).limit(1)

  if (!currentSession.length) {
    throw new Error("Sesión no encontrada")
  }

  let agendaFileUrl = currentSession[0].agendaFileUrl
  let minutesFileUrl = currentSession[0].minutesFileUrl
  let audioFileUrl = currentSession[0].audioFileUrl

  if (input.agendaFile) {
    if (agendaFileUrl) {
      await deleteFile(agendaFileUrl)
    }
    agendaFileUrl = await uploadFile(input.agendaFile, "sessions/agendas")
  }

  if (input.minutesFile) {
    if (minutesFileUrl) {
      await deleteFile(minutesFileUrl)
    }
    minutesFileUrl = await uploadFile(input.minutesFile, "sessions/minutes")
  }

  if (input.audioFile) {
    if (audioFileUrl) {
      await deleteFile(audioFileUrl)
    }
    audioFileUrl = await uploadFile(input.audioFile, "sessions/audios")
  }

  const result = await db
    .update(sessions)
    .set({
      date: input.date,
      type: input.type,
      agendaFileUrl,
      minutesFileUrl,
      audioFileUrl,
      videoUrl: input.videoUrl,
      isPublished: input.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, input.id))
    .returning()

  return result[0]
}

export async function deleteSession(id: number) {
  const session = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)

  if (!session.length) {
    throw new Error("Sesión no encontrada")
  }

  // Eliminar archivos asociados
  if (session[0].agendaFileUrl) {
    await deleteFile(session[0].agendaFileUrl)
  }

  if (session[0].minutesFileUrl) {
    await deleteFile(session[0].minutesFileUrl)
  }

  if (session[0].audioFileUrl) {
    await deleteFile(session[0].audioFileUrl)
  }

  await db.delete(sessions).where(eq(sessions.id, id))

  return { success: true }
}

export async function getSessionById(id: number) {
  const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
  return result[0] || null
}

export async function getSessions({
  year,
  type,
  limit = 10,
  offset = 0,
  onlyPublished = true,
}: {
  year?: number
  type?: "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
  limit?: number
  offset?: number
  onlyPublished?: boolean
}) {
  let query = db.select().from(sessions)

  const conditions = []

  if (onlyPublished) {
    conditions.push(eq(sessions.isPublished, true))
  }

  if (type) {
    conditions.push(eq(sessions.type, type))
  }

  if (year) {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)
    conditions.push(sql`${sessions.date} >= ${startDate}`)
    conditions.push(sql`${sessions.date} <= ${endDate}`)
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const result = await query.orderBy(desc(sessions.date)).limit(limit).offset(offset)

  return result
}

export async function getSessionsCount({
  year,
  type,
  onlyPublished = true,
}: {
  year?: number
  type?: "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
  onlyPublished?: boolean
}) {
  let query = db.select({ count: sql<number>`count(*)` }).from(sessions)

  const conditions = []

  if (onlyPublished) {
    conditions.push(eq(sessions.isPublished, true))
  }

  if (type) {
    conditions.push(eq(sessions.type, type))
  }

  if (year) {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)
    conditions.push(sql`${sessions.date} >= ${startDate}`)
    conditions.push(sql`${sessions.date} <= ${endDate}`)
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const result = await query
  return result[0].count
}
