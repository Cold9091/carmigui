import { execSync } from 'child_process';

const args = process.argv.slice(2);
const command = args[0] || 'check';

console.log('🎯 Bundle Monitor\n');

try {
  switch (command) {
    case 'check':
      console.log('Verificando tamanho do bundle...\n');
      execSync('node scripts/check-bundle-size.js', { stdio: 'inherit' });
      break;
    
    case 'analyze':
      console.log('Executando análise completa do bundle...\n');
      execSync('node scripts/analyze-bundle.js', { stdio: 'inherit' });
      break;
    
    case 'full':
      console.log('Executando build + análise + verificação...\n');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('\n');
      execSync('node scripts/analyze-bundle.js', { stdio: 'inherit' });
      console.log('\n');
      execSync('node scripts/check-bundle-size.js', { stdio: 'inherit' });
      break;
    
    case 'ci':
      console.log('Modo CI/CD: Build + Verificação\n');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('\n');
      execSync('node scripts/check-bundle-size.js', { stdio: 'inherit' });
      break;
    
    default:
      console.log('Comandos disponíveis:');
      console.log('  check   - Verifica tamanho do bundle existente');
      console.log('  analyze - Gera análise visual do bundle');
      console.log('  full    - Build + Análise + Verificação');
      console.log('  ci      - Modo CI/CD (Build + Verificação)\n');
      console.log('Uso: node scripts/bundle-monitor.js [comando]\n');
  }
} catch (error) {
  console.error('❌ Erro ao executar comando:', error.message);
  process.exit(1);
}
