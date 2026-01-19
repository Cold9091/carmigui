#!/bin/bash
# Script para validar se Turso está corretamente configurado em produção

echo "🔍 Validando configuração do Turso..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar TURSO_DATABASE_URL
if [ -z "$TURSO_DATABASE_URL" ]; then
  echo -e "${RED}✗ TURSO_DATABASE_URL não definida${NC}"
  MISSING_VARS=true
else
  if [[ $TURSO_DATABASE_URL == libsql://* ]]; then
    echo -e "${GREEN}✓ TURSO_DATABASE_URL configurada${NC}"
    echo "  → ${TURSO_DATABASE_URL:0:40}..."
  else
    echo -e "${RED}✗ TURSO_DATABASE_URL tem formato inválido${NC}"
    echo "  → Esperado: libsql://seu-database.turso.io"
    echo "  → Obtido: $TURSO_DATABASE_URL"
    INVALID_FORMAT=true
  fi
fi

# Verificar TURSO_AUTH_TOKEN
if [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo -e "${RED}✗ TURSO_AUTH_TOKEN não definida${NC}"
  MISSING_VARS=true
else
  echo -e "${GREEN}✓ TURSO_AUTH_TOKEN configurada${NC}"
  echo "  → Token: ${TURSO_AUTH_TOKEN:0:10}...${TURSO_AUTH_TOKEN: -4}"
fi

echo ""

if [ "$MISSING_VARS" = true ]; then
  echo -e "${RED}❌ ERRO: Variáveis obrigatórias do Turso não estão configuradas!${NC}"
  echo ""
  echo "📋 AÇÃO NECESSÁRIA:"
  echo "1. Aceda a https://vercel.com/dashboard"
  echo "2. Vá para seu projeto → Settings → Environment Variables"
  echo "3. Adicione:"
  echo "   TURSO_DATABASE_URL = libsql://seu-database.turso.io"
  echo "   TURSO_AUTH_TOKEN = seu_token_aqui"
  echo "4. Clique em Deployments → Reprocess deployment"
  exit 1
fi

if [ "$INVALID_FORMAT" = true ]; then
  echo -e "${RED}❌ ERRO: Variáveis têm formato inválido!${NC}"
  echo ""
  echo "📋 Verifique:"
  echo "• TURSO_DATABASE_URL deve começar com 'libsql://'"
  echo "• TURSO_AUTH_TOKEN não deve estar vazio"
  exit 1
fi

echo -e "${GREEN}✅ Todas as variáveis do Turso estão configuradas corretamente!${NC}"
echo ""
echo "🚀 Seu aplicativo está pronto para usar persistência com Turso"
exit 0
