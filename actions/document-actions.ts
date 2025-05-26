"use server"

import { sql } from "@/lib/db"

export type DocumentType = {
  id: number
  title: string
  type: string
  number: string
  published_at: Date
  isPublished: boolean
  file_url?: string
  description?: string
}

export async function searchDocuments(query?: string): Promise<DocumentType[]> {
  try {
    if (!query || query.trim() === "") {
      const result = await sql`
        SELECT id, title, type, number, published_at, is_published as "isPublished", file_url, description
        FROM documents
        ORDER BY published_at DESC
        LIMIT 50
      `
      return result as unknown as DocumentType[]
    }

    const searchTerm = `%${query}%`
    const result = await sql`
      SELECT id, title, type, number, published_at, is_published as "isPublished", file_url, description
      FROM documents
      WHERE title ILIKE ${searchTerm}
         OR type ILIKE ${searchTerm}
         OR number ILIKE ${searchTerm}
         OR description ILIKE ${searchTerm}
      ORDER BY published_at DESC
      LIMIT 50
    `
    return result as unknown as DocumentType[]
  } catch (error) {
    console.error("Error searching documents:", error)
    return []
  }
}

export async function getDocumentById(id: number): Promise<DocumentType | null> {
  try {
    const result = await sql`
      SELECT id, title, type, number, published_at, is_published as "isPublished", file_url, description
      FROM documents
      WHERE id = ${id}
    `
    return (result[0] as unknown as DocumentType) || null
  } catch (error) {
    console.error("Error getting document by id:", error)
    return null
  }
}

export async function deleteDocument(id: number) {
  try {
    await sql`DELETE FROM documents WHERE id = ${id}`
    return { success: true }
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}
