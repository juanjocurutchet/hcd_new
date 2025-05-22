"use server"

import { sql } from "@/lib/db"

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
  type?: string
}

export type Contact = {
  id: number
  name: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
  type?: string
  createdAt: Date
  isRead: boolean
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    const result = await sql`
      INSERT INTO contact_messages (
        name, email, phone, organization, subject, message, type
      ) VALUES (
        ${formData.name},
        ${formData.email},
        ${formData.phone || null},
        ${formData.organization || null},
        ${formData.subject},
        ${formData.message},
        ${formData.type || "contact"}
      )
      RETURNING id
    `

    return { success: true, id: result[0]?.id }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error: "Error al enviar el formulario. Por favor, inténtelo de nuevo." }
  }
}

export async function getAllContacts(): Promise<Contact[]> {
  try {
    const result = await sql`
      SELECT
        id,
        name,
        email,
        phone,
        organization,
        subject,
        message,
        type,
        created_at as "createdAt",
        is_read as "isRead"
      FROM contact_messages
      ORDER BY created_at DESC
    `

    return result as unknown as Contact[]
  } catch (error) {
    console.error("Error fetching all contacts:", error)
    return []
  }
}