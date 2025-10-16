import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function compressImage() {
  const inputPath = join(__dirname, '..', 'attached_assets', 'Component 1_1760554140338.jpg');
  const outputPathJpg = join(__dirname, '..', 'attached_assets', 'Component 1_1760554140338_optimized.jpg');
  const outputPathWebP = join(__dirname, '..', 'attached_assets', 'Component 1_1760554140338.webp');

  try {
    console.log('🖼️  Comprimindo imagem...');
    
    const metadata = await sharp(inputPath).metadata();
    console.log(`📊 Tamanho original: ${metadata.width}x${metadata.height}`);

    await sharp(inputPath)
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ 
        quality: 82,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPathJpg);

    await sharp(inputPath)
      .resize(1920, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ 
        quality: 80,
        effort: 6
      })
      .toFile(outputPathWebP);

    const fs = await import('fs');
    const originalSize = fs.statSync(inputPath).size;
    const jpgSize = fs.statSync(outputPathJpg).size;
    const webpSize = fs.statSync(outputPathWebP).size;

    console.log('✅ Compressão concluída!');
    console.log(`📦 Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📦 JPG otimizado: ${(jpgSize / 1024).toFixed(2)} KB (${((1 - jpgSize/originalSize) * 100).toFixed(1)}% menor)`);
    console.log(`📦 WebP: ${(webpSize / 1024).toFixed(2)} KB (${((1 - webpSize/originalSize) * 100).toFixed(1)}% menor)`);
    
    console.log('\n💡 Agora você pode usar a versão otimizada!');
  } catch (error) {
    console.error('❌ Erro ao comprimir:', error);
    process.exit(1);
  }
}

compressImage();
