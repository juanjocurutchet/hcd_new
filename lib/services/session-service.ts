"use server"

import { sql } from "@/lib/db"
import { desc } from "drizzle-orm"
import { sessions } from "../db/schema"
import { db } from "../db-singleton"
import { uploadFile } from "../storage"

export type CouncilMember = {
  id: number
  name: string
  position: string | null
  block_id: number
  blockName?: string
  mandate: string | null
  image_url: string | null
  bio: string | null
  is_active: boolean
  isActive?: boolean
}

export type PoliticalBlock = {
  id: number
  name: string
  president_id: number | null
  color: string | null
  description?: string
  memberCount?: number
}

export type Session = {
  id: number
  date: Date
  type: string
  agendaFileUrl: string | null
  minutesFileUrl: string | null
  audioFileUrl: string | null
  videoUrl: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getActiveCouncilMembers(): Promise<CouncilMember[]> {
  try {
    const result = await sql`
      SELECT id, name, position, block_id, mandate, image_url, bio, is_active
      FROM council_members
      WHERE is_active = true
      ORDER BY
        CASE
          WHEN position = 'Presidente' THEN 1
          WHEN position LIKE 'Vicepresidente%' THEN 2
          ELSE 3
        END,
        name
    `
    return result as unknown as CouncilMember[]
  } catch (error) {
    console.error("Error fetching active council members:", error)
    return []
  }
}

export async function getAllCouncilMembers(): Promise<CouncilMember[]> {
  try {
    const result = await sql`
      SELECT
        cm.id,
        cm.name,
        cm.position,
        cm.block_id,
        pb.name as "blockName",
        cm.mandate,
        cm.image_url,
        cm.bio,
        cm.is_active as "isActive"
      FROM council_members cm
      LEFT JOIN political_blocks pb ON cm.block_id = pb.id
      ORDER BY
        CASE
          WHEN cm.position = 'Presidente' THEN 1
          WHEN cm.position LIKE 'Vicepresidente%' THEN 2
          ELSE 3
        END,
        cm.name
    `
    return result as unknown as CouncilMember[]
  } catch (error) {
    console.error("Error fetching all council members:", error)
    return []
  }
}

export async function getPoliticalBlocks(): Promise<PoliticalBlock[]> {
  try {
    const result = await sql`
      SELECT id, name, president_id, color
      FROM political_blocks
      ORDER BY name
    `
    return result as unknown as PoliticalBlock[]
  } catch (error) {
    console.error("Error fetching political blocks:", error)
    return []
  }
}

export async function getAllPoliticalBlocks(): Promise<PoliticalBlock[]> {
  try {
    const blocks = await sql`
      SELECT id, name, president_id, color
      FROM political_blocks
      ORDER BY name
    `

    const blocksWithCounts = await Promise.all(
      (blocks as PoliticalBlock[]).map(async (block) => {
        const countResult = await sql`
          SELECT COUNT(*) as count
          FROM council_members
          WHERE block_id = ${block.id} AND is_active = true
        `

        return {
          ...block,
          memberCount: Number(countResult[0]?.count) || 0,
        }
      })
    )

    return blocksWithCounts
  } catch (error) {
    console.error("Error fetching all political blocks:", error)
    return []
  }
}

export async function getCouncilMembersByBlock(blockId: number): Promise<CouncilMember[]> {
  try {
    const result = await sql`
      SELECT id, name, position, block_id, mandate, image_url, bio, is_active
      FROM council_members
      WHERE block_id = ${blockId} AND is_active = true
      ORDER BY
        CASE
          WHEN position = 'Presidente' THEN 1
          WHEN position LIKE 'Vicepresidente%' THEN 2
          ELSE 3
        END,
        name
    `
    return result as unknown as CouncilMember[]
  } catch (error) {
    console.error(`Error fetching council members for block ${blockId}:`, error)
    return []
  }
}

export async function getCouncilMemberById(id: number): Promise<CouncilMember | null> {
  try {
    const result = await sql`
      SELECT
        cm.id,
        cm.name,
        cm.position,
        cm.block_id,
        pb.name as "blockName",
        cm.mandate,
        cm.image_url,
        cm.bio,
        cm.is_active as "isActive"
      FROM council_members cm
      LEFT JOIN political_blocks pb ON cm.block_id = pb.id
      WHERE cm.id = ${id}
    `
    return (result[0] as unknown as CouncilMember) || null
  } catch (error) {
    console.error("Error getting council member by id:", error)
    return null
  }
}

export async function deleteCouncilMember(id: number) {
  try {
    await sql`DELETE FROM council_members WHERE id = ${id}`
    return { success: true }
  } catch (error) {
    console.error("Error deleting council member:", error)
    throw error
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const result = await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.date))

    return result as Session[]
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return []
  }
}

export async function getSessionById(id: number): Promise<Session | null> {
  try {
    const result = await sql`
      SELECT *
      FROM sessions
      WHERE id = ${id}
    `
    return (result[0] as Session) || null
  } catch (error) {
    console.error("Error getting session by id:", error)
    return null
  }
}

export async function updateSession(session: {
  id: number
  date: Date
  type: string
  agendaFile?: File | null
  minutesFile?: File | null
  audioFile?: File | null
  videoUrl?: string
  isPublished: boolean
}) {
  try {
    const result = await sql`
      SELECT agenda_file_url, minutes_file_url, audio_file_url
      FROM sessions
      WHERE id = ${session.id}
    `

    const currentData = (result as any[])[0] || {}

    let agendaFileUrl = currentData.agenda_file_url || null
    let minutesFileUrl = currentData.minutes_file_url || null
    let audioFileUrl = currentData.audio_file_url || null

    if (session.agendaFile && session.agendaFile.size > 0) {
      agendaFileUrl = await uploadFile(session.agendaFile, "sesiones")
    }

    if (session.minutesFile && session.minutesFile.size > 0) {
      minutesFileUrl = await uploadFile(session.minutesFile, "sesiones")
    }

    if (session.audioFile && session.audioFile.size > 0) {
      audioFileUrl = await uploadFile(session.audioFile, "sesiones")
    }

    const updated = await sql`
      UPDATE sessions
      SET
        date = ${session.date},
        type = ${session.type},
        agenda_file_url = ${agendaFileUrl},
        minutes_file_url = ${minutesFileUrl},
        audio_file_url = ${audioFileUrl},
        video_url = ${session.videoUrl},
        is_published = ${session.isPublished},
        updated_at = NOW()
      WHERE id = ${session.id}
      RETURNING *
    `

    return (updated as any[])[0]
  } catch (error) {
    console.error("Error updating session:", error)
    throw error
  }
}

export async function deleteSession(id: number) {
  try {
    await sql`
      DELETE FROM sessions
      WHERE id = ${id}
    `
    console.log(`Session with ID ${id} deleted successfully.`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}