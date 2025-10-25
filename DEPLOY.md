# 🚀 Guia Completo de Deploy - CARMIGUI

Este documento fornece instruções detalhadas para fazer deploy da aplicação CARMIGUI no Vercel.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
4. [Deploy no Vercel](#deploy-no-vercel)
5. [Pós-Deploy](#pós-deploy)
6. [Troubleshooting](#troubleshooting)
7. [Rollback](#rollback)

---

## 🔧 Pré-requisitos

Antes de iniciar o deploy, certifique-se de ter:

- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Conta no [Turso Database](https://turso.tech) (recomendado) ou outro provedor Turso
- [ ] CLI do Vercel instalado (opcional): `npm i -g vercel`
- [ ] Repositório Git configurado (GitHub, GitLab ou Bitbucket)
- [ ] Node.js 18+ instalado localmente

---

## 💾 Configuração do Banco de Dados

### Opção 1: Turso Database (Recomendado)

1. **Criar conta no Turso**
   - Acesse [turso.tech](https://turso.tech)
   - Faça login ou crie uma conta gratuita

2. **Criar novo projeto**
   - Clique em "New Project"
   - Nome: `carmigui-production`
   - Região: Escolha a mais próxima de Angola (ex: Frankfurt/eu-central-1)
   - Turso version: 16

3. **Obter string de conexão**
   - No dashboard do projeto, copie a Connection String
   - Formato: `libsql://user:pass@nome-do-database.turso.io?sslmode=require`
   - Guarde esta string - você vai precisar dela!

### Opção 2: Outro Provedor Turso

Alternativas compatíveis:
- **Supabase**: [supabase.com](https://supabase.com)
- **Railway**: [railway.app](https://railway.app)
- **Render**: [render.com](https://render.com)
- **AWS RDS**: Para escala empresarial

---

## 🔐 Configuração de Variáveis de Ambiente

### 1. Gerar SESSION_SECRET

Execute no terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado - será algo como:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### 2. Definir Credenciais do Admin

Escolha um email e senha forte para o administrador inicial:
- **Email**: Ex: `admin@carmigui.com`
- **Senha**: Mínimo 12 caracteres com letras, números e símbolos

⚠️ **IMPORTANTE**: Estas credenciais serão usadas apenas na primeira instalação. Você deve trocá-las após o primeiro login!

### 3. Tabela de Variáveis

| Variável | Obrigatória | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `TURSO_DATABASE_URL` | ✅ Sim | URL do database Turso | `libsql://user:pass@host/db` |
| `SESSION_SECRET` | ✅ Sim | Chave secreta para sessões (32+ chars) | `a1b2c3d4e5...` |
| `NODE_ENV` | ✅ Sim | Ambiente de execução | `production` |
| `ADMIN_EMAIL` | 🟡 Recomendado | Email do admin inicial | `admin@carmigui.com` |
| `ADMIN_PASSWORD` | 🟡 Recomendado | Senha do admin inicial | `SenhaForte123!` |
| `BASE_URL` | 🟡 Recomendado | URL do site em produção | `https://carmigui.com` |

---

## 🌐 Deploy no Vercel

### Método 1: Deploy via Dashboard (Mais Fácil)

1. **Conectar Repositório**
   - Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
   - Clique em "Add New Project"
   - Selecione seu repositório Git
   - Clique em "Import"

2. **Configurar Projeto**
   - **Project Name**: `carmigui`
   - **Framework Preset**: `Other` (já configurado via vercel.json)
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run vercel-build` (já configurado)
   - **Output Directory**: `dist/client` (já configurado)

3. **Adicionar Variáveis de Ambiente**
   - Na seção "Environment Variables", adicione:

   ```
   TURSO_DATABASE_URL = libsql://nome-do-database.turso.io
   SESSION_SECRET = sua_chave_secreta_gerada
   NODE_ENV = production
   ADMIN_EMAIL = admin@carmigui.com
   ADMIN_PASSWORD = SuaSenhaForte123!
   BASE_URL = https://carmigui.vercel.app
   ```

   ⚠️ **Marque todas as variáveis para**: Production, Preview, Development

4. **Fazer Deploy**
   - Clique em "Deploy"
   - Aguarde o build (3-5 minutos)
   - ✅ Deploy completo!

### Método 2: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login no Vercel
vercel login

# 3. Link ao projeto (primeira vez)
vercel link

# 4. Adicionar variáveis de ambiente
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add SESSION_SECRET
vercel env add NODE_ENV
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add BASE_URL

# 5. Deploy para produção
vercel --prod
```

---

## ✅ Pós-Deploy

### 1. Verificar Build

Após o deploy, verifique no dashboard do Vercel:
- ✅ Build Status: "Ready"
- ✅ Sem erros no log de build
- ✅ Função serverless criada

### 2. Testar a Aplicação

Acesse seu site e teste:

1. **Página Inicial**
   - Acesse: `https://seu-projeto.vercel.app`
   - Verifique se carrega corretamente
   - Verifique imagens e estilos

2. **Páginas Públicas**
   - `/imoveis` - Lista de imóveis
   - `/condominios` - Lista de condomínios
   - `/construcao` - Projetos de construção
   - `/sobre-nos` - Sobre a empresa
   - `/contacto` - Formulário de contato
   - `/faq` - Perguntas frequentes

3. **Login Admin**
   - Acesse: `/admin/login`
   - Use as credenciais definidas em `ADMIN_EMAIL` e `ADMIN_PASSWORD`
   - ⚠️ **IMPORTANTE**: Após primeiro login, vá em `/admin/settings` e **TROQUE A SENHA**!

4. **Testar CRUD no Admin**
   - Criar um imóvel de teste
   - Fazer upload de imagem
   - Editar e deletar

5. **Testar Formulário de Contato**
   - Preencha o formulário em `/contacto`
   - Verifique se aparece no admin em `/admin/contacts`

### 3. Configurar Domínio Personalizado (Opcional)

Se você tem `carmigui.com`:

1. No dashboard do Vercel, vá em **Settings > Domains**
2. Adicione seu domínio: `carmigui.com`
3. Configure os DNS conforme instruções do Vercel:
   - **Tipo A**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Aguarde propagação (até 48h, geralmente 10-30 min)
5. Atualize `BASE_URL` para `https://carmigui.com`

### 4. Configurar Robots.txt e Sitemap

Após deploy, verifique:
- `https://seu-site.com/robots.txt` - Deve carregar
- `https://seu-site.com/sitemap.xml` - Deve listar todas as páginas

### 5. Submeter ao Google

1. **Google Search Console**
   - Acesse: [search.google.com/search-console](https://search.google.com/search-console)
   - Adicione a propriedade: `https://seu-site.com`
   - Verifique propriedade
   - Submeta o sitemap: `https://seu-site.com/sitemap.xml`

2. **Google Business Profile**
   - Crie perfil para CARMIGUI
   - Use dados consistentes (NAP)
   - Adicione fotos e informações

---

## 🔧 Manutenção e Atualizações

### Deploy de Atualizações

Com Git conectado, o Vercel faz deploy automático:
- **Push para `main`** → Deploy em produção
- **Push para outras branches** → Deploy preview

Para deploy manual:
```bash
vercel --prod
```

### Rollback (Desfazer Deploy)

Se algo der errado:

1. **Via Dashboard**
   - Vá em **Deployments**
   - Encontre o deploy anterior funcionando
   - Clique nos 3 pontos → "Promote to Production"

2. **Via CLI**
   ```bash
   vercel rollback
   ```

### Logs e Monitoramento

Acesse logs em tempo real:
- **Dashboard**: Projeto > Deployments > [deployment] > Function Logs
- **CLI**: `vercel logs --follow`

---

## 🐛 Troubleshooting

### Problema: Build Falha

**Erro**: `npm run vercel-build failed`

**Solução**:
1. Verifique logs no Vercel
2. Comum: Falta variável `TURSO_DATABASE_URL`
3. Adicione manualmente no dashboard

### Problema: Database Connection Error

**Erro**: `Failed to connect to database`

**Solução**:
1. Verifique `TURSO_DATABASE_URL` está correta
2. Confirme que SSL está habilitado: `?sslmode=require`
3. Teste conexão localmente:
   ```bash
   turso db shell carmigui
   ```

### Problema: Session Secret Error

**Erro**: `SESSION_SECRET environment variable is required`

**Solução**:
1. Gere nova secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Adicione no Vercel: `vercel env add SESSION_SECRET`

### Problema: Admin Login Não Funciona

**Solução**:
1. Verifique se `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão definidos
2. Vá no banco e verifique se usuário foi criado:
   ```sql
   SELECT * FROM users;
   ```
3. Se não existe, rode migrations novamente

### Problema: Uploads Não Funcionam

**Solução**:
⚠️ **IMPORTANTE**: Vercel é serverless, uploads locais não persistem!

**Opções**:
1. **Vercel Blob Storage** (Recomendado)
   - Configure: [vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)
   
2. **Cloudinary** (Alternativa)
   - Use para armazenar imagens
   
3. **AWS S3** (Empresarial)
   - Configure bucket S3

### Problema: Imagens Não Carregam

**Solução**:
1. Verifique se `/uploads` e `/attached_assets` estão no `.vercelignore`
2. Configure storage externo (Vercel Blob, S3, Cloudinary)
3. Atualize URLs das imagens no banco

---

## 📊 Checklist Completo de Deploy

### Antes do Deploy

- [ ] Código em repositório Git
- [ ] Banco de dados Turso criado
- [ ] `TURSO_DATABASE_URL` obtida
- [ ] `SESSION_SECRET` gerada (32+ chars)
- [ ] Credenciais admin definidas
- [ ] `.env.example` revisado
- [ ] Testes locais passando

### Durante Deploy

- [ ] Projeto conectado no Vercel
- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Build executado com sucesso
- [ ] Função serverless criada
- [ ] Sem erros nos logs

### Após Deploy

- [ ] Site acessível
- [ ] Páginas públicas funcionando
- [ ] Login admin funciona
- [ ] CRUD funciona
- [ ] Upload de imagens funciona (ou storage configurado)
- [ ] Formulário de contato funciona
- [ ] Senha admin trocada
- [ ] Domínio personalizado configurado (se aplicável)
- [ ] Robots.txt acessível
- [ ] Sitemap.xml acessível
- [ ] Google Search Console configurado
- [ ] Monitoramento ativo

### Manutenção Contínua

- [ ] Backups automáticos do banco configurados
- [ ] Alertas de erro configurados
- [ ] Logs sendo monitorados
- [ ] Performance sendo medida

---

## 📞 Suporte

Se encontrar problemas:

1. **Logs do Vercel**: Verifique primeiro os logs de build e runtime
2. **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
3. **Documentação Turso**: [turso.tech/docs](https://turso.tech/docs)
4. **Suporte**: Contate a equipe CARMIGUI

---

## 🎯 Próximos Passos Após Deploy

1. **Configurar Storage de Imagens**
   - Migrar para Vercel Blob ou Cloudinary
   - Atualizar código de upload

2. **Configurar Monitoramento**
   - Sentry para erros: [sentry.io](https://sentry.io)
   - Google Analytics: [analytics.google.com](https://analytics.google.com)

3. **Otimizar Performance**
   - Configurar CDN
   - Habilitar compressão Brotli
   - Otimizar imagens

4. **Segurança**
   - Revisar CSP headers
   - Configurar rate limiting
   - Habilitar 2FA no Vercel

5. **SEO**
   - Submeter a diretórios angolanos
   - Criar conteúdo de blog
   - Otimizar meta tags

---

**Última Atualização**: 25 de Outubro de 2025  
**Versão**: 1.0  
**Autor**: Equipe CARMIGUI
