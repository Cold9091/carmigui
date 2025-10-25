#!/usr/bin/env node

/**
 * Script de Validação de Variáveis de Ambiente
 * Garante que todas as variáveis obrigatórias estão configuradas antes do deploy
 */

const requiredEnvVars = {
  production: [
    'DATABASE_URL',
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
    } else if (varName === 'DATABASE_URL' && !value.startsWith('postgresql://')) {
      console.warn(`⚠️  AVISO: ${varName} deve usar PostgreSQL em produção`);
      hasWarnings = true;
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
  process.exit(1);
}

if (hasWarnings && ENV === 'production') {
  console.warn('⚠️  Validação com AVISOS. Recomenda-se corrigir antes de deploy em produção.\n');
}

if (!hasErrors && !hasWarnings) {
  console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente!\n');
}

process.exit(0);
