import { db } from "@/lib/db"
import { contactMessages } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { sendEmail } from "@/lib/email"

export type ContactMessageInput = {
  name: string
  email: string
  phone?: string
  organization?: string
  subject: string
  message: string
  type?: string
}

export async function createContactMessage(input: ContactMessageInput) {
  const result = await db
    .insert(contactMessages)
    .values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      organization: input.organization,
      subject: input.subject,
      message: input.message,
      type: input.type || "contact",
    })
    .returning()

  // Enviar notificación por email
  await sendEmail({
    to: process.env.NOTIFICATION_EMAIL || "admin@hcdlasflores.gob.ar",
    subject: `Nuevo mensaje de contacto: ${input.subject}`,
    text: `
      Nombre: ${input.name}
      Email: ${input.email}
      Teléfono: ${input.phone || "No proporcionado"}
      Organización: ${input.organization || "No proporcionada"}
      Tipo: ${input.type || "Contacto"}

      Mensaje:
      ${input.message}
    `,
  })

  return result[0]
}

export async function getContactMessages(limit = 10, offset = 0, type?: string) {
  let query = db.select().from(contactMessages)

  if (type) {
    query = query.where(eq(contactMessages.type, type))
  }

  const result = await query.orderBy(desc(contactMessages.createdAt)).limit(limit).offset(offset)

  return result
}

export async function markMessageAsRead(id: number) {
  const result = await db
    .update(contactMessages)
    .set({ isRead: true, updatedAt: new Date() })
    .where(eq(contactMessages.id, id))
    .returning()

  return result[0]
}

export async function deleteContactMessage(id: number) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id))
  return { success: true }
}
