# 🛠️ Documentação de Suporte Técnico - CARMIGUI Platform

## Visão Geral

Este documento fornece informações técnicas para diagnóstico e resolução de problemas na plataforma CARMIGUI.

**Última Atualização**: 27 de Outubro de 2025  
**Versão**: 1.0  
**Público-Alvo**: Suporte Técnico e Desenvolvedores

---

## 📋 Índice

1. [Arquitetura do Sistema](#arquitetura-do-sistema)
2. [Diagnóstico Rápido](#diagnóstico-rápido)
3. [Problemas Comuns e Soluções](#problemas-comuns-e-soluções)
4. [Logs e Monitoramento](#logs-e-monitoramento)
5. [Procedimentos de Emergência](#procedimentos-de-emergência)
6. [Comandos Úteis](#comandos-úteis)
7. [FAQ Técnico](#faq-técnico)
8. [Escalação de Problemas](#escalação-de-problemas)

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- TanStack Query (state management)
- Wouter (routing)

**Backend**:
- Node.js 18+
- Express.js
- TypeScript
- Passport.js (autenticação)

**Banco de Dados**:
- **Desenvolvimento**: SQLite (better-sqlite3)
- **Produção**: Turso (distributed SQLite)
- **ORM**: Drizzle ORM

**Infraestrutura**:
- **Hosting**: Vercel (serverless)
- **Database**: Turso Database
- **Storage**: Sistema de arquivos local (dev) / Vercel Blob (prod recomendado)
- **CDN**: Vercel Edge Network

### Ambiente de Execução

**Desenvolvimento**:
- `NODE_ENV=development`
- SQLite local (`database.db`)
- Hot Module Replacement (HMR) ativo
- Logs detalhados no console

**Produção**:
- `NODE_ENV=production`
- Turso Database (remoto)
- Assets minificados e otimizados
- Rate limiting ativo
- Security headers ativo

### Variáveis de Ambiente

**Obrigatórias (Produção)**:
```env
NODE_ENV=production
TURSO_DATABASE_URL=libsql://[database-name].turso.io
TURSO_AUTH_TOKEN=[auth-token]
SESSION_SECRET=[random-string-32+]
```

**Opcionais**:
```env
ADMIN_EMAIL=[admin-email]
ADMIN_PASSWORD=[admin-password]
BASE_URL=https://carmigui.com
PORT=5000
```

---

## 🔍 Diagnóstico Rápido

### Checklist de Diagnóstico (5 Minutos)

1. **Site está acessível?**
   ```bash
   curl -I https://carmigui.com
   # Esperado: HTTP/2 200
   ```

2. **Banco de dados responde?**
   - Acessar: `/admin/database`
   - Status deve ser "Conectado"

3. **Logs mostram erros?**
   - Vercel Dashboard → Logs
   - Filtrar por "error" ou "500"

4. **Rate limiting ativo?**
   ```bash
   # Fazer 10 requisições rápidas
   for i in {1..10}; do curl https://carmigui.com/api/properties; done
   # Deve eventualmente retornar 429
   ```

5. **Certificado SSL válido?**
   ```bash
   curl -vI https://carmigui.com 2>&1 | grep -i ssl
   # Deve mostrar certificado válido
   ```

### Fluxograma de Diagnóstico

```
Site não carrega?
│
├─ Erro DNS/Conexão?
│  └─ Verificar domínio e DNS
│
├─ Erro 500/502/503?
│  └─ Verificar logs do servidor
│     ├─ Erro de banco? → Verificar Turso
│     ├─ Erro de código? → Rollback deploy
│     └─ Timeout? → Verificar performance
│
├─ Erro 404?
│  └─ Verificar rotas e deploy
│
└─ Site lento?
   └─ Verificar:
      ├─ Tamanho de imagens
      ├─ Queries de banco
      └─ Cache headers
```

---

## 🚨 Problemas Comuns e Soluções

### 1. Site Fora do Ar (HTTP 500/502)

**Sintomas**:
- Página mostra erro 500 ou 502
- "Service Unavailable"
- Timeout ao carregar

**Causas Possíveis**:
1. Deploy com erro
2. Banco de dados inacessível
3. Variável de ambiente faltando
4. Crash do servidor

**Diagnóstico**:
```bash
# 1. Verificar último deploy
# Vercel Dashboard → Deployments → Ver logs

# 2. Verificar variáveis de ambiente
# Vercel Dashboard → Settings → Environment Variables
# Confirmar: TURSO_DATABASE_URL, SESSION_SECRET, NODE_ENV

# 3. Verificar logs de runtime
# Vercel Dashboard → Logs → Filtrar por "error"
```

**Soluções**:

**Opção A - Rollback de Deploy**:
1. Vercel Dashboard → Deployments
2. Encontrar último deploy funcional
3. Clicar "..." → "Promote to Production"
4. Confirmar
5. Aguardar 1-2 minutos

**Opção B - Verificar Banco**:
1. Turso Dashboard → Database
2. Verificar status (deve estar "Active")
3. Testar conexão manualmente
4. Regenerar auth token se necessário

**Opção C - Redeployar**:
1. Git push (força novo deploy)
2. Ou Vercel Dashboard → Redeploy

**Tempo Estimado de Resolução**: 10-30 minutos

### 2. Login Admin Não Funciona

**Sintomas**:
- Credenciais corretas rejeitadas
- Erro "Email ou senha incorretos"
- Sessão não persiste

**Causas Possíveis**:
1. SESSION_SECRET mudou
2. Banco de dados sem usuário admin
3. Password hash corrompido
4. Cookie bloqueado pelo navegador

**Diagnóstico**:
```bash
# Verificar se admin existe no banco
# Via Turso CLI:
turso db shell carmigui-production
SELECT * FROM users LIMIT 1;
```

**Soluções**:

**Problema: Admin não existe**:
```bash
# Criar admin manualmente via Turso Shell
INSERT INTO users (id, email, password, role) VALUES (
  'admin-id-123',
  'admin@carmigui.com',
  '[hash-gerado]',
  'admin'
);
```

**Problema: Sessão não persiste**:
1. Verificar SESSION_SECRET não mudou
2. Limpar cookies do navegador
3. Tentar navegador anônimo
4. Verificar se secure cookies funcionam (HTTPS)

**Problema: Rate limit atingido**:
- Aguardar 15 minutos
- Ou limpar via admin do Vercel

**Tempo Estimado de Resolução**: 15-60 minutos

### 3. Upload de Imagens Falha

**Sintomas**:
- Erro ao fazer upload
- Imagem não aparece após upload
- Mensagem "Failed to upload"

**Causas Possíveis**:
1. Arquivo muito grande (>5MB)
2. Formato não suportado
3. Rate limit de upload (10/15min)
4. Problema de storage (Vercel serverless)

**Diagnóstico**:
```javascript
// Verificar logs de upload
// Vercel Dashboard → Logs → Filtrar por "upload"

// Verificar formato e tamanho do arquivo
// Client-side: console.log(file.size, file.type)
```

**Soluções**:

**Arquivo muito grande**:
1. Comprimir imagem antes de upload
2. Usar ferramentas: TinyPNG, Squoosh.app
3. Ou aumentar limite (não recomendado)

**Formato não suportado**:
- Formatos aceitos: JPEG, PNG, WebP, GIF
- Converter se necessário

**Rate limit**:
- Aguardar 15 minutos
- Ou fazer upload em lotes menores

**Storage em serverless**:
- ⚠️ Vercel serverless não persiste arquivos!
- Configurar Vercel Blob Storage ou S3
- Ver: [DEPLOY.md](./DEPLOY.md) seção Storage

**Tempo Estimado de Resolução**: 5-30 minutos

### 4. Performance Ruim (Site Lento)

**Sintomas**:
- Páginas carregam em >3 segundos
- Imagens demoram a aparecer
- Admin panel lento

**Causas Possíveis**:
1. Imagens não otimizadas
2. Queries de banco ineficientes
3. Cache não configurado
4. Muitos assets carregados

**Diagnóstico**:
```bash
# 1. Testar performance
# Google PageSpeed Insights
# https://pagespeed.web.dev/

# 2. Verificar tamanho de imagens
ls -lh uploads/images/ | head -20

# 3. Verificar query time nos logs
# Vercel Dashboard → Logs → Procurar por "in XXXms"
```

**Soluções**:

**Imagens grandes**:
```bash
# Otimizar imagens em lote
# Instalar sharp-cli
npm install -g sharp-cli

# Redimensionar todas as imagens
sharp -i uploads/images/*.jpg -o uploads/images/ resize 1920
```

**Queries lentas**:
1. Verificar índices no banco
2. Adicionar limit às queries
3. Implementar paginação

**Cache**:
1. Verificar cache headers
2. Configurar CDN corretamente
3. Usar Vercel Edge Caching

**Tempo Estimado de Resolução**: 1-4 horas

### 5. Formulário de Contacto Não Envia

**Sintomas**:
- Botão "Enviar" não responde
- Erro ao submeter formulário
- Mensagens não aparecem no admin

**Causas Possíveis**:
1. Validação de formulário falhando
2. Banco de dados rejeitando insert
3. Rate limiting
4. Erro de rede

**Diagnóstico**:
```javascript
// 1. Abrir DevTools → Console
// Verificar erros JavaScript

// 2. Abrir DevTools → Network
// Verificar requisição POST /api/contacts
// Status esperado: 200 ou 201

// 3. Verificar logs do servidor
// Vercel Dashboard → Logs → Filtrar por "/api/contacts"
```

**Soluções**:

**Validação falhando**:
1. Verificar campos obrigatórios preenchidos
2. Verificar formato de email
3. Verificar tamanho da mensagem

**Banco rejeitando**:
1. Verificar schema da tabela contacts
2. Verificar tipos de dados
3. Executar query manual para testar

**Rate limit**:
- Aguardar 1 minuto (API limiter)
- Ou aumentar limite se legítimo

**Tempo Estimado de Resolução**: 15-45 minutos

---

## 📊 Logs e Monitoramento

### Acessar Logs

**Vercel Runtime Logs**:
1. Vercel Dashboard
2. Selecionar projeto CARMIGUI
3. Logs (menu lateral)
4. Filtrar por:
   - Erro (status: error)
   - Endpoint (path: /api/...)
   - Período (last 1h, 24h, 7d)

**Turso Database Logs**:
1. Turso Dashboard
2. Selecionar database
3. Activity/Logs
4. Ver queries executadas

**Browser Console Logs**:
1. F12 (DevTools)
2. Console tab
3. Verificar erros JavaScript
4. Network tab para requests

### Interpretar Logs

**Exemplo de Log Normal**:
```
[GET] /api/properties 200 OK in 45ms
```
- Método: GET
- Endpoint: /api/properties
- Status: 200 (sucesso)
- Tempo: 45ms (bom)

**Exemplo de Log com Erro**:
```
[POST] /api/properties 500 Internal Server Error in 1230ms
Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: properties.id
  at DatabaseStorage.createProperty (storage.ts:123)
  ...
```
- Status: 500 (erro)
- Tempo: 1230ms (lento)
- Erro: ID duplicado (violação de constraint)
- Stack trace mostra onde erro ocorreu

**Tipos de Erro HTTP**:
- `400 Bad Request` - Dados inválidos do cliente
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não existe
- `429 Too Many Requests` - Rate limit
- `500 Internal Server Error` - Erro no servidor
- `502 Bad Gateway` - Problema de proxy/network
- `503 Service Unavailable` - Serviço fora do ar

### Alertas Automáticos

**Configurar no Vercel**:
1. Settings → Notifications
2. Adicionar webhook ou email
3. Configurar triggers:
   - Error rate > 5%
   - Response time > 5s
   - Deployment failed

**Ferramentas Externas**:
- **Sentry**: Error tracking
- **UptimeRobot**: Uptime monitoring
- **LogRocket**: Session replay

---

## 🚨 Procedimentos de Emergência

### Procedimento 1: Site Completamente Fora

**Severidade**: CRÍTICA  
**SLA**: 15 minutos

**Checklist Rápido**:
```
□ Confirmar downtime (múltiplas fontes)
□ Verificar Vercel Status (status.vercel.com)
□ Verificar Turso Status (status.turso.tech)
□ Acessar Vercel Dashboard → Logs
□ Identificar deploy que causou problema
□ Fazer rollback imediato
□ Verificar recuperação
□ Notificar stakeholders
□ Documentar incidente
```

**Comandos de Emergência**:
```bash
# Rollback via CLI (mais rápido)
vercel rollback

# Ou via API
curl -X POST https://api.vercel.com/v12/deployments/[deploy-id]/promote \
  -H "Authorization: Bearer [token]"
```

### Procedimento 2: Banco de Dados Corrompido

**Severidade**: ALTA  
**SLA**: 30 minutos

**Checklist Rápido**:
```
□ Confirmar problema de banco (não apenas conexão)
□ Acessar Turso Dashboard
□ Verificar status do database
□ Localizar último backup (automático ou manual)
□ Estimar data do backup
□ Confirmar com stakeholder perda de dados aceitável
□ Iniciar restauração
□ Testar integridade após restauração
□ Documentar dados perdidos
```

### Procedimento 3: Invasão/Ataque

**Severidade**: CRÍTICA  
**SLA**: IMEDIATO

**Checklist Rápido**:
```
□ Identificar tipo de ataque
□ Bloquear IP(s) suspeito(s) se possível
□ Trocar SESSION_SECRET imediatamente
□ Trocar senha admin
□ Trocar TURSO_AUTH_TOKEN
□ Verificar integridade de dados
□ Restaurar backup se dados alterados
□ Revisar logs completos
□ Reportar às autoridades se necessário
□ Fortalecer segurança
□ Documentar incidente completo
```

**Contatos de Emergência**:
- Vercel Support: support@vercel.com (Enterprise)
- Turso Support: support@turso.tech
- Desenvolvedor: 945 806 968

---

## 💻 Comandos Úteis

### Desenvolvimento Local

```bash
# Iniciar ambiente de desenvolvimento
npm run dev

# Verificar TypeScript
npm run check

# Build de produção (teste local)
npm run build

# Executar build local
npm start

# Limpar cache
rm -rf node_modules/.vite
rm -rf dist
```

### Banco de Dados

```bash
# Push schema para banco (desenvolvimento)
npm run db:push

# Push schema para banco (força, cuidado!)
npm run db:push -- --force

# Conectar ao banco Turso via CLI
turso db shell carmigui-production

# Queries úteis no shell Turso
SELECT COUNT(*) FROM properties;
SELECT COUNT(*) FROM contacts;
SELECT * FROM users;

# Backup do banco
turso db dump carmigui-production > backup.sql

# Restaurar backup
turso db shell carmigui-production < backup.sql
```

### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Ver deployments
vercel ls

# Ver logs em tempo real
vercel logs --follow

# Promover deployment para produção
vercel promote [url]

# Rollback para deployment anterior
vercel rollback

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável de ambiente
vercel env add SESSION_SECRET
```

### Debugging

```bash
# Testar endpoint
curl -X GET https://carmigui.com/api/properties

# Testar com headers
curl -H "Content-Type: application/json" \
     -X POST https://carmigui.com/api/contacts \
     -d '{"name":"Test","email":"test@test.com","message":"Test"}'

# Ver headers de resposta
curl -I https://carmigui.com

# Testar rate limiting
for i in {1..10}; do 
  curl https://carmigui.com/api/properties
  sleep 1
done

# Verificar certificado SSL
openssl s_client -connect carmigui.com:443 -servername carmigui.com

# Verificar DNS
nslookup carmigui.com
dig carmigui.com
```

---

## ❓ FAQ Técnico

### P: Posso mudar de SQLite para Turso sem perder dados?

**R**: Sim, seguindo este processo:
1. Exportar dados do SQLite: `sqlite3 database.db .dump > export.sql`
2. Criar database no Turso
3. Importar dados: `turso db shell [db-name] < export.sql`
4. Atualizar variáveis de ambiente
5. Fazer deploy

### P: Como resetar senha do admin?

**R**: Via Turso Shell:
```sql
-- 1. Gerar hash da nova senha (usar script Node.js)
-- 2. Atualizar no banco
UPDATE users 
SET password = '[novo-hash]' 
WHERE email = 'admin@carmigui.com';
```

### P: Imagens sobrevivem ao redeploy no Vercel?

**R**: Não! Vercel é serverless, filesystem é efêmero. Soluções:
- Usar Vercel Blob Storage
- Usar Cloudinary
- Usar AWS S3
- Ou manter SQLite local apenas para desenvolvimento

### P: Como aumentar limite de upload?

**R**: Editar `server/index.ts`:
```typescript
app.use(express.json({ limit: '20mb' })); // era 10mb
```
E `server/routes/uploads.ts`:
```typescript
limits: {
  fileSize: 10 * 1024 * 1024, // 10MB (era 5MB)
}
```

### P: Como desativar rate limiting temporariamente?

**R**: Comentar no `server/index.ts`:
```typescript
// app.use('/api/', globalLimiter);  // Comentar estas linhas
// app.use('/api/login', authLimiter);
// app.use('/api/', apiLimiter);
```
⚠️ Apenas para debug, nunca em produção!

### P: Como ver quantos requests por segundo o site recebe?

**R**: Vercel Analytics:
1. Vercel Dashboard → Analytics
2. Ver gráfico de requests
3. Ou usar: `vercel logs --follow | grep -c "GET"`

### P: Database chegou ao limite do free tier, e agora?

**R**: Opções:
1. Upgrade para plano pago do Turso
2. Migrar para outro provedor (Supabase, Railway)
3. Limpar dados antigos (contacts, logs)

---

## 📞 Escalação de Problemas

### Níveis de Suporte

**Nível 1 - Admin/Gestor de Conteúdo**:
- Gestão de conteúdo (imóveis, projetos)
- Upload de imagens
- Resposta a contactos
- Problemas de uso do admin

**Nível 2 - Suporte Técnico**:
- Problemas de login
- Troubleshooting de uploads
- Configuração básica
- Consulta de logs

**Nível 3 - Desenvolvedor**:
- Bugs de código
- Problemas de banco de dados
- Deploy e infraestrutura
- Segurança

### Quando Escalar

**Para Nível 2**:
- Problema não resolve após 30min
- Requer acesso a logs ou dashboard
- Envolve configuração técnica

**Para Nível 3**:
- Site fora do ar >1 hora
- Corrupção de dados
- Problema de segurança
- Bug que afeta funcionalidade crítica

### Informações ao Escalar

Sempre incluir:
1. Descrição do problema
2. Passos para reproduzir
3. Screenshots/logs relevantes
4. O que já foi tentado
5. Urgência (baixa/média/alta/crítica)
6. Impacto nos usuários

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Vercel**: https://vercel.com/docs
- **Turso**: https://docs.turso.tech
- **Drizzle ORM**: https://orm.drizzle.team
- **Express.js**: https://expressjs.com
- **React**: https://react.dev

### Ferramentas de Debug

- **Postman**: Testar APIs
- **DevTools**: Debug frontend
- **Turso CLI**: Acesso direto ao banco
- **Vercel CLI**: Deploy e logs

### Comunidades

- **Vercel Discord**: https://vercel.com/discord
- **Turso Discord**: https://discord.gg/turso
- **Stack Overflow**: Perguntas técnicas

---

**Fim da Documentação de Suporte**

Para adicionar novos casos de suporte, contacte: carmiguicomercialda@gmail.com
