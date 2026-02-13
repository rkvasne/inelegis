# 🔐 Política de Segurança - Inelegis

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md)

---

Este documento é a fonte única de verdade (SSOT) para políticas e práticas de segurança do INELEGIS.

---

## 🧭 Mapa de Uso Rápido

- Definir regras de acesso
  - Quando: ao criar ou revisar controles de acesso nos endpoints `/api/*` e no dashboard.
  - Ação: consultar Controles de Acesso e Supabase (RLS), APIs e CORS para ajustar validações e restrições.
- Configurar segredos e variáveis
  - Quando: ao adicionar, rotacionar ou revisar chaves de API, tokens e variáveis de deploy.
  - Ação: usar Gestão de Segredos para garantir que nenhum segredo (especialmente `SERVICE_ROLE_KEY`) seja exposto no código-fonte ou no cliente.
- Implementar logging/auditoria
  - Quando: ao registrar eventos técnicos sensíveis ou implementar novas trilhas de auditoria.
  - Ação: seguir Logs e Auditoria para registrar apenas o mínimo necessário, sem PII e sem segredos.
- Responder a incidentes
  - Quando: diante de incidentes de segurança ou suspeitas de violação.
  - Ação: usar Incidentes e Resposta para aplicar o fluxo de contenção, recuperação e aprendizado documentado.
- Revisar segurança periodicamente
  - Quando: em revisões regulares de segurança e ao alterar analytics, histórico, cookies ou storage.
  - Ação: consultar Revisão e Governança e alinhar com a Política de Privacidade.

---

## 1) Reporte de vulnerabilidades

Se você encontrar um problema de segurança:

- Não exponha dados pessoais nem segredos (tokens/chaves) em issues, logs ou screenshots.
- Não abra issue pública para temas de segurança.
- Descreva:
  - Passos para reproduzir
  - Impacto observado/esperado
  - Versão/commit afetado
  - Ambiente (local/staging/produção) e navegador/OS quando aplicável

Canal privado (GitHub Security Advisories):

- https://github.com/rkvasne/inelegis/security/advisories/new

---

## 2) Escopo

- Aplicação: páginas estáticas (`public/*.html`) + CSS (`public/styles/*`) + JavaScript (runtime em `public/assets/js/**`)
- APIs: funções serverless em `api/*` (analytics, dashboard, search-history)
- Banco: Supabase (PostgreSQL) com RLS ativado
- Deploy: Vercel

---

## 3) Princípios

- Menor privilégio por padrão (RLS)
- Segregação de funções e ambientes
- Evitar dados pessoais e reduzir dados ao mínimo necessário
- Segredos fora do código-fonte (variáveis de ambiente)
- Hardening contínuo e revisão periódica

---

## 4) Controles de Acesso

- Endpoints públicos (ex.: analytics e histórico) devem validar origem (CORS) e validar payload.
- Dashboard é protegido por token (não expor token no cliente).
- Evitar expor dados sensíveis no frontend; validar regras de autorização no servidor (RLS/JWT).

---

## 5) Supabase, APIs e CORS

- Restringir origens em endpoints `api/*` ao domínio de produção e aos hosts locais necessários.
- Negar por padrão origens desconhecidas.
- Validar campos obrigatórios e tamanho/forma do payload antes de persistir no banco.
- Revisar Row Level Security (RLS) policies regularmente.
- Nunca expor `SUPABASE_SERVICE_ROLE_KEY` no frontend. Apenas `ANON_KEY` é pública.

---

## 6) Gestão de Segredos

- Nunca commitar segredos.
- Usar `.env` por ambiente e variáveis do ambiente na Vercel (produção/staging).
- Rotacionar segredos de forma planejada; documentar impacto e plano de rollback.

---

## 7) Logs e Auditoria

- Evitar logs com dados pessoais, segredos e payloads completos.
- Em caso de erros, preferir mensagens resumidas e sem PII.
- Para métricas e auditoria, registrar apenas o mínimo necessário (tipo de evento, timestamp e contexto técnico).

---

## 8) Comunicação Segura

- HTTPS obrigatório em todos os ambientes.
- Aplicar headers/controles de segurança (ex.: CSP) onde configurado.
- Proteger contra XSS evitando `innerHTML` e utilizando inserção segura no DOM.

---

## 9) Checklist Rápido

- [ ] Segredos apenas em variáveis de ambiente
- [ ] CORS restrito e testado nos endpoints `api/*`
- [ ] Payloads validados antes de persistir no banco
- [ ] RLS Policies configuradas e testadas
- [ ] Dashboard/rotas admin protegidos por token e sem exposição no cliente
- [ ] Sem `innerHTML` direto; inserção segura de HTML
- [ ] HTTPS e headers de segurança aplicados
- [ ] Logs sem PII e sem segredos
- [ ] Revisão de privacidade ao tocar em cookies/storage/analytics

---

## 10) Referências Internas

- Política de Privacidade: `PRIVACY.md`
- Código de Conduta: `CODE_OF_CONDUCT.md`
- Guia para agentes: `AGENTS.md`
- Índice de documentação: `docs/README.md`
- Variáveis de ambiente: `docs/guides/variaveis-ambiente.md`
- Supabase Setup: `docs/guides/setup-supabase.md`
- Analytics: `docs/operations/analytics.md`
- Proteção contra corrupção de código: `docs/operations/protection.md`

---

## 11) Incidentes e Resposta

- Definir responsáveis, SLA e fluxo de comunicação.
- Conter, erradicar, recuperar e aprender (post-mortem com ações preventivas).

---

## 12) Revisão e Governança

- Alterações relevantes devem ser aprovadas por engenharia.

---

_Última atualização: 12/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
