/**
 * Auto Setup Admin
 * 
 * Este script verifica as variáveis de ambiente ADMIN_EMAIL e ADMIN_PASSWORD
 * e cria automaticamente o usuário administrador se ele não existir.
 * 
 * É executado automaticamente na inicialização do servidor.
 */

import { hashPassword } from "./auth";
import { storage } from "./storage";

export async function autoSetupAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Se não houver variáveis de ambiente, não faz nada
  if (!adminEmail || !adminPassword) {
    console.log("ℹ️  Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não configuradas.");
    return;
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await storage.getUserByEmail(adminEmail);
    
    if (existingUser) {
      console.log(`✅ Usuário administrador já existe: ${adminEmail}`);
      return;
    }

    // Criar o usuário automaticamente
    console.log(`🔧 Criando usuário administrador: ${adminEmail}...`);
    
    const hashedPassword = await hashPassword(adminPassword);
    
    const newUser = await storage.createUser({
      name: "Administrador",
      email: adminEmail,
      password: hashedPassword,
    });

    console.log("╔════════════════════════════════════════════╗");
    console.log("║   ✅ Usuário Admin Criado com Sucesso     ║");
    console.log("╠════════════════════════════════════════════╣");
    console.log(`║ Email: ${adminEmail.padEnd(35)}║`);
    console.log("╠════════════════════════════════════════════╣");
    console.log("║ Acesse: /admin/login                       ║");
    console.log("╚════════════════════════════════════════════╝");

  } catch (error: any) {
    console.error("❌ Erro ao criar usuário administrador:", error.message);
    // Não lança erro para não quebrar a inicialização do servidor
  }
}
