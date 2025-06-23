import { db } from "@/lib/db-singleton"
import { committees, councilMembers } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function getAllCommissions() {
  try {
    const result = await db
      .select({
        id: committees.id,
        name: committees.name,
        description: committees.description,
        presidentId: committees.presidentId,
        secretaryId: committees.secretaryId,
        isActive: committees.isActive,
        createdAt: committees.createdAt,
        updatedAt: committees.updatedAt,
        presidentName: councilMembers.name, // ✅ Nombre del presidente
      })
      .from(committees)
      .leftJoin(councilMembers, eq(committees.presidentId, councilMembers.id))

    return result
  } catch (error) {
    console.error("Error fetching commissions:", error)
    return []
  }
}

export async function getCommissionById(id: number) {
  try {
    const result = await db
      .select()
      .from(committees)
      .where(eq(committees.id, id))
      .limit(1)

    return result[0] || null
  } catch (error) {
    console.error("Error fetching commission by id:", error)
    return null
  }
}