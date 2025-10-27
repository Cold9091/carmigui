# ⚡ Deploy Rápido - CARMIGUI

Guia de 5 minutos para fazer deploy no Vercel.

---

## 🚀 Deploy em 5 Passos

### 1️⃣ Preparar Turso Database (2 min)

```bash
# Instalar CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Criar database
turso db create carmigui

# Obter credenciais
turso db show carmigui
```

Copie:
- `URL` → TURSO_DATABASE_URL
- `Auth token` → TURSO_AUTH_TOKEN

### 2️⃣ Gerar SESSION_SECRET (30 seg)

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3️⃣ Deploy no Vercel (2 min)

**Via Dashboard:**
1. Acesse https://vercel.com/new
2. Import seu repositório
3. Adicione variáveis de ambiente:
   ```
   TURSO_DATABASE_URL = libsql://...
   TURSO_AUTH_TOKEN = eyJ...
   SESSION_SECRET = a1b2c3d4...
   NODE_ENV = production
   ADMIN_EMAIL = admin@carmigui.com
   ADMIN_PASSWORD = SuaSenhaForte123!
   ```
4. Clique em **Deploy**

**Via CLI:**
```bash
npm install -g vercel
vercel
vercel --prod
```

### 4️⃣ Configurar GitHub Actions (30 seg)

1. GitHub > Settings > Secrets and variables > Actions
2. Adicione:
   ```
   VERCEL_TOKEN → Copie de vercel.com/account/tokens
   VERCEL_ORG_ID → De .vercel/project.json
   VERCEL_PROJECT_ID → De .vercel/project.json
   SESSION_SECRET → Sua chave gerada
   TURSO_DATABASE_URL → URL do Turso
   TURSO_AUTH_TOKEN → Token do Turso
   ```

### 5️⃣ Verificar Deploy (30 seg)

```bash
# Via script
node scripts/monitor-production.js

# Ou manual
curl https://seu-site.vercel.app/api/health
```

---

## ✅ Checklist Pós-Deploy

- [ ] Site acessível na URL do Vercel
- [ ] Health check retorna 200 OK
- [ ] Login admin funciona
- [ ] Trocar senha do admin
- [ ] Configurar domínio customizado (opcional)

---

## 🔄 Deploy Contínuo

**Automático:**
```bash
git push origin main  # Deploy automático via GitHub Actions
```

**Manual:**
```bash
./scripts/deploy.sh production
```

---

## 📊 Monitoramento

```bash
# Health check
node scripts/monitor-production.js

# Logs
./scripts/logs-production.sh --follow

# Métricas
curl https://seu-site.com/api/metrics
```

---

## 🆘 Problemas Comuns

**Build falha:**
```bash
npm run check  # Verificar TypeScript
npm run build  # Testar build local
```

**Migrações falham:**
```bash
npm run db:push -- --force  # Forçar push
```

**Site não carrega:**
```bash
./scripts/logs-production.sh  # Ver logs
```

---

**Documentação Completa:** `DEPLOYMENT-PIPELINE.md`
