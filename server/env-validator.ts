import crypto from 'crypto';

interface EnvValidationError {
  variable: string;
  message: string;
  severity: 'error' | 'warning';
}

const WEAK_SECRETS = [
  'SUBSTITUA_POR_STRING_ALEATORIA_FORTE_MINIMO_32_CARACTERES',
  'change-this-to-a-random-secret',
  'your-secret-here',
  'secret',
  'password',
  '12345678901234567890123456789012',
  'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
];

export function validateEnvironment(): void {
  const errors: EnvValidationError[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  console.log('\n🔒 Validando configuração de ambiente...\n');

  if (!process.env.SESSION_SECRET) {
    errors.push({
      variable: 'SESSION_SECRET',
      message: 'SESSION_SECRET é obrigatório para segurança das sessões',
      severity: 'error'
    });
  } else {
    const secret = process.env.SESSION_SECRET;

    if (secret.length < 32) {
      errors.push({
        variable: 'SESSION_SECRET',
        message: `SESSION_SECRET deve ter no mínimo 32 caracteres (atual: ${secret.length})`,
        severity: 'error'
      });
    }

    if (WEAK_SECRETS.includes(secret)) {
      errors.push({
        variable: 'SESSION_SECRET',
        message: 'SESSION_SECRET está usando um valor padrão inseguro. Gere um novo com: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
        severity: 'error'
      });
    }

    if (secret.length < 64) {
      errors.push({
        variable: 'SESSION_SECRET',
        message: `SESSION_SECRET recomendado: 64+ caracteres (atual: ${secret.length})`,
        severity: 'warning'
      });
    }

    const entropy = calculateEntropy(secret);
    if (entropy < 4.0) {
      errors.push({
        variable: 'SESSION_SECRET',
        message: `SESSION_SECRET tem baixa entropia (${entropy.toFixed(2)}). Use caracteres variados.`,
        severity: 'warning'
      });
    }
  }

  if (isProduction) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      errors.push({
        variable: 'TURSO_DATABASE_URL / TURSO_AUTH_TOKEN',
        message: 'Turso Database é obrigatório em produção. Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN',
        severity: 'error'
      });
    } else {
      const tursoUrl = process.env.TURSO_DATABASE_URL;
      
      if (!tursoUrl.startsWith('libsql://')) {
        errors.push({
          variable: 'TURSO_DATABASE_URL',
          message: 'TURSO_DATABASE_URL deve usar o protocolo libsql:// (formato: libsql://nome-db.turso.io)',
          severity: 'error'
        });
      }

      if (tursoUrl.includes('localhost') || tursoUrl.includes('127.0.0.1')) {
        errors.push({
          variable: 'TURSO_DATABASE_URL',
          message: 'TURSO_DATABASE_URL não deve apontar para localhost em produção',
          severity: 'error'
        });
      }
    }

    if (!process.env.NODE_ENV) {
      errors.push({
        variable: 'NODE_ENV',
        message: 'NODE_ENV deve ser definido explicitamente',
        severity: 'warning'
      });
    }
  }

  if (isProduction && !process.env.BASE_URL) {
    errors.push({
      variable: 'BASE_URL',
      message: 'BASE_URL é recomendado para SEO e links absolutos em produção',
      severity: 'warning'
    });
  }

  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  if (errors.length > 0) {
    errors.forEach(error => {
      const icon = error.severity === 'error' ? '❌' : '⚠️';
      const label = error.severity === 'error' ? 'ERRO' : 'AVISO';
      console.log(`${icon} ${label} [${error.variable}]: ${error.message}`);
    });
    console.log('');
  }

  if (errorCount > 0) {
    console.error(`❌ Validação FALHOU! ${errorCount} erro(s) crítico(s) encontrado(s).\n`);
    console.error('📖 Consulte o arquivo .env.example para referência.\n');
    console.error('🔑 Para gerar um SESSION_SECRET seguro, execute:');
    console.error('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n');
    console.error('🗄️  Para configurar Turso Database em produção:');
    console.error('   1. Crie conta em https://turso.tech');
    console.error('   2. Crie database: turso db create carmigui');
    console.error('   3. Obtenha credenciais: turso db show carmigui\n');
    
    process.exit(1);
  }

  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} aviso(s) encontrado(s). Recomenda-se corrigir.\n`);
  }

  if (errorCount === 0 && warningCount === 0) {
    console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente!\n');
  }
}

function calculateEntropy(str: string): number {
  const len = str.length;
  const frequencies: { [key: string]: number } = {};
  
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

export function generateSecureSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}
