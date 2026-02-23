# Convenções de Documentação

Este guia define o padrão de documentação para manter consistência, rastreabilidade e SSoT no Inelegis.

---

## 1. Fonte de Verdade (SSoT)

- A documentação canônica do projeto vive em `docs/` e nos arquivos raiz (`README.md`, `CHANGELOG.md`, `AGENTS.md`).
- `dist/` é artefato de build, não fonte de documentação.
- Atualizações devem ocorrer sempre no arquivo canônico, nunca no artefato gerado.

---

## 2. Nomenclatura de Arquivos

- Padrão geral: `lowercase-kebab-case.md`.
- Arquivos de arquivo histórico (`docs/archive/`): `YYYY-MM-DD-<slug>.md`.
- Evitar nomes genéricos como `novo.md`, `temp.md`, `doc-final.md`.

Exemplos válidos:

- `docs/plan-initial.md`
- `docs/guides/setup-supabase.md`
- `docs/archive/2026-02-23-release-history-v0.md`

---

## 3. Estrutura dos Documentos

- Título claro no topo.
- Blocos curtos e escaneáveis (seções objetivas).
- Links internos preferenciais para arquivos canônicos.
- Não duplicar conteúdo extenso entre arquivos; usar referência cruzada.

---

## 4. Assinatura Obrigatória em Markdown

Ao editar `.md`, manter assinatura no rodapé:

```markdown
_Última atualização: DD/MM/AAAA • vX.X.X_
_Editado via: [IDE] | Modelo: [LLM] | OS: [Sistema]_
```

Para documentos com frontmatter YAML, usar os campos de metadado no frontmatter (sem duplicar no footer).

---

## 5. Checklist de Publicação

Antes de concluir uma rodada de documentação:

1. Executar `npm run doc:check`
2. Executar `npm run format:check`
3. Verificar links internos dos arquivos alterados
4. Atualizar `CHANGELOG.md` e `.agent/memory/project-status.md` quando aplicável

---

_Última atualização: 23/02/2026 • v0.3.27_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
