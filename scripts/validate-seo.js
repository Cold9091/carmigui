import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const VALIDATION_RULES = {
  title: {
    min: 50,
    max: 60,
    optimal: { min: 55, max: 60 }
  },
  description: {
    min: 120,
    max: 160,
    optimal: { min: 140, max: 160 }
  },
  altText: {
    min: 10,
    generic: ['image', 'photo', 'picture', 'img', 'foto', 'imagem']
  }
};

let errors = [];
let warnings = [];
let info = [];

function log(color, symbol, message) {
  console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

function findFilesRecursively(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        findFilesRecursively(filePath, extensions, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

function validateImageAltText() {
  log(COLORS.cyan, '🔍', 'Validando alt text de imagens...\n');
  
  const clientDir = path.join(__dirname, '..', 'client', 'src');
  const files = findFilesRecursively(clientDir, ['.tsx', '.jsx', '.ts', '.js']);
  
  let totalImages = 0;
  let imagesWithAlt = 0;
  let imagesWithGoodAlt = 0;
  
  const imagePattern = /<img\s+([^>]*?)>/g;
  const altPattern = /alt=["']([^"']*)["']/;
  const srcPattern = /src=["']([^"']*)["']/;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    
    let match;
    let lineNumber = 0;
    const lines = content.split('\n');
    
    while ((match = imagePattern.exec(content)) !== null) {
      totalImages++;
      const imgTag = match[0];
      const imgAttributes = match[1];
      
      lineNumber = content.substring(0, match.index).split('\n').length;
      
      const altMatch = imgTag.match(altPattern);
      const srcMatch = imgTag.match(srcPattern);
      const src = srcMatch ? srcMatch[1] : 'unknown';
      
      if (!altMatch) {
        errors.push({
          file: relativePath,
          line: lineNumber,
          message: `Imagem sem atributo alt: ${src}`,
          type: 'missing-alt'
        });
      } else {
        const altText = altMatch[1];
        imagesWithAlt++;
        
        if (!altText || altText.trim() === '') {
          errors.push({
            file: relativePath,
            line: lineNumber,
            message: `Alt text vazio: ${src}`,
            type: 'empty-alt'
          });
        } else if (altText.length < VALIDATION_RULES.altText.min) {
          warnings.push({
            file: relativePath,
            line: lineNumber,
            message: `Alt text muito curto (${altText.length} chars): "${altText}"`,
            type: 'short-alt'
          });
        } else {
          const isGeneric = VALIDATION_RULES.altText.generic.some(word => 
            altText.toLowerCase() === word.toLowerCase()
          );
          
          if (isGeneric) {
            warnings.push({
              file: relativePath,
              line: lineNumber,
              message: `Alt text genérico: "${altText}" em ${src}`,
              type: 'generic-alt'
            });
          } else {
            imagesWithGoodAlt++;
          }
        }
      }
    }
  });
  
  info.push(`Total de imagens encontradas: ${totalImages}`);
  info.push(`Imagens com alt text: ${imagesWithAlt}/${totalImages} (${Math.round(imagesWithAlt/totalImages*100)}%)`);
  info.push(`Imagens com alt text adequado: ${imagesWithGoodAlt}/${totalImages} (${Math.round(imagesWithGoodAlt/totalImages*100)}%)`);
}

function validateSEOMetaTags() {
  log(COLORS.cyan, '🔍', 'Validando meta tags de SEO...\n');
  
  const seoContentPath = path.join(__dirname, '..', 'client', 'src', 'data', 'seo-content.ts');
  
  if (!fs.existsSync(seoContentPath)) {
    warnings.push({
      file: 'seo-content.ts',
      message: 'Arquivo de conteúdo SEO não encontrado',
      type: 'missing-file'
    });
    return;
  }
  
  const content = fs.readFileSync(seoContentPath, 'utf-8');
  
  const titlePattern = /title:\s*["']([^"']+)["']/g;
  const descriptionPattern = /description:\s*["']([^"']+)["']/g;
  
  let titleMatch;
  let pageCount = 0;
  let validTitles = 0;
  let optimalTitles = 0;
  
  while ((titleMatch = titlePattern.exec(content)) !== null) {
    pageCount++;
    const title = titleMatch[1];
    const length = title.length;
    
    if (length < VALIDATION_RULES.title.min) {
      errors.push({
        file: 'seo-content.ts',
        message: `Title muito curto (${length} chars): "${title.substring(0, 50)}..."`,
        type: 'short-title'
      });
    } else if (length > VALIDATION_RULES.title.max) {
      errors.push({
        file: 'seo-content.ts',
        message: `Title muito longo (${length} chars): "${title.substring(0, 50)}..."`,
        type: 'long-title'
      });
    } else {
      validTitles++;
      if (length >= VALIDATION_RULES.title.optimal.min && length <= VALIDATION_RULES.title.optimal.max) {
        optimalTitles++;
      } else {
        warnings.push({
          file: 'seo-content.ts',
          message: `Title com tamanho sub-ótimo (${length} chars, ideal 55-60): "${title.substring(0, 50)}..."`,
          type: 'suboptimal-title'
        });
      }
    }
  }
  
  let descriptionMatch;
  let validDescriptions = 0;
  let optimalDescriptions = 0;
  let descCount = 0;
  
  while ((descriptionMatch = descriptionPattern.exec(content)) !== null) {
    descCount++;
    const description = descriptionMatch[1];
    const length = description.length;
    
    if (length < VALIDATION_RULES.description.min) {
      errors.push({
        file: 'seo-content.ts',
        message: `Description muito curta (${length} chars): "${description.substring(0, 50)}..."`,
        type: 'short-description'
      });
    } else if (length > VALIDATION_RULES.description.max) {
      errors.push({
        file: 'seo-content.ts',
        message: `Description muito longa (${length} chars): "${description.substring(0, 50)}..."`,
        type: 'long-description'
      });
    } else {
      validDescriptions++;
      if (length >= VALIDATION_RULES.description.optimal.min && length <= VALIDATION_RULES.description.optimal.max) {
        optimalDescriptions++;
      } else {
        warnings.push({
          file: 'seo-content.ts',
          message: `Description com tamanho sub-ótimo (${length} chars, ideal 140-160): "${description.substring(0, 50)}..."`,
          type: 'suboptimal-description'
        });
      }
    }
  }
  
  info.push(`Páginas com SEO configurado: ${pageCount}`);
  info.push(`Titles válidos: ${validTitles}/${pageCount} (${Math.round(validTitles/pageCount*100)}%)`);
  info.push(`Titles ótimos: ${optimalTitles}/${pageCount} (${Math.round(optimalTitles/pageCount*100)}%)`);
  info.push(`Descriptions válidas: ${validDescriptions}/${descCount} (${Math.round(validDescriptions/descCount*100)}%)`);
  info.push(`Descriptions ótimas: ${optimalDescriptions}/${descCount} (${Math.round(optimalDescriptions/descCount*100)}%)`);
}

function validateSEOHead() {
  log(COLORS.cyan, '🔍', 'Validando componente SEOHead...\n');
  
  const seoHeadPath = path.join(__dirname, '..', 'client', 'src', 'components', 'seo', 'SEOHead.tsx');
  
  if (!fs.existsSync(seoHeadPath)) {
    errors.push({
      file: 'SEOHead.tsx',
      message: 'Componente SEOHead não encontrado',
      type: 'missing-component'
    });
    return;
  }
  
  const content = fs.readFileSync(seoHeadPath, 'utf-8');
  
  const requiredMetaTags = [
    'og:title',
    'og:description',
    'og:image',
    'og:type',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'description',
    'keywords'
  ];
  
  requiredMetaTags.forEach(tag => {
    if (!content.includes(tag)) {
      warnings.push({
        file: 'SEOHead.tsx',
        message: `Meta tag "${tag}" não encontrada no componente`,
        type: 'missing-meta-tag'
      });
    }
  });
  
  info.push('Componente SEOHead validado');
}

function printReport() {
  console.log('\n' + '='.repeat(80));
  log(COLORS.blue, '📊', 'RELATÓRIO DE VALIDAÇÃO SEO');
  console.log('='.repeat(80) + '\n');
  
  if (errors.length > 0) {
    log(COLORS.red, '❌', `ERROS CRÍTICOS: ${errors.length}\n`);
    errors.forEach((error, index) => {
      console.log(`${COLORS.red}${index + 1}.${COLORS.reset} ${error.file}${error.line ? `:${error.line}` : ''}`);
      console.log(`   ${error.message}\n`);
    });
  }
  
  if (warnings.length > 0) {
    log(COLORS.yellow, '⚠️ ', `AVISOS: ${warnings.length}\n`);
    warnings.forEach((warning, index) => {
      console.log(`${COLORS.yellow}${index + 1}.${COLORS.reset} ${warning.file}${warning.line ? `:${warning.line}` : ''}`);
      console.log(`   ${warning.message}\n`);
    });
  }
  
  if (info.length > 0) {
    log(COLORS.green, '📈', 'ESTATÍSTICAS:\n');
    info.forEach(item => {
      console.log(`   ${COLORS.gray}•${COLORS.reset} ${item}`);
    });
    console.log('');
  }
  
  console.log('='.repeat(80) + '\n');
  
  const totalIssues = errors.length + warnings.length;
  
  if (errors.length === 0 && warnings.length === 0) {
    log(COLORS.green, '✅', 'Validação SEO APROVADA! Nenhum problema encontrado.\n');
    return 0;
  } else if (errors.length === 0) {
    log(COLORS.yellow, '⚠️ ', `Validação com AVISOS (${warnings.length} avisos). Recomenda-se corrigir.\n`);
    return 0;
  } else {
    log(COLORS.red, '❌', `Validação FALHOU com ${errors.length} erros e ${warnings.length} avisos.\n`);
    log(COLORS.cyan, '💡', 'Dicas para corrigir:');
    console.log(`   ${COLORS.gray}•${COLORS.reset} Todas as imagens devem ter alt text descritivo`);
    console.log(`   ${COLORS.gray}•${COLORS.reset} Titles devem ter 55-60 caracteres`);
    console.log(`   ${COLORS.gray}•${COLORS.reset} Descriptions devem ter 140-160 caracteres`);
    console.log(`   ${COLORS.gray}•${COLORS.reset} Evite alt text genérico como "imagem" ou "foto"\n`);
    return 1;
  }
}

async function main() {
  console.log('\n');
  log(COLORS.blue, '🚀', 'Iniciando validação SEO automatizada...\n');
  
  try {
    validateImageAltText();
    validateSEOMetaTags();
    validateSEOHead();
    
    const exitCode = printReport();
    process.exit(exitCode);
  } catch (error) {
    log(COLORS.red, '❌', 'Erro durante validação:');
    console.error(error);
    process.exit(1);
  }
}

main();
