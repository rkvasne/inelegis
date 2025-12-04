# 📜 Scripts do Projeto

Este diretório contém utilitários para desenvolvimento, validação, build e manutenção.

## Principais Scripts

- `build.js` — Cria a build de produção em `dist/`.
- `serve.js` — Servidor local com live reload.
- `lint.js` — Verificações de qualidade (HTML/CSS/JS/estrutura/performance).
- `test.js` — Testes integrados do projeto.
- `validate-theme.js` — Validação avançada de temas CSS.
- `extrair_normalizado_xml.js` — Gera `public/assets/js/normalizado.data.js` a partir do XML oficial.
- `verify-data.js` — Verifica consistência dos dados normalizados.
- `backup-data.js` — Backup/restore de `normalizado.data.js`.
- `validate-html-links.js` — Valida links internos de todos os HTML em `public/`.
- `migrate.js`/`rollback.js` — Migrações e reversões pontuais.
- `optimize.js` — Otimizações pós-build.
- `sync-js.js` — Sincroniza `src/js` → `public/assets/js` quando aplicável.

## Como Usar

```bash
node scripts/validate-html-links.js
npx html-validate public
node scripts/extrair_normalizado_xml.js
```

Todos os scripts assumem Windows 11 como ambiente padrão.

