# 🚀 Quick Start - Deploy CARMIGUI no Vercel

Guia rápido para deploy em 10 minutos.

---

## ⚡ Passos Rápidos

### 1️⃣ Preparar Banco de Dados (5 min)

1. Crie conta em [neon.tech](https://neon.tech)
2. Crie novo projeto: `carmigui-production`
3. Copie a Connection String
   - Exemplo: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### 2️⃣ Gerar Secrets (2 min)

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
DATABASE_URL = sua_connection_string_aqui
SESSION_SECRET = resultado_do_comando_acima
NODE_ENV = production
ADMIN_EMAIL = admin@carmigui.com
ADMIN_PASSWORD = SuaSenhaForte123!
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
  "db:migrate": "node scripts/db-migrate.js",
  "validate:env": "node scripts/validate:env.js",
  "predeploy": "npm run validate:env && npm run check",
  "vercel-build": "npm run db:push && npm run build"
}
```

Ver detalhes em: `SCRIPTS-PACKAGE.md`

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
➡️ Verifique se `DATABASE_URL` está configurada no Vercel

### Login Não Funciona
➡️ Verifique se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão configurados

### Imagens Não Carregam
➡️ Configure Vercel Blob Storage (ver `DEPLOY.md`)

---

## 📞 Precisa de Ajuda?

Consulte `DEPLOY.md` para instruções detalhadas ou troubleshooting completo.

---

✅ **Pronto para produção!**
