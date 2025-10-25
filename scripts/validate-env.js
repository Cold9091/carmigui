#!/usr/bin/env node

/**
 * Script de Validação de Variáveis de Ambiente
 * Garante que todas as variáveis obrigatórias estão configuradas antes do deploy
 * 
 * Banco de Dados:
 * - Desenvolvimento: SQLite (local)
 * - Produção: Turso Database (edge computing)
 */

const requiredEnvVars = {
  production: [
    'TURSO_DATABASE_URL',
    'TURSO_AUTH_TOKEN',
    'SESSION_SECRET',
    'NODE_ENV'
  ],
  development: [
    'SESSION_SECRET'
  ]
};

const recommendedEnvVars = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'BASE_URL'
];

const ENV = process.env.NODE_ENV || 'development';

console.log(`\n🔍 Validando variáveis de ambiente para: ${ENV}\n`);

let hasErrors = false;
let hasWarnings = false;

const varsToCheck = requiredEnvVars[ENV] || requiredEnvVars.development;

varsToCheck.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ ERRO: Variável obrigatória ${varName} não está definida`);
    hasErrors = true;
  } else {
    const value = process.env[varName];
    
    if (varName === 'SESSION_SECRET' && value.length < 32) {
      console.error(`❌ ERRO: ${varName} deve ter pelo menos 32 caracteres (atual: ${value.length})`);
      hasErrors = true;
    } else if (varName === 'SESSION_SECRET' && value === 'SUBSTITUA_POR_STRING_ALEATORIA_FORTE_MINIMO_32_CARACTERES') {
      console.error(`❌ ERRO: ${varName} ainda está com o valor padrão do .env.example`);
      hasErrors = true;
    } else if (varName === 'TURSO_DATABASE_URL' && !value.startsWith('libsql://')) {
      console.error(`❌ ERRO: ${varName} deve usar protocolo libsql:// (formato: libsql://nome-db.turso.io)`);
      hasErrors = true;
    } else if (varName === 'TURSO_AUTH_TOKEN' && value.length < 20) {
      console.error(`❌ ERRO: ${varName} parece inválido (muito curto)`);
      hasErrors = true;
    } else {
      console.log(`✅ ${varName} configurado`);
    }
  }
});

console.log('\n📋 Variáveis recomendadas:\n');

recommendedEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️  AVISO: Variável recomendada ${varName} não está definida`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${varName} configurado`);
  }
});

console.log('\n');

if (hasErrors) {
  console.error('❌ Validação FALHOU! Corrija os erros acima antes de continuar.\n');
  if (ENV === 'production') {
    console.error('💡 Para configurar Turso Database:');
    console.error('   1. Crie conta em https://turso.tech');
    console.error('   2. Instale CLI: npm install -g @turso/cli');
    console.error('   3. Faça login: turso auth login');
    console.error('   4. Crie database: turso db create carmigui');
    console.error('   5. Obtenha credenciais: turso db show carmigui\n');
  }
  process.exit(1);
}

if (hasWarnings && ENV === 'production') {
  console.warn('⚠️  Validação com AVISOS. Recomenda-se corrigir antes de deploy em produção.\n');
}

if (!hasErrors && !hasWarnings) {
  console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente!\n');
}

process.exit(0);
