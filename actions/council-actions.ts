"use server"

import { sql } from "@/lib/db"

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

    console.log("Council members result:", result)
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
    // Eliminamos la columna 'description' que no existe en la tabla
    const blocks = await sql`
      SELECT id, name, president_id, color
      FROM political_blocks
      ORDER BY name
    `

    // Para cada bloque, obtener la cantidad de miembros
    const blocksWithCounts = await Promise.all(
      blocks.map(async (block) => {
        const countResult = await sql`
          SELECT COUNT(*) as count
          FROM council_members
          WHERE block_id = ${block.id} AND is_active = true
        `

        return {
          ...block,
          memberCount: countResult[0]?.count || 0,
        }
      }),
    )

    return blocksWithCounts as unknown as PoliticalBlock[]
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