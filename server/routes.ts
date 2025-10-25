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

// Rotas complexas que permaneceram no arquivo original
import { registerDatabaseRoutes } from "./routes-backup";
import { registerUploadRoutes } from "./routes-backup";
import { registerSitemapRoute } from "./routes-backup";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup de autenticação
  setupAuth(app);
  
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
  
  // Rotas complexas (temporário - manter do arquivo original)
  registerDatabaseRoutes(app);
  registerUploadRoutes(app);
  registerSitemapRoute(app);
  
  // Aplicar todas as rotas do router
  app.use(router);
  
  return createServer(app);
}
