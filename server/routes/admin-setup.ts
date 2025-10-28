/**
 * Rota temporária para criar usuário admin
 * 
 * IMPORTANTE: Esta rota deve ser removida após criar o primeiro usuário!
 * 
 * Para usar:
 * POST https://carmigui.vercel.app/api/setup-admin
 * Body: { "secret": "SEU_SECRET_TOKEN_AQUI" }
 */

import type { Express } from "express";
import { hashPassword } from "../auth";
import { storage } from "../storage";

export function registerAdminSetup(app: Express) {
  // Endpoint para criar admin - protegido por token secreto
  app.post("/api/setup-admin", async (req, res) => {
    try {
      // Verificar token secreto nas env vars
      const expectedSecret = process.env.ADMIN_SETUP_SECRET || "carmigui-setup-2024";
      const providedSecret = req.body.secret;

      if (providedSecret !== expectedSecret) {
        return res.status(403).json({ 
          error: "Token secreto inválido",
          message: "Configure ADMIN_SETUP_SECRET nas variáveis de ambiente"
        });
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        return res.status(400).json({ 
          error: "Variáveis de ambiente não configuradas",
          message: "Configure ADMIN_EMAIL e ADMIN_PASSWORD no Vercel"
        });
      }

      // Verificar se já existe
      const existingUser = await storage.getUserByEmail(adminEmail);
      if (existingUser) {
        return res.status(409).json({ 
          error: "Usuário já existe",
          email: adminEmail,
          message: "Você já pode fazer login em /admin/login"
        });
      }

      // Criar usuário
      const hashedPassword = await hashPassword(adminPassword);
      const newUser = await storage.createUser({
        name: "Administrador",
        email: adminEmail,
        password: hashedPassword,
      });

      res.json({
        success: true,
        message: "Usuário administrador criado com sucesso!",
        email: newUser.email,
        loginUrl: "/admin/login"
      });

    } catch (error: any) {
      console.error("Erro ao criar admin:", error);
      res.status(500).json({ 
        error: "Erro ao criar usuário",
        message: error.message 
      });
    }
  });
}
