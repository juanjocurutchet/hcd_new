export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle/migrations",
  adapter: "pg",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
}
