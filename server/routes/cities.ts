import type { Router } from "express";
import { storage } from "../storage";
import { insertCitySchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerCityRoutes(router: Router) {
  const handlers = createCRUDHandlers({
    storage: {
      getAll: (filters) => storage.getCities(filters),
      getById: (id) => storage.getCity(id),
      create: (data) => storage.createCity(data),
      update: (id, data) => storage.updateCity(id, data),
      delete: (id) => storage.deleteCity(id),
    },
    schemas: {
      insert: insertCitySchema,
      update: insertCitySchema.partial(),
    },
    resourceName: "City",
  });

  router.get("/api/cities", handlers.getAll);
  router.get("/api/cities/:id", handlers.getById);
  router.post("/api/cities", ensureAuthenticated, handlers.create);
  router.put("/api/cities/:id", ensureAuthenticated, handlers.update);
  router.delete("/api/cities/:id", ensureAuthenticated, handlers.delete);
}
