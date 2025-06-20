import { db } from "@/lib/db-singleton"
import { committees } from "@/lib/db/schema"

import { eq } from "drizzle-orm"

export async function getAllCommissions() {
  try {
    return await db.select().from(committees)
  } catch (error) {
    console.error("Error fetching commissions:", error)
    return []
  }
}

export async function getCommissionById(id: number) {
  try {
    const result = await db.select().from(committees).where(eq(committees.id, id))
    return result[0] || null
  } catch (error) {
    console.error("Error fetching commission by id:", error)
    return null
  }
}
