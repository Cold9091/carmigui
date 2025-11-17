/**
 * Main Routes Registration
 * 
 * Este arquivo importa e registra todos os módulos de rotas.
 * Cada recurso foi organizado em seu próprio arquivo para melhor manutenibilidade.
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { setupAuth } from "./auth";

// Import de módulos de rotas
import { registerPropertyRoutes } from "./routes/properties";
import { registerProjectRoutes } from "./routes/projects";
import { registerCondominiumRoutes } from "./routes/condominiums";
import { registerContactRoutes } from "./routes/contacts";
import { registerCategoryRoutes } from "./routes/categories";
import { registerCityRoutes } from "./routes/cities";
import { registerHeroRoutes } from "./routes/hero";
import { registerAboutRoutes } from "./routes/about";
import { registerDatabaseRoutes } from "./routes/database";
import { registerUploadRoutesV2 } from "./routes/uploads-v2";
import { registerSitemapRoutes } from "./routes/sitemap";
import { monitoringRouter } from "./routes/monitoring";
import { registerAdminSetup } from "./routes/admin-setup";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup de autenticação
  setupAuth(app);
  
  // Endpoint temporário para criar admin (REMOVER após primeiro login!)
  registerAdminSetup(app);
  
  const router = Router();
  
  // Registrar rotas por módulo
  registerPropertyRoutes(router);
  registerProjectRoutes(router);
  registerCondominiumRoutes(router);
  registerContactRoutes(router);
  registerCategoryRoutes(router);
  registerCityRoutes(router);
  registerHeroRoutes(router);
  registerAboutRoutes(router);
  
  // Rotas adicionais (database, upload, sitemap, monitoring)
  registerDatabaseRoutes(app);
  registerUploadRoutesV2(app);
  registerSitemapRoutes(router, storage);
  
  // Monitoring routes (health check is public, logs/metrics require auth)
  app.use(monitoringRouter);
  
  // Aplicar todas as rotas do router
  app.use(router);
  
  return createServer(app);
}
