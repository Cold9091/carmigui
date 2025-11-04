import type { Express } from "express";
import { storage } from "../storage";
import { getDatabaseStatus } from "../db";
import { ensureAuthenticated } from "../auth";

export function registerDatabaseRoutes(app: Express) {
  // Debug: Verificar se admin existe
  app.get("/api/debug/check-admin", async (req, res) => {
    try {
      const admin = await storage.getUserByEmail("admin@carmigui.com");
      res.json({
        exists: !!admin,
        email: admin?.email,
        hasPassword: !!admin?.password,
        createdAt: admin?.createdAt
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Debug: Verificar versão do código deployado
  app.get("/api/debug/version", (req, res) => {
    res.json({
      version: "3.0-WITH-TURSO-SESSION-STORE",
      timestamp: new Date().toISOString(),
      hasTursoSessionStore: storage.sessionStore?.constructor?.name === 'TursoSessionStore',
      sessionStoreType: storage.sessionStore?.constructor?.name || 'unknown',
      nodeEnv: process.env.NODE_ENV
    });
  });

  // Database management routes
  app.post("/api/database/run-migrations", ensureAuthenticated, async (req, res) => {
    try {
      // Check which tables exist by trying to query each one
      const schema = await import('@shared/schema');
      const expectedTables = [
        { name: 'properties', table: schema.properties },
        { name: 'projects', table: schema.projects },
        { name: 'contacts', table: schema.contacts },
        { name: 'condominiums', table: schema.condominiums },
        { name: 'property_categories', table: schema.propertyCategories },
        { name: 'hero_settings', table: schema.heroSettings },
        { name: 'cities', table: schema.cities },
        { name: 'about_us', table: schema.aboutUs },
        { name: 'employees', table: schema.employees },
        { name: 'users', table: schema.users }
      ];
      
      const existingTables: string[] = [];
      const missingTables: string[] = [];
      
      // Test each table
      for (const { name } of expectedTables) {
        try {
          // Try to get the table from storage
          switch (name) {
            case 'properties':
              await storage.getProperties();
              existingTables.push(name);
              break;
            case 'projects':
              await storage.getProjects();
              existingTables.push(name);
              break;
            case 'contacts':
              await storage.getContacts();
              existingTables.push(name);
              break;
            case 'condominiums':
              await storage.getCondominiums();
              existingTables.push(name);
              break;
            case 'property_categories':
              await storage.getPropertyCategories();
              existingTables.push(name);
              break;
            case 'cities':
              await storage.getCities();
              existingTables.push(name);
              break;
            default:
              // For tables without storage methods, assume they exist
              existingTables.push(name);
          }
        } catch (error) {
          missingTables.push(name);
        }
      }
      
      if (missingTables.length > 0) {
        return res.json({
          success: false,
          message: `Encontradas ${missingTables.length} tabelas faltantes no banco de dados`,
          existingTables,
          missingTables,
          recommendation: "Para sincronizar o schema, execute 'npm run db:push --force' no terminal",
          note: "Isso criará todas as tabelas definidas em shared/schema.ts"
        });
      }
      
      res.json({
        success: true,
        message: "✅ Todas as tabelas do schema estão presentes no banco de dados!",
        tables: existingTables,
        totalTables: existingTables.length
      });
    } catch (error) {
      console.error("Migration check failed:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao verificar migrações",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
  
  app.get("/api/database/status", async (req, res) => {
    try {
      const status = getDatabaseStatus();
      res.json(status);
    } catch (error) {
      console.error("Error getting database status:", error);
      res.status(500).json({ message: "Failed to get database status" });
    }
  });

  app.post("/api/database/test", ensureAuthenticated, async (req, res) => {
    try {
      await storage.getProperties();
      res.json({ 
        success: true, 
        message: "Database connection is working",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Database connection test failed:", error);
      res.status(500).json({ 
        success: false, 
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Turso configuration routes
  app.post("/api/database/test-turso", ensureAuthenticated, async (req, res) => {
    try {
      const { databaseUrl, authToken } = req.body;

      if (!databaseUrl || !authToken) {
        return res.status(400).json({
          success: false,
          message: "Database URL e Auth Token são obrigatórios"
        });
      }

      const { createClient } = await import('@libsql/client');
      
      const testClient = createClient({
        url: databaseUrl,
        authToken: authToken
      });
      
      const result = await testClient.execute('SELECT 1 as test');
      await testClient.close();
      
      res.json({
        success: true,
        message: "Conexão com Turso testada com sucesso!",
        result: result.rows[0]
      });
    } catch (error) {
      console.error("Turso connection test failed:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao conectar com o Turso",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  app.post("/api/database/configure-turso", ensureAuthenticated, async (req, res) => {
    try {
      const { databaseUrl, authToken } = req.body;

      if (!databaseUrl || !authToken) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios"
        });
      }

      process.env.TURSO_DATABASE_URL = databaseUrl;
      process.env.TURSO_AUTH_TOKEN = authToken;

      res.json({
        success: true,
        message: "Configurações do Turso salvas temporariamente!",
        warning: "Para tornar as credenciais permanentes, adicione nos Secrets do Replit:",
        secrets: {
          TURSO_DATABASE_URL: databaseUrl,
          TURSO_AUTH_TOKEN: "***" + authToken.slice(-4)
        },
        instructions: [
          "1. Clique em 'Tools' > 'Secrets' no painel lateral",
          "2. Adicione TURSO_DATABASE_URL com o valor da URL",
          "3. Adicione TURSO_AUTH_TOKEN com o valor do token",
          "4. Reinicie o servidor para aplicar as mudanças"
        ]
      });
    } catch (error) {
      console.error("Failed to configure Turso:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao salvar configurações do Turso",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  app.post("/api/database/clear-turso", ensureAuthenticated, async (req, res) => {
    try {
      delete process.env.TURSO_DATABASE_URL;
      delete process.env.TURSO_AUTH_TOKEN;

      res.json({
        success: true,
        message: "Credenciais do Turso removidas da sessão atual.",
        warning: "Para remover permanentemente, delete as variáveis TURSO_DATABASE_URL e TURSO_AUTH_TOKEN dos Secrets do Replit e reinicie o servidor."
      });
    } catch (error) {
      console.error("Failed to clear Turso config:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao limpar configurações do Turso",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  app.get("/api/database/turso-config", async (req, res) => {
    try {
      const hasConfig = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
      
      res.json({
        configured: hasConfig,
        databaseUrl: process.env.TURSO_DATABASE_URL ? process.env.TURSO_DATABASE_URL.substring(0, 40) + '...' : null
      });
    } catch (error) {
      console.error("Failed to get Turso config:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao obter configurações do Turso"
      });
    }
  });

  app.post("/api/database/migrate-to-turso", ensureAuthenticated, async (req, res) => {
    try {
      const { databaseUrl, authToken } = req.body;

      if (!databaseUrl || !authToken) {
        return res.status(400).json({
          success: false,
          message: "Database URL e Auth Token são obrigatórios para migração"
        });
      }

      const { createClient } = await import('@libsql/client');
      const { drizzle } = await import('drizzle-orm/libsql');
      const schema = await import('@shared/schema');

      const tursoClient = createClient({
        url: databaseUrl,
        authToken: authToken
      });
      const tursoDb = drizzle(tursoClient, { schema });

      await tursoClient.execute('DROP TABLE IF EXISTS properties');
      await tursoClient.execute('DROP TABLE IF EXISTS projects');
      await tursoClient.execute('DROP TABLE IF EXISTS contacts');
      await tursoClient.execute('DROP TABLE IF EXISTS condominiums');
      await tursoClient.execute('DROP TABLE IF EXISTS property_categories');
      await tursoClient.execute('DROP TABLE IF EXISTS hero_settings');
      await tursoClient.execute('DROP TABLE IF EXISTS cities');

      const createTablesSQL = `
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
          title_line_1 TEXT NOT NULL DEFAULT 'BEM-VINDO',
          title_line_2 TEXT NOT NULL DEFAULT 'AO SEU NOVO',
          title_line_3 TEXT NOT NULL DEFAULT 'COMEÇO !',
          description TEXT NOT NULL DEFAULT 'Especialistas em imóveis que conectam você aos melhores espaços para viver ou investir. Confiança, transparência e soluções sob medida para cada etapa do seu caminho imobiliário.',
          carousel_enabled BOOLEAN DEFAULT FALSE,
          carousel_interval INTEGER DEFAULT 5000,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
        
        CREATE TABLE IF NOT EXISTS cities (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          image_url TEXT NOT NULL,
          display_order INTEGER DEFAULT 0,
          active BOOLEAN DEFAULT TRUE,
          created_at TEXT,
          updated_at TEXT
        );
      `;

      await tursoClient.executeMultiple(createTablesSQL);

      const migratedTables = [];
      let totalRecords = 0;

      const properties = await storage.getProperties();
      if (properties.length > 0) {
        for (const prop of properties) {
          await tursoDb.insert(schema.properties).values(prop).onConflictDoNothing();
        }
        migratedTables.push(`properties (${properties.length})`);
        totalRecords += properties.length;
      }

      const projects = await storage.getProjects();
      if (projects.length > 0) {
        for (const proj of projects) {
          await tursoDb.insert(schema.projects).values(proj).onConflictDoNothing();
        }
        migratedTables.push(`projects (${projects.length})`);
        totalRecords += projects.length;
      }

      const condominiums = await storage.getCondominiums();
      if (condominiums.length > 0) {
        for (const condo of condominiums) {
          await tursoDb.insert(schema.condominiums).values(condo).onConflictDoNothing();
        }
        migratedTables.push(`condominiums (${condominiums.length})`);
        totalRecords += condominiums.length;
      }

      const contacts = await storage.getContacts();
      if (contacts.length > 0) {
        for (const contact of contacts) {
          await tursoDb.insert(schema.contacts).values(contact).onConflictDoNothing();
        }
        migratedTables.push(`contacts (${contacts.length})`);
        totalRecords += contacts.length;
      }

      const categories = await storage.getPropertyCategories();
      if (categories.length > 0) {
        for (const cat of categories) {
          await tursoDb.insert(schema.propertyCategories).values(cat).onConflictDoNothing();
        }
        migratedTables.push(`categories (${categories.length})`);
        totalRecords += categories.length;
      }

      const cities = await storage.getCities();
      if (cities.length > 0) {
        for (const city of cities) {
          await tursoDb.insert(schema.cities).values(city).onConflictDoNothing();
        }
        migratedTables.push(`cities (${cities.length})`);
        totalRecords += cities.length;
      }

      await tursoClient.close();

      res.json({
        success: true,
        message: `Migração concluída com sucesso!`,
        details: {
          totalRecords,
          tables: migratedTables
        },
        note: "As tabelas devem ser criadas no Turso antes da migração. Execute: turso db shell [nome] < schema.sql ou npm run db:push com TURSO_DATABASE_URL configurado"
      });
    } catch (error) {
      console.error("Migration to Turso failed:", error);
      res.status(500).json({
        success: false,
        message: "Falha na migração para Turso",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });
}
