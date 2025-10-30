#!/usr/bin/env tsx
/**
 * Script para criar o primeiro usuário administrador
 * 
 * Uso:
 *   npx tsx server/setup-admin.ts
 * 
 * Ou com npm:
 *   npm run setup:admin
 */

import { hashPassword } from "./auth";
import { storage } from "./storage";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("╔════════════════════════════════════════════╗");
  console.log("║   CARMIGUI - Setup de Administrador        ║");
  console.log("╚════════════════════════════════════════════╝\n");

  try {
    console.log("📝 Por favor, forneça os dados do administrador:\n");

    const name = await question("Nome completo: ");
    const email = await question("Email: ");
    const password = await question("Senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial): ");
    const confirmPassword = await question("Confirme a senha: ");

    // Validações
    if (!name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem");
    }

    if (password.length < 8) {
      throw new Error("A senha deve ter no mínimo 8 caracteres");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("A senha deve conter pelo menos uma letra minúscula");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("A senha deve conter pelo menos uma letra maiúscula");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("A senha deve conter pelo menos um número");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error("A senha deve conter pelo menos um caractere especial");
    }

    // Verificar se email já existe
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      throw new Error("Já existe um usuário com este email");
    }

    console.log("\n⏳ Criando usuário...");

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const newUser = await storage.createUser({
      name,
      email,
      password: hashedPassword,
    });

    console.log("\n✅ Usuário administrador criado com sucesso!");
    console.log("\n╔════════════════════════════════════════════╗");
    console.log("║          Dados de Acesso                   ║");
    console.log("╠════════════════════════════════════════════╣");
    console.log(`║ Nome:  ${newUser.name.padEnd(35)}║`);
    console.log(`║ Email: ${newUser.email.padEnd(35)}║`);
    console.log("╚════════════════════════════════════════════╝");
    console.log("\n🔗 Acesse: http://localhost:5000/admin/login");
    console.log("   Ou no Vercel: https://seu-site.vercel.app/admin/login\n");

  } catch (error: any) {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
