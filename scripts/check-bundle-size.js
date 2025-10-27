import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLimits() {
  const limitsPath = path.join(__dirname, '.bundle-limits.json');
  const defaults = {
    maxBundleSize: 500 * 1024,
    maxChunkSize: 200 * 1024,
    warnBundleSize: 400 * 1024,
  };
  
  if (!fs.existsSync(limitsPath)) {
    return defaults;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(limitsPath, 'utf-8'));
    
    if (!config.limits || typeof config.limits !== 'object') {
      console.warn('⚠️  Arquivo .bundle-limits.json inválido (chave "limits" ausente). Usando valores padrão.');
      return defaults;
    }
    
    const limits = config.limits;
    
    if (typeof limits.maxBundleSize !== 'number' || 
        typeof limits.maxChunkSize !== 'number' || 
        typeof limits.warnBundleSize !== 'number') {
      console.warn('⚠️  Limites em .bundle-limits.json devem ser números. Usando valores padrão.');
      return defaults;
    }
    
    if (limits.maxBundleSize <= 0 || limits.maxChunkSize <= 0 || limits.warnBundleSize <= 0) {
      console.warn('⚠️  Limites devem ser valores positivos. Usando valores padrão.');
      return defaults;
    }
    
    if (limits.warnBundleSize > limits.maxBundleSize) {
      console.warn('⚠️  warnBundleSize deve ser menor que maxBundleSize. Usando valores padrão.');
      return defaults;
    }
    
    return limits;
  } catch (error) {
    console.warn(`⚠️  Erro ao ler .bundle-limits.json: ${error.message}. Usando valores padrão.`);
    return defaults;
  }
}

const { maxBundleSize: MAX_BUNDLE_SIZE, maxChunkSize: MAX_CHUNK_SIZE, warnBundleSize: WARN_BUNDLE_SIZE } = loadLimits();

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function checkBundleSize() {
  console.log('📦 Verificando tamanho do bundle...\n');

  const distPath = path.resolve(__dirname, '..', 'dist', 'public');
  
  if (!fs.existsSync(distPath)) {
    console.log('⚠️  Diretório dist/public não encontrado. Execute o build primeiro.');
    return;
  }

  const assetsPath = path.join(distPath, 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    console.log('⚠️  Diretório de assets não encontrado.');
    return;
  }

  const files = fs.readdirSync(assetsPath);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  let totalSize = 0;
  let hasErrors = false;
  let hasWarnings = false;
  const fileSizes = [];

  jsFiles.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;
    totalSize += size;
    
    fileSizes.push({ file, size });
    
    if (size > MAX_CHUNK_SIZE) {
      console.log(`❌ ERRO: ${file} excede o tamanho máximo`);
      console.log(`   Tamanho: ${formatSize(size)} (máximo: ${formatSize(MAX_CHUNK_SIZE)})`);
      hasErrors = true;
    }
  });

  console.log('\n📊 Resumo do Bundle:\n');
  console.log(`Total de arquivos JS: ${jsFiles.length}`);
  console.log(`Tamanho total: ${formatSize(totalSize)}`);
  console.log(`Limite máximo: ${formatSize(MAX_BUNDLE_SIZE)}`);
  console.log(`Limite de aviso: ${formatSize(WARN_BUNDLE_SIZE)}\n`);

  fileSizes.sort((a, b) => b.size - a.size);
  
  console.log('📈 Top 5 maiores arquivos:');
  fileSizes.slice(0, 5).forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.file}: ${formatSize(item.size)}`);
  });

  console.log('\n');

  if (totalSize > MAX_BUNDLE_SIZE) {
    console.log(`❌ ERRO: Bundle total excede o tamanho máximo!`);
    console.log(`   Total: ${formatSize(totalSize)}`);
    console.log(`   Máximo: ${formatSize(MAX_BUNDLE_SIZE)}`);
    console.log(`   Excesso: ${formatSize(totalSize - MAX_BUNDLE_SIZE)}\n`);
    hasErrors = true;
  } else if (totalSize > WARN_BUNDLE_SIZE) {
    console.log(`⚠️  AVISO: Bundle está próximo do limite máximo`);
    console.log(`   Total: ${formatSize(totalSize)}`);
    console.log(`   Limite de aviso: ${formatSize(WARN_BUNDLE_SIZE)}\n`);
    hasWarnings = true;
  }

  if (hasErrors) {
    console.log('💡 Recomendações:');
    console.log('   1. Execute "node scripts/analyze-bundle.js" para análise detalhada');
    console.log('   2. Considere code splitting para chunks grandes');
    console.log('   3. Remova dependências não utilizadas');
    console.log('   4. Use imports dinâmicos para módulos grandes\n');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('💡 Dica: Execute "node scripts/analyze-bundle.js" para otimizar o bundle\n');
  } else {
    console.log('✅ Bundle está dentro dos limites aceitáveis!\n');
  }
}

try {
  checkBundleSize();
} catch (error) {
  console.error('❌ Erro ao verificar bundle:', error.message);
  process.exit(1);
}
