#!/usr/bin/env node

/**
 * Script de Migração de Banco de Dados
 * Executa migrações Drizzle de forma segura com backup e rollback
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 5;

async function createBackup() {
  if (process.env.NODE_ENV === 'production' && process.env.TURSO_DATABASE_URL) {
    console.log('⚠️  Backup automático não disponível para Turso');
    console.log('💡 Considere usar: turso db backup create <database-name>');
    return null;
  }

  const sqliteFile = process.env.SQLITE_FILE || './database.db';
  
  if (!fs.existsSync(sqliteFile)) {
    console.log('ℹ️  Banco de dados não existe ainda, pulando backup');
    return null;
  }

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.db`);

  fs.copyFileSync(sqliteFile, backupFile);
  console.log(`✅ Backup criado: ${backupFile}`);

  const backups = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('backup-'))
    .sort()
    .reverse();

  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach(f => {
      fs.unlinkSync(path.join(BACKUP_DIR, f));
      console.log(`🗑️  Backup antigo removido: ${f}`);
    });
  }

  return backupFile;
}

async function testDatabaseConnection() {
  console.log('3️⃣ Testando conexão com banco de dados...');
  
  try {
    if (process.env.TURSO_DATABASE_URL) {
      console.log('ℹ️  Usando Turso Database');
      
      const { createClient } = await import('@libsql/client');
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN
      });
      
      await client.execute('SELECT 1');
      console.log('✅ Conexão com Turso OK');
    } else {
      console.log('ℹ️  Usando SQLite local');
      const Database = (await import('better-sqlite3')).default;
      const sqliteFile = process.env.SQLITE_FILE || './database.db';
      const db = new Database(sqliteFile);
      db.prepare('SELECT 1').get();
      db.close();
      console.log('✅ Conexão com SQLite OK');
    }
    return true;
  } catch (error) {
    console.error('❌ Falha na conexão:', error.message);
    return false;
  }
}

async function runMigrations() {
  console.log('\n🔄 Iniciando migrações do banco de dados...\n');

  const startTime = Date.now();
  let backupFile = null;

  try {
    console.log('1️⃣ Validando variáveis de ambiente...');
    const { stdout: validateOut, stderr: validateErr } = await execAsync('node scripts/validate-env.js');
    console.log(validateOut);
    if (validateErr) console.error(validateErr);

    console.log('2️⃣ Criando backup do banco de dados...');
    backupFile = await createBackup();

    const canConnect = await testDatabaseConnection();
    if (!canConnect) {
      throw new Error('Não foi possível conectar ao banco de dados');
    }

    console.log('4️⃣ Sincronizando schema com banco de dados...');
    const { stdout: pushOut, stderr: pushErr } = await execAsync('npm run db:push');
    console.log(pushOut);
    if (pushErr && !pushErr.includes('Warning')) {
      throw new Error(pushErr);
    }

    const duration = Date.now() - startTime;
    console.log(`\n✅ Migrações executadas com sucesso! (${duration}ms)\n`);
    
    if (backupFile) {
      console.log('💡 Backup disponível em:', backupFile);
      console.log('   Para reverter: cp', backupFile, process.env.SQLITE_FILE || './database.db\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro durante migrações:');
    console.error(error.message);
    
    if (backupFile) {
      console.log('\n🔄 Deseja reverter para o backup? (requer ação manual)');
      console.log(`   cp ${backupFile} ${process.env.SQLITE_FILE || './database.db'}`);
    }
    
    console.log('\n💡 Dicas de troubleshooting:');
    console.log('   1. Verifique se as variáveis de ambiente estão corretas');
    console.log('   2. Se houver conflitos de schema, tente: npm run db:push -- --force');
    console.log('   3. Verifique os logs acima para mais detalhes\n');
    
    process.exit(1);
  }
}

runMigrations();
