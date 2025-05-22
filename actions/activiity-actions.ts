"use server"

import { sql } from "@/lib/db"

export type Activity = {
  id: number
  title: string
  description: string
  date: Date
  image_url: string | null
  isPublished?: boolean
}

export type ActivityWithParticipants = Activity & {
  participants: string[]
}

export async function getLatestActivities(limit = 4): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT id, title, description, date, image_url
      FROM activities
      WHERE is_published = true
      ORDER BY date DESC
      LIMIT ${limit}
    `

    return result as unknown as Activity[]
  } catch (error) {
    console.error("Error fetching latest activities:", error)
    return []
  }
}

export async function getAllActivities(): Promise<Activity[]> {
  try {
    const result = await sql`
      SELECT id, title, description, date, image_url, is_published as "isPublished"
      FROM activities
      ORDER BY date DESC
    `

    return result as unknown as Activity[]
  } catch (error) {
    console.error("Error fetching all activities:", error)
    return []
  }
}

export async function getActivityWithParticipants(activityId: number): Promise<ActivityWithParticipants | null> {
  try {
    const activities = await sql`
      SELECT id, title, description, date, image_url
      FROM activities
      WHERE id = ${activityId} AND is_published = true
    `

    if (activities.length === 0) {
      return null
    }

    const activity = activities[0] as unknown as Activity

    const participantsResult = await sql`
      SELECT cm.name
      FROM activity_participants ap
      JOIN council_members cm ON ap.council_member_id = cm.id
      WHERE ap.activity_id = ${activityId}
    `

    const participants = participantsResult.map((p) => p.name)

    return {
      ...activity,
      participants,
    }
  } catch (error) {
    console.error(`Error fetching activity with id ${activityId}:`, error)
    return null
  }
}