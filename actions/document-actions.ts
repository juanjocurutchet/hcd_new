"use server"

import { sql } from "@/lib/db"

export type Document = {
  id: number
  title: string
  number: string | null
  type: "ordenanza" | "decreto" | "resolucion" | "comunicacion"
  content: string | null
  file_url: string | null
  published_at: Date | null
  isPublished: boolean
}

export type Session = {
  id: number
  date: Date
  type: "ordinaria" | "extraordinaria" | "especial" | "preparatoria"
  agenda_file_url: string | null
  minutes_file_url: string | null
  audio_file_url: string | null
  video_url: string | null
}

export async function getLatestDocuments(limit = 10, type?: string): Promise<Document[]> {
  try {
    // Usar la sintaxis de plantilla etiquetada (tagged template) con casting de tipo
    if (type) {
      const result = await sql`
        SELECT id, title, number, type, content, file_url, published_at
        FROM documents
        WHERE is_published = true AND type = ${type}
        ORDER BY published_at DESC
        LIMIT ${limit}
      `
      return result as unknown as Document[]
    } else {
      const result = await sql`
        SELECT id, title, number, type, content, file_url, published_at
        FROM documents
        WHERE is_published = true
        ORDER BY published_at DESC
        LIMIT ${limit}
      `
      return result as unknown as Document[]
    }
  } catch (error) {
    console.error("Error fetching latest documents:", error)
    return []
  }
}

export async function getLatestSessions(limit = 6): Promise<Session[]> {
  try {
    const result = await sql`
      SELECT id, date, type, agenda_file_url, minutes_file_url, audio_file_url, video_url
      FROM sessions
      WHERE is_published = true
      ORDER BY date DESC
      LIMIT ${limit}
    `

    return result as unknown as Session[]
  } catch (error) {
    console.error("Error fetching latest sessions:", error)
    return []
  }
}

export async function searchDocuments({
  searchTerm = "",
  type,
  limit = 10,
  offset = 0,
  onlyPublished = true,
}: {
  searchTerm?: string
  type?: string
  limit?: number
  offset?: number
  onlyPublished?: boolean
}): Promise<Document[]> {
  try {
    const result = await sql`
      SELECT id, title, number, type, content, file_url, published_at
      FROM documents
      WHERE (${onlyPublished} IS NOT NULL AND is_published = ${onlyPublished})
      AND (${type} IS NULL OR type = ${type})
      AND (
        title ILIKE ${"%" + searchTerm + "%"}
        OR COALESCE(content, '') ILIKE ${"%" + searchTerm + "%"}
        OR COALESCE(number, '') ILIKE ${"%" + searchTerm + "%"}
      )
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result as unknown as Document[]
  } catch (error) {
    console.error(`Error searching documents:`, error)
    return []
  }
}