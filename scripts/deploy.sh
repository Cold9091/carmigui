#!/bin/bash

# Script de Deploy Automatizado para Vercel
# Uso: ./scripts/deploy.sh [production|preview]

set -e

ENVIRONMENT=${1:-preview}
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}🚀 CARMIGUI Deploy Script${NC}\n"

if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "preview" ]; then
  echo -e "${RED}❌ Ambiente inválido. Use: production ou preview${NC}"
  exit 1
fi

echo -e "${BOLD}Ambiente:${NC} $ENVIRONMENT\n"

echo -e "${GREEN}1️⃣ Verificando dependências...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM não está instalado${NC}"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não está instalado${NC}"
    echo -e "${BOLD}Instalando Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Dependências OK${NC}\n"

echo -e "${GREEN}2️⃣ Validando variáveis de ambiente...${NC}"
node scripts/validate-env.js || {
    echo -e "${RED}❌ Validação de ambiente falhou${NC}"
    exit 1
}

echo -e "${GREEN}3️⃣ Executando verificações de código...${NC}"
npm run check || {
    echo -e "${RED}❌ TypeScript check falhou${NC}"
    exit 1
}

echo -e "${GREEN}4️⃣ Verificando tamanho do bundle...${NC}"
if [ -d "dist/public" ]; then
    node scripts/check-bundle-size.js || echo -e "${YELLOW}⚠️  Bundle excede limites recomendados${NC}"
else
    echo -e "${YELLOW}⚠️  Build não encontrado, pulando verificação de bundle${NC}"
fi

echo -e "${GREEN}5️⃣ Fazendo deploy no Vercel...${NC}\n"

if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${BOLD}${RED}⚠️  ATENÇÃO: Deploy para PRODUÇÃO${NC}"
    echo -e "${BOLD}Isso afetará o ambiente de produção em tempo real!${NC}"
    read -p "Deseja continuar? (yes/no): " -r
    echo
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Deploy cancelado${NC}"
        exit 0
    fi
    
    vercel --prod
else
    vercel
fi

echo -e "\n${GREEN}✅ Deploy concluído com sucesso!${NC}\n"

echo -e "${BOLD}📋 Próximos passos:${NC}"
echo "1. Verifique os logs no dashboard do Vercel"
echo "2. Teste a aplicação no ambiente de $ENVIRONMENT"
echo "3. Se for produção, troque a senha do admin"
echo "4. Configure domínio customizado (se necessário)"
echo ""
