# ✅ Checklist de Deploy - CARMIGUI

Use este checklist para garantir que nada seja esquecido durante o processo de deploy.

---

## 📋 PRÉ-DEPLOY

### Preparação do Código

- [ ] Código está no branch `main` ou `production`
- [ ] Todos os commits foram feitos
- [ ] Código foi revisado (code review)
- [ ] Testes locais passando
- [ ] TypeScript sem erros: `npm run check`
- [ ] Build local funciona: `npm run build`

### Banco de Dados

- [ ] Banco PostgreSQL criado (Neon, Supabase, etc.)
- [ ] Connection string obtida e testada
- [ ] Schema reviewed em `shared/schema.ts`
- [ ] Migrations prontas para executar
- [ ] Backup do banco atual (se houver dados)

### Variáveis de Ambiente

- [ ] `DATABASE_URL` definida
- [ ] `SESSION_SECRET` gerada (mínimo 32 caracteres)
- [ ] `NODE_ENV` = `production`
- [ ] `ADMIN_EMAIL` definido
- [ ] `ADMIN_PASSWORD` definida (senha forte)
- [ ] `BASE_URL` definida (opcional)
- [ ] Todas as variáveis documentadas
- [ ] Validação de ambiente passou: `npm run validate:env`

### Configuração Vercel

- [ ] Conta Vercel criada
- [ ] Projeto importado do Git
- [ ] Framework preset: `Other`
- [ ] Build command: `npm run vercel-build`
- [ ] Output directory: `dist/client`
- [ ] Root directory: `./`

### Segurança

- [ ] Credenciais admin não estão hardcoded
- [ ] Secrets não estão no código
- [ ] `.env` no `.gitignore`
- [ ] Rate limiting configurado
- [ ] CORS configurado para domínio de produção
- [ ] Headers de segurança (Helmet) ativos

### SEO

- [ ] Meta tags configuradas
- [ ] Sitemap.xml funciona localmente
- [ ] Robots.txt configurado
- [ ] Schema.org markup implementado
- [ ] Alt text em imagens principais

---

## 🚀 DURANTE O DEPLOY

### Vercel Dashboard

- [ ] Todas as variáveis de ambiente adicionadas
- [ ] Variáveis marcadas para: Production ✅
- [ ] Build iniciado
- [ ] Build logs monitorados
- [ ] Build concluído sem erros
- [ ] Função serverless criada
- [ ] URL de preview gerada

### Migrações

- [ ] Migrations executadas automaticamente (via vercel-build)
- [ ] Sem erros de migration nos logs
- [ ] Tabelas criadas no banco
- [ ] Usuário admin criado automaticamente

---

## ✅ PÓS-DEPLOY

### Verificação Básica

- [ ] Site acessível via URL do Vercel
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Sem erros 500 ou 404
- [ ] Favicon carrega
- [ ] Estilos CSS aplicados
- [ ] JavaScript funciona (sem erros no console)

### Páginas Públicas

- [ ] `/` - Home page carrega
- [ ] `/imoveis` - Lista de imóveis
- [ ] `/imoveis/:id` - Detalhes de imóvel
- [ ] `/condominios` - Lista de condomínios
- [ ] `/condominios/:id` - Detalhes de condomínio
- [ ] `/construcao` - Projetos de construção
- [ ] `/construcao/:id` - Detalhes de projeto
- [ ] `/sobre-nos` - Sobre a empresa
- [ ] `/contacto` - Formulário de contato
- [ ] `/faq` - Perguntas frequentes

### Admin Panel

- [ ] `/admin/login` acessível
- [ ] Login funciona com credenciais definidas
- [ ] Dashboard admin carrega
- [ ] `/admin/properties` - CRUD de imóveis
- [ ] `/admin/projects` - CRUD de projetos
- [ ] `/admin/condominiums` - CRUD de condomínios
- [ ] `/admin/contacts` - Visualizar contatos
- [ ] `/admin/categories` - Gerenciar categorias
- [ ] `/admin/cities` - Gerenciar cidades
- [ ] `/admin/hero` - Configurar hero banner
- [ ] `/admin/about` - Gerenciar sobre nós
- [ ] `/admin/settings` - Configurações

### Funcionalidades

- [ ] Criar novo imóvel funciona
- [ ] Editar imóvel funciona
- [ ] Deletar imóvel funciona
- [ ] Upload de imagem funciona (ou storage configurado)
- [ ] Filtros de busca funcionam
- [ ] Formulário de contato envia
- [ ] Contatos aparecem no admin
- [ ] Login/logout funciona
- [ ] Sessão persiste

### SEO e Performance

- [ ] `/robots.txt` acessível
- [ ] `/sitemap.xml` acessível e lista todas as páginas
- [ ] Meta tags corretas em cada página (view-source)
- [ ] Open Graph tags presentes
- [ ] Schema.org markup validado
- [ ] Imagens carregam
- [ ] Google PageSpeed score > 80
- [ ] Core Web Vitals OK

### Banco de Dados

- [ ] Conexão com banco estável
- [ ] Tabelas criadas corretamente
- [ ] Dados podem ser inseridos
- [ ] Dados podem ser lidos
- [ ] Dados podem ser atualizados
- [ ] Dados podem ser deletados
- [ ] Queries sem erros nos logs

---

## 🔒 SEGURANÇA PÓS-DEPLOY

### Credenciais

- [ ] Senha admin padrão foi trocada
- [ ] Senha forte configurada (12+ caracteres)
- [ ] Email admin real configurado
- [ ] Backup das credenciais em local seguro

### Testes de Segurança

- [ ] Rate limiting está ativo
- [ ] Tentativas de login limitadas (5 max)
- [ ] Upload de arquivo malicioso bloqueado
- [ ] CORS bloqueia origens não autorizadas
- [ ] Headers de segurança presentes (view network tab)
- [ ] Cookies são httpOnly e secure
- [ ] SQL injection não funciona (tente no formulário)

---

## 🌐 CONFIGURAÇÃO DE DOMÍNIO (Se aplicável)

### DNS

- [ ] Domínio comprado
- [ ] Domínio adicionado no Vercel
- [ ] DNS A record: `76.76.21.21`
- [ ] DNS CNAME: `cname.vercel-dns.com`
- [ ] Propagação DNS completa
- [ ] Site acessível via domínio
- [ ] HTTPS funcionando no domínio
- [ ] Redirect www → não-www (ou vice-versa)

### Atualização de Variáveis

- [ ] `BASE_URL` atualizada para domínio real
- [ ] CORS atualizado para domínio real
- [ ] Sitemap usa domínio real
- [ ] Robots.txt usa domínio real

---

## 📊 MONITORAMENTO E ANALYTICS

### Ferramentas

- [ ] Google Search Console configurado
- [ ] Sitemap submetido ao Google
- [ ] Google Analytics configurado (opcional)
- [ ] Sentry para erros (opcional)
- [ ] Uptime monitoring (UptimeRobot, etc.)

### Verificações

- [ ] Logs do Vercel acessíveis
- [ ] Erros são logados corretamente
- [ ] Alertas configurados para erros críticos
- [ ] Backup automático do banco configurado

---

## 📱 TESTES DE DISPOSITIVOS

### Desktop

- [ ] Chrome - Funciona
- [ ] Firefox - Funciona
- [ ] Safari - Funciona
- [ ] Edge - Funciona

### Mobile

- [ ] Chrome Mobile - Funciona
- [ ] Safari iOS - Funciona
- [ ] Layout responsivo OK
- [ ] Touch interactions funcionam
- [ ] Modals funcionam em mobile

### Tablets

- [ ] iPad - Funciona
- [ ] Android Tablet - Funciona

---

## 🎯 OTIMIZAÇÕES PÓS-DEPLOY

### Performance

- [ ] Imagens otimizadas (WebP)
- [ ] Lazy loading ativo
- [ ] Service Worker ativo (se aplicável)
- [ ] Compressão Gzip/Brotli ativa
- [ ] Cache headers configurados
- [ ] Bundle size < 500KB

### SEO Local (Angola)

- [ ] Google Business Profile criado
- [ ] NAP (Name, Address, Phone) consistente
- [ ] Cadastrado em diretórios angolanos:
  - [ ] Yaka.ao
  - [ ] Angola-Online.net
  - [ ] Infocasa Angola
- [ ] Reviews solicitadas de clientes

---

## 📝 DOCUMENTAÇÃO

### Interno

- [ ] README.md atualizado
- [ ] DEPLOY.md revisado
- [ ] Credenciais salvas em local seguro (1Password, etc.)
- [ ] Equipe treinada no admin panel
- [ ] Processo de rollback documentado

### Externo

- [ ] Manual do usuário (se aplicável)
- [ ] FAQ atualizado
- [ ] Termos de uso (se aplicável)
- [ ] Política de privacidade (se aplicável)

---

## 🚨 PLANO DE EMERGÊNCIA

### Contatos

- [ ] Lista de contatos de emergência criada
- [ ] Suporte Vercel conhecido
- [ ] Suporte do banco conhecido
- [ ] Desenvolvedor disponível

### Rollback

- [ ] Processo de rollback testado
- [ ] Backup do banco antes do deploy
- [ ] Deploy anterior identificado no Vercel
- [ ] Comandos de rollback documentados

---

## 📈 MÉTRICAS DE SUCESSO

### Primeira Semana

- [ ] 0 erros críticos
- [ ] Uptime > 99%
- [ ] Tempo de resposta < 2s
- [ ] 10+ visitantes orgânicos

### Primeiro Mês

- [ ] Todos os CRUDs funcionando
- [ ] 100+ visitantes orgânicos
- [ ] 5+ contatos via formulário
- [ ] Ranking Google melhorando

---

## ✅ APROVAÇÃO FINAL

- [ ] Product Owner aprovou
- [ ] QA passou
- [ ] Cliente testou
- [ ] Deploy aprovado para produção

**Data do Deploy**: ___/___/______  
**Responsável**: _________________  
**Status**: [ ] Sucesso [ ] Parcial [ ] Falhou

---

## 📞 Suporte

**Em caso de problemas**:
1. Verifique logs do Vercel
2. Consulte DEPLOY.md
3. Faça rollback se necessário
4. Contate suporte técnico

---

**Última Atualização**: 25 de Outubro de 2025  
**Versão**: 1.0
