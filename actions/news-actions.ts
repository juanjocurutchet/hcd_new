"use server"

import { sql } from "@/lib/db"

export type News = {
  id: number
  title: string
  content: string
  excerpt: string | null
  image_url: string | null
  published_at: Date
  slug: string
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  try {
    const result = await sql`
      SELECT id, title, content, excerpt, image_url, published_at, slug
      FROM news
      WHERE is_published = true
      ORDER BY published_at DESC
      LIMIT ${limit}
    `

    return result as unknown as News[]
  } catch (error) {
    console.error("Error fetching latest news:", error)
    return []
  }
}

export async function getNewsById(id: number): Promise<News | null> {
  try {
    const result = await sql`
      SELECT id, title, content, excerpt, image_url, published_at, slug
      FROM news
      WHERE id = ${id} AND is_published = true
    `

    if (result.length === 0) return null
    return result[0] as unknown as News
  } catch (error) {
    console.error(`Error fetching news with id ${id}:`, error)
    return null
  }
}

export async function getNewsForSlider(limit = 3): Promise<News[]> {
  try {
    const result = await sql`
      SELECT id, title, content, excerpt, image_url, published_at, slug
      FROM news
      WHERE is_published = true
      ORDER BY published_at DESC
      LIMIT ${limit}
    `

    return result as unknown as News[]
  } catch (error) {
    console.error("Error fetching news for slider:", error)
    return []
  }
}