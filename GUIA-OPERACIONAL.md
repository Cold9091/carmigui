# 📖 Guia Operacional - CARMIGUI Platform

## Visão Geral

Este guia fornece instruções para a operação diária da plataforma CARMIGUI, incluindo procedimentos de rotina, monitoramento e manutenção.

**Última Atualização**: 27 de Outubro de 2025  
**Versão**: 1.0  
**Responsável**: Equipe de Desenvolvimento CARMIGUI

---

## 📋 Índice

1. [Operações Diárias](#operações-diárias)
2. [Monitoramento do Sistema](#monitoramento-do-sistema)
3. [Gestão de Conteúdo](#gestão-de-conteúdo)
4. [Backup e Recuperação](#backup-e-recuperação)
5. [Procedimentos de Emergência](#procedimentos-de-emergência)
6. [Manutenção Preventiva](#manutenção-preventiva)
7. [Relatórios e Métricas](#relatórios-e-métricas)

---

## 🔄 Operações Diárias

### Checklist Matinal (Todos os dias úteis)

- [ ] **Verificar Uptime do Site** (09:00)
  - Acessar: https://carmigui.com
  - Verificar se carrega em menos de 3 segundos
  - Testar navegação entre páginas principais

- [ ] **Verificar Mensagens de Contacto** (09:15)
  - Aceder ao painel admin → Contactos
  - Responder mensagens urgentes em até 2 horas
  - Arquivar/deletar spam

- [ ] **Monitorar Logs de Erros** (09:30)
  - Aceder ao Vercel Dashboard → Logs
  - Verificar se há erros críticos (status 500)
  - Investigar erros recorrentes

- [ ] **Verificar Performance** (10:00)
  - Google PageSpeed Insights
  - Verificar Core Web Vitals
  - Anotar métricas para relatório semanal

### Checklist Vespertino (Dias úteis)

- [ ] **Atualizar Conteúdo** (14:00)
  - Adicionar novos imóveis/projetos conforme necessário
  - Atualizar status de propriedades vendidas/alugadas
  - Verificar se imagens foram carregadas corretamente

- [ ] **Backup Manual** (17:00 - Sexta-feira apenas)
  - Exportar dados do banco Turso
  - Salvar em local seguro (Google Drive/OneDrive)
  - Verificar integridade do backup

- [ ] **Revisão de Segurança** (17:30)
  - Verificar tentativas de login suspeitas
  - Confirmar que rate limiting está ativo
  - Revisar logs de acesso

---

## 📊 Monitoramento do Sistema

### Métricas Críticas

#### Uptime (Disponibilidade)

**Meta**: > 99.5% mensalmente

**Como Monitorar**:
1. Usar ferramenta como UptimeRobot (grátis)
2. Configurar alertas para downtime > 5 minutos
3. Verificar dashboard diariamente

**Ações se Uptime < 99%**:
- Investigar causa do downtime nos logs do Vercel
- Contatar suporte do Vercel se necessário
- Documentar incidente para análise

#### Tempo de Resposta

**Meta**: < 2 segundos (página inicial)

**Como Monitorar**:
1. Google PageSpeed Insights (teste manual diário)
2. Vercel Analytics (automático)
3. Ferramentas de monitoramento de terceiros

**Ações se Tempo > 3 segundos**:
- Verificar tamanho das imagens
- Analisar queries do banco de dados
- Revisar cache de assets estáticos

#### Erros HTTP

**Meta**: < 0.1% de requisições com erro 5xx

**Como Monitorar**:
1. Vercel Dashboard → Analytics → Errors
2. Logs do servidor (filtrar por status 500-599)

**Ações se Taxa de Erro > 1%**:
- Verificar conectividade com banco Turso
- Revisar logs para stack traces
- Escalar para desenvolvedor se necessário

### Dashboard de Monitoramento

**Acesso**: Vercel Dashboard → Projeto CARMIGUI → Analytics

**Principais Gráficos**:
- Requests por dia
- Latência média (p50, p95, p99)
- Taxa de erro
- Bandwidth usado

**Alertas Configurados**:
- Email quando erro 5xx > 10 por hora
- Email quando uptime < 99% em 24h
- SMS para downtime > 15 minutos (configurar)

---

## 📝 Gestão de Conteúdo

### Adição de Novos Imóveis

**Frequência**: Conforme disponibilidade de novos imóveis

**Procedimento**:
1. Aceder: Admin → Imóveis → Adicionar Imóvel
2. Preencher formulário completo:
   - Título descritivo (ex: "Vivenda T4 Moderna - Talatona")
   - Descrição detalhada (mínimo 100 palavras)
   - Preço em Kz
   - Categoria correta (Vivenda, Apartamento, etc.)
   - Cidade/Localização
   - Área em m²
   - Quartos e casas de banho
3. Upload de imagens:
   - Mínimo 3 fotos, máximo 10
   - Formato: JPEG, PNG ou WebP
   - Tamanho máximo: 5MB por imagem
   - Resolução recomendada: 1920x1080
4. Configurar:
   - Status: Disponível/Vendido/Alugado
   - Destacado: Sim (se for imóvel premium)
   - Tipo de pagamento: Preço fixo/Parcelado
5. Salvar e verificar na página pública

**Dicas**:
- Usar fotos de alta qualidade
- Preencher alt text nas imagens para SEO
- Incluir tour virtual se disponível
- Revisar ortografia antes de publicar

### Atualização de Conteúdo Existente

**Frequência**: Semanal ou conforme mudanças

**Itens para Revisar**:
- Status de imóveis (disponível → vendido)
- Preços alterados
- Novas fotos de propriedades
- Descrições desatualizadas
- Links quebrados

**Procedimento**:
1. Admin → Imóveis → Clicar em editar
2. Atualizar campos necessários
3. Salvar alterações
4. Verificar mudanças no site público

### Gestão de Imagens

**Boas Práticas**:
- Sempre otimizar imagens antes do upload
- Usar nomes descritivos (vivenda-talatona-frente.jpg)
- Deletar imagens não usadas mensalmente
- Verificar carregamento de imagens semanalmente

**Troubleshooting**:
- **Imagem não aparece**: Verificar formato (deve ser JPEG/PNG/WebP)
- **Upload falha**: Verificar tamanho < 5MB
- **Imagem distorcida**: Verificar proporção correta

---

## 💾 Backup e Recuperação

### Política de Backup

**Backups Automáticos** (Turso Database):
- Frequência: Diário (automático pelo Turso)
- Retenção: 7 dias (free tier) ou 30 dias (paid)
- Não requer ação manual

**Backups Manuais Recomendados**:
- Frequência: Semanal (Sexta-feira às 17:00)
- Responsável: Administrador de Sistema
- Armazenamento: Google Drive (pasta "Backups CARMIGUI")

### Como Fazer Backup Manual

#### Opção 1: Via Turso CLI (Recomendado)

```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Listar databases
turso db list

# Criar backup
turso db dump carmigui-production > backup-$(date +%Y%m%d).sql

# Upload para cloud storage
```

#### Opção 2: Via Admin Panel (Simples)

1. Aceder: Admin → Banco de Dados
2. Clicar em "Exportar Dados"
3. Salvar arquivo SQL
4. Upload para Google Drive/OneDrive

### Procedimento de Recuperação

**Cenário 1: Perda de Dados Recente (<24h)**

1. Aceder Turso Dashboard
2. Selecionar ponto de restauração (automatic daily backup)
3. Clicar em "Restore"
4. Confirmar restauração
5. Verificar integridade dos dados

**Cenário 2: Perda de Dados Antiga (>24h)**

1. Localizar backup manual mais recente
2. Aceder Turso Dashboard
3. Selecionar database
4. Clicar em "Restore from SQL"
5. Upload do arquivo de backup
6. Aguardar conclusão
7. Testar aplicação

**Tempo de Recuperação Esperado**:
- Backup automático: 5-15 minutos
- Backup manual: 15-30 minutos
- Verificação completa: +30 minutos

---

## 🚨 Procedimentos de Emergência

### Site Fora do Ar (Downtime)

**Severidade**: CRÍTICA  
**Tempo Máximo de Resposta**: 15 minutos

**Procedimento**:
1. **Confirmar o problema** (5 min)
   - Testar de múltiplos dispositivos/redes
   - Verificar se é problema local ou global
   - Usar ferramentas: isitdownrightnow.com

2. **Diagnosticar** (10 min)
   - Acessar Vercel Dashboard → Deployments
   - Verificar último deploy (pode ter introduzido bug)
   - Revisar logs de erro
   - Verificar status do Turso Database

3. **Ação Imediata** (15 min)
   - Se último deploy causou problema: Fazer rollback
   - Se problema no banco: Verificar conexão Turso
   - Se problema no Vercel: Contatar suporte

4. **Comunicação** (20 min)
   - Informar cliente/stakeholders
   - Atualizar status page (se houver)
   - Documentar incidente

**Contatos de Emergência**:
- Vercel Support: support@vercel.com
- Turso Support: support@turso.tech
- Desenvolvedor Principal: [inserir contato]

### Banco de Dados Corrompido

**Severidade**: ALTA  
**Tempo Máximo de Resposta**: 30 minutos

**Sintomas**:
- Erros 500 em todas as páginas
- Mensagens de erro SQL nos logs
- Impossibilidade de login no admin

**Procedimento**:
1. Não entrar em pânico
2. Verificar se é problema de conexão (timeout)
3. Se confirmado corrupção: Restaurar do último backup
4. Seguir [Procedimento de Recuperação](#procedimento-de-recuperação)
5. Documentar causa raiz

### Ataque de Segurança Detectado

**Severidade**: CRÍTICA  
**Tempo Máximo de Resposta**: IMEDIATO

**Sintomas**:
- Múltiplas tentativas de login falhadas
- Requisições suspeitas nos logs
- Upload de arquivos maliciosos
- Mudanças não autorizadas no conteúdo

**Procedimento**:
1. **Isolar** (Imediato)
   - Se possível, bloquear IP suspeito no Vercel
   - Desativar temporariamente rotas afetadas

2. **Investigar** (30 min)
   - Revisar logs completos
   - Identificar vetor de ataque
   - Verificar integridade dos dados

3. **Remediar** (1-2 horas)
   - Trocar credenciais admin
   - Atualizar SESSION_SECRET
   - Restaurar backup se dados foram alterados
   - Fortalecer proteções

4. **Reportar**
   - Documentar incidente completo
   - Notificar autoridades se necessário
   - Implementar melhorias de segurança

---

## 🔧 Manutenção Preventiva

### Checklist Semanal

**Segunda-feira (Manhã)**:
- [ ] Revisar logs da semana anterior
- [ ] Verificar atualizações de dependências
- [ ] Testar formulário de contacto
- [ ] Verificar links externos

**Quarta-feira (Tarde)**:
- [ ] Backup manual do banco
- [ ] Verificar espaço em disco no Turso
- [ ] Testar upload de imagens
- [ ] Revisar performance PageSpeed

**Sexta-feira (Tarde)**:
- [ ] Gerar relatório semanal
- [ ] Limpar logs antigos (>30 dias)
- [ ] Verificar certificado SSL
- [ ] Planejar manutenção da próxima semana

### Checklist Mensal

**Primeira Sexta-feira do Mês**:
- [ ] Atualizar dependências NPM
- [ ] Revisar e atualizar documentação
- [ ] Análise de SEO (posicionamento Google)
- [ ] Auditoria de segurança básica
- [ ] Limpeza de imagens não utilizadas
- [ ] Verificar validade de domínio
- [ ] Revisar custos de infraestrutura
- [ ] Backup completo para armazenamento externo

### Checklist Trimestral

**Janeiro, Abril, Julho, Outubro**:
- [ ] Auditoria de segurança completa
- [ ] Teste de recuperação de backup
- [ ] Revisão de política de privacidade
- [ ] Análise de performance completa
- [ ] Atualização de conteúdo desatualizado
- [ ] Teste de carga (se volume alto)
- [ ] Revisão de contratos (Vercel, Turso)

---

## 📈 Relatórios e Métricas

### Relatório Semanal

**Quando**: Toda Sexta-feira às 17:00  
**Destinatário**: Gestor/Cliente  
**Formato**: Email + PDF anexo

**Conteúdo**:
```markdown
# Relatório Semanal CARMIGUI - [Data]

## Resumo Executivo
- Uptime: XX.X%
- Novos imóveis: X
- Mensagens de contacto: X
- Visitantes únicos: X

## Métricas de Performance
- Tempo médio de carregamento: X.Xs
- PageSpeed Score: XX/100
- Taxa de erro: X.XX%

## Atividades Realizadas
- [Lista de atividades da semana]

## Problemas Identificados
- [Lista de problemas, se houver]

## Próximos Passos
- [Plano para próxima semana]
```

### Relatório Mensal

**Quando**: Primeiro dia útil do mês  
**Destinatário**: Stakeholders  
**Formato**: Apresentação PDF

**Conteúdo**:
- Resumo executivo
- Métricas de tráfego (Google Analytics)
- Performance SEO
- Conversões (formulários enviados)
- Custos de infraestrutura
- Incidentes e resolução
- Roadmap para próximo mês

### Métricas KPI

**Operacionais**:
- Uptime: > 99.5%
- Tempo de resposta médio: < 2s
- Taxa de erro: < 0.1%

**Conteúdo**:
- Novos imóveis por mês: > 10
- Tempo médio de atualização: < 24h
- Mensagens respondidas: 100% em 24h

**SEO**:
- Posição Google (palavra-chave principal): Top 10
- Tráfego orgânico mensal: crescimento > 5%
- Taxa de rejeição: < 60%

---

## 📞 Contatos Importantes

### Suporte Técnico

**Vercel**:
- Email: support@vercel.com
- Documentação: https://vercel.com/docs

**Turso Database**:
- Email: support@turso.tech
- Discord: https://discord.gg/turso
- Documentação: https://docs.turso.tech

**Desenvolvedor**:
- Email: carmiguicomercialda@gmail.com
- Telefone: 945 806 968 | 957 970 662

### Escalação de Problemas

**Nível 1** (Problemas Menores):
- Administrador de Conteúdo
- Tempo de resolução: 1-2 dias

**Nível 2** (Problemas Moderados):
- Administrador de Sistema
- Tempo de resolução: 4-8 horas

**Nível 3** (Problemas Críticos):
- Desenvolvedor + Suporte Vercel
- Tempo de resolução: 1-2 horas

---

## 📚 Recursos Adicionais

### Documentação Relacionada

- [Manual do Administrador](./MANUAL-ADMINISTRADOR.md)
- [Guia de Deploy](./DEPLOY.md)
- [Checklist de Produção](./CHECKLIST-PRODUCAO.md)
- [Documentação de Segurança](./SECURITY.md)
- [Documentação de Suporte](./DOCUMENTACAO-SUPORTE.md)

### Ferramentas Úteis

- **Monitoramento**: UptimeRobot, Pingdom
- **SEO**: Google Search Console, Ahrefs
- **Performance**: Google PageSpeed, GTmetrix
- **Analytics**: Google Analytics, Vercel Analytics

---

**Fim do Guia Operacional**

Para dúvidas ou sugestões de melhorias neste guia, contacte: carmiguicomercialda@gmail.com
