# 📦 Monitoramento de Bundle

Sistema de monitoramento automático de tamanho de bundle para garantir performance da aplicação.

## 🎯 Objetivo

Manter o bundle da aplicação dentro de limites aceitáveis para garantir:
- Carregamento rápido da aplicação
- Boa experiência do usuário
- Performance otimizada

## 📊 Limites Configurados

### Bundle Total
- **Máximo**: 500 KB
- **Aviso**: 400 KB

### Chunks Individuais
- **Máximo**: 200 KB por arquivo

## 🚀 Como Usar

### 1. Verificação Rápida

Verifica o tamanho do bundle já compilado:

```bash
node scripts/check-bundle-size.js
```

Ou use o wrapper:

```bash
node scripts/bundle-monitor.js check
```

### 2. Análise Completa

Gera relatório visual detalhado do bundle:

```bash
node scripts/analyze-bundle.js
```

Ou use o wrapper:

```bash
node scripts/bundle-monitor.js analyze
```

O relatório será salvo em `dist/stats.html` com:
- Visualização treemap interativa
- Tamanhos com gzip/brotli
- Detalhes de cada dependência

### 3. Análise Completa (Build + Análise + Verificação)

```bash
node scripts/bundle-monitor.js full
```

Executa em sequência:
1. Build da aplicação
2. Análise visual do bundle
3. Verificação de limites

### 4. Modo CI/CD

Para integração em pipelines de CI/CD:

```bash
node scripts/bundle-monitor.js ci
```

Este comando:
- Faz o build da aplicação
- Verifica limites de tamanho
- **Falha** (exit code 1) se limites forem excedidos

## ⚙️ Integração no Pipeline de Build

### Opção 1: Verificação Manual Após Build

```bash
npm run build
node scripts/check-bundle-size.js
```

### Opção 2: Análise Periódica

Execute semanalmente ou antes de releases:

```bash
node scripts/bundle-monitor.js full
```

### Opção 3: CI/CD Automático

Adicione ao seu workflow de CI/CD (GitHub Actions, GitLab CI, etc.):

```yaml
# Exemplo para GitHub Actions
- name: Build e Verificar Bundle
  run: node scripts/bundle-monitor.js ci
```

## 📈 Interpretando Resultados

### ✅ Sucesso

```
✅ Bundle está dentro dos limites aceitáveis!
```

Bundle está OK, não precisa fazer nada.

### ⚠️ Aviso

```
⚠️ AVISO: Bundle está próximo do limite máximo
   Total: 420.50 KB
   Limite de aviso: 400.00 KB
```

Bundle está crescendo. Considere otimizar antes que atinja o limite.

### ❌ Erro

```
❌ ERRO: Bundle total excede o tamanho máximo!
   Total: 550.00 KB
   Máximo: 500.00 KB
   Excesso: 50.00 KB
```

Bundle excedeu o limite. **Ação necessária!**

## 🛠️ Como Otimizar

Quando o bundle exceder os limites:

### 1. Analise as Dependências

```bash
node scripts/analyze-bundle.js
```

Abra `dist/stats.html` e identifique:
- Bibliotecas muito grandes
- Dependências duplicadas
- Código não utilizado

### 2. Code Splitting

Divida código em chunks menores usando imports dinâmicos:

```javascript
// Antes
import HeavyComponent from './HeavyComponent';

// Depois
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 3. Remova Dependências Não Utilizadas

```bash
npm uninstall <package-name>
```

### 4. Use Imports Específicos

```javascript
// Evite
import _ from 'lodash';

// Prefira
import debounce from 'lodash/debounce';
```

### 5. Otimize Imagens e Assets

- Use formatos modernos (WebP, AVIF)
- Comprima imagens
- Use lazy loading

## 🔧 Ajustando Limites

**IMPORTANTE**: Para modificar os limites, edite o arquivo `scripts/.bundle-limits.json`:

```json
{
  "limits": {
    "maxBundleSize": 512000,
    "maxChunkSize": 204800,
    "warnBundleSize": 409600
  },
  "description": {
    "maxBundleSize": "Tamanho máximo total do bundle em bytes (500 KB)",
    "maxChunkSize": "Tamanho máximo de um chunk individual em bytes (200 KB)",
    "warnBundleSize": "Tamanho que dispara aviso em bytes (400 KB)"
  }
}
```

Os valores são em **bytes**. Para converter:
- 1 KB = 1024 bytes
- 500 KB = 512000 bytes
- 1 MB = 1048576 bytes

Se o arquivo `.bundle-limits.json` não existir ou estiver malformado, o sistema usa valores padrão (500KB/200KB/400KB).

## 📋 Checklist de Otimização

- [ ] Executar análise de bundle
- [ ] Identificar maiores dependências
- [ ] Remover código não utilizado
- [ ] Implementar code splitting
- [ ] Otimizar imports
- [ ] Comprimir assets
- [ ] Verificar tamanho novamente
- [ ] Confirmar que está dentro dos limites

## 🎓 Boas Práticas

1. **Execute verificação regularmente** - Ao menos antes de cada release
2. **Monitore o crescimento** - Acompanhe o tamanho ao adicionar features
3. **Aja nos avisos** - Não espere chegar no limite máximo
4. **Documente decisões** - Justifique quando aumentar limites
5. **Automatize no CI/CD** - Previna regressões automaticamente

## 📚 Recursos Adicionais

- [Web.dev - Bundle Size Optimization](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Vite - Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [React - Code Splitting](https://react.dev/reference/react/lazy)

## ❓ Dúvidas Frequentes

### O limite é muito restritivo?

Os limites são baseados em boas práticas de performance. Se precisar ajustar:
1. Justifique tecnicamente
2. Aumente gradualmente
3. Documente a decisão

### Quando executar a verificação?

- **Desenvolvimento**: Periodicamente (semanal)
- **Antes de PRs**: Sempre
- **CI/CD**: Em todo commit/PR
- **Antes de releases**: Obrigatório

### O que fazer se o CI falhar?

1. Execute localmente: `node scripts/bundle-monitor.js full`
2. Analise o relatório em `dist/stats.html`
3. Otimize conforme necessário
4. Verifique novamente
5. Commit e push
