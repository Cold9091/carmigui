import type { Router } from "express";
import { storage } from "../storage";
import { insertHeroSettingsSchema } from "@shared/schema";
import { ensureAuthenticated } from "../auth";
import { createPostHandler, createPutHandler, createDeleteHandler } from "../utils/crud-helpers";

export function registerHeroRoutes(router: Router) {
  // Rotas específicas para hero
  router.get("/api/hero-settings", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettings();
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  router.get("/api/admin/hero-settings", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettingsForAdmin();
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings for admin:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  // Handlers CRUD individuais (hero settings não retorna array)
  router.get("/api/hero-settings/:id", async (req, res) => {
    try {
      const heroSettings = await storage.getHeroSettingsById(req.params.id);
      if (!heroSettings) {
        return res.status(404).json({ message: "Hero Settings not found" });
      }
      res.json(heroSettings);
    } catch (error) {
      console.error("Error fetching hero settings:", error);
      res.status(500).json({ message: "Failed to fetch hero settings" });
    }
  });

  const createHandler = createPostHandler(
    storage.createHeroSettings,
    insertHeroSettingsSchema,
    "Hero Settings"
  );

  const updateHandler = createPutHandler(
    storage.updateHeroSettings,
    insertHeroSettingsSchema.partial(),
    "Hero Settings"
  );

  const deleteHandler = createDeleteHandler(
    storage.deleteHeroSettings,
    "Hero Settings"
  );

  router.post("/api/hero-settings", ensureAuthenticated, createHandler);
  router.put("/api/hero-settings/:id", ensureAuthenticated, updateHandler);
  router.delete("/api/hero-settings/:id", ensureAuthenticated, deleteHandler);
}
