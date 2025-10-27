# 🚀 Pipeline de Deploy - CARMIGUI

Documentação completa do pipeline de deploy automatizado para Vercel.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Scripts de Deploy](#scripts-de-deploy)
3. [GitHub Actions CI/CD](#github-actions-cicd)
4. [Processo de Migrações](#processo-de-migrações)
5. [Monitoramento e Logs](#monitoramento-e-logs)
6. [Guia de Uso](#guia-de-uso)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O pipeline de deploy automatizado oferece:

- ✅ **Scripts automatizados** para deploy local e CI/CD
- ✅ **GitHub Actions** para integração contínua
- ✅ **Migrações seguras** com backup e rollback
- ✅ **Monitoramento** de saúde e performance
- ✅ **Logs estruturados** para produção

### Arquitetura do Pipeline

```
┌─────────────────┐
│   Código Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pre-Deploy     │
│  - TypeScript   │
│  - Lint         │
│  - Bundle       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Build         │
│   - Frontend    │
│   - Backend     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Migrations    │
│   - Backup      │
│   - Push Schema │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Deploy        │
│   - Vercel      │
│   - Production  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Monitor       │
│   - Health      │
│   - Logs        │
└─────────────────┘
```

---

## 📦 Scripts de Deploy

### 1. Deploy Manual

```bash
# Deploy para preview (staging)
./scripts/deploy.sh preview

# Deploy para produção
./scripts/deploy.sh production
```

**O que faz:**
1. Valida dependências (Node, NPM, Vercel CLI)
2. Executa validação de ambiente
3. Verifica TypeScript
4. Analisa bundle size
5. Deploy no Vercel
6. Mostra próximos passos

### 2. Pre-Deploy Check

```bash
./scripts/pre-deploy-check.sh
```

**Verificações:**
- ✅ Git status (commits pendentes)
- ✅ Variáveis de ambiente
- ✅ TypeScript check
- ✅ Build test
- ✅ Bundle size
- ✅ Arquivos de configuração
- ✅ Dependências atualizadas

### 3. Dar Permissões

```bash
chmod +x scripts/*.sh
```

---

## ⚙️ GitHub Actions CI/CD

### Workflows Configurados

#### 1. **CI - Integração Contínua**
Arquivo: `.github/workflows/ci.yml`

**Triggers:**
- Push em `main` ou `develop`
- Pull Requests

**Jobs:**
- Lint e TypeScript check
- Análise de bundle
- Security check (npm audit)

#### 2. **Deploy Preview**
Arquivo: `.github/workflows/deploy-preview.yml`

**Triggers:**
- Pull Requests para `main`/`develop`
- Push em `develop`

**Jobs:**
1. Validação de ambiente
2. TypeScript check
3. Build
4. Deploy para Vercel Preview
5. Comentário no PR com URL

#### 3. **Deploy Production**
Arquivo: `.github/workflows/deploy-production.yml`

**Triggers:**
- Push em `main`
- Manual (workflow_dispatch)

**Jobs:**
1. Pre-deploy checks (todas as validações)
2. Deploy para Vercel Production
3. Notificação de sucesso/erro

### Secrets Necessários

Configure no GitHub: **Settings > Secrets and variables > Actions**

| Secret | Descrição | Como Obter |
|--------|-----------|------------|
| `VERCEL_TOKEN` | Token de autenticação Vercel | [Vercel Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | ID da organização | Comando `vercel` → `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | ID do projeto | Comando `vercel` → `.vercel/project.json` |
| `SESSION_SECRET` | Chave secreta | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `TURSO_DATABASE_URL` | URL do Turso | Dashboard do Turso |
| `TURSO_AUTH_TOKEN` | Token do Turso | Dashboard do Turso |

---

## 💾 Processo de Migrações

### Script Melhorado

Arquivo: `scripts/db-migrate.js`

**Recursos:**
- ✅ Backup automático antes de migrar (SQLite local)
- ✅ Validação de variáveis de ambiente
- ✅ Teste de conexão com banco
- ✅ Gerenciamento de backups (mantém últimos 5)
- ✅ Mensagens de erro claras
- ✅ Instruções de rollback

### Uso

```bash
# Executar migrações
npm run db:migrate

# ou diretamente
node scripts/db-migrate.js
```

### Rollback Manual

Se algo der errado:

```bash
# Listar backups
ls backups/

# Restaurar backup
cp backups/backup-2025-10-27T12-00-00.db ./database.db
```

### Turso Production

Para produção com Turso:

```bash
# Criar backup
turso db backup create carmigui

# Listar backups
turso db backup list carmigui

# Restaurar backup
turso db backup restore carmigui <backup-id>
```

---

## 📊 Monitoramento e Logs

### 1. Health Check API

**Endpoint:** `/api/health`

```bash
curl https://carmigui.com/api/health
```

**Resposta:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-27T12:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": "45 MB",
    "heapTotal": "20 MB",
    "heapUsed": "15 MB"
  },
  "env": "production"
}
```

### 2. Monitoramento Automatizado

```bash
# Verificar saúde da produção
node scripts/monitor-production.js
```

**Endpoints Verificados:**
- Homepage (/)
- Health Check API (/api/health)
- Properties API (/api/properties)

**Output:**
```
✅ Homepage - 200 (150ms)
✅ Health Check API - 200 (50ms)
✅ Properties API - 200 (120ms)
```

### 3. Logs de Produção

**Via Vercel CLI:**
```bash
# Ver últimos logs
./scripts/logs-production.sh

# Seguir logs em tempo real
./scripts/logs-production.sh --follow
```

**Via Dashboard:**
- Acesse: https://vercel.com/[seu-projeto]/logs

### 4. Logs Estruturados (API)

**Endpoint:** `/api/logs` (requer autenticação)

```bash
# Ver últimos 100 logs
curl -H "Cookie: connect.sid=..." https://carmigui.com/api/logs

# Ver apenas erros
curl -H "Cookie: connect.sid=..." https://carmigui.com/api/logs?type=errors
```

### 5. Métricas

**Endpoint:** `/api/metrics` (requer autenticação)

```json
{
  "period": "1000 últimos requests",
  "totalRequests": 1000,
  "errorCount": 5,
  "errorRate": "0.50%",
  "avgResponseTime": "125ms",
  "statusCodes": {
    "200": 950,
    "400": 3,
    "500": 2
  }
}
```

### 6. Logger Middleware

Integrado automaticamente no servidor:

```typescript
import { requestLogger, errorLogger } from './middleware/logger.js';

app.use(requestLogger);
app.use(errorLogger);
```

**Logs em produção:** JSON estruturado
**Logs em desenvolvimento:** Formato legível

---

## 📖 Guia de Uso

### Deploy Inicial

1. **Configure Secrets no GitHub**
   ```bash
   # Obter IDs do projeto
   vercel
   # Copie org_id e project_id de .vercel/project.json
   ```

2. **Adicione Secrets**
   - GitHub > Settings > Secrets
   - Adicione todos os secrets listados acima

3. **Push para Main**
   ```bash
   git push origin main
   ```

4. **Acompanhe Deploy**
   - GitHub > Actions
   - Vercel > Dashboard

### Deploy Diário

**Desenvolvimento (Feature Branch):**
```bash
git checkout -b feature/nova-funcionalidade
# ... fazer mudanças ...
git commit -am "Add: nova funcionalidade"
git push origin feature/nova-funcionalidade
# Criar PR → Deploy Preview automático
```

**Produção:**
```bash
git checkout main
git merge develop
git push origin main
# Deploy Production automático
```

### Deploy Manual de Emergência

```bash
# Verificar tudo antes
./scripts/pre-deploy-check.sh

# Deploy direto
./scripts/deploy.sh production
```

---

## 🔧 Troubleshooting

### Deploy Falhou no GitHub Actions

**Erro:** `Vercel token is invalid`
- Verifique se VERCEL_TOKEN está correto
- Gere novo token: https://vercel.com/account/tokens

**Erro:** `Build failed`
- Verifique logs no GitHub Actions
- Execute localmente: `npm run build`
- Verifique TypeScript: `npm run check`

**Erro:** `Environment variables missing`
- Verifique secrets no GitHub
- Adicione variáveis faltantes no Vercel

### Migrações Falharam

**Erro:** `Connection refused`
- Verifique TURSO_DATABASE_URL
- Teste conexão: `turso db show <database>`

**Erro:** `Schema conflict`
- Use force: `npm run db:push -- --force`
- Ou reverta backup: `cp backups/backup-*.db ./database.db`

### Monitoramento

**Erro 503 - Service Unavailable**
- Verifique logs: `./scripts/logs-production.sh`
- Verifique health: `node scripts/monitor-production.js`
- Reinicie função no Vercel Dashboard

**Alto Tempo de Resposta**
- Verifique métricas: `/api/metrics`
- Analise logs de erro: `/api/logs?type=errors`
- Considere otimizações de banco

### Logs Não Aparecem

**No Vercel:**
- Logs podem ter delay de ~1 minuto
- Use `--follow` para tempo real

**No Dashboard:**
- Filtros podem estar ativos
- Verifique timezone

---

## 📚 Próximos Passos

1. ✅ Configure GitHub Secrets
2. ✅ Faça primeiro deploy
3. ✅ Configure monitoramento externo (opcional)
   - [UptimeRobot](https://uptimerobot.com)
   - [Sentry](https://sentry.io)
4. ✅ Configure domínio customizado
5. ✅ Configure Vercel Blob para uploads
6. ✅ Configure alertas de erro

---

## 🎓 Boas Práticas

1. **Sempre** rode pre-deploy check antes de deploy manual
2. **Nunca** faça deploy para produção sem testes
3. **Sempre** tenha backup antes de migração
4. **Monitore** logs após cada deploy
5. **Documente** mudanças importantes

---

**Versão:** 1.0.0  
**Última Atualização:** 27 de Outubro de 2025
