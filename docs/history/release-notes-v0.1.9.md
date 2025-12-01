---
docStatus: historical
docScope: release-notes
lastReviewed: 2026-01-10
---
# Release Notes v0.1.9

Data: 05 de dezembro de 2025  
Versão: 0.1.9  
Status: estável

## Novidades
- Histórico de Consultas reformulado com `features-grid`, cards compactos e estatísticas em 3 colunas.
- Página FAQ corrigida e estilizada (hero, busca, categorias, acordeões) com ajustes finos na posição da busca.
- Página Inicial com indicador de consentimento restaurado (mãozinha) e melhor alinhamento do conjunto com checkbox e texto.

## Correções
- Ajustes de contraste, sombras e espaçamentos em cards no tema claro.
- Padronização dos botões do modal (tamanho e hover com `bg-tertiary`).
- Remoção de mocks locais e obrigatoriedade de `REDIS_URL` para ambiente dev.

## Segurança & Acesso
- Remoção do bloqueio de consentimento nas páginas públicas `sobre` e `faq`. Bloqueio mantido apenas em `consulta`.
- Indicador visual e acessibilidade melhorados para estados de desabilitado.

## Migração
- Configurar `REDIS_URL` em desenvolvimento para paridade com produção.
- Verificar `localStorage` chave `ineleg_termos_aceitos` para experiência de acesso.

## Referências
- Changelog: `../CHANGELOG.md`
- FAQ: `../../public/faq.html`
- Página Inicial: `../../public/index.html`
