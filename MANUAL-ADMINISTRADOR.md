# 👨‍💼 Manual do Administrador - CARMIGUI Platform

## Visão Geral

Este manual fornece instruções completas para administradores da plataforma CARMIGUI, cobrindo todas as funcionalidades do painel administrativo e procedimentos de gestão.

**Última Atualização**: 27 de Outubro de 2025  
**Versão**: 1.0  
**Público-Alvo**: Administradores e Gestores de Conteúdo

---

## 📋 Índice

1. [Acesso ao Painel Admin](#acesso-ao-painel-admin)
2. [Dashboard Principal](#dashboard-principal)
3. [Gestão de Imóveis](#gestão-de-imóveis)
4. [Gestão de Projetos](#gestão-de-projetos)
5. [Gestão de Condomínios](#gestão-de-condomínios)
6. [Gestão de Contactos](#gestão-de-contactos)
7. [Gestão de Categorias](#gestão-de-categorias)
8. [Gestão de Cidades](#gestão-de-cidades)
9. [Configuração do Hero Banner](#configuração-do-hero-banner)
10. [Gestão de Funcionários](#gestão-de-funcionários)
11. [Banco de Dados](#banco-de-dados)
12. [Configurações da Conta](#configurações-da-conta)
13. [Boas Práticas](#boas-práticas)
14. [Resolução de Problemas](#resolução-de-problemas)

---

## 🔐 Acesso ao Painel Admin

### Como Aceder

1. **URL de Acesso**: `https://carmigui.com/admin/login`
2. **Credenciais**:
   - Email: [seu email de administrador]
   - Senha: [sua senha segura]

### Primeiro Acesso

**Se for o primeiro acesso ao sistema:**

1. Use as credenciais padrão fornecidas pelo desenvolvedor
2. **IMPORTANTE**: Troque a senha imediatamente após o primeiro login
3. Vá em: Admin → Configurações → Alterar Senha
4. Escolha senha forte:
   - Mínimo 8 caracteres
   - Pelo menos 1 letra maiúscula
   - Pelo menos 1 letra minúscula
   - Pelo menos 1 número
   - Pelo menos 1 caractere especial (!@#$%^&*)

### Segurança da Conta

**Proteções Ativas**:
- Máximo 5 tentativas de login a cada 15 minutos
- Sessão expira após 7 dias de inatividade
- Conexão segura via HTTPS obrigatória

**Recomendações**:
- Nunca compartilhe suas credenciais
- Use um gestor de passwords (LastPass, 1Password)
- Faça logout ao sair de computadores compartilhados
- Não aceda de redes Wi-Fi públicas sem VPN

### Recuperação de Senha

**Se esquecer a senha**:

1. **Opção 1**: Contatar desenvolvedor para reset manual
2. **Opção 2**: Usar funcionalidade de reset (se implementada)

**Processo de Reset Manual**:
- Email: carmiguicomercialda@gmail.com
- Assunto: "Reset de Senha - Admin CARMIGUI"
- Tempo de resposta: 2-4 horas úteis

---

## 📊 Dashboard Principal

### Visão Geral

Após login bem-sucedido, você será direcionado ao dashboard principal com:

**Widgets Disponíveis**:
- Total de imóveis ativos
- Total de projetos
- Total de condomínios
- Mensagens de contacto não lidas
- Estatísticas de visitantes (se configurado)

**Navegação Principal**:
- Menu lateral esquerdo com todas as seções
- Barra superior com perfil e logout
- Breadcrumbs para navegação de contexto

---

## 🏠 Gestão de Imóveis

### Listar Imóveis

**Acesso**: Admin → Imóveis

**Funcionalidades**:
- Ver todos os imóveis cadastrados
- Filtrar por categoria, cidade ou status
- Pesquisar por título ou descrição
- Ordenar por data, preço ou popularidade

**Colunas da Listagem**:
- Imagem principal
- Título do imóvel
- Categoria
- Cidade
- Preço
- Status (Disponível/Vendido/Alugado)
- Ações (Editar/Deletar)

### Adicionar Novo Imóvel

**Acesso**: Admin → Imóveis → Botão "Adicionar Imóvel"

**Passo a Passo**:

#### 1. Informações Básicas

**Título** (obrigatório):
- Seja descritivo e atrativo
- Inclua tipo + características + localização
- Exemplo: "Vivenda T4 Moderna com Piscina - Talatona"
- Limite: 100 caracteres

**Descrição** (obrigatório):
- Descreva detalhadamente o imóvel
- Inclua:
  - Características principais
  - Estado de conservação
  - Acabamentos
  - Proximidade de serviços
  - Diferenciais
- Mínimo: 100 palavras
- Máximo: 1000 palavras
- Use parágrafos curtos para melhor leitura

**Exemplo de Boa Descrição**:
```
Magnífica vivenda T4 de arquitetura moderna, localizada no coração 
da Talatona. Esta propriedade oferece 350m² de área construída em 
lote de 600m².

Características:
- 4 quartos espaçosos (1 suite com closet)
- 3 casas de banho completas
- Sala ampla com pé direito duplo
- Cozinha equipada com bancada em granito
- Área de lazer com piscina aquecida
- Garagem para 3 viaturas

Acabamentos de primeira qualidade incluindo pisos em porcelanato, 
janelas com vidro duplo, e sistema de segurança completo.

Localização privilegiada próxima a:
- Supermercados (5min)
- Escolas internacionais (10min)
- Centro comercial (7min)
- Principais vias de acesso
```

#### 2. Localização e Categoria

**Categoria** (obrigatório):
- Selecionar da lista: Vivenda, Apartamento, Terreno, Comercial, etc.
- Se categoria não existe: Criar primeiro em Admin → Categorias

**Cidade** (obrigatório):
- Selecionar da lista: Luanda, Talatona, Maianga, etc.
- Se cidade não existe: Criar primeiro em Admin → Cidades

**Bairro/Zona** (opcional):
- Especificar bairro ou zona específica
- Exemplo: "Talatona, próximo ao Belas Shopping"

#### 3. Detalhes do Imóvel

**Área** (obrigatório):
- Em metros quadrados (m²)
- Apenas números
- Exemplo: 350 (não incluir "m²")

**Quartos** (opcional):
- Número de quartos/dormitórios
- Para T0/Studio: deixar vazio ou 0
- Exemplo: 4

**Casas de Banho** (opcional):
- Número de WCs completos
- Incluir suites e lavabos separados
- Exemplo: 3

**Estado da Casa** (opcional):
- Opções:
  - **Construída**: Pronta a habitar
  - **Inacabada**: Em construção ou para terminar
- Se não selecionado: assumido como construída

#### 4. Informações de Preço

**Tipo de Pagamento** (obrigatório):
- **Preço Fixo**: Valor total definido
- **Parcelado**: Pagamento em prestações
- **Customizado**: Condições especiais (negociável)

**Preço** (obrigatório):
- Valor em Kwanzas (Kz)
- Formato: 50.000.000 Kz ou USD 100,000
- Se parcelado: indicar valor total ou entrada

**Entrada** (se parcelado):
- Valor da entrada inicial
- Exemplo: 20.000.000 Kz

**Período de Pagamento** (se parcelado):
- Prazo de amortização
- Exemplo: "24 meses" ou "2 anos"

#### 5. Imagens

**Upload de Fotos** (obrigatório):
- **Mínimo**: 1 foto (recomendado 5-10)
- **Máximo**: 10 fotos por imóvel
- **Formatos aceitos**: JPEG, PNG, WebP
- **Tamanho máximo**: 5MB por imagem
- **Resolução recomendada**: 1920x1080 ou superior

**Ordem das Imagens**:
1. Primeira imagem = Foto principal (fachada)
2. Sala principal
3. Cozinha
4. Quartos
5. Casas de banho
6. Área externa
7. Detalhes especiais

**Dicas para Boas Fotos**:
- Use luz natural sempre que possível
- Tire fotos em ângulos que mostrem amplitude
- Limpe e organize espaços antes de fotografar
- Evite fotos escuras ou desfocadas
- Não use filtros exagerados

#### 6. Tour Virtual (Opcional)

**URL do Tour Virtual**:
- Cole link do tour 360° ou vídeo
- Plataformas suportadas:
  - Matterport
  - YouTube (vídeo)
  - Kuula
  - Qualquer URL de tour virtual

**Exemplo**: `https://my.matterport.com/show/?m=XXXXXXX`

#### 7. Configurações Adicionais

**Status** (obrigatório):
- **Disponível**: Imóvel à venda/aluguel
- **Vendido**: Imóvel já vendido (não aparece em destaque)
- **Alugado**: Imóvel já alugado

**Destacado**:
- ☑ Marcar se for imóvel premium
- Imóveis destacados aparecem primeiro na listagem
- Use com moderação (máximo 3-5 simultâneos)

#### 8. Salvar

**Botões**:
- **Salvar**: Criar imóvel e voltar à listagem
- **Cancelar**: Descartar alterações

**Após Salvar**:
- Imóvel aparece imediatamente no site público
- Você pode editar a qualquer momento
- Verifique visualização no site

### Editar Imóvel

**Acesso**: Admin → Imóveis → Clicar ícone lápis

**Procedimento**:
1. Formulário é preenchido com dados atuais
2. Modificar campos desejados
3. Clicar "Salvar"
4. Alterações são imediatas no site

**Edições Comuns**:
- Atualizar preço
- Mudar status (Disponível → Vendido)
- Adicionar/remover fotos
- Corrigir descrição
- Atualizar informações de contacto

### Deletar Imóvel

**Acesso**: Admin → Imóveis → Clicar ícone lixeira

**Atenção**: 
- ⚠️ **Ação irreversível!**
- Imóvel é removido permanentemente
- Imagens associadas são mantidas no servidor

**Quando Deletar**:
- Imóvel vendido há muito tempo
- Listagem duplicada
- Informações completamente desatualizadas

**Alternativa Recomendada**:
- Em vez de deletar, mude status para "Vendido"
- Mantém histórico e portfólio da empresa

---

## 🏗️ Gestão de Projetos

### Visão Geral

Projetos de construção realizados pela CARMIGUI. Servem como portfólio e demonstração de capacidade técnica.

### Adicionar Novo Projeto

**Acesso**: Admin → Projetos → "Adicionar Projeto"

**Campos**:

**Título** (obrigatório):
- Nome do projeto ou empreendimento
- Exemplo: "Edifício Comercial Maianga Plaza"

**Descrição** (obrigatório):
- Detalhe o escopo do projeto:
  - Tipo de obra
  - Cliente (se permitido divulgar)
  - Desafios superados
  - Soluções implementadas
  - Resultado final

**Área** (obrigatório):
- Área total construída em m²
- Exemplo: 5000

**Duração** (obrigatório):
- Tempo de execução do projeto
- Formato livre
- Exemplo: "18 meses" ou "1 ano e meio"

**Unidades** (obrigatório):
- Descrição do que foi construído
- Exemplos:
  - "12 apartamentos T3"
  - "50 lojas comerciais"
  - "2 blocos residenciais"

**Ano** (obrigatório):
- Ano de conclusão
- Formato: YYYY
- Exemplo: 2024

**Status** (obrigatório):
- **Concluído**: Projeto finalizado
- **Em Andamento**: Em execução
- **Planejamento**: Em fase de projeto

**Imagens** (obrigatório):
- Fotos do antes/durante/depois
- Mínimo 3, máximo 10
- Mesmas especificações de imóveis

**Destacado**:
- Marcar projetos mais importantes/recentes

### Gerenciar Projetos

**Editar**: Mesmo procedimento de imóveis  
**Deletar**: Com cautela, mantém credibilidade da empresa

---

## 🏢 Gestão de Condomínios

### Visão Geral

Condomínios são empreendimentos com múltiplas unidades geridos pela CARMIGUI.

### Adicionar Novo Condomínio

**Acesso**: Admin → Condomínios → "Adicionar Condomínio"

**Campos**:

**Título** (obrigatório):
- Nome do condomínio
- Exemplo: "Condomínio Jardins de Talatona"

**Descrição** (obrigatório):
- Descreva:
  - Conceito do condomínio
  - Infraestruturas
  - Áreas comuns
  - Segurança
  - Serviços incluídos

**Localização** (obrigatório):
- Endereço ou zona
- Exemplo: "Talatona, Rua Principal"

**Total de Unidades** (obrigatório):
- Número total de apartamentos/vivendas
- Exemplo: 48

**Unidades Disponíveis** (obrigatório):
- Quantas ainda estão à venda
- Atualizar quando vendidas
- Exemplo: 12

**Tipologias** (obrigatório):
- Tipos de unidades disponíveis
- Exemplo: "T2, T3, T4"

**Comodidades** (obrigatório):
- Lista de amenidades
- Separar por vírgulas
- Exemplo: "Piscina, Ginásio, Playground, Segurança 24h, Estacionamento"

**Preço Desde** (obrigatório):
- Preço da unidade mais barata
- Exemplo: "45.000.000 Kz"

**Tipo de Pagamento** (obrigatório):
- Mesmo que imóveis: Fixo/Parcelado/Customizado

**Entrada** (se parcelado):
- Valor ou percentual de entrada

**Período de Pagamento** (se parcelado):
- Prazo de financiamento

**Imagens** (obrigatório):
- Planta do condomínio
- Áreas comuns
- Unidades modelo
- Mínimo 5 fotos

**Destacado**:
- Marcar lançamentos ou promoções

---

## 📧 Gestão de Contactos

### Visão Geral

Mensagens enviadas através do formulário de contacto no site.

### Visualizar Contactos

**Acesso**: Admin → Contactos

**Informações Exibidas**:
- Nome do contactante
- Email
- Telefone (se fornecido)
- Assunto
- Mensagem completa
- Data/hora de envio
- Status: Novo/Lido

### Responder Contactos

**Procedimento**:
1. Ler mensagem no painel admin
2. Copiar email do contactante
3. Abrir cliente de email (Gmail, Outlook)
4. Compor resposta profissional
5. Marcar como resolvido no admin (deletar)

**Template de Resposta**:
```
Assunto: Re: [Assunto Original] - CARMIGUI

Caro(a) [Nome],

Obrigado por entrar em contacto com a CARMIGUI.

[Resposta específica à pergunta/solicitação]

Estamos à disposição para esclarecer qualquer dúvida adicional.

Atenciosamente,
[Seu Nome]
CARMIGUI - CM Carmigui Comércio Geral & Prestação de Serviços SARL
Tel: 945 806 968 | 957 970 662
Email: carmiguicomercialda@gmail.com
Website: https://carmigui.com
```

### Deletar Contactos

- Deletar apenas após responder
- Ou se for spam evidente
- Considerar exportar para backup antes de deletar

---

## 📁 Gestão de Categorias

### Visão Geral

Categorias agrupam tipos de imóveis (Vivendas, Apartamentos, Terrenos, etc.).

### Adicionar Nova Categoria

**Acesso**: Admin → Categorias → "Adicionar Categoria"

**Campos**:

**Nome** (obrigatório):
- Nome da categoria
- Singular, capitalizado
- Exemplos: Vivenda, Apartamento, Terreno, Escritório

**Slug** (obrigatório):
- Versão URL-friendly do nome
- Minúsculas, sem espaços, sem acentos
- Gerado automaticamente, mas editável
- Exemplos: vivenda, apartamento, terreno

**Imagem** (obrigatório):
- Imagem representativa da categoria
- Upload ou URL
- Dimensões recomendadas: 800x600

**Ordem de Exibição** (opcional):
- Número para ordenar categorias
- Menor número aparece primeiro
- Exemplo: 1, 2, 3...

**Ativo**:
- ☑ Marcar para exibir no site
- Desmarcar para ocultar temporariamente

### Editar/Deletar Categoria

**Atenção ao Deletar**:
- ⚠️ Verificar se há imóveis usando a categoria
- Se houver, primeiro reatribuir imóveis para outra categoria
- Ou sistema pode impedir deleção

---

## 🗺️ Gestão de Cidades

### Visão Geral

Cidades onde a CARMIGUI opera (Luanda, Talatona, etc.).

### Adicionar Nova Cidade

**Acesso**: Admin → Cidades → "Adicionar Cidade"

**Campos**: Similares às categorias

**Nome** (obrigatório):
- Nome da cidade/zona
- Exemplo: Luanda, Talatona, Maianga

**Slug** (obrigatório):
- Auto-gerado
- Exemplo: luanda, talatona

**Imagem** (obrigatório):
- Foto icônica da cidade/zona
- Marcos conhecidos ou paisagem

**Ordem de Exibição** (opcional):
- Ordem de prioridade
- Principais cidades primeiro

**Ativo**:
- Marcar para exibir

---

## 🎨 Configuração do Hero Banner

### Visão Geral

Banner principal da página inicial. Gerencia título, descrição e imagem de fundo.

### Configurar Hero

**Acesso**: Admin → Hero

**Campos**:

**Título** (obrigatório):
- Frase de impacto
- Máximo 60 caracteres
- Exemplo: "Construindo Sonhos, Entregando Lares"

**Descrição** (obrigatório):
- Subtítulo explicativo
- Máximo 200 caracteres
- Exemplo: "A CARMIGUI é especialista em construção civil e gestão imobiliária em Angola"

**Imagem de Fundo** (obrigatório):
- Upload de imagem hero
- Dimensões ideais: 1920x1080 ou maior
- Formato: JPEG ou WebP
- Tamanho máximo: 5MB
- Deve ter boa contraste com texto

**Botão CTA**:
- Texto do botão (ex: "Ver Imóveis")
- Link do botão (ex: /imoveis)

**Ativo**:
- ☑ Marcar para exibir hero
- Desmarcar para ocultar temporariamente

**Dicas**:
- Use imagem com boa qualidade
- Texto deve ser legível sobre a imagem
- Testar visualização em desktop e mobile

---

## 👥 Gestão de Funcionários

### Visão Geral

Página "Sobre Nós" com equipa da CARMIGUI.

### Adicionar Funcionário

**Acesso**: Admin → Funcionários → "Adicionar Funcionário"

**Campos**:

**Nome** (obrigatório):
- Nome completo
- Exemplo: "João Silva"

**Cargo** (obrigatório):
- Título/função
- Exemplo: "Engenheiro Civil", "Gestor de Projetos"

**Bio** (opcional):
- Breve descrição profissional
- Formação, experiência
- Máximo 300 palavras

**Foto** (obrigatório):
- Foto profissional
- Formato quadrado preferível (1:1)
- Fundo neutro
- Dimensões: 500x500 ou maior

**Email** (opcional):
- Email profissional
- Aparece no site se preenchido

**Telefone** (opcional):
- Número direto
- Formato: +244 XXX XXX XXX

**Ordem** (opcional):
- Para ordenar equipa
- Diretor primeiro, etc.

### Gerenciar Seção "Sobre Nós"

**Informações da Empresa**:
- Editar história da empresa
- Missão, visão, valores
- Anos de experiência
- Projetos realizados

---

## 💾 Banco de Dados

### Visão Geral

Área sensível para configuração e manutenção do banco Turso.

### Acesso à Área

**Credencial de Segurança**:
- Requer credencial adicional além do login admin
- Protege contra mudanças acidentais
- Contatar desenvolvedor para credencial

### Funcionalidades

**Status do Banco**:
- Ver informações de conexão
- Status: Conectado/Desconectado
- Tipo de banco: SQLite (dev) ou Turso (prod)

**Configurar Turso**:
- Inserir TURSO_DATABASE_URL
- Inserir TURSO_AUTH_TOKEN
- Testar conexão
- Aplicar mudanças

**Migrações**:
- Ver status de migrações
- Executar migrações pendentes
- Ver histórico

**Exportar Dados**:
- Baixar backup do banco
- Formato SQL
- Salvar em local seguro

**⚠️ ATENÇÃO**:
- Esta área é CRÍTICA
- Mudanças erradas podem derrubar o site
- Em dúvida, contactar desenvolvedor
- Sempre fazer backup antes de alterações

---

## ⚙️ Configurações da Conta

### Alterar Senha

**Acesso**: Admin → Configurações (ou ícone perfil)

**Procedimento**:
1. Clicar em "Alterar Senha"
2. Inserir senha atual
3. Inserir nova senha (2x)
4. Validações:
   - Mínimo 8 caracteres
   - Letra maiúscula
   - Letra minúscula
   - Número
   - Caractere especial
5. Clicar "Salvar"
6. Será desconectado automaticamente
7. Fazer login com nova senha

**Recomendações**:
- Trocar senha a cada 3-6 meses
- Não reutilizar senhas antigas
- Usar gestor de passwords

### Logout

**Como Sair**:
- Clicar no ícone de perfil (canto superior direito)
- Selecionar "Logout" ou "Sair"
- Será redirecionado para página de login

**Importante**:
- Sempre fazer logout em computadores compartilhados
- Sessão expira após 7 dias de inatividade

---

## ✅ Boas Práticas

### Gestão de Conteúdo

1. **Consistência**:
   - Use mesmo estilo de escrita
   - Formate preços uniformemente
   - Mantenha padrão de fotos

2. **Qualidade sobre Quantidade**:
   - Prefira 5 imóveis bem descritos que 20 superficiais
   - Fotos profissionais fazem diferença
   - Descrições detalhadas convertem mais

3. **Atualização Regular**:
   - Revise imóveis semanalmente
   - Atualize status (vendido/disponível)
   - Remova conteúdo desatualizado

4. **SEO**:
   - Use palavras-chave relevantes
   - Título descritivo
   - Descrição completa
   - Alt text em imagens

### Segurança

1. **Credenciais**:
   - Senha forte e única
   - Não compartilhar conta
   - Trocar senha periodicamente

2. **Sessão**:
   - Logout após uso
   - Não salvar senha em navegadores públicos
   - Limpar cache em PCs compartilhados

3. **Uploads**:
   - Apenas imagens de fontes confiáveis
   - Verificar imagens antes de upload
   - Não fazer upload de arquivos executáveis

### Performance

1. **Imagens**:
   - Otimizar antes de upload
   - Usar ferramentas: TinyPNG, Squoosh
   - Dimensões adequadas (não enviar fotos de 10MB)

2. **Conteúdo**:
   - Evitar textos extremamente longos
   - Usar parágrafos curtos
   - Incluir espaçamento adequado

---

## 🔧 Resolução de Problemas

### Não Consigo Fazer Login

**Causas Possíveis**:
1. Senha incorreta
2. Email incorreto
3. Conta bloqueada (5+ tentativas)
4. Sessão expirada

**Soluções**:
1. Verificar caps lock
2. Copiar/colar credenciais
3. Aguardar 15 minutos se bloqueado
4. Contatar desenvolvedor para reset

### Upload de Imagem Falha

**Causas Possíveis**:
1. Arquivo muito grande (>5MB)
2. Formato não suportado
3. Conexão lenta
4. Limite de uploads atingido (10/15min)

**Soluções**:
1. Comprimir imagem (TinyPNG)
2. Converter para JPEG/PNG
3. Aguardar e tentar novamente
4. Verificar conexão internet

### Mudanças Não Aparecem no Site

**Causas Possíveis**:
1. Cache do navegador
2. CDN ainda não atualizou
3. Erro ao salvar

**Soluções**:
1. Limpar cache (Ctrl+F5)
2. Aguardar 1-2 minutos
3. Verificar se salvou corretamente
4. Testar em navegador anônimo

### Site Lento ou Não Carrega

**Causas Possíveis**:
1. Problema de internet local
2. Servidor em manutenção
3. Ataque DDoS
4. Muitas imagens grandes

**Soluções**:
1. Verificar sua conexão
2. Verificar em downdetector.com
3. Contatar desenvolvedor
4. Otimizar imagens enviadas

### Erro ao Deletar Item

**Causas Possíveis**:
1. Item em uso (ex: categoria com imóveis)
2. Permissões insuficientes
3. Erro de banco de dados

**Soluções**:
1. Primeiro remover dependências
2. Verificar permissões da conta
3. Contatar desenvolvedor

---

## 📞 Suporte

### Contatos de Suporte

**Suporte Técnico**:
- Email: carmiguicomercialda@gmail.com
- Telefone: 945 806 968 | 957 970 662
- Horário: 8h-18h, dias úteis

**Para Problemas Críticos**:
- Site fora do ar
- Banco de dados inacessível
- Invasão/segurança

→ Ligar imediatamente: 945 806 968

### Como Reportar Problemas

**Informações Necessárias**:
1. Descrição do problema
2. O que estava fazendo quando ocorreu
3. Mensagem de erro (se houver)
4. Screenshot (se possível)
5. Navegador usado
6. Hora aproximada

**Email Template**:
```
Assunto: PROBLEMA ADMIN - [Descrição breve]

Descrição detalhada:
[Explique o que aconteceu]

Passos para reproduzir:
1. [Passo 1]
2. [Passo 2]
3. [Erro ocorre]

Mensagem de erro:
[Cole aqui se houver]

Navegador: [Chrome/Firefox/Safari]
Data/Hora: [DD/MM/YYYY HH:MM]

[Anexar screenshot se possível]
```

---

## 📚 Recursos Adicionais

### Documentação Relacionada

- [Guia Operacional](./GUIA-OPERACIONAL.md)
- [Documentação de Segurança](./SECURITY.md)
- [Checklist de Produção](./CHECKLIST-PRODUCAO.md)
- [Documentação de Suporte](./DOCUMENTACAO-SUPORTE.md)

### Tutoriais em Vídeo

(A serem criados)
- Como adicionar um imóvel
- Como fazer upload de imagens
- Como gerenciar contactos
- Como configurar o hero banner

---

## 📝 Glossário

**Admin**: Administrador do sistema  
**CRUD**: Create, Read, Update, Delete (operações básicas)  
**Dashboard**: Painel de controle principal  
**Hero**: Banner principal da homepage  
**Slug**: Versão URL-friendly de um texto  
**SEO**: Search Engine Optimization (otimização para motores de busca)  
**Status**: Estado atual (disponível, vendido, etc.)  
**Turso**: Serviço de banco de dados usado em produção  
**Upload**: Enviar arquivo (foto) para o servidor

---

**Fim do Manual do Administrador**

Para dúvidas ou sugestões de melhorias neste manual, contacte: carmiguicomercialda@gmail.com
