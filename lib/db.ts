import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Crear una única instancia de conexión
const sql = neon(process.env.DATABASE_URL)

// Pool de conexiones simple para evitar crear demasiadas conexiones
let connectionCount = 0
const MAX_CONNECTIONS = 10

const createConnection = () => {
  if (connectionCount >= MAX_CONNECTIONS) {
    console.warn(`Máximo de conexiones alcanzado: ${connectionCount}`)
  } else {
    connectionCount++
    console.log(`Creando nueva conexión a la base de datos... (${connectionCount}/${MAX_CONNECTIONS})`)
  }
  return sql
}

export { createConnection as sql }
