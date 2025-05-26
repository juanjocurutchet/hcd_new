"use server"

import {
  getAllNews as fetchAll,
  getNewsById as fetchById,
  deleteNews as remove
} from "@/services/newsService"

import { News } from "@/types/news"

export async function getAllNews(): Promise<News[]> {
  try {
    return await fetchAll()
  } catch (error) {
    console.error("Error al obtener noticias:", error)
    return []
  }
}

export async function getNewsById(id: number): Promise<News | null> {
  try {
    return await fetchById(id)
  } catch (error) {
    console.error("Error al obtener noticia:", error)
    return null
  }
}

export async function deleteNews(id: number): Promise<{ success: boolean }> {
  try {
    await remove(id)
    return { success: true }
  } catch (error) {
    console.error("Error al eliminar noticia:", error)
    return { success: false }
  }
}
