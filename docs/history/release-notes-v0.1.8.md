---
docStatus: historical
docScope: release-notes
lastReviewed: 2026-01-10
---
# Release Notes v0.1.8

Data: 03 de dezembro de 2025  
Versão: 0.1.8  
Status: estável

## Novidades
- Página **Histórico (Admin)** adicionada com cards compactos e estatísticas agregadas.
- Módulos utilitários consolidados em `public/assets/js/modules/`:
  - `storage.js`, `formatters.js`, `exceptions.js`, `modal-manager.js` e `components.js`.
- Versão de assets padronizada com query `?v=0.1.8` nas páginas públicas.
- Dev Server aprimorado com live reload e sincronização automática de assets JS.

## Correções
- Responsividade e acessibilidade em cabeçalho, botões e grids.
- Ajustes de favicon e ícones Apple Touch.
- Melhoria de contraste e sombras no tema claro.

## Segurança & Acesso
- Implementação inicial do guard de consentimento apenas na página `consulta`.
- Desativação visual de link de consulta quando termos não estão aceitos.

## Migração
- Verifique o carregamento de módulos em páginas públicas (`consulta`, `historico`, `faq`, `sobre`).
- Utilize o Dev Server para desenvolvimento com live reload.

## Referências
- Changelog: `../CHANGELOG.md`
- Histórico: `../../public/historico.html`
- Dev Server: `../../scripts/serve.js`
