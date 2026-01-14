# AGENTS.md

> Este arquivo fornece instruções para agentes de IA que trabalham neste projeto.
> Compatível com: VS Code + Copilot, Cursor, Windsurf, Trae, Gemini CLI, e outros.

---

## 🖥️ Ambiente

- **Sistema Operacional:** Windows 11
- **Idioma de Resposta:** Português (pt-BR)
- **Modelo de IA:** Sempre informe qual modelo está sendo usado

---

## ⚠️ REGRA MÁXIMA DE ALTERAÇÃO

**❌ NUNCA altere código que não foi explicitamente solicitado.**

### Obrigatório:
- ✅ Edite APENAS o que for claramente pedido
- ✅ Pergunte antes se houver qualquer dúvida sobre escopo
- ✅ Mantenha todo o resto do código intacto
- ❌ NÃO reescreva funções ou arquivos inteiros sem solicitação
- ❌ NÃO refatore, otimize ou "melhore" código por conta própria
- ❌ NÃO sugira alterações automáticas não solicitadas

---

## 🔒 Execução de Comandos

- ❌ **NUNCA** execute comandos em terminal sem autorização explícita
- Isso inclui: instalações, scripts, migrações de banco, automações
- ✅ Sempre pergunte antes de executar qualquer comando

---

## 🧠 Prompt Agents (Trae - Smart Agents)

Estes são templates de prompt criados para uso inicial com agentes inteligentes (ex.: Trae Smart Agents). Eles servem como *pontos de partida* — foram pensados para automatizar tarefas repetitivas (planejamento, geração de patches, criação de CI e auditoria de privacidade) de forma segura e auditável. O uso real ainda precisa ser validado em fluxo de trabalho (modo assistido → revisão humana → aplicação).

Arquivos gerados neste repositório:
- `agents/planejador.prompt.md` — Planejador: gera planos técnicos, passos e checkpoints antes de qualquer alteração.
- `agents/implementador.prompt.md` — Implementador de Patches: gera unified diffs e instruções de validação (NUNCA aplica sem confirmação).
- `agents/ci-builder.prompt.md` — CI Builder: propõe workflows para GitHub Actions (pytest, flake8, mypy) e comandos locais para teste.
- `agents/security.prompt.md` — Security/Privacy Auditor: encontra logs e problemas de exposição de dados e propõe patches mitigatórios.

Por que foram criados:
- Padronizar saídas (planos, diffs, workflows) para facilitar revisão humana.
- Evitar trabalho manual repetitivo (contagens, varreduras, geração de arquivos de CI).
- Fornecer agentes especializados que colaboram com um agente genérico (ex.: `Planejador` define o plano; `Implementador` gera o patch).

Importante — validação e segurança:
- Comece em modo *assistido*: o agente propõe plano/patch e aguarda confirmação humana.
- Nunca habilite modo autônomo em repositórios sensíveis sem auditoria e testes automatizados.
- Este repositório NÃO implementou ainda Model Context Protocols (MCPs) automáticos; recomendamos documentar como o agente deve carregar contexto (arquivos/paths) e versionar prompts.


## 📁 Convenções de Arquivos

### Nomenclatura
- ✅ Use prefixos numéricos para ordenação: `001_criar_tabelas.sql`
- ❌ NUNCA use sufixos como `_fix`, `_v2`, `_novo`, `_final`
- ✅ Corrija o arquivo original até que funcione

### Documentação (padrão recomendado)
- **Raiz (padrão GitHub)**: manter arquivos canônicos em UPPERCASE/nomes tradicionais:
  - `README.md`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `PRIVACY.md`
- **`docs/` (URLs amigáveis)**: novos arquivos em `lowercase-kebab-case.md`:
  - Ex.: `architecture.md`, `security-audit-logs.md`, `windows-python-setup.md`
- **Importante**: não renomeie docs existentes só por estética (evita quebrar links); aplique o padrão em **novos** documentos.

### Organização
```
public/
├── assets/         # JS runtime, imagens, ícones
├── styles/         # CSS
└── *.html          # Páginas
src/
└── js/             # Fontes JavaScript
scripts/            # Build, lint e testes
tests/              # Testes (node)
docs/               # Documentação
```

---

## 🛠️ Comandos do Projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar testes
npm test

# Lint
npm run lint
```

---

## 📐 Padrões de Código

### JavaScript (Vanilla)
- Manter código modular em `src/js/` e `src/js/modules/`
- Evitar dependências de framework no frontend

### HTML
- Manter atributos de acessibilidade já existentes (`aria-*`)

### CSS
- Seguir o padrão de variáveis de tema (claro/escuro) existente
- Preferir mudanças localizadas em `public/styles/`

---

## 🧪 Testes

- Rodar testes antes de cada commit
- Cobertura mínima: 80%
- Nomear testes descritivamente

```bash
# Rodar todos os testes
npm test

# Rodar suites específicas
npm run test:unit
npm run test:theme
npm run test:components
```

---

## 📝 Commits e Versionamento

### Formato de Commits (Conventional Commits)
```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: Nova funcionalidade (MINOR)
- `fix`: Correção de bug (PATCH)
- `docs`: Documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `test`: Adicionar/corrigir testes
- `chore`: Manutenção
- `perf`: Performance
- `ci`: CI/CD
- `build`: Sistema de build
- `revert`: Reverter commit

**Breaking Changes:** Adicione `!` ou `BREAKING CHANGE:` no footer (MAJOR)

**Exemplos:**
```
feat(auth): adicionar login com Google
fix(api): corrigir timeout em requisições
docs: atualizar README com instruções de deploy
feat!: remover suporte para Node 14
```

### Versionamento Semântico (SemVer)

**Formato:** `MAJOR.MINOR.PATCH` (ex: `1.4.2`)

- **MAJOR** (1.x.x): Mudanças incompatíveis (breaking changes)
- **MINOR** (x.1.x): Novas funcionalidades compatíveis
- **PATCH** (x.x.1): Correções de bugs

**Regras:**
- Versão inicial de desenvolvimento: `0.x.x`
- Primeira versão estável: `1.0.0`
- Bug fix: incrementa PATCH (`1.0.0` → `1.0.1`)
- Nova feature: incrementa MINOR (`1.0.1` → `1.1.0`)
- Breaking change: incrementa MAJOR (`1.1.0` → `2.0.0`)

### CHANGELOG.md

Mantenha um CHANGELOG seguindo [Keep a Changelog](https://keepachangelog.com/pt-BR/):

```markdown
# Changelog

Todas as mudanças notáveis serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- Nova funcionalidade X

### Changed
- Alteração na funcionalidade Y

### Fixed
- Correção do bug Z

## [1.1.0] - 2026-01-06

### Added
- Login com OAuth2
- Suporte para dark mode

### Fixed
- Correção de memory leak no componente X

## [1.0.0] - 2025-12-15

### Added
- Versão inicial do projeto
```

**Categorias:**
- `Added`: Novas funcionalidades
- `Changed`: Mudanças em funcionalidades existentes
- `Deprecated`: Funcionalidades que serão removidas
- `Removed`: Funcionalidades removidas
- `Fixed`: Correções de bugs
- `Security`: Correções de segurança

---

## 🔍 Debugging

1. Verifique o console do navegador
2. Verifique os logs do servidor
3. Use breakpoints no VS Code
4. Verifique o estado com React DevTools

---

## 📚 Documentação Adicional

Para regras específicas, consulte:

- **React:** `@rules/tecnologias/react.md`
- **Next.js:** `@rules/tecnologias/nextjs.md`
- **TypeScript:** `@rules/tecnologias/typescript.md`
- **Tailwind:** `@rules/tecnologias/tailwind.md`
- **SQL:** `@rules/tecnologias/sql.md`

Para modos de trabalho:

- **Arquitetura:** `@rules/modos/modo-arquiteto.md`
- **Planejamento:** `@rules/modos/modo-planejador.md`
- **Depuração:** `@rules/modos/modo-depurador.md`
- **Frontend/UI:** `@rules/modos/modo-frontend.md`
- **API:** `@rules/modos/modo-api.md`
- **Performance:** `@rules/modos/modo-performance.md`

Para guias complementares:

- **Engenharia de Software:** `@rules/guias/guia-engenharia-software.md`
- **Qualidade de Código:** `@rules/guias/guia-qualidade-codigo.md`
- **UI/UX:** `@rules/guias/guia-ui-ux.md`

---

## ⚡ Quick Reference

| Ação | Comando |
|------|---------|
| Iniciar dev | `npm run dev` |
| Build | `npm run build` |
| Testar | `npm test` |
| Lint | `npm run lint` |

---

*Última atualização: Janeiro 2026*
