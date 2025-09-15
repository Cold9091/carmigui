import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDatabaseStatus } from "./db";
import { insertPropertySchema, insertProjectSchema, insertContactSchema, insertCondominiumSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
