import type { Router } from "express";
import { storage } from "../storage";
import { insertPropertySchema, updatePropertySchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerPropertyRoutes(router: Router) {
  // GET com filtros customizados
  router.get("/api/properties", async (req, res) => {
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

  // Handlers CRUD padrão
  const handlers = createCRUDHandlers({
    storage: {
      getAll: (filters) => storage.getProperties(filters),
      getById: (id) => storage.getProperty(id),
      create: (data) => storage.createProperty(data),
      update: (id, data) => storage.updateProperty(id, data),
      delete: (id) => storage.deleteProperty(id),
    },
    schemas: {
      insert: insertPropertySchema,
      update: updatePropertySchema,
    },
    resourceName: "Property",
  });

  router.get("/api/properties/:id", handlers.getById);
  router.post("/api/properties", ensureAuthenticated, handlers.create);
  router.put("/api/properties/:id", ensureAuthenticated, handlers.update);
  router.delete("/api/properties/:id", ensureAuthenticated, handlers.delete);
}
