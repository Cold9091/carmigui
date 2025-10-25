# 🚀 Quick Start - Deploy CARMIGUI no Vercel

Guia rápido para deploy em 10 minutos.

---

## ⚡ Passos Rápidos

### 1️⃣ Preparar Banco de Dados Turso (5 min)

```bash
# 1. Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 2. Fazer login
turso auth login

# 3. Criar database
turso db create carmigui

# 4. Obter credenciais
turso db show carmigui
```

Anote:
- **TURSO_DATABASE_URL**: `libsql://carmigui-xxx.turso.io`
- **TURSO_AUTH_TOKEN**: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...`

### 2️⃣ Gerar SESSION_SECRET (1 min)

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado - será seu `SESSION_SECRET`

### 3️⃣ Deploy no Vercel (3 min)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório Git
3. Configure variáveis de ambiente:

```
TURSO_DATABASE_URL = libsql://carmigui-xxx.turso.io
TURSO_AUTH_TOKEN = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
SESSION_SECRET = resultado_do_comando_acima
NODE_ENV = production
ADMIN_EMAIL = admin@carmigui.com
ADMIN_PASSWORD = SuaSenhaForte123!
BASE_URL = https://seu-dominio.vercel.app
```

4. Clique em **Deploy**

### 4️⃣ Testar (1 min)

1. Abra o URL do Vercel
2. Vá para `/admin/login`
3. Use as credenciais que você definiu
4. **Troque a senha imediatamente**!

---

## 📝 Scripts Necessários

⚠️ **IMPORTANTE**: Adicione estes scripts ao `package.json`:

```json
"scripts": {
  "db:push": "drizzle-kit push:sqlite",
  "validate:env": "node scripts/validate-env.js",
  "predeploy": "npm run validate:env && npm run check",
  "vercel-build": "npm run build"
}
```

Ver detalhes em: `SCRIPTS-PACKAGE.md`

---

## 🗄️ Sobre o Banco de Dados

**Desenvolvimento**: SQLite (automático, arquivo local)  
**Produção**: Turso Database (SQLite distribuído, edge computing)

**Por que Turso?**
- ✅ Baixa latência global
- ✅ Compatível com SQLite
- ✅ Tier gratuito generoso
- ✅ Replicação automática
- ✅ Perfeito para edge computing

---

## 🔍 Validar Deploy

Após deploy, teste estas URLs:

- ✅ `https://seu-site.vercel.app` - Home
- ✅ `https://seu-site.vercel.app/imoveis` - Imóveis
- ✅ `https://seu-site.vercel.app/admin/login` - Admin

---

## 📚 Documentação Completa

- **Deploy Completo**: `DEPLOY.md`
- **Checklist**: `DEPLOY-CHECKLIST.md`
- **Segurança**: `SECURITY.md`
- **SEO**: `SEO-ESTRATEGIA-CARMIGUI.md`

---

## 🆘 Problemas Comuns

### Build Falha
➡️ Verifique se `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` estão configurados no Vercel

### Login Não Funciona
➡️ Verifique se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão configurados

### Erro de Conexão com Banco
➡️ Verifique se as credenciais Turso estão corretas (execute `turso db show carmigui`)

### Imagens Não Carregam
➡️ Configure Vercel Blob Storage (ver `DEPLOY.md`)

---

## 📞 Precisa de Ajuda?

Consulte `DEPLOY.md` para instruções detalhadas ou troubleshooting completo.

---

✅ **Pronto para produção!**
