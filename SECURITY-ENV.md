# 🔒 Segurança de Variáveis de Ambiente

Este documento explica as práticas de segurança implementadas para proteger as variáveis de ambiente da aplicação CARMIGUI contra possíveis ataques.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Validações Implementadas](#validações-implementadas)
- [Configuração Segura](#configuração-segura)
- [Práticas de Segurança](#práticas-de-segurança)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A aplicação implementa **validação em runtime** de todas as variáveis de ambiente críticas antes do servidor iniciar. Isso previne:

- ✅ Deploy com configurações inválidas
- ✅ Uso de secrets fracos ou padrão
- ✅ Vazamento acidental de credenciais
- ✅ Configurações inseguras em produção

## 🛡️ Validações Implementadas

### 1. SESSION_SECRET (Obrigatório)

O `SESSION_SECRET` é validado com múltiplas camadas de segurança:

#### Validações Aplicadas:
- **Existência**: Deve estar definido
- **Comprimento mínimo**: 32 caracteres (OBRIGATÓRIO)
- **Comprimento recomendado**: 64+ caracteres (AVISO se menor)
- **Valores fracos**: Rejeita valores padrão conhecidos
- **Entropia**: Verifica aleatoriedade dos caracteres

#### Valores Rejeitados:
```bash
❌ SUBSTITUA_POR_STRING_ALEATORIA_FORTE_MINIMO_32_CARACTERES
❌ change-this-to-a-random-secret
❌ your-secret-here
❌ secret
❌ password
❌ 12345678901234567890123456789012
```

#### Como Gerar um Secret Seguro:
```bash
# Método 1: Node.js (Recomendado)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Método 2: Node.js (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Método 3: OpenSSL
openssl rand -hex 32

# Método 4: Linux/Mac
head -c 32 /dev/urandom | base64
```

### 2. Banco de Dados (Ambiente-Específico)

#### Desenvolvimento: SQLite
- **Automático**: SQLite é usado automaticamente em desenvolvimento
- **Arquivo local**: `./database.db`
- **Sem configuração necessária**

#### Produção: Turso Database (Obrigatório)

**Validações Aplicadas:**
- **TURSO_DATABASE_URL**: Deve estar definido em produção
- **TURSO_AUTH_TOKEN**: Deve estar definido em produção
- **Protocolo**: Deve usar `libsql://`
- **Localhost**: Rejeita conexões localhost em produção

**Formato Correto:**
```bash
✅ libsql://carmigui-db.turso.io
✅ TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

❌ libsql://localhost:8080
❌ postgresql://... (não suportado - apenas SQLite/Turso)
```

### 3. NODE_ENV

#### Valores Válidos:
- `development` - Desenvolvimento local (SQLite)
- `production` - Produção/Deploy (Turso)

#### Impacto no Comportamento:
- **Banco de Dados**: SQLite (dev) vs Turso (prod)
- **CORS**: Origins permitidos
- **Cookies**: Secure flag habilitado em produção
- **Logs**: Nível de detalhamento
- **Cache**: Configurações otimizadas

### 4. Variáveis Recomendadas

Estas variáveis geram **avisos** se ausentes:

- `BASE_URL` - URL do site em produção (SEO)
- `ADMIN_EMAIL` - Email do administrador
- `ADMIN_PASSWORD` - Senha inicial do admin

---

## ⚙️ Configuração Segura

### Passo 1: Copiar Template
```bash
cp .env.example .env
```

### Passo 2: Gerar SESSION_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Passo 3: Configurar Turso (Produção)
```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Criar database
turso db create carmigui

# Obter credenciais
turso db show carmigui
```

### Passo 4: Editar .env
```bash
# Abra o arquivo .env e substitua os valores:
nano .env  # ou use seu editor favorito
```

### Passo 5: Validar Configuração
```bash
npm run dev
```

Se houver erros, você verá mensagens claras:
```
❌ ERRO [SESSION_SECRET]: SESSION_SECRET deve ter no mínimo 32 caracteres (atual: 16)
❌ ERRO [TURSO_DATABASE_URL / TURSO_AUTH_TOKEN]: Turso Database é obrigatório em produção
```

---

## 🔐 Práticas de Segurança

### ✅ O Que FAZER

1. **Use valores únicos para cada ambiente**
   ```bash
   # .env.development
   SESSION_SECRET=dev_secret_here_32_chars_minimum_required
   # SQLite é usado automaticamente
   
   # .env.production
   SESSION_SECRET=prod_secret_here_different_from_dev_32chars
   TURSO_DATABASE_URL=libsql://carmigui.turso.io
   TURSO_AUTH_TOKEN=eyJ...
   ```

2. **Mantenha .env fora do Git**
   - O arquivo `.gitignore` já está configurado
   - **NUNCA** faça commit de arquivos `.env`

3. **Rotacione secrets regularmente**
   - Gere novos SESSION_SECRET a cada 3-6 meses
   - Após suspeita de vazamento, rotacione IMEDIATAMENTE

4. **Use secrets do provedor de hospedagem**
   - **Vercel**: Use Environment Variables no dashboard
   - **Replit**: Use Secrets no painel lateral
   - **Railway**: Use Variables no projeto

5. **Monitore acessos suspeitos**
   - Revise logs regularmente
   - Configure alertas de segurança

### ❌ O Que NÃO FAZER

1. **Nunca commite .env no Git**
   ```bash
   # ERRADO ❌
   git add .env
   git commit -m "Add env file"
   
   # CORRETO ✅
   # .env já está no .gitignore
   ```

2. **Nunca use valores padrão**
   ```bash
   # ERRADO ❌
   SESSION_SECRET=secret
   
   # CORRETO ✅
   SESSION_SECRET=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
   ```

3. **Nunca compartilhe .env**
   - Não envie por email, Slack, WhatsApp
   - Use sistemas de gerenciamento de secrets

4. **Nunca logue variáveis sensíveis**
   ```javascript
   // ERRADO ❌
   console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
   
   // CORRETO ✅
   console.log('SESSION_SECRET:', '***');
   ```

---

## 🚨 Troubleshooting

### Erro: "SESSION_SECRET is required"
```bash
# Solução:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copie o resultado e adicione no .env:
SESSION_SECRET=resultado_aqui
```

### Erro: "SESSION_SECRET deve ter no mínimo 32 caracteres"
```bash
# O secret atual é muito curto
# Gere um novo com 32+ caracteres:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erro: "SESSION_SECRET está usando um valor padrão inseguro"
```bash
# Você está usando o valor do .env.example
# Gere um novo secret único:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Erro: "Turso Database é obrigatório em produção"
```bash
# Configure Turso Database:
# 1. Instale CLI:
curl -sSfL https://get.tur.so/install.sh | bash

# 2. Login:
turso auth login

# 3. Crie database:
turso db create carmigui

# 4. Obtenha credenciais:
turso db show carmigui

# 5. Adicione no .env ou secrets do provedor:
TURSO_DATABASE_URL=libsql://seu-db.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### Aviso: "SESSION_SECRET tem baixa entropia"
```bash
# O secret tem pouca variação de caracteres
# Use o método crypto.randomBytes para gerar um novo:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📚 Referências

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [Turso Database Documentation](https://docs.turso.tech)
- [Express Session Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 🆘 Suporte

Se você encontrar problemas de segurança:

1. **NÃO** abra issues públicas com detalhes de vulnerabilidades
2. Entre em contato diretamente com a equipe de desenvolvimento
3. Forneça detalhes do problema de forma privada

---

**Última Atualização**: 25 de Outubro de 2025  
**Versão**: 2.0.0 - SQLite + Turso
