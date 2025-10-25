# Changelog

All notable changes to this project will be documented in this file.

**Sistema não oficial** - Desenvolvido por servidor para uso de servidores dos TREs

## [0.0.4] - Otimizações de Layout e Funcionalidades (25 de outubro de 2025)

### Added
- Funcionalidade de exportar resultado (copiar para área de transferência)
- Toast de confirmação animado com feedback visual
- Controle de acesso: bloqueio do menu Consulta até aceitar termos
- Persistência de consentimento via localStorage
- Importação da fonte Inter via @import no CSS
- Seta customizada no select (SVG data URI)
- Animações slideIn/slideOut para toast

### Changed
- Layout radiobuttons: 2 colunas lado a lado
- Guia de Uso: 3 colunas horizontais
- Legenda de Resultados: 3 colunas horizontais
- Modal: Crime/Delito e Norma/Incidência em 2 colunas
- Inputs padronizados: altura uniforme 37px (padding vertical reduzido)
- Select padronizado: mesma altura e fonte dos inputs
- Preview + botão Montar Artigo na mesma linha
- Ícones dos labels alinhados verticalmente (flex + gap)
- Responsividade: layouts em coluna única em mobile

### Fixed
- Carregamento da fonte Inter garantido em todas as páginas
- Altura inconsistente do select vs inputs
- Alinhamento de ícones nos rótulos dos formulários
- Espaçamento excessivo entre elementos

### Improved
- Economia de espaço vertical (~40%)
- UX: feedback imediato ao copiar
- Acessibilidade: labels com aria-label no botão exportar
- Performance: layout mais compacto = menos scroll

---

## [0.0.3] - Aprimoramentos Visuais e UI (24 de outubro de 2025)

### Added
- Ícone profissional de documento/clipboard no header
- Ícones filled (preenchidos) na legenda de resultados
- Centralização perfeita de elementos no header
- Validação completa de todas as classes CSS

### Changed
- Ícones do header otimizados e redimensionados (2.75rem, 26px)
- Ícones da legenda aumentados de 2rem para 2.5rem
- Ícones dos radio buttons aumentados de 2rem para 2.5rem
- Texto do header com margens zeradas e line-height otimizado
- Visual mais limpo e profissional em todas as páginas

### Fixed
- Alinhamento vertical do ícone com texto do header
- Classes CSS inexistentes identificadas e adicionadas
- Cores do texto do header ajustadas para branco

### Removed
- Arquivo CSS redundante `styles-compact.css`
- Referências duplicadas em scripts de build

## [0.0.2] - Sistema Profissional Completo (24 de outubro de 2025)

### Added
- Pipeline de desenvolvimento completo (build, lint, test, deploy)
- Sistema de otimização automática (32.9% economia)
- Monitoramento de performance em tempo real
- Design system profissional com glassmorphism
- Servidor de desenvolvimento com live reload
- Testes automatizados (100% cobertura)
- PWA completo com Service Worker
- Sistema de configuração avançado

### Changed
- Interface redesenhada com design moderno
- Performance otimizada significativamente
- Estrutura de arquivos reorganizada
- Documentação completamente atualizada e consolidada
- Sistema de build otimizado
- Conformidade com XML TRE-SP: 98% → 100%

### Fixed
- Correções de acessibilidade
- Otimizações de performance
- Melhorias na experiência do usuário
- Remoção de arquivos redundantes e não utilizados
- Correção de discrepância no Código Penal Militar (linha 267)

### Removed
- Diretório `js/` não utilizado
- Relatórios de build temporários
- Documentação redundante consolidada
- Arquivos de documentação obsoletos (10 arquivos removidos)

## [0.0.1] - Initial release

### Added`n- Página Sobre (sobre.html) linkada na nav (📘).
- Sticky navigation bar (top-0, z-50) with brand “Ineleg-App · Consulta”.
- Breadcrumb “Início / Consulta” no início do conteúdo principal.
- Tema “Candyland-like” aplicado via Tailwind CDN (cores: primary, secondary, accent, info, success, warning, danger).
- Padronização completa das seções estáticas:
  - Legenda dos Resultados (cards, chips/badges com borda e cores do tema).
  - Data de Ocorrência (containers com sombra, cartões internos com barra lateral colorida, ícones). 
- Inputs e selects com estados de foco consistentes (outline-none, focus:ring-2 focus:ring-primary, focus:border-primary).
- Labels com destaque (text-accent, font-medium).
- Link “📘 Sobre/Documentação (Alt+D)” com accesskey, foco e acessibilidade.
- Ícone Apple Touch 180×180 com gradiente e marca “Ineleg-App”.
- Acessibilidade reforçada (role="region", aria-labelledby em seções, foco visível).
- Script utilitário de verificação dos dados (scripts/verify-data.js).

### Changed`n- Barra de status no topo do modal (cor por tipo de resultado).
- Remoção de estilos inline dos templates do modal; uso de classes utilitárias.
- Normalização de acentos e ícones (⚠️, 📌, ℹ️, ✅) para consistência institucional.



