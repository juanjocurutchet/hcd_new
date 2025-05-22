import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Crear una conexión SQL usando la variable de entorno DATABASE_URL
export const sql = neon(process.env.DATABASE_URL!)

// Crear una instancia de Drizzle
export const db = drizzle(sql)