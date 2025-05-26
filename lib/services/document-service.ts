import { documents } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { uploadFile, deleteFile } from "@/lib/storage"
import { db } from "../db-singleton"
import { DocumentType } from "@/types/document"

export type DocumentInput = {
  title: string
  number?: string
  type: "ordenanza" | "decreto" | "resolucion" | "comunicacion"
  content?: string
  file?: File | null
  publishedAt?: Date
  authorId: number
  isPublished?: boolean
}

export type DocumentUpdateInput = Partial<DocumentInput> & {
  id: number
}

export async function createDocument(input: DocumentInput) {
  let fileUrl = null

  if (input.file) {
    fileUrl = await uploadFile(input.file, "documents")
  }

  const result = await db.insert(documents).values({
    title: input.title,
    number: input.number,
    type: input.type,
    content: input.content,
    fileUrl: fileUrl,
    publishedAt: input.publishedAt || new Date(),
    authorId: input.authorId,
    isPublished: input.isPublished ?? true,
  }).returning()

  return result[0]
}

export async function updateDocument(input: DocumentUpdateInput) {
  const currentDoc = await db.select().from(documents).where(eq(documents.id, input.id)).limit(1)

  if (!currentDoc.length) {
    throw new Error("Documento no encontrado")
  }

  let fileUrl = currentDoc[0].fileUrl

  if (input.file) {
    // Si hay un archivo anterior, eliminarlo
    if (fileUrl) {
      await deleteFile(fileUrl)
    }
    fileUrl = await uploadFile(input.file, "documents")
  }

  const result = await db.update(documents)
    .set({
      title: input.title,
      number: input.number,
      type: input.type,
      content: input.content,
      fileUrl: fileUrl,
      publishedAt: input.publishedAt,
      isPublished: input.isPublished,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, input.id))
    .returning()

  return result[0]
}

export async function getDocumentById(id: number) {
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1)

  if (!result.length) {
    return null
  }

  return result[0]
}

export async function deleteDocument(id: number) {
  const currentDoc = await db.select().from(documents).where(eq(documents.id, id)).limit(1)

  if (!currentDoc.length) {
    throw new Error("Documento no encontrado")
  }

  const fileUrl = currentDoc[0].fileUrl

  // Si hay un archivo asociado, eliminarlo
  if (fileUrl) {
    await deleteFile(fileUrl)
  }

  await db.delete(documents).where(eq(documents.id, id))

  return { success: true }
}

export async function getDocuments({
  limit = 10,
  offset = 0,
  onlyPublished = true,
}: {
  limit?: number
  offset?: number
  onlyPublished?: boolean
}): Promise<DocumentType[]> {
  const conditions = onlyPublished
    ? sql`WHERE is_published = true`
    : sql``

  const result = await db.execute<DocumentType>(sql`
    SELECT id, title, type, number, published_at, is_published as "isPublished"
    FROM documents
    ${conditions}
    ORDER BY published_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `)

  return result.rows
}

