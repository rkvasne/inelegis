# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - Initial release

### Added`n- Página Sobre (sobre.html) linkada na nav (📘).
- Sticky navigation bar (top-0, z-50) with brand “Ineleg-App · Justiça Eleitoral”.
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


