import { relations } from "drizzle-orm"
import { pgTable, serial, text, timestamp, varchar, integer, boolean, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const documentTypeEnum = pgEnum("document_type", ["ordenanza", "decreto", "resolucion", "comunicacion"])
export const sessionTypeEnum = pgEnum("session_type", ["ordinaria", "extraordinaria", "especial", "preparatoria"])

// Tablas
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("editor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: varchar("image_url", { length: 255 }),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  authorId: integer("author_id").references(() => users.id),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const councilMembers = pgTable("council_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  position: varchar("position", { length: 255 }),
  blockId: integer("block_id").references(() => politicalBlocks.id),
  mandate: varchar("mandate", { length: 100 }),
  imageUrl: varchar("image_url", { length: 255 }),
  bio: text("bio"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const politicalBlocks = pgTable("political_blocks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  presidentId: integer("president_id"),
  color: varchar("color", { length: 50 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const committees = pgTable("committees", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  presidentId: integer("president_id").references(() => councilMembers.id),
  secretaryId: integer("secretary_id").references(() => councilMembers.id), // ✅ Añadir
  isActive: boolean("is_active").default(true).notNull(), // ✅ Añadir
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const committeeMembers = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  committeeId: integer("committee_id")
    .references(() => committees.id)
    .notNull(),
  councilMemberId: integer("council_member_id")
    .references(() => councilMembers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  number: varchar("number", { length: 100 }),
  type: documentTypeEnum("type").notNull(),
  content: text("content"),
  fileUrl: varchar("file_url", { length: 255 }),
  publishedAt: timestamp("published_at"),
  authorId: integer("author_id").references(() => users.id),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  agendaFileUrl: varchar("agenda_file_url", { length: 255 }),
  minutesFileUrl: varchar("minutes_file_url", { length: 255 }),
  audioFileUrl: varchar("audio_file_url", { length: 255 }),
  videoUrl: varchar("video_url", { length: 255 }),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  organization: varchar("organization", { length: 255 }),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("contact").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const activityParticipants = pgTable("activity_participants", {
  id: serial("id").primaryKey(),
  activityId: integer("activity_id")
    .references(() => activities.id)
    .notNull(),
  councilMemberId: integer("council_member_id")
    .references(() => councilMembers.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relaciones
export const usersRelations = relations(users, ({ many }) => ({
  news: many(news),
  documents: many(documents),
}))

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}))

export const councilMembersRelations = relations(councilMembers, ({ one, many }) => ({
  block: one(politicalBlocks, {
    fields: [councilMembers.blockId],
    references: [politicalBlocks.id],
  }),
  committeeParticipations: many(committeeMembers),
  activityParticipations: many(activityParticipants),
}))

export const politicalBlocksRelations = relations(politicalBlocks, ({ many }) => ({
  members: many(councilMembers),
}))

export const committeesRelations = relations(committees, ({ one, many }) => ({
  president: one(councilMembers, {
    fields: [committees.presidentId],
    references: [councilMembers.id],
  }),
  secretary: one(councilMembers, {
    fields: [committees.secretaryId],
    references: [councilMembers.id],
  }),
  members: many(committeeMembers),
}))

export const committeesMembersRelations = relations(committeeMembers, ({ one }) => ({
  committee: one(committees, {
    fields: [committeeMembers.committeeId],
    references: [committees.id],
  }),
  councilMember: one(councilMembers, {
    fields: [committeeMembers.councilMemberId],
    references: [councilMembers.id],
  }),
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  author: one(users, {
    fields: [documents.authorId],
    references: [users.id],
  }),
}))

export const activitiesRelations = relations(activities, ({ many }) => ({
  participants: many(activityParticipants),
}))

export const activityParticipantsRelations = relations(activityParticipants, ({ one }) => ({
  activity: one(activities, {
    fields: [activityParticipants.activityId],
    references: [activities.id],
  }),
  councilMember: one(councilMembers, {
    fields: [activityParticipants.councilMemberId],
    references: [councilMembers.id],
  }),
}))
