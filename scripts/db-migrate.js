#!/usr/bin/env node

/**
 * Script de Migração de Banco de Dados
 * Executa migrações Drizzle de forma segura
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  console.log('\n🔄 Iniciando migrações do banco de dados...\n');

  try {
    // Validar variáveis de ambiente primeiro
    console.log('1️⃣ Validando variáveis de ambiente...');
    const { stdout: validateOut, stderr: validateErr } = await execAsync('node scripts/validate-env.js');
    console.log(validateOut);
    if (validateErr) console.error(validateErr);

    // Executar push do schema
    console.log('2️⃣ Sincronizando schema com banco de dados...');
    const { stdout: pushOut, stderr: pushErr } = await execAsync('npm run db:push');
    console.log(pushOut);
    if (pushErr && !pushErr.includes('Warning')) {
      throw new Error(pushErr);
    }

    console.log('\n✅ Migrações executadas com sucesso!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro durante migrações:');
    console.error(error.message);
    console.log('\n💡 Dica: Se houver conflitos, tente: npm run db:push -- --force\n');
    process.exit(1);
  }
}

runMigrations();
