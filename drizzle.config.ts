import { defineConfig } from "drizzle-kit";

// Usar Turso em produção, PostgreSQL em desenvolvimento
const useTurso = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

if (useTurso) {
  // Configuração para Turso (SQLite/libSQL)
  export default defineConfig({
    out: "./migrations-turso",
    schema: "./shared/schema-turso.ts",
    dialect: "sqlite",
    driver: "turso",
    dbCredentials: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
  });
} else {
  // Configuração para PostgreSQL (desenvolvimento)
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for PostgreSQL");
  }
  
  export default defineConfig({
    out: "./migrations",
    schema: "./shared/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  });
}
