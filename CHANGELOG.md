# Changelog

**Última atualização:** 02 de dezembro de 2025
**Versão atual:** 0.0.9

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.0.9] - 2025-12-02

### 🛠 Changed
- Reorganização completa da pasta `docs/` em domínios (`design/`, `guides/`, `operations/`, `history/`).
- README principal, `docs/README.md`, scripts utilitários e `.env.example` apontam para os novos caminhos.
- Badge de versão, `package.json` e módulos JavaScript sincronizados para 0.0.9.

### 📚 Documentation
- `history/RELEASE-NOTES-v0.0.9.md` criado com os destaques da reorganização.
- `history/refatoracao-v0.0.6.md` passa a centralizar plano, execução e lições aprendidas.
- `CHANGELOG-DOCS.md`, `SUMMARY.md` e guias operacionais atualizados com a nova estrutura.

---

## [0.0.8] - 2025-12-02

### ✨ Added
- 🖼️ **Favicon e Logo**: Implementação completa de identidade visual
  - Favicon.ico adicionado em todos os HTMLs
  - Logo.png integrado no header do sistema
  - Consistência visual em todas as páginas
- 🎨 **Theme Validator Pro v3.1.0**: Script de validação de temas completamente reescrito
  - Detecção de 19+ categorias de problemas de tema
  - Suporte a múltiplos frameworks (Tailwind, Material, Bootstrap, Chakra, Radix, etc.)
  - Lista completa de 147+ cores CSS nomeadas
  - Verificação de variáveis não-semânticas de design systems
  - Detecção de CSS-in-JS, estilos inline JS, Canvas colors
  - Saída em JSON para integração com CI/CD
  - Opções avançadas: --fix, --strict, --json, --only, --ignore
  - Sugestões de correção automática para cada problema
  - Relatório detalhado com estatísticas por categoria e arquivo
- **Novas verificações avançadas (v3.1.0):**
  - Componentes críticos sem variáveis de tema (header, footer, nav)
  - Gradientes não adaptáveis ao tema escuro
  - Problemas de contraste em estados ativos/hover
  - Variáveis de tema definidas mas não utilizadas

### 🛠 Changed
- Script validate-theme.js expandido de ~500 para ~900 linhas
- Configuração modular e extensível via arquivo JSON
- Melhor detecção de contextos onde cores hardcoded são aceitáveis
- Padronizados footers em todas as páginas para usar componente reutilizável
- Removidos footers hardcoded duplicados de sobre.html, landing.html e consulta.html
- **Footer simplificado e compacto:**
  - Layout horizontal em uma única linha
  - Apenas links essenciais (Sobre, FAQ, Changelog, GitHub)
  - Versão exibida como badge
  - Melhor uso do espaço vertical
- **Padronização completa de design:**
  - Header agora usa variáveis --header-bg e --header-text (adapta ao tema)
  - Footer usa --footer-bg e --footer-text (melhor contraste)
  - Nav-link ativo usa --nav-active-bg e --nav-active-text (contraste corrigido no dark)
  - Adicionadas animações globais padronizadas (fadeIn, slideIn, scaleIn, scroll-animate)
  - Classes de hover effects (hover-lift, hover-scale, hover-glow)

### 🐛 Fixed
- Corrigidas 109 cores hardcoded em styles.css, script.js, landing.html e outros arquivos
- Corrigida cor RGB em hover-glow (agora usa var(--primary-500))
- Corrigida opacidade hardcoded em footer-link (agora usa var(--opacity-muted))
- Adicionados comentários em variáveis reservadas para uso futuro
- Substituídas cores nomeadas (white) por variáveis semânticas (--text-on-primary)
- Substituídas cores rgba() por variáveis (--glass-bg, --glass-border, --glass-text)
- Substituídas variáveis --neutral-* por variáveis semânticas (--text-muted, --border-muted, etc.)
- Adicionadas novas variáveis CSS:
  - Cores: --text-on-primary, --text-on-dark, --text-muted, --bg-muted
  - Bordas: --border-muted, --border-light
  - Glass: --glass-bg, --glass-bg-light, --glass-bg-subtle, --glass-border, --glass-text
  - Overlay: --overlay-bg
  - Z-index: --z-dropdown, --z-modal, --z-modal-backdrop, --z-tooltip, --z-toast, etc.
  - Opacidade: --opacity-disabled, --opacity-muted, --opacity-subtle, --opacity-hover, --opacity-overlay
- Adicionado suporte a @media (prefers-color-scheme: dark) para dark mode automático
- Corrigido gradiente em .faq-hero para usar var(--bg-primary)
- Corrigido toast em script.js para usar variáveis CSS
- Corrigidos z-index hardcoded para usar variáveis (--z-modal, --z-modal-backdrop)

---

## [0.0.7] - 2025-12-01

### ✨ Added
- 🌙 **Tema Escuro Completo**: Sistema de temas com alternância automática e persistência
- 🧩 **Sistema de Componentes Reutilizáveis**: Header, Nav, Footer e componentes modulares
- 📊 **Histórico de Consultas**: Rastreamento com estatísticas, exportação e detecção de duplicatas
- 🎨 **Variáveis CSS Semânticas**: Sistema de cores adaptável para temas claro e escuro
- 🔄 **Sincronização de Tema**: Preferência compartilhada entre todas as páginas

### 🛠 Changed
- Código adaptado para usar REDIS_URL ao invés de KV_REST_API_URL
- Todas as páginas HTML migradas para usar componentes reutilizáveis
- Cores hardcoded substituídas por variáveis CSS semânticas
- Documentação do INDEX.md reorganizada e atualizada
- README.md atualizado com novidades da v0.0.7
- Versão atualizada para 0.0.7 em todos os componentes

### 🐛 Fixed
- Corrigido problema de registros duplicados no histórico
- Corrigido campo `artigoConsultado` undefined no histórico
- Removidos 7 warnings CSS de rulesets vazios
- Modal de histórico agora fecha ao clicar fora (overlay)

### 📚 Documentation
- Consolidação completa da documentação (11 documentos redundantes removidos)
- Documentos históricos marcados com notas explicativas
- Changelog de documentação criado (CHANGELOG-DOCS.md)
- Setup Redis consolidado em guia único (SETUP-REDIS.md)
- Manual ASE convertido para Markdown (manual-ase.md)
- Nomenclatura de arquivos padronizada (kebab-case)

### 🗑 Removed
- 14 documentos e 5 arquivos de código morto removidos
- Arquivo manual-ase.txt (migrado para .md)
- Cores hardcoded em CSS e HTML
  - Terceira limpeza: 1 doc + 5 arquivos de componentes não utilizados (pasta components/ removida)
  - Quarta limpeza: 2 arquivos legacy obsoletos (pasta docs/legacy/ removida)

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
