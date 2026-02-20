---
type: gotchas
project: Inelegis
last-updated: 2026-02-15
---

# ⚠️ Gotchas — Inelegis

> Problemas conhecidos, comportamentos inesperados e workarounds descobertos durante o desenvolvimento.
> **Consulte antes de iniciar tarefas em áreas relacionadas.**
> Adicione uma entrada sempre que resolver um problema não óbvio.

---

## 🔴 Críticos (bloqueiam desenvolvimento)

<!--
TEMPLATE DE ENTRADA:
### [Título curto e descritivo]
- **Categoria:** build | test | lint | runtime | integração | segurança | infra
- **Contexto:** Onde/quando ocorre
- **Problema:** O que acontece de errado
- **Workaround:** Como contornar
- **Arquivos relacionados:** (opcional)
- **Descoberto em:** YYYY-MM-DD
-->

_Nenhum gotcha crítico registrado ainda._

---

## ⚠️ Avisos (podem causar confusão ou retrabalho)

_Nenhum gotcha de aviso registrado ainda._

---

## ℹ️ Informativos (comportamentos não óbvios mas não bloqueantes)

_Nenhum gotcha informativo registrado ainda._

---

## 📋 Como Usar Este Arquivo

### Adicionando um Gotcha

Quando resolver um problema não óbvio, adicione uma entrada na seção adequada:

```markdown
### Zustand persist exige type annotation explícita

- **Categoria:** runtime
- **Contexto:** Ao usar `persist()` com TypeScript strict
- **Problema:** TypeScript não consegue inferir o tipo do store sem anotação explícita — resulta em erro de tipo silencioso
- **Workaround:** `create<MyStore>()(persist(...))` — note os parênteses extras e o tipo explícito
- **Arquivos relacionados:** `src/stores/*.ts`
- **Descoberto em:** 2026-01-15
```

### Consultando Gotchas

- **Antes de uma sessão:** Leia os críticos e avisos da área em que vai trabalhar
- **Pesquisa rápida:** Use `Ctrl+F` com a categoria ou tecnologia (ex: `zustand`, `prisma`, `next`)
- **No terminal:** `grep -i "categoria" .agent/memory/gotchas.md`

### Critérios para Adicionar

✅ Adicione se:

- Perdeu mais de 30 min resolvendo
- O erro não aparece claramente na documentação oficial
- É fácil repetir o mesmo erro em sessões futuras
- Envolve comportamento específico do stack do projeto

❌ Não adicione se:

- É documentado claramente na doc oficial
- É um erro de digitação ou config óbvia
- Já está coberto pelo `project-status.md` de forma adequada

---

_Última atualização: 20/02/2026_
_Projeto: Inelegis | Hub: agents-rules v0.5.9_
