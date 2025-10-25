# 📝 Scripts Adicionais para package.json

Como o `package.json` não pode ser editado automaticamente, você precisará adicionar manualmente os seguintes scripts na seção `"scripts"`.

## Scripts a Adicionar

Abra o arquivo `package.json` e adicione os seguintes scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push",
    
    // ⬇️ ADICIONE ESTES SCRIPTS NOVOS ⬇️
    "db:migrate": "node scripts/db-migrate.js",
    "validate:env": "node scripts/validate-env.js",
    "predeploy": "npm run validate:env && npm run check",
    "vercel-build": "npm run db:push && npm run build"
  }
}
```

## Descrição dos Scripts

### `db:migrate`
Executa as migrações do banco de dados de forma segura, incluindo validação de ambiente.

**Uso**:
```bash
npm run db:migrate
```

### `validate:env`
Valida se todas as variáveis de ambiente obrigatórias estão configuradas corretamente.

**Uso**:
```bash
npm run validate:env
```

### `predeploy`
Script de pré-deploy que valida ambiente e verifica tipos TypeScript antes de fazer deploy.

**Uso**:
```bash
npm run predeploy
```

### `vercel-build`
Script especial usado pelo Vercel durante o build. Executa migrations e build automaticamente.

**Este script é chamado automaticamente pelo Vercel** - configurado em `vercel.json`

---

## Como Adicionar

1. Abra o arquivo `package.json`
2. Localize a seção `"scripts"`
3. Adicione as 4 novas linhas após `"db:push"`
4. Salve o arquivo

## Verificação

Após adicionar, teste os scripts:

```bash
# Testar validação de ambiente
npm run validate:env

# Testar migrações (se já tiver DATABASE_URL configurado)
npm run db:migrate

# Testar pré-deploy
npm run predeploy
```

---

**Importante**: Estes scripts são essenciais para o processo de deploy no Vercel funcionar corretamente!
