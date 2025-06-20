import { db } from "@/lib/db-singleton"
import { councilMembers, politicalBlocks } from "@/lib/db/schema"
import { eq, asc, sql, and } from "drizzle-orm"

export type CouncilMember = {
  id: number
  name: string
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
  position: string | null
  blockId: number | null
  mandate: string | null
  bio: string | null
  isActive: boolean
}

export type CouncilMemberWithBlock = CouncilMember & {
  blockName: string | null
}

export type PoliticalBlock = {
  id: number
  name: string
  presidentId: number | null
  color: string | null
  description: string | null
  memberCount: number
}

export async function getAllCouncilMembersWithBlock(): Promise<CouncilMemberWithBlock[]> {
  try {
    const result = await db
      .select({
        id: councilMembers.id,
        name: councilMembers.name,
        imageUrl: councilMembers.imageUrl,
        createdAt: councilMembers.createdAt,
        updatedAt: councilMembers.updatedAt,
        position: councilMembers.position,
        blockId: councilMembers.blockId,
        mandate: councilMembers.mandate,
        bio: councilMembers.bio,
        isActive: councilMembers.isActive,
        blockName: politicalBlocks.name,
      })
      .from(councilMembers)
      .leftJoin(politicalBlocks, eq(councilMembers.blockId, politicalBlocks.id))
      .orderBy(asc(councilMembers.name))

    return result
  } catch (error) {
    console.error("Error fetching council members with block:", error)
    return []
  }
}

export async function getAllPoliticalBlocks(): Promise<PoliticalBlock[]> {
  try {
    const blocks = await db
      .select({
        id: politicalBlocks.id,
        name: politicalBlocks.name,
        presidentId: politicalBlocks.presidentId,
        color: politicalBlocks.color,
        description: politicalBlocks.description,
      })
      .from(politicalBlocks)
      .orderBy(asc(politicalBlocks.name))

    const blocksWithCounts = await Promise.all(
      blocks.map(async (block): Promise<PoliticalBlock> => {
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(councilMembers)
          .where(and(eq(councilMembers.blockId, block.id), eq(councilMembers.isActive, true)))

        return {
          ...block,
          memberCount: Number(countResult[0].count || 0),
        }
      }),
    )

    return blocksWithCounts
  } catch (error) {
    console.error("Error fetching political blocks:", error)
    return []
  }
}

// actions/concejal-actions.ts

export async function updateCouncilMember(id: number, formData: FormData, userId: string, role: string) {
  const response = await fetch(`/api/concejales/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      "x-user-id": userId,
      "x-user-role": role,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al actualizar concejal")
  }

  return await response.json()
}

export async function createCouncilMember(formData: FormData, userId: string, role: string) {
  const response = await fetch("/api/concejales", {
    method: "POST",
    body: formData,
    headers: {
      "x-user-id": userId,
      "x-user-role": role,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al crear concejal")
  }

  return await response.json()
}
