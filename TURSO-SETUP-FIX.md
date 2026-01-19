# 🔧 Corrigir Erro: "Cannot read properties of undefined (reading 'initPromise')"

## Problema
Ao tentar criar um condomínio no Vercel, recebe erro:
```
Error creating Condominium: TypeError: Cannot read properties of undefined (reading 'initPromise')
    at createCondominium (file:///var/task/dist/app.js:3134:16)
```

## Causa Raiz
As variáveis de ambiente **TURSO_DATABASE_URL** e **TURSO_AUTH_TOKEN** não estão configuradas no Vercel, mas o sistema está tentando usar TursoStorage de forma insegura.

---

## ✅ Solução (Passo a Passo)

### 1️⃣ Aceder ao Vercel Dashboard
```
https://vercel.com/dashboard
```

### 2️⃣ Selecionar o Projeto
- Clique no projeto **carmigui**

### 3️⃣ Ir para Environment Variables
- Menu: **Settings** → **Environment Variables**

### 4️⃣ Adicionar Variáveis do Turso

**Se ainda não tem banco Turso:**
1. Aceda a https://turso.tech
2. Crie uma nova database
3. Copie:
   - **Database URL** (formato: `libsql://seu-database.turso.io`)
   - **Auth Token** (clique em "Tokens")

**Adicionar no Vercel:**

| Variable Name | Value | Scope |
|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://seu-database.turso.io` | Production |
| `TURSO_AUTH_TOKEN` | `seu_token_secreto_aqui` | Production |

### 5️⃣ Fazer Reprocess do Deployment
1. Vá para **Deployments**
2. Selecione o deployment atual
3. Clique em **"Reprocess deployment"**
4. Aguarde até completar (deve levar ~2min)

### 6️⃣ Testar
Tente criar um condomínio novamente. Agora deve funcionar!

---

## 🔍 Verificar Logs

Se ainda tiver erro, verifique os logs:

**No Vercel:**
1. Dashboard → seu projeto
2. **Deployments** → último deployment
3. **Logs** → procure por "TursoStorage"

Deve ver:
```
✅ TursoSessionStore criado (sessões persistentes)
✅ TursoStorage conectado: libsql://...
```

Se vir erro como:
```
❌ ERRO CRÍTICO: Você está em produção (Vercel) mas não configurou as variáveis Turso!
```

Volte ao passo 4 e certifique-se que as variáveis estão salvas.

---

## 📝 Checklist Final

- [ ] TURSO_DATABASE_URL adiciona no Vercel
- [ ] TURSO_AUTH_TOKEN adicionado no Vercel
- [ ] Reprocess deployment feito
- [ ] Logs mostram "✅ TursoStorage conectado"
- [ ] Teste: consegue criar condomínio

---

## 🆘 Se Ainda Não Funcionar

Verifique:

1. **As variáveis estão no scope correto?**
   - Devem estar em **Production**, não apenas em Development

2. **O token é válido?**
   - Aceda a Turso.tech e gere um novo token

3. **O database URL está correto?**
   - Deve ser: `libsql://seu-nome-database.turso.io`
   - NÃO deve ser a URL com porta (sem `:8080`)

4. **Fez reprocess depois de adicionar as variáveis?**
   - Se não, o deployment anterior ainda vai usar valores antigos

---

## 🚀 Melhoria de Segurança Implementada

O código agora:
✅ Valida variáveis de ambiente na inicialização
✅ Em produção, exige Turso (não usa fallback)
✅ Mostra mensagem de erro clara e acionável
✅ Falha rápido (fail-fast) em vez de erro silencioso

Isto significa que em produção **não há mais risco** de dados não persistirem.
