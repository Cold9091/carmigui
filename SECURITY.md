# Medidas de Segurança - CARMIGUI Platform

## 🛡️ Resumo das Proteções Implementadas

Este documento detalha todas as medidas de segurança implementadas no backend da plataforma CARMIGUI para proteger contra ataques comuns e garantir a segurança dos dados.

---

## ✅ Proteções Implementadas

### 1. **Helmet.js - Headers de Segurança HTTP**

**Localização:** `server/index.ts`

Implementamos o Helmet.js que configura automaticamente headers HTTP seguros para proteger contra várias vulnerabilidades web conhecidas:

#### Headers Configurados:
- **Content Security Policy (CSP)**: Previne ataques XSS (Cross-Site Scripting)
  - `defaultSrc: ["'self']` - Apenas recursos do próprio domínio
  - `scriptSrc` - Scripts apenas do domínio e Replit (necessário para desenvolvimento)
  - `styleSrc` - Estilos inline permitidos (necessário para Tailwind CSS)
  - `imgSrc` - Imagens de qualquer origem HTTPS (necessário para URLs externas)
  - `connectSrc` - WebSocket permitido (necessário para Vite HMR)

- **X-Content-Type-Options**: Previne MIME type sniffing
- **X-Frame-Options**: Protege contra clickjacking
- **X-XSS-Protection**: Ativa proteção XSS do navegador
- **Strict-Transport-Security**: Força uso de HTTPS em produção

#### Benefícios:
- ✅ Proteção contra XSS (Cross-Site Scripting)
- ✅ Proteção contra clickjacking
- ✅ Proteção contra MIME type sniffing
- ✅ Força conexão HTTPS em produção

---

### 2. **Rate Limiting - Proteção contra Força Bruta**

**Localização:** `server/index.ts`

Implementamos quatro níveis de rate limiting usando `express-rate-limit`:

#### a) **Global Limiter**
```typescript
windowMs: 15 minutos
max: 100 requisições por IP
```
- Aplica-se a todas as rotas `/api/`
- Protege contra sobrecarga do servidor
- Mensagem: "Muitas requisições deste IP, tente novamente mais tarde."

#### b) **Auth Limiter (Proteção de Login)**
```typescript
windowMs: 15 minutos
max: 5 tentativas de login por IP
skipSuccessfulRequests: true
```
- Aplica-se especificamente a `/api/login`
- **CRÍTICO**: Previne ataques de força bruta em senhas
- Não conta tentativas bem-sucedidas
- Mensagem: "Muitas tentativas de login, tente novamente após 15 minutos."

#### c) **API Limiter**
```typescript
windowMs: 1 minuto
max: 30 requisições por IP
```
- Aplica-se a todas as rotas de API
- Previne abuso da API
- Mensagem: "Muitas requisições à API, tente novamente em breve."

#### d) **Upload Limiter**
```typescript
windowMs: 15 minutos
max: 10 uploads por IP
```
- Aplica-se especificamente a `/api/upload`
- Previne abuso de uploads e ataques DoS via uploads
- Mensagem: "Muitas tentativas de upload, tente novamente após 15 minutos."

#### Benefícios:
- ✅ Proteção contra ataques de força bruta no login
- ✅ Proteção contra DDoS (negação de serviço)
- ✅ Previne abuso da API
- ✅ Previne abuso de uploads (DoS via upload)
- ✅ Headers padrão de rate limit informam ao cliente

---

### 3. **CORS - Controle de Origem**

**Localização:** `server/index.ts`

Configuramos CORS (Cross-Origin Resource Sharing) com controle rigoroso de origens permitidas:

#### Configuração:
```typescript
// Produção
allowedOrigins: ['https://carmigui.com', 'https://www.carmigui.com']

// Desenvolvimento
allowedOrigins: ['http://localhost:5000', 'http://127.0.0.1:5000']
```

#### Headers CORS:
- `Access-Control-Allow-Origin`: Apenas origens autorizadas
- `Access-Control-Allow-Methods`: GET, POST, PUT, DELETE, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization
- `Access-Control-Allow-Credentials`: true (para cookies/sessões)

#### Benefícios:
- ✅ Apenas domínios autorizados podem fazer requisições
- ✅ Previne CSRF (Cross-Site Request Forgery) básico
- ✅ Suporte adequado para sessões e cookies
- ✅ Ambiente de desenvolvimento separado

---

### 4. **Limites de Payload**

**Localização:** `server/index.ts`

Configuramos limites para o tamanho de requisições:

```typescript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
```

#### Benefícios:
- ✅ Previne ataques de sobrecarga com payloads grandes
- ✅ Protege memória do servidor
- ✅ Limite adequado para upload de imagens (via multer)

---

### 5. **Validação de Upload de Arquivos**

**Localização:** `server/routes.ts`

Sistema de upload com múltiplas camadas de segurança contra arquivos maliciosos:

#### Validações Implementadas:
```typescript
// Tipos de arquivo permitidos (Multer)
allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Tamanho máximo
fileSize: 5 MB por arquivo

// Máximo de arquivos
maxFiles: 10 arquivos por upload

// Rate Limiting
uploadLimiter: 10 uploads por IP a cada 15 minutos
```

#### Validação Profunda de Segurança:

##### a) **Validação de Magic Bytes**
Verifica a assinatura binária do arquivo para detectar arquivos maliciosos disfarçados:

- **JPEG**: `FF D8 FF`
- **PNG**: `89 50 4E 47 0D 0A 1A 0A`
- **GIF**: `47 49 46 38` (GIF8)
- **WebP**: `52 49 46 46 ... 57 45 42 50` (RIFF...WEBP)

**Benefício:** Previne upload de executáveis ou scripts disfarçados com extensão `.jpg`

##### b) **Validação com Sharp**
Processa o arquivo usando `sharp` para garantir que é uma imagem válida:

- Verifica dimensões válidas
- Rejeita dimensões suspeitas (< 1px ou > 20.000px)
- Confirma formato de imagem legítimo
- Falha automaticamente se o arquivo estiver corrompido

**Benefício:** Garante que apenas imagens legítimas sejam processadas

##### c) **Cleanup Automático**
Arquivos que falham em qualquer validação são deletados automaticamente:

```typescript
// Se validação falhar
- Adiciona arquivo à lista de cleanup
- Deleta arquivo imediatamente
- Retorna erro descritivo ao cliente
```

#### Processamento Seguro:
- ✅ Validação de MIME type (camada 1)
- ✅ Validação de magic bytes (camada 2)
- ✅ Validação usando sharp (camada 3)
- ✅ Conversão automática para WebP (formato seguro)
- ✅ Redimensionamento para máximo 1920px
- ✅ Nomes únicos gerados (timestamp + random)
- ✅ Armazenamento em diretório isolado
- ✅ Cleanup automático de arquivos inválidos
- ✅ Rate limiting por IP (10 uploads/15min)

---

### 6. **Autenticação Segura**

**Localização:** `server/auth.ts`

Implementação robusta de autenticação:

#### Características:
- **Hashing de Senhas**: `scrypt` (recomendado pelo Node.js)
- **Salt Aleatório**: 16 bytes hex por senha
- **Comparação Segura**: `timingSafeEqual` previne timing attacks
- **Sessões Seguras**:
  - `httpOnly: true` - Cookies não acessíveis via JavaScript
  - `secure: true` em produção - Apenas HTTPS
  - `maxAge: 7 dias` - Expiração automática
  - PostgreSQL session store - Persistente e seguro

#### Benefícios:
- ✅ Senhas nunca armazenadas em texto plano
- ✅ Proteção contra rainbow tables (salt único)
- ✅ Proteção contra timing attacks
- ✅ Sessões seguras via HTTPS em produção

---

## 📊 Proteções por Tipo de Ataque

| Tipo de Ataque | Proteção Implementada | Status |
|----------------|----------------------|--------|
| XSS (Cross-Site Scripting) | Helmet CSP + Sanitização | ✅ |
| CSRF (Cross-Site Request Forgery) | CORS + SameSite Cookies | ✅ |
| SQL Injection | Drizzle ORM + Prepared Statements | ✅ |
| Força Bruta (Login) | Rate Limiting (5 tentativas/15min) | ✅ |
| DDoS | Rate Limiting (100 req/15min) | ✅ |
| DDoS via Upload | Rate Limiting (10 uploads/15min) | ✅ |
| Clickjacking | X-Frame-Options (DENY) | ✅ |
| MIME Sniffing | X-Content-Type-Options | ✅ |
| Upload Malicioso | Magic Bytes + Sharp + Conversão WebP | ✅ |
| Arquivo Disfarçado | Validação Magic Bytes (3 camadas) | ✅ |
| Arquivo Corrompido | Validação Sharp + Cleanup | ✅ |
| Man-in-the-Middle | HTTPS + HSTS | ✅ |
| Session Hijacking | HttpOnly + Secure Cookies | ✅ |

---

## 🔧 Configurações de Produção

### Variáveis de Ambiente Requeridas:

```env
# Segurança
SESSION_SECRET=<strong-random-secret>
NODE_ENV=production

# Database
DATABASE_URL=<postgresql-connection-string>

# Opcional
BASE_URL=https://carmigui.com
```

### Checklist de Deploy:

- [ ] `NODE_ENV=production` configurado
- [ ] `SESSION_SECRET` forte e aleatório
- [ ] HTTPS configurado e funcionando
- [ ] CORS configurado para domínio de produção
- [ ] Rate limits testados
- [ ] Logs de segurança ativados
- [ ] Backup automático do banco configurado

---

## 📈 Monitoramento e Logs

### Headers de Segurança Retornados:

Todas as respostas incluem headers de rate limiting:
- `RateLimit-Limit`: Limite máximo de requisições
- `RateLimit-Remaining`: Requisições restantes
- `RateLimit-Reset`: Timestamp quando o limite reseta

### Logs Automáticos:

O sistema registra:
- ✅ Todas as requisições API com timing
- ✅ Tentativas de login falhas
- ✅ Rate limit excedido
- ✅ Erros de validação
- ✅ Uploads de arquivo

---

## 🚨 Resposta a Incidentes

### Se Rate Limit for Atingido:

1. **Usuário Legítimo**: Aguardar 15 minutos ou 1 minuto (dependendo do limite)
2. **Ataque Detectado**: IP automaticamente bloqueado pelo tempo do limite
3. **Logs**: Todas as tentativas são registradas para análise

### Se Login Falhar Múltiplas Vezes:

1. Após 5 tentativas: IP bloqueado por 15 minutos
2. Mensagem clara ao usuário
3. Admin pode verificar logs para investigar

---

## ✅ Próximos Passos Recomendados

### Melhorias Futuras:

1. **Autenticação 2FA** - Adicionar segundo fator
2. **WAF (Web Application Firewall)** - Cloudflare ou similar
3. **Monitoramento em Tempo Real** - Sentry ou LogRocket
4. **Auditoria de Segurança** - Testes de penetração
5. **Backup Automatizado** - Backup diário do banco de dados
6. **SSL/TLS Avançado** - Certificate pinning

---

## 📞 Contato de Segurança

Para reportar vulnerabilidades de segurança:
- Email: carmiguicomercialda@gmail.com
- Assunto: [SEGURANÇA] Descrição breve

**Política de Divulgação Responsável**: Por favor, não divulgue publicamente vulnerabilidades antes de nos contatar.

---

**Última Atualização**: 25 de Outubro de 2025  
**Versão do Documento**: 1.0  
**Responsável**: Equipe de Desenvolvimento CARMIGUI
