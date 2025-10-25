import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDatabaseStatus } from "./db";
import { insertPropertySchema, insertProjectSchema, insertContactSchema, insertCondominiumSchema, insertPropertyCategorySchema, insertHeroSettingsSchema, insertCitySchema, insertAboutUsSchema, insertEmployeeSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { setupAuth, ensureAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  // Properties routes
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        type: req.query.type as string,
        location: req.query.location as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        featured: req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined,
      };
      
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", ensureAuthenticated, async (req, res) => {
    try {
      const property = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(property);
      res.status(201).json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.put("/api/properties/:id", ensureAuthenticated, async (req, res) => {
    try {
      const { updatePropertySchema } = await import("@shared/schema");
      const updates = updatePropertySchema.parse(req.body);
      const updatedProperty = await storage.updateProperty(req.params.id, updates);
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(updatedProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
      const projects = await storage.getProjects(featured);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", ensureAuthenticated, async (req, res) => {
    try {
      const project = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject(project);
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertProjectSchema.partial().parse(req.body);
      const updatedProject = await storage.updateProject(req.params.id, updates);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const contact = insertContactSchema.parse(req.body);
      const newContact = await storage.createContact(contact);
      res.status(201).json(newContact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.delete("/api/contacts/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  // Condominiums routes
  app.get("/api/condominiums", async (req, res) => {
    try {
      const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
      const condominiums = await storage.getCondominiums(featured);
      res.json(condominiums);
    } catch (error) {
      console.error("Error fetching condominiums:", error);
      res.status(500).json({ message: "Failed to fetch condominiums" });
    }
  });

  app.get("/api/condominiums/:id", async (req, res) => {
    try {
      const condominium = await storage.getCondominium(req.params.id);
      if (!condominium) {
        return res.status(404).json({ message: "Condominium not found" });
      }
      res.json(condominium);
    } catch (error) {
      console.error("Error fetching condominium:", error);
      res.status(500).json({ message: "Failed to fetch condominium" });
    }
  });

  app.post("/api/condominiums", ensureAuthenticated, async (req, res) => {
    try {
      const condominium = insertCondominiumSchema.parse(req.body);
      const newCondominium = await storage.createCondominium(condominium);
      res.status(201).json(newCondominium);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid condominium data", errors: error.errors });
      }
      console.error("Error creating condominium:", error);
      res.status(500).json({ message: "Failed to create condominium" });
    }
  });

  app.put("/api/condominiums/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertCondominiumSchema.partial().parse(req.body);
      const updatedCondominium = await storage.updateCondominium(req.params.id, updates);
      if (!updatedCondominium) {
        return res.status(404).json({ message: "Condominium not found" });
      }
      res.json(updatedCondominium);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid condominium data", errors: error.errors });
      }
      console.error("Error updating condominium:", error);
      res.status(500).json({ message: "Failed to update condominium" });
    }
  });

  app.delete("/api/condominiums/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteCondominium(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Condominium not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting condominium:", error);
      res.status(500).json({ message: "Failed to delete condominium" });
    }
  });

  // Property Categories routes
  app.get("/api/property-categories", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true" ? true : req.query.active === "false" ? false : undefined;
      const categories = await storage.getPropertyCategories(activeOnly);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching property categories:", error);
      res.status(500).json({ message: "Failed to fetch property categories" });
    }
  });

  app.get("/api/property-categories/:id", async (req, res) => {
    try {
      const category = await storage.getPropertyCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/property-categories", ensureAuthenticated, async (req, res) => {
    try {
      const category = insertPropertyCategorySchema.parse(req.body);
      const newCategory = await storage.createPropertyCategory(category);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/property-categories/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertPropertyCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updatePropertyCategory(req.params.id, updates);
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/property-categories/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deletePropertyCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Hero Settings routes
  app.get("/api/hero-settings", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettings();
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  app.get("/api/admin/hero-settings", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettingsForAdmin();
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings for admin:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  app.get("/api/hero-settings/:id", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettingsById(req.params.id);
      if (!heroSettings) {
        return res.status(404).json({ message: "Hero settings not found" });
      }
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  app.post("/api/hero-settings", ensureAuthenticated, async (req, res) => {
    try {
      const heroSettings = insertHeroSettingsSchema.parse(req.body);
      const newHeroSettings = await storage.createHeroSettings(heroSettings);
      res.status(201).json(newHeroSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hero settings data", errors: error.errors });
      }
      console.error("Error creating hero settings:", error);
      res.status(500).json({ message: "Failed to create hero settings" });
    }
  });

  app.put("/api/hero-settings/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertHeroSettingsSchema.partial().parse(req.body);
      const updatedHeroSettings = await storage.updateHeroSettings(req.params.id, updates);
      if (!updatedHeroSettings) {
        return res.status(404).json({ message: "Hero settings not found" });
      }
      res.json(updatedHeroSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hero settings data", errors: error.errors });
      }
      console.error("Error updating hero settings:", error);
      res.status(500).json({ message: "Failed to update hero settings" });
    }
  });

  app.delete("/api/hero-settings/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteHeroSettings(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Hero settings not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting hero settings:", error);
      res.status(500).json({ message: "Failed to delete hero settings" });
    }
  });

  // Cities routes
  app.get("/api/cities", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true" ? true : req.query.active === "false" ? false : undefined;
      const cities = await storage.getCities(activeOnly);
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const city = await storage.getCity(req.params.id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });

  app.post("/api/cities", ensureAuthenticated, async (req, res) => {
    try {
      const city = insertCitySchema.parse(req.body);
      const newCity = await storage.createCity(city);
      res.status(201).json(newCity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid city data", errors: error.errors });
      }
      console.error("Error creating city:", error);
      res.status(500).json({ message: "Failed to create city" });
    }
  });

  app.put("/api/cities/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertCitySchema.partial().parse(req.body);
      const updatedCity = await storage.updateCity(req.params.id, updates);
      if (!updatedCity) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(updatedCity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid city data", errors: error.errors });
      }
      console.error("Error updating city:", error);
      res.status(500).json({ message: "Failed to update city" });
    }
  });

  app.delete("/api/cities/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteCity(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "City not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting city:", error);
      res.status(500).json({ message: "Failed to delete city" });
    }
  });

  // Database management routes
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

  // Security: Validate file magic bytes (file signatures) to detect disguised malicious files
  async function validateImageMagicBytes(filePath: string): Promise<boolean> {
    try {
      const fileHandle = await fs.open(filePath, 'r');
      const buffer = Buffer.alloc(12);
      await fileHandle.read(buffer, 0, 12, 0);
      await fileHandle.close();

      // Check magic bytes for common image formats
      // JPEG: FF D8 FF
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
        return true;
      }
      
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
          buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
        return true;
      }
      
      // GIF: 47 49 46 38 (GIF8)
      if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
        return true;
      }
      
      // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
      if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
          buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating magic bytes:', error);
      return false;
    }
  }

  // Security: Validate image using sharp to ensure it's a valid, processable image
  async function validateImageWithSharp(filePath: string): Promise<boolean> {
    try {
      const metadata = await sharp(filePath).metadata();
      
      // Ensure image has valid dimensions
      if (!metadata.width || !metadata.height) {
        return false;
      }
      
      // Ensure dimensions are reasonable (not too small or suspiciously large)
      if (metadata.width < 1 || metadata.height < 1 || 
          metadata.width > 20000 || metadata.height > 20000) {
        return false;
      }
      
      // Ensure format is one we expect
      const allowedFormats = ['jpeg', 'png', 'gif', 'webp'];
      if (!metadata.format || !allowedFormats.includes(metadata.format)) {
        return false;
      }
      
      return true;
    } catch (error) {
      // If sharp can't process it, it's not a valid image
      return false;
    }
  }

  // Configure multer for file uploads
  const storage_multer = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads', 'images');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error instanceof Error ? error : new Error('Failed to create upload directory'), uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `image-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_multer,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
      }
    }
  });

  // Image upload routes with comprehensive security validation
  app.post('/api/upload/images', upload.array('images', 10), async (req, res) => {
    const filesToCleanup: string[] = [];
    
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const uploadedFiles = await Promise.all(
        req.files.map(async (file: Express.Multer.File) => {
          const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
          const originalPath = file.path;
          const fileNameWithoutExt = path.parse(file.filename).name;
          const webpFilename = `${fileNameWithoutExt}.webp`;
          const webpPath = path.join(uploadsDir, webpFilename);

          try {
            // Security: Validate magic bytes to detect disguised malicious files
            const validMagicBytes = await validateImageMagicBytes(originalPath);
            if (!validMagicBytes) {
              filesToCleanup.push(originalPath);
              throw new Error(`File ${file.originalname} failed magic bytes validation. Invalid or potentially malicious file.`);
            }

            // Security: Validate with sharp to ensure it's a legitimate, processable image
            const validImage = await validateImageWithSharp(originalPath);
            if (!validImage) {
              filesToCleanup.push(originalPath);
              throw new Error(`File ${file.originalname} failed image validation. Corrupted or invalid image format.`);
            }

            // Convert to WebP with optimization
            await sharp(originalPath)
              .resize(1920, null, { 
                withoutEnlargement: true,
                fit: 'inside'
              })
              .webp({ 
                quality: 80,
                effort: 6
              })
              .toFile(webpPath);

            return {
              filename: file.filename,
              originalName: file.originalname,
              size: file.size,
              url: `/uploads/images/${file.filename}`,
              webp: {
                filename: webpFilename,
                url: `/uploads/images/${webpFilename}`
              }
            };
          } catch (conversionError) {
            filesToCleanup.push(originalPath);
            if (conversionError instanceof Error && conversionError.message.includes('validation')) {
              throw conversionError;
            }
            throw new Error(`Failed to process image ${file.originalname}. File may be corrupted or in an unsupported format.`);
          }
        })
      );

      res.json({
        success: true,
        message: `${uploadedFiles.length} image(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      // Security: Automatic cleanup of files that failed validation
      for (const filePath of filesToCleanup) {
        try {
          await fs.unlink(filePath);
        } catch (cleanupError) {
          console.error('Error cleaning up invalid file:', cleanupError);
        }
      }

      console.error('Error uploading images:', error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to upload images',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete image route
  app.delete('/api/upload/images/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      
      // Security: Validate filename pattern to prevent path traversal
      const filenamePattern = /^image-\d+-\d+\.(jpg|jpeg|png|gif|webp)$/i;
      if (!filenamePattern.test(filename)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid filename format' 
        });
      }
      
      // Safely construct file path
      const uploadsDir = path.join(process.cwd(), 'uploads', 'images');
      const filePath = path.join(uploadsDir, filename);
      
      // Ensure the resolved path is still within uploads/images
      const normalizedPath = path.normalize(filePath);
      if (!normalizedPath.startsWith(uploadsDir)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid file path' 
        });
      }
      
      try {
        // Delete original file
        await fs.unlink(normalizedPath);
        
        // Try to delete WebP version if it exists
        const fileNameWithoutExt = path.parse(filename).name;
        const webpFilename = `${fileNameWithoutExt}.webp`;
        const webpPath = path.join(uploadsDir, webpFilename);
        
        try {
          await fs.unlink(webpPath);
        } catch (webpError) {
          // Ignore if WebP doesn't exist
          if ((webpError as any).code !== 'ENOENT') {
            console.warn('Error deleting WebP version:', webpError);
          }
        }
        
        res.json({ 
          success: true, 
          message: 'Image deleted successfully' 
        });
      } catch (error) {
        if ((error as any).code === 'ENOENT') {
          return res.status(404).json({ 
            success: false, 
            message: 'Image not found' 
          });
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // About Us routes
  app.get("/api/about-us", async (req, res) => {
    try {
      const sections = await storage.getAboutUsSections();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching about us sections:", error);
      res.status(500).json({ message: "Failed to fetch about us sections" });
    }
  });

  app.get("/api/about-us/:id", async (req, res) => {
    try {
      const section = await storage.getAboutUsSection(req.params.id);
      if (!section) {
        return res.status(404).json({ message: "About us section not found" });
      }
      res.json(section);
    } catch (error) {
      console.error("Error fetching about us section:", error);
      res.status(500).json({ message: "Failed to fetch about us section" });
    }
  });

  app.post("/api/about-us", ensureAuthenticated, async (req, res) => {
    try {
      const aboutUs = insertAboutUsSchema.parse(req.body);
      const newSection = await storage.createAboutUsSection(aboutUs);
      res.status(201).json(newSection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid about us data", errors: error.errors });
      }
      console.error("Error creating about us section:", error);
      res.status(500).json({ message: "Failed to create about us section" });
    }
  });

  app.put("/api/about-us/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertAboutUsSchema.partial().parse(req.body);
      const updatedSection = await storage.updateAboutUsSection(req.params.id, updates);
      if (!updatedSection) {
        return res.status(404).json({ message: "About us section not found" });
      }
      res.json(updatedSection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid about us data", errors: error.errors });
      }
      console.error("Error updating about us section:", error);
      res.status(500).json({ message: "Failed to update about us section" });
    }
  });

  app.delete("/api/about-us/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteAboutUsSection(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "About us section not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting about us section:", error);
      res.status(500).json({ message: "Failed to delete about us section" });
    }
  });

  // Employees routes
  app.get("/api/employees", async (req, res) => {
    try {
      const filters = {
        department: req.query.department as string,
        activeOnly: req.query.activeOnly === "true" ? true : req.query.activeOnly === "false" ? false : undefined,
      };
      const employees = await storage.getEmployees(filters);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", ensureAuthenticated, async (req, res) => {
    try {
      const employee = insertEmployeeSchema.parse(req.body);
      const newEmployee = await storage.createEmployee(employee);
      res.status(201).json(newEmployee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", ensureAuthenticated, async (req, res) => {
    try {
      const updates = insertEmployeeSchema.partial().parse(req.body);
      const updatedEmployee = await storage.updateEmployee(req.params.id, updates);
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(updatedEmployee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", ensureAuthenticated, async (req, res) => {
    try {
      const deleted = await storage.deleteEmployee(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Sitemap route
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const properties = await storage.getProperties();
      const projects = await storage.getProjects();
      const condominiums = await storage.getCondominiums();
      
      const baseUrl = "https://carmigui.com";
      const currentDate = new Date().toISOString().split('T')[0];
      
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/imoveis', priority: '0.9', changefreq: 'daily' },
        { url: '/condominios', priority: '0.9', changefreq: 'weekly' },
        { url: '/construcao', priority: '0.9', changefreq: 'weekly' },
        { url: '/sobre-nos', priority: '0.7', changefreq: 'monthly' },
        { url: '/contacto', priority: '0.8', changefreq: 'monthly' },
        { url: '/faq', priority: '0.8', changefreq: 'monthly' },
      ];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      
      staticPages.forEach(page => {
        sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      });
      
      properties.forEach(property => {
        const lastmod = property.updatedAt ? new Date(property.updatedAt).toISOString().split('T')[0] : currentDate;
        sitemap += `  <url>
    <loc>${baseUrl}/imoveis/${property.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
      
      projects.forEach(project => {
        const lastmod = project.updatedAt ? new Date(project.updatedAt).toISOString().split('T')[0] : currentDate;
        sitemap += `  <url>
    <loc>${baseUrl}/construcao/${project.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      });
      
      condominiums.forEach(condominium => {
        const lastmod = condominium.updatedAt ? new Date(condominium.updatedAt).toISOString().split('T')[0] : currentDate;
        sitemap += `  <url>
    <loc>${baseUrl}/condominios/${condominium.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
      
      sitemap += `</urlset>`;
      
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
