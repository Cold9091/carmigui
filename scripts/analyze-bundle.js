import { build } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function analyzeBundle() {
  console.log('📊 Iniciando análise de bundle...\n');

  try {
    await build({
      plugins: [
        react(),
        visualizer({
          filename: './dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap',
        }),
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "..", "client", "src"),
          "@shared": path.resolve(__dirname, "..", "shared"),
          "@assets": path.resolve(__dirname, "..", "attached_assets"),
        },
      },
      root: path.resolve(__dirname, "..", "client"),
      build: {
        outDir: path.resolve(__dirname, "..", "dist/public"),
        emptyOutDir: true,
        reportCompressedSize: true,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              router: ['wouter'],
              ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
            },
          },
        },
      },
    });

    console.log('\n✅ Análise de bundle concluída!');
    console.log('📈 Relatório salvo em: ./dist/stats.html');
    console.log('\n💡 Tamanhos incluem:');
    console.log('   - Gzip compression');
    console.log('   - Brotli compression');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Abra ./dist/stats.html no navegador para visualização interativa');
    console.log('   2. Execute "node scripts/check-bundle-size.js" para validar limites');
  } catch (error) {
    console.error('❌ Erro na análise:', error);
    process.exit(1);
  }
}

analyzeBundle();
