import type { Router } from "express";
import { storage } from "../storage";
import { insertPropertyCategorySchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerCategoryRoutes(router: Router) {
  const handlers = createCRUDHandlers({
    storage: {
      getAll: storage.getPropertyCategories,
      getById: storage.getPropertyCategory,
      create: storage.createPropertyCategory,
      update: storage.updatePropertyCategory,
      delete: storage.deletePropertyCategory,
    },
    schemas: {
      insert: insertPropertyCategorySchema,
      update: insertPropertyCategorySchema.partial(),
    },
    resourceName: "Property Category",
  });

  router.get("/api/property-categories", handlers.getAll);
  router.get("/api/property-categories/:id", handlers.getById);
  router.post("/api/property-categories", ensureAuthenticated, handlers.create);
  router.put("/api/property-categories/:id", ensureAuthenticated, handlers.update);
  router.delete("/api/property-categories/:id", ensureAuthenticated, handlers.delete);
}
