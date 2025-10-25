import type { Router } from "express";
import { storage } from "../storage";
import { insertCondominiumSchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerCondominiumRoutes(router: Router) {
  router.get("/api/condominiums", async (req, res) => {
    try {
      const featured = req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined;
      const condominiums = await storage.getCondominiums(featured);
      res.json(condominiums);
    } catch (error) {
      console.error("Error fetching condominiums:", error);
      res.status(500).json({ message: "Failed to fetch condominiums" });
    }
  });

  const handlers = createCRUDHandlers({
    storage: {
      getAll: storage.getCondominiums,
      getById: storage.getCondominium,
      create: storage.createCondominium,
      update: storage.updateCondominium,
      delete: storage.deleteCondominium,
    },
    schemas: {
      insert: insertCondominiumSchema,
      update: insertCondominiumSchema.partial(),
    },
    resourceName: "Condominium",
  });

  router.get("/api/condominiums/:id", handlers.getById);
  router.post("/api/condominiums", ensureAuthenticated, handlers.create);
  router.put("/api/condominiums/:id", ensureAuthenticated, handlers.update);
  router.delete("/api/condominiums/:id", ensureAuthenticated, handlers.delete);
}
