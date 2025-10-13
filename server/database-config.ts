import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "@shared/schema";

export type DatabaseType = 'sqlite' | 'turso';

export interface DatabaseConfig {
  type: DatabaseType;
  connectionString?: string;
  authToken?: string;
  sqliteFile?: string;
}

function getDatabaseConfig(): DatabaseConfig {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    return {
      type: 'turso',
      connectionString: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    };
  }
  
  return {
    type: 'sqlite',
    sqliteFile: process.env.SQLITE_FILE || './database.db'
  };
}

export const dbConfig = getDatabaseConfig();

export function createDatabaseConnection() {
  switch (dbConfig.type) {
    case 'sqlite':
      const sqlite = new Database(dbConfig.sqliteFile!);
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS properties (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          price TEXT NOT NULL,
          city_id TEXT NOT NULL,
          category_id TEXT NOT NULL,
          bedrooms INTEGER,
          bathrooms INTEGER,
          area INTEGER NOT NULL,
          images TEXT DEFAULT '[]',
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
          images TEXT DEFAULT '[]',
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
          images TEXT DEFAULT '[]',
          amenities TEXT DEFAULT '[]',
          featured BOOLEAN DEFAULT FALSE,
          development_year TEXT NOT NULL,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS property_categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          image_url TEXT NOT NULL,
          display_order INTEGER DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS hero_settings (
          id TEXT PRIMARY KEY,
          images TEXT DEFAULT '[]',
          title_line1 TEXT,
          title_line2 TEXT,
          title_line3 TEXT,
          description TEXT,
          carousel_enabled BOOLEAN DEFAULT TRUE,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS cities (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          image_url TEXT NOT NULL,
          display_order INTEGER DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS about_us (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_url TEXT,
          display_order INTEGER DEFAULT 0,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS employees (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          position TEXT NOT NULL,
          department TEXT,
          bio TEXT,
          email TEXT,
          phone TEXT,
          image_url TEXT,
          display_order INTEGER DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
      `);
      return drizzleSqlite(sqlite, { schema });
      
    case 'turso':
      const tursoClient = createClient({
        url: dbConfig.connectionString!,
        authToken: dbConfig.authToken!
      });
      return drizzleLibsql(tursoClient, { schema });
      
    default:
      throw new Error(`Tipo de banco de dados não suportado: ${dbConfig.type}`);
  }
}

export function getDatabaseStatus() {
  return {
    type: dbConfig.type,
    connected: true,
    file: dbConfig.type === 'sqlite' ? dbConfig.sqliteFile : undefined,
    url: dbConfig.type === 'turso' ? 'Connected to Turso' : undefined
  };
}
