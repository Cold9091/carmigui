# Configuração para Desenvolvimento Local

## Dependência Adicional para Dev

O `tsx` foi removido das dependências do projeto para evitar conflitos no deploy do Vercel.

Para rodar o projeto localmente em modo desenvolvimento, você precisa instalar o `tsx`:

```bash
# Opção 1: Instalar globalmente (recomendado)
npm install -g tsx

# Opção 2: Instalar localmente (não commitado)
npm install tsx --save-dev --no-save

# Opção 3: Usar npx (não precisa instalar)
# Modifique o script dev no package.json para:
# "dev": "npx tsx server/index.ts"
```

## Comandos Disponíveis

```bash
# Desenvolvimento (requer tsx instalado)
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm run start

# Build para Vercel (usado automaticamente)
npm run vercel-build
```

## Por que tsx foi removido?

O `tsx` tinha conflito de versão do `esbuild` que causava falha no deploy do Vercel.
Como o tsx é usado apenas para desenvolvimento local (`npm run dev`), foi removido
das dependências do projeto para não afetar o build de produção.
