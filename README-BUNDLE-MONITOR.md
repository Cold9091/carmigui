# 📦 Sistema de Monitoramento de Bundle

Sistema automatizado para monitorar e controlar o tamanho do bundle da aplicação.

## ✨ Solução Implementada

O sistema resolve os problemas identificados:

- ✅ **Script de análise roda automaticamente** - via comando único
- ✅ **Controle de tamanho máximo** - limites configuráveis
- ✅ **Integração em pipeline de build** - pronto para CI/CD
- ✅ **Alertas automáticos** - quando limites são excedidos

## 🚀 Uso Rápido

### Verificar Bundle Atual

```bash
node scripts/check-bundle-size.js
```

**Nota**: Este comando requer que o build já tenha sido executado. Se for a primeira vez, execute `npm run build` primeiro.

Mostra:
- Tamanho total do bundle
- Top 5 maiores arquivos
- Status em relação aos limites
- Recomendações de otimização

### Análise Visual Completa

```bash
node scripts/analyze-bundle.js
```

Gera relatório visual interativo em `dist/stats.html` com:
- Treemap de dependências
- Tamanhos com gzip/brotli
- Detalhes de cada módulo

### Monitor Unificado

```bash
# Ver comandos disponíveis
node scripts/bundle-monitor.js

# Apenas verificar tamanho
node scripts/bundle-monitor.js check

# Gerar análise visual
node scripts/bundle-monitor.js analyze

# Build + Análise + Verificação
node scripts/bundle-monitor.js full

# Modo CI/CD (falha se exceder limites)
node scripts/bundle-monitor.js ci
```

## 📊 Limites Configurados

Configuração em `scripts/.bundle-limits.json`:

```json
{
  "limits": {
    "maxBundleSize": 512000,
    "maxChunkSize": 204800,
    "warnBundleSize": 409600
  }
}
```

- **maxBundleSize**: 512000 bytes (500 KB) - limite máximo total
- **maxChunkSize**: 204800 bytes (200 KB) - limite por chunk individual  
- **warnBundleSize**: 409600 bytes (400 KB) - dispara alerta

### Ajustar Limites

**IMPORTANTE**: Para modificar os limites, edite o arquivo `scripts/.bundle-limits.json`:

```json
{
  "limits": {
    "maxBundleSize": 1048576,
    "maxChunkSize": 307200,
    "warnBundleSize": 819200
  }
}
```

Os valores são em **bytes**. Se o arquivo não existir, o sistema usa valores padrão (500KB/200KB/400KB).

## 🔄 Integração no Pipeline

### Desenvolvimento Local

Antes de cada commit importante:

```bash
node scripts/bundle-monitor.js check
```

### CI/CD (GitHub Actions)

```yaml
name: Build & Bundle Check

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node scripts/bundle-monitor.js ci
```

### Pre-commit Hook

Adicione ao `.git/hooks/pre-commit`:

```bash
#!/bin/bash
node scripts/bundle-monitor.js check
```

## 📈 Interpretação dos Resultados

### ✅ Status OK

```
✅ Bundle está dentro dos limites aceitáveis!
Total: 380.50 KB
```

Tudo certo! Bundle está otimizado.

### ⚠️ Aviso

```
⚠️ AVISO: Bundle está próximo do limite máximo
Total: 420.50 KB
Limite de aviso: 400.00 KB
```

Bundle está crescendo. Considere otimizar.

### ❌ Erro

```
❌ ERRO: Bundle total excede o tamanho máximo!
Total: 737.95 KB
Máximo: 500.00 KB
Excesso: 237.95 KB
```

**Ação necessária!** Bundle muito grande.

## 🛠️ Como Otimizar

### 1. Identifique Problemas

```bash
node scripts/analyze-bundle.js
```

Abra `dist/stats.html` e procure por:
- Bibliotecas grandes desnecessárias
- Dependências duplicadas
- Código não utilizado

### 2. Aplique Otimizações

#### Code Splitting

```javascript
// Carregamento sob demanda
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### Imports Específicos

```javascript
// ❌ Evite
import _ from 'lodash';

// ✅ Prefira
import debounce from 'lodash/debounce';
```

#### Remova Dependências Não Usadas

```bash
npm uninstall <package-name>
```

### 3. Verifique Novamente

```bash
node scripts/bundle-monitor.js check
```

## 📁 Arquivos do Sistema

```
scripts/
├── analyze-bundle.js          # Análise visual detalhada
├── check-bundle-size.js       # Verificação de limites
├── bundle-monitor.js          # Wrapper unificado
└── .bundle-limits.json        # Configuração de limites

docs/
└── BUNDLE_MONITORING.md       # Documentação completa
```

## 🎯 Casos de Uso

### Desenvolvimento Diário

```bash
# Verificação rápida
node scripts/check-bundle-size.js
```

### Antes de Pull Request

```bash
# Análise completa
node scripts/bundle-monitor.js full
```

### Pipeline CI/CD

```bash
# Validação automática
node scripts/bundle-monitor.js ci
```

### Investigação de Performance

```bash
# Análise visual
node scripts/analyze-bundle.js
# Abrir dist/stats.html no navegador
```

## 💡 Dicas

1. **Execute regularmente** - Monitore o crescimento do bundle
2. **Aja nos avisos** - Não espere chegar no limite
3. **Documente mudanças** - Se aumentar limites, justifique
4. **Automatize** - Adicione ao CI/CD para prevenir regressões
5. **Analise visualmente** - Use o treemap para identificar oportunidades

## 📚 Documentação Completa

Para guia detalhado de otimização e melhores práticas, consulte:

```
docs/BUNDLE_MONITORING.md
```

## ❓ Troubleshooting

### Erro: "Diretório dist/public não encontrado"

O comando `check` requer um build prévio. Execute:

```bash
npm run build
node scripts/check-bundle-size.js
```

Ou use o comando `full` ou `ci` que fazem o build automaticamente:

```bash
node scripts/bundle-monitor.js full
```

### Bundle sempre excede limite

1. Analise o bundle: `node scripts/analyze-bundle.js`
2. Identifique maiores dependências
3. Otimize conforme recomendações
4. Se necessário, ajuste limites em `.bundle-limits.json`

### Script não funciona no CI

Certifique-se de:
- Build foi executado antes
- Node.js está instalado
- Permissões de execução estão corretas

## 🎓 Próximos Passos

1. ✅ Execute verificação inicial: `node scripts/bundle-monitor.js check`
2. ✅ Se bundle exceder limites, otimize conforme recomendações
3. ✅ Adicione ao seu workflow de desenvolvimento
4. ✅ Configure no CI/CD para automação
5. ✅ Monitore regularmente o crescimento

---

**Nota**: Este sistema foi projetado para ser não-invasivo. Não modifica arquivos de configuração do projeto (package.json, vite.config.ts), apenas adiciona scripts de monitoramento.
