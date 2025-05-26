import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

console.log("Creando nueva conexión a la base de datos...")

export const sql = neon(process.env.DATABASE_URL)

export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log("Conexión a la base de datos exitosa:", result)
    return true
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error)
    return false
  }
}
