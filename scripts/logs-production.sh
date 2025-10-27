#!/bin/bash

# Script para visualizar logs de produção do Vercel
# Uso: ./scripts/logs-production.sh [--follow]

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}📋 CARMIGUI - Logs de Produção${NC}\n"

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI não está instalado${NC}"
    echo -e "${BOLD}Instale com: npm install -g vercel${NC}"
    exit 1
fi

if [ "$1" = "--follow" ] || [ "$1" = "-f" ]; then
    echo -e "${GREEN}📡 Seguindo logs em tempo real...${NC}"
    echo -e "${YELLOW}Pressione Ctrl+C para sair${NC}\n"
    vercel logs --follow
else
    echo -e "${GREEN}📜 Últimos logs...${NC}\n"
    vercel logs
fi
