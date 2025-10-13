import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDatabaseStatus } from "./db";
import { insertPropertySchema, insertProjectSchema, insertContactSchema, insertCondominiumSchema, insertPropertyCategorySchema, insertHeroSettingsSchema, insertCitySchema, insertAboutUsSchema, insertEmployeeSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.post("/api/properties", async (req, res) => {
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

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const updates = insertPropertySchema.partial().parse(req.body);
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

  app.delete("/api/properties/:id", async (req, res) => {
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

  app.post("/api/projects", async (req, res) => {
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

  app.put("/api/projects/:id", async (req, res) => {
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

  app.delete("/api/projects/:id", async (req, res) => {
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

  app.delete("/api/contacts/:id", async (req, res) => {
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

  app.post("/api/condominiums", async (req, res) => {
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

  app.put("/api/condominiums/:id", async (req, res) => {
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

  app.delete("/api/condominiums/:id", async (req, res) => {
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

  app.post("/api/property-categories", async (req, res) => {
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

  app.put("/api/property-categories/:id", async (req, res) => {
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

  app.delete("/api/property-categories/:id", async (req, res) => {
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

  app.post("/api/hero-settings", async (req, res) => {
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

  app.put("/api/hero-settings/:id", async (req, res) => {
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

  app.delete("/api/hero-settings/:id", async (req, res) => {
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

  app.post("/api/cities", async (req, res) => {
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

  app.put("/api/cities/:id", async (req, res) => {
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

  app.delete("/api/cities/:id", async (req, res) => {
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

  app.post("/api/database/test", async (req, res) => {
    try {
      // Test database connection by trying to fetch properties
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

  // Supabase configuration routes
  app.post("/api/database/test-supabase", async (req, res) => {
    try {
      const { supabaseUrl, supabaseAnonKey, databaseUrl } = req.body;

      if (!supabaseUrl || !supabaseAnonKey || !databaseUrl) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios: supabaseUrl, supabaseAnonKey, databaseUrl"
        });
      }

      // Validar formato da URL
      try {
        new URL(supabaseUrl);
        new URL(databaseUrl);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "URLs inválidas. Verifique o formato das URLs fornecidas."
        });
      }

      // Testar conexão com PostgreSQL usando a DATABASE_URL do Supabase
      const { Pool } = await import('@neondatabase/serverless');
      const testPool = new Pool({ connectionString: databaseUrl });
      
      try {
        const result = await testPool.query('SELECT NOW()');
        await testPool.end();
        
        res.json({
          success: true,
          message: "Credenciais do Supabase válidas! Conexão testada com sucesso.",
          timestamp: result.rows[0].now
        });
      } catch (error) {
        await testPool.end();
        throw error;
      }
    } catch (error) {
      console.error("Supabase connection test failed:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao conectar com o Supabase",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  app.post("/api/database/configure-supabase", async (req, res) => {
    try {
      const { supabaseUrl, supabaseAnonKey, databaseUrl } = req.body;

      if (!supabaseUrl || !supabaseAnonKey || !databaseUrl) {
        return res.status(400).json({
          success: false,
          message: "Todos os campos são obrigatórios"
        });
      }

      // Salvar as variáveis de ambiente
      // Nota: Em produção, essas variáveis devem ser configuradas no ambiente do servidor
      // Para desenvolvimento, podemos usar um arquivo .env ou configurar diretamente
      
      process.env.SUPABASE_URL = supabaseUrl;
      process.env.SUPABASE_ANON_KEY = supabaseAnonKey;
      process.env.DATABASE_URL = databaseUrl;

      res.json({
        success: true,
        message: "Configurações do Supabase salvas com sucesso! Reinicie o servidor para aplicar as mudanças.",
        note: "Em ambiente de produção, configure essas variáveis diretamente no seu provedor de hospedagem (Replit Secrets, Vercel, etc.)"
      });
    } catch (error) {
      console.error("Failed to configure Supabase:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao salvar configurações do Supabase",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  app.get("/api/database/supabase-config", async (req, res) => {
    try {
      const hasConfig = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
      
      res.json({
        configured: hasConfig,
        supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : null,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      });
    } catch (error) {
      console.error("Failed to get Supabase config:", error);
      res.status(500).json({
        success: false,
        message: "Falha ao obter configurações do Supabase"
      });
    }
  });

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

  // Image upload routes
  app.post('/api/upload/images', upload.array('images', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded' });
      }

      const uploadedFiles = req.files.map((file: Express.Multer.File) => {
        return {
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          url: `/uploads/images/${file.filename}`
        };
      });

      res.json({
        success: true,
        message: `${uploadedFiles.length} image(s) uploaded successfully`,
        files: uploadedFiles
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to upload images',
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
        await fs.unlink(normalizedPath);
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

  app.post("/api/about-us", async (req, res) => {
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

  app.put("/api/about-us/:id", async (req, res) => {
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

  app.delete("/api/about-us/:id", async (req, res) => {
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

  app.post("/api/employees", async (req, res) => {
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

  app.put("/api/employees/:id", async (req, res) => {
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

  app.delete("/api/employees/:id", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
