# Changelog

**Última atualização:** 01 de dezembro de 2025
**Versão atual:** 0.0.7

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.0.7] - 2025-12-01

### 📚 Documentation
- Consolidação completa da documentação (11 documentos redundantes removidos)
- Documentos históricos marcados com notas explicativas (REFACTORING-PLAN.md, IMPLEMENTATION-GUIDE.md)
- Changelog de documentação criado (CHANGELOG-DOCS.md)
- Setup Redis consolidado em guia único (SETUP-REDIS.md)
- Variáveis de ambiente atualizadas para usar REDIS_URL

### 🛠 Changed
- Código adaptado para usar REDIS_URL ao invés de KV_REST_API_URL
- Documentação do INDEX.md reorganizada e atualizada
- README.md atualizado com novidades da v0.0.7

### 🗑 Removed
- 12 documentos e 5 arquivos de código morto removidos em três limpezas:
  - Primeira limpeza: 9 docs redundantes/obsoletos
  - Segunda limpeza: 2 docs redundantes (ANALISE-DOCUMENTACAO.md, ATUALIZACAO-DOCS-HISTORICOS.md)
  - Terceira limpeza: 1 doc + 5 arquivos de componentes não utilizados (pasta components/ removida)

---

## [0.0.6] - 2025-12-01

### ✨ Added
- 6 módulos JavaScript para segurança e performance (sanitizer, storage, formatters, exceptions, modal-manager, search-index)
- 20 testes unitários automatizados (formatters e exceptions)
- Scripts de migração e rollback automatizados
- Content Security Policy (CSP) implementado
- Sistema de cache e índices para busca otimizada

### 🛠 Changed
- Código refatorado e modularizado (redução de 15% para <5% de duplicação)
- Performance de busca melhorada em 90% (de ~50ms para ~5ms)
- localStorage agora com validação e expiração automática
- Gestão de modal centralizada e segura

### 🐛 Fixed
- Vulnerabilidades XSS corrigidas (sanitização de HTML)
- Problema onde estilos CSS eram perdidos ao navegar entre páginas
- Service Worker atualizado para assumir controle imediato
- Versões sincronizadas em todos os arquivos
- Funções duplicadas removidas
- Tratamento de erros padronizado

### 🔒 Security
- Implementação de CSP headers
- Sanitização de todas as inserções de HTML
- Validação de localStorage com timestamp e expiração
- Remoção de código inseguro (innerHTML direto)

## [0.0.5] - 2025-11-30

### 🛠 Changed
- **Renomeação:** Projeto renomeado de "Ineleg-App" para "Inelegis".
- **PWA:** Removida funcionalidade de instalação (manifest.json) para focar em site responsivo.
- **Service Worker:** Reescrito para focar apenas em cache de performance, sem lógica de instalação.
- **Docs:** Documentação atualizada para refletir a nova identidade.

## [0.0.4] - 2025-10-25

### ✨ Added
- Funcionalidade de exportar resultado (copiar para área de transferência).
- Toast de confirmação animado com feedback visual.
- Controle de acesso: bloqueio do menu Consulta até aceitar termos.
- Persistência de consentimento via `localStorage`.
- Importação da fonte Inter via `@import` no CSS.
- Seta customizada no select (SVG data URI).
- Animações `slideIn`/`slideOut` para toast.

### 🛠 Changed
- Layout radiobuttons: 2 colunas lado a lado.
- Guia de Uso: 3 colunas horizontais.
- Legenda de Resultados: 3 colunas horizontais.
- Modal: Crime/Delito e Norma/Incidência em 2 colunas.
- Inputs padronizados: altura uniforme 37px.
- Select padronizado: mesma altura e fonte dos inputs.
- Preview + botão Montar Artigo na mesma linha.
- Responsividade: layouts em coluna única em mobile.

### 🐛 Fixed
- Carregamento da fonte Inter garantido em todas as páginas.
- Altura inconsistente do select vs inputs.
- Alinhamento de ícones nos rótulos dos formulários.
- Espaçamento excessivo entre elementos.

## [0.0.3] - 2025-10-24

### ✨ Added
- Ícone profissional de documento/clipboard no header.
- Ícones filled (preenchidos) na legenda de resultados.
- Centralização perfeita de elementos no header.
- Validação completa de todas as classes CSS.

### 🛠 Changed
- Ícones do header otimizados e redimensionados (2.75rem).
- Ícones da legenda aumentados para 2.5rem.
- Visual mais limpo e profissional em todas as páginas.

### 🐛 Fixed
- Alinhamento vertical do ícone com texto do header.
- Classes CSS inexistentes identificadas e adicionadas.
- Cores do texto do header ajustadas para branco.

### 🗑 Removed
- Arquivo CSS redundante `styles-compact.css`.
- Referências duplicadas em scripts de build.

## [0.0.2] - 2025-10-24

### ✨ Added
- Pipeline de desenvolvimento completo (build, lint, test, deploy).
- Sistema de otimização automática (32.9% economia).
- Monitoramento de performance em tempo real.
- Design system profissional com glassmorphism.
- Servidor de desenvolvimento com live reload.
- Testes automatizados (100% cobertura).
- PWA completo com Service Worker.

### 🛠 Changed
- Interface redesenhada com design moderno.
- Performance otimizada significativamente.
- Estrutura de arquivos reorganizada.
- Documentação completamente atualizada e consolidada.
- Conformidade com XML TRE-SP: 100%.

### 🗑 Removed
- Diretório `js/` não utilizado.
- Relatórios de build temporários.
- Arquivos de documentação obsoletos.

## [0.0.1] - 2025-10-20

### ✨ Added
- Lançamento inicial do projeto.
- Página Sobre (`sobre.html`) linkada na navegação.
- Sticky navigation bar.
- Breadcrumb "Início / Consulta".
- Tema visual inicial com cores institucionais.
- Padronização das seções estáticas (Legenda, Data de Ocorrência).
- Inputs e selects com estados de foco consistentes.
- Script utilitário de verificação dos dados.

---

[0.0.6]: https://github.com/rkvasne/inelegis-app/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/rkvasne/inelegis-app/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/rkvasne/inelegis-app/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/rkvasne/inelegis-app/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/rkvasne/inelegis-app/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/rkvasne/inelegis-app/releases/tag/v0.0.1
