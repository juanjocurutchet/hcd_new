"use server"

import { sql } from "@/lib/db"

export type News = {
  id: number
  title: string
  content: string
  excerpt: string
  published_at: Date
  isPublished: boolean
  image_url?: string
  author?: string
}

export async function getAllNews(): Promise<News[]> {
  try {
    const result = await sql`
      SELECT id, title, content, excerpt, published_at, is_published as "isPublished", image_url, author
      FROM news
      ORDER BY published_at DESC
    `
    return result as unknown as News[]
  } catch (error) {
    console.error("Error fetching all news:", error)
    return []
  }
}

export async function getNewsById(id: number): Promise<News | null> {
  try {
    const result = await sql`
      SELECT id, title, content, excerpt, published_at, is_published as "isPublished", image_url, author
      FROM news
      WHERE id = ${id}
    `
    return (result[0] as unknown as News) || null
  } catch (error) {
    console.error("Error getting news by id:", error)
    return null
  }
}

export async function deleteNews(id: number) {
  try {
    await sql`DELETE FROM news WHERE id = ${id}`
    return { success: true }
  } catch (error) {
    console.error("Error deleting news:", error)
    throw error
  }
}
