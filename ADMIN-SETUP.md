# 🔐 Setup do Administrador - CARMIGUI

## ⚠️ Problema: Não consigo acessar /admin

**Motivo:** Não existe nenhum usuário administrador criado no sistema.

## ✅ Solução Automática (Produção - Vercel)

Se você configurou as variáveis de ambiente no Vercel:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

O usuário será **criado automaticamente** na próxima vez que o servidor iniciar!

### Como configurar no Vercel:

1. Acesse: **Settings** → **Environment Variables**
2. Adicione:
   - **Key:** `ADMIN_EMAIL` | **Value:** `admin@carmigui.com`
   - **Key:** `ADMIN_PASSWORD` | **Value:** `SuaSenhaSegura123!`
3. **Redeploy** a aplicação

🎉 O usuário será criado automaticamente no próximo deploy!

---

## ✅ Solução: Criar Usuário Administrador

### Opção 1: Usando o Script Automático (Recomendado)

```bash
npm run setup:admin
```

O script vai pedir:
1. **Nome completo** do administrador
2. **Email** para login
3. **Senha** (requisitos de segurança)
4. **Confirmação da senha**

**Requisitos da senha:**
- Mínimo 8 caracteres
- Pelo menos 1 letra minúscula
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%^&*...)

### Opção 2: Criar Manualmente via Código

Se preferir, você pode adicionar um endpoint temporário ou usar o console do Node.js:

```typescript
// No servidor (development)
import { hashPassword } from "./server/auth";
import { storage } from "./server/storage";

const password = await hashPassword("SuaSenha123!");
await storage.createUser({
  name: "Admin",
  email: "admin@carmigui.com",
  password: password
});
```

---

## 🚀 Acessando o Painel Admin

Depois de criar o usuário:

### Local (Development):
```
http://localhost:5000/admin/login
```

### Produção (Vercel):
```
https://seu-site.vercel.app/admin/login
```

### Credenciais:
- **Email:** o que você cadastrou
- **Senha:** a que você definiu

---

## 📋 Rotas do Painel Admin

Após o login, você terá acesso a:

| Rota | Descrição |
|------|-----------|
| `/admin` | Dashboard principal |
| `/admin/hero` | Gerenciar banner principal |
| `/admin/properties` | Gerenciar imóveis |
| `/admin/projects` | Gerenciar projetos de construção |
| `/admin/condominiums` | Gerenciar condomínios |
| `/admin/contacts` | Ver mensagens de contato |
| `/admin/categories` | Gerenciar categorias |
| `/admin/cities` | Gerenciar cidades |
| `/admin/about` | Gerenciar funcionários |
| `/admin/database` | Configuração do banco de dados |
| `/admin/settings` | Configurações gerais |

---

## 🔒 Segurança

### Alterar Senha

Após o primeiro login, você pode alterar sua senha em `/admin/settings`

### Requisitos de Senha Forte

O sistema força o uso de senhas fortes:
- ✅ Mínimo 8 caracteres
- ✅ Combinação de letras, números e símbolos
- ✅ Maiúsculas e minúsculas

### Sessões

- Sessões duram 7 dias
- Logout automático após inatividade
- Cookies seguros em produção (HTTPS)

---

## 🛠️ Troubleshooting

### Erro: "Email ou senha incorretos"

1. Certifique-se que o usuário foi criado com sucesso
2. Verifique se está usando o email correto
3. Lembre-se: a senha é case-sensitive

### Erro: "Não autenticado"

1. Faça login em `/admin/login` primeiro
2. Verifique se os cookies estão habilitados no navegador
3. Em produção, certifique-se que HTTPS está ativo

### Erro ao criar usuário: "Já existe um usuário com este email"

Use um email diferente ou remova o usuário existente do banco de dados.

---

## 📝 Notas Importantes

1. **Primeiro usuário:** Crie-o usando `npm run setup:admin`
2. **Usuários adicionais:** Podem ser criados via painel admin (se implementado) ou repetindo o script
3. **Produção:** Certifique-se de criar um usuário forte antes de fazer deploy
4. **Segurança:** Nunca compartilhe ou commite credenciais no Git

---

## ✉️ Suporte

Se precisar de ajuda adicional, verifique:
- `server/auth.ts` - Lógica de autenticação
- `client/src/hooks/use-auth.tsx` - Hook de autenticação no frontend
- `client/src/lib/protected-route.tsx` - Proteção de rotas
