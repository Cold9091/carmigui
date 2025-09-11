import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuração do banco de dados baseada em variáveis de ambiente
export type DatabaseType = 'sqlite' | 'neon' | 'supabase';

export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  sqliteFile?: string;
}

// Detectar automaticamente o tipo de banco baseado nas variáveis de ambiente
function getDatabaseConfig(): DatabaseConfig {
  // Prioridade: 1. SQLite (desenvolvimento local), 2. Neon (PostgreSQL), 3. Supabase
  
  if (process.env.USE_SQLITE === 'true') {
    return {
      type: 'sqlite',
      sqliteFile: process.env.SQLITE_FILE || './database.db'
    };
  }
  
  if (process.env.DATABASE_URL) {
    return {
      type: 'neon',
      connectionString: process.env.DATABASE_URL
    };
  }
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return {
      type: 'supabase',
      connectionString: process.env.DATABASE_URL // Supabase também fornece DATABASE_URL
    };
  }
  
  // Fallback para SQLite se nenhuma configuração for encontrada
  return {
    type: 'sqlite',
    sqliteFile: './database.db'
  };
}

export const dbConfig = getDatabaseConfig();

// Criar conexão baseada na configuração
export function createDatabaseConnection() {
  switch (dbConfig.type) {
    case 'sqlite':
      const sqlite = new Database(dbConfig.sqliteFile!);
      // Criar tabelas se não existirem
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS properties (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          price TEXT NOT NULL,
          location TEXT NOT NULL,
          type TEXT NOT NULL,
          bedrooms INTEGER,
          bathrooms INTEGER,
          area INTEGER NOT NULL,
          images TEXT,
          virtual_tour_url TEXT,
          status TEXT NOT NULL DEFAULT 'available',
          featured BOOLEAN DEFAULT FALSE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          area INTEGER NOT NULL,
          duration TEXT NOT NULL,
          units TEXT NOT NULL,
          year TEXT NOT NULL,
          status TEXT NOT NULL,
          images TEXT,
          featured BOOLEAN DEFAULT FALSE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS condominiums (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          centrality_or_district TEXT NOT NULL,
          total_units INTEGER NOT NULL,
          completed_units INTEGER DEFAULT 0,
          available_units INTEGER NOT NULL,
          price_range TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'in-development',
          images TEXT,
          amenities TEXT,
          featured BOOLEAN DEFAULT FALSE,
          development_year TEXT NOT NULL,
          created_at TEXT,
          updated_at TEXT
        );
      `);
      return drizzleSqlite(sqlite, { schema });
      
    case 'neon':
      neonConfig.webSocketConstructor = ws;
      const pool = new Pool({ connectionString: dbConfig.connectionString! });
      return drizzleNeon({ client: pool, schema });
      
    case 'supabase':
      // Para Supabase, ainda usamos a conexão PostgreSQL
      neonConfig.webSocketConstructor = ws;
      const supabasePool = new Pool({ connectionString: dbConfig.connectionString! });
      return drizzleNeon({ client: supabasePool, schema });
      
    default:
      throw new Error(`Tipo de banco de dados não suportado: ${dbConfig.type}`);
  }
}

// Status da conexão do banco
export function getDatabaseStatus() {
  return {
    type: dbConfig.type,
    connected: true,
    file: dbConfig.type === 'sqlite' ? dbConfig.sqliteFile : undefined,
    url: dbConfig.type !== 'sqlite' ? (dbConfig.connectionString ? 'Connected' : 'Not configured') : undefined
  };
}