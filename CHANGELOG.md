# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.0.6] - 2025-11-30

### Fixed
- Problema onde estilos CSS eram perdidos ao navegar entre páginas (cache issue).
- Service Worker atualizado para assumir controle imediato (`skipWaiting`, `clients.claim`).
- Estratégia de cache aprimorada para garantir carregamento de assets críticos.

## [0.0.5] - 2025-11-30

### Changed
- **Renomeação:** Projeto renomeado de "Ineleg-App" para "Inelegis".
- **PWA:** Removida funcionalidade de instalação (manifest.json) para focar em site responsivo.
- **Service Worker:** Reescrito para focar apenas em cache de performance, sem lógica de instalação.
- **Docs:** Documentação atualizada para refletir a nova identidade.

## [0.0.4] - 2025-10-25

### Added
- Funcionalidade de exportar resultado (copiar para área de transferência).
- Toast de confirmação animado com feedback visual.
- Controle de acesso: bloqueio do menu Consulta até aceitar termos.
- Persistência de consentimento via `localStorage`.
- Importação da fonte Inter via `@import` no CSS.
- Seta customizada no select (SVG data URI).
- Animações `slideIn`/`slideOut` para toast.

### Changed
- Layout radiobuttons: 2 colunas lado a lado.
- Guia de Uso: 3 colunas horizontais.
- Legenda de Resultados: 3 colunas horizontais.
- Modal: Crime/Delito e Norma/Incidência em 2 colunas.
- Inputs padronizados: altura uniforme 37px.
- Select padronizado: mesma altura e fonte dos inputs.
- Preview + botão Montar Artigo na mesma linha.
- Responsividade: layouts em coluna única em mobile.

### Fixed
- Carregamento da fonte Inter garantido em todas as páginas.
- Altura inconsistente do select vs inputs.
- Alinhamento de ícones nos rótulos dos formulários.
- Espaçamento excessivo entre elementos.

## [0.0.3] - 2025-10-24

### Added
- Ícone profissional de documento/clipboard no header.
- Ícones filled (preenchidos) na legenda de resultados.
- Centralização perfeita de elementos no header.
- Validação completa de todas as classes CSS.

### Changed
- Ícones do header otimizados e redimensionados (2.75rem).
- Ícones da legenda aumentados para 2.5rem.
- Visual mais limpo e profissional em todas as páginas.

### Fixed
- Alinhamento vertical do ícone com texto do header.
- Classes CSS inexistentes identificadas e adicionadas.
- Cores do texto do header ajustadas para branco.

### Removed
- Arquivo CSS redundante `styles-compact.css`.
- Referências duplicadas em scripts de build.

## [0.0.2] - 2025-10-24

### Added
- Pipeline de desenvolvimento completo (build, lint, test, deploy).
- Sistema de otimização automática (32.9% economia).
- Monitoramento de performance em tempo real.
- Design system profissional com glassmorphism.
- Servidor de desenvolvimento com live reload.
- Testes automatizados (100% cobertura).
- PWA completo com Service Worker.

### Changed
- Interface redesenhada com design moderno.
- Performance otimizada significativamente.
- Estrutura de arquivos reorganizada.
- Documentação completamente atualizada e consolidada.
- Conformidade com XML TRE-SP: 100%.

### Removed
- Diretório `js/` não utilizado.
- Relatórios de build temporários.
- Arquivos de documentação obsoletos.

## [0.0.1] - 2025-10-20

### Added
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
