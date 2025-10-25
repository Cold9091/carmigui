import type { Router } from "express";
import { storage } from "../storage";
import { insertCitySchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createCRUDHandlers } from "../utils/crud-helpers";

export function registerCityRoutes(router: Router) {
  const handlers = createCRUDHandlers({
    storage: {
      getAll: storage.getCities,
      getById: storage.getCity,
      create: storage.createCity,
      update: storage.updateCity,
      delete: storage.deleteCity,
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
