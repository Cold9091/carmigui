#!/bin/bash

# Script de Verificação Pré-Deploy
# Executa todas as verificações necessárias antes do deploy

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

HAS_ERRORS=0
HAS_WARNINGS=0

echo -e "${BOLD}🔍 Pre-Deploy Check - CARMIGUI${NC}\n"

echo -e "${GREEN}1️⃣ Verificando Git status...${NC}"
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠️  Há mudanças não commitadas${NC}"
  git status --short
  HAS_WARNINGS=1
else
  echo -e "${GREEN}✅ Git working tree limpo${NC}"
fi
echo ""

echo -e "${GREEN}2️⃣ Validando variáveis de ambiente...${NC}"
if node scripts/validate-env.js 2>&1 | grep -q "FALHOU"; then
  echo -e "${RED}❌ Validação de ambiente falhou${NC}"
  HAS_ERRORS=1
else
  echo -e "${GREEN}✅ Variáveis de ambiente OK${NC}"
fi
echo ""

echo -e "${GREEN}3️⃣ Verificando TypeScript...${NC}"
if npm run check > /dev/null 2>&1; then
  echo -e "${GREEN}✅ TypeScript check passou${NC}"
else
  echo -e "${RED}❌ TypeScript check falhou${NC}"
  HAS_ERRORS=1
fi
echo ""

echo -e "${GREEN}4️⃣ Testando build...${NC}"
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Build executado com sucesso${NC}"
else
  echo -e "${RED}❌ Build falhou${NC}"
  HAS_ERRORS=1
fi
echo ""

echo -e "${GREEN}5️⃣ Verificando bundle size...${NC}"
if node scripts/check-bundle-size.js 2>&1 | grep -q "ERRO"; then
  echo -e "${YELLOW}⚠️  Bundle excede limites${NC}"
  HAS_WARNINGS=1
else
  echo -e "${GREEN}✅ Bundle dentro dos limites${NC}"
fi
echo ""

echo -e "${GREEN}6️⃣ Verificando arquivos de configuração...${NC}"
MISSING_FILES=0

if [ ! -f "vercel.json" ]; then
  echo -e "${RED}❌ vercel.json não encontrado${NC}"
  MISSING_FILES=1
fi

if [ ! -f ".env.example" ]; then
  echo -e "${YELLOW}⚠️  .env.example não encontrado${NC}"
  HAS_WARNINGS=1
fi

if [ ! -f "scripts/db-migrate.js" ]; then
  echo -e "${RED}❌ scripts/db-migrate.js não encontrado${NC}"
  MISSING_FILES=1
fi

if [ $MISSING_FILES -eq 0 ]; then
  echo -e "${GREEN}✅ Arquivos de configuração OK${NC}"
else
  HAS_ERRORS=1
fi
echo ""

echo -e "${GREEN}7️⃣ Verificando dependências...${NC}"
if npm outdated --depth=0 2>&1 | grep -q "Package"; then
  echo -e "${YELLOW}⚠️  Há pacotes desatualizados${NC}"
  npm outdated --depth=0 || true
  HAS_WARNINGS=1
else
  echo -e "${GREEN}✅ Dependências atualizadas${NC}"
fi
echo ""

echo -e "${BOLD}═══════════════════════════════════════${NC}\n"

if [ $HAS_ERRORS -eq 1 ]; then
  echo -e "${RED}❌ PRÉ-DEPLOY CHECK FALHOU!${NC}"
  echo -e "${BOLD}Corrija os erros acima antes de fazer deploy.${NC}\n"
  exit 1
fi

if [ $HAS_WARNINGS -eq 1 ]; then
  echo -e "${YELLOW}⚠️  PRÉ-DEPLOY CHECK COM AVISOS${NC}"
  echo -e "${BOLD}Recomenda-se corrigir os avisos antes de continuar.${NC}\n"
  exit 0
fi

echo -e "${GREEN}✅ PRÉ-DEPLOY CHECK PASSOU!${NC}"
echo -e "${BOLD}Tudo pronto para deploy.${NC}\n"
exit 0
