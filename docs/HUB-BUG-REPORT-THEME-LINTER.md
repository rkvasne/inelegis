# Hub Bug Report: Theme Linter Ignore Logic

> **Status:** Fork Local Ativo
> **Arquivo Local:** `scripts/hub-tools/theme-linter.js`
> **Arquivo Hub:** `.agent/hub/capabilities/design/frontend-design/scripts/theme-linter.js`
> **Data do Report:** 10/02/2026

## 🚨 O Problema

O script `theme-linter.js` original do Hub possui uma falha na lógica de ignorar regras via comentários (`allowedContexts`).

1. **Quebra com Formatadores:** O linter verifica apenas a linha atual (`line`). Quando formatadores automáticos (Prettier) movem o comentário de ignore para a linha seguinte ou anterior, o linter falha em ignorar a infração.
2. **Contexto Limitado:** Não há suporte nativo para `theme-ignore-next-line` ou verificação de linhas adjacentes.

## 🛠️ Correção Aplicada (Localmente)

O script local foi modificado para verificar a linha **anterior**:

```javascript
// scripts/hub-tools/theme-linter.js (Linha ~948)

// NOVO: Suporte explícito a diretivas de ignore (atual ou linha anterior)
if (line.includes('theme-ignore')) return;
if (index > 0 && lines[index-1].includes('theme-ignore')) return;
```

## ✅ Ação Requerida no Hub

Para eliminar o script duplicado localmente, o Hub precisa incorporar essa lógica ou uma equivalente.

**Passos:**
1. Atualizar o `theme-linter.js` no repositório central (`Agents`).
2. Adicionar suporte oficial a `/* theme-ignore */` na linha anterior.
3. Sincronizar o Hub (`git submodule update`).
4. Excluir `scripts/hub-tools/theme-linter.js` local e apontar `package.json` para o Hub.

---
*Este documento deve ser mantido até a resolução do problema upstream.*
