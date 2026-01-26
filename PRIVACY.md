# 🔎 Política de Privacidade - Inelegiss

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md)

---

Esta política descreve como dados podem ser processados ao usar o **Inelegis**, tanto no navegador quanto (quando habilitado) nas APIs do projeto.

---

## Escopo

Este documento cobre:
- O que o frontend armazena localmente (ex.: tema, aceite de termos)
- O que pode ser enviado às APIs do projeto (ex.: analytics e histórico de buscas)
- Como você pode exercer controle (ex.: limpeza de dados locais e cookies)

---

## Dados no navegador

### localStorage

O frontend usa `localStorage` para preferências e controles de acesso:
- `inelegis_theme`: tema selecionado (claro/escuro)
- `ineleg_termos_aceitos`: registro de aceite dos termos (gate de acesso)
- Chaves com prefixo `inelegis_`: armazenamento do app via `SecureStorage` (quando usado)

### Cookies

O projeto usa um cookie para identificar de forma pseudônima a sessão do usuário:
- `inelegis_uid` (max-age típico de 12 meses)

Esse identificador é utilizado pelo frontend para correlacionar eventos e para o histórico de buscas.

---

## Dados enviados para o servidor (quando habilitado)

Quando uma instância do Inelegis estiver configurada para aceitar requisições às rotas `/api/*`, o frontend pode enviar dados às seguintes APIs:

### Analytics (`POST /api/analytics`)

O frontend pode enviar eventos do tipo:
- `search`: lei, artigo, resultado, indicação de exceção e tempo de resposta
- `error`: mensagem, stack e contexto (lei/artigo quando disponível)
- `action`: nome da ação e campos adicionais

Além disso, o evento inclui informações do navegador:
- `userAgent`, `language`, `screenWidth`, `screenHeight`, `timezone`

### Histórico de buscas (`POST /api/search-history`)

O frontend pode sincronizar histórico de consultas com:
- lei, artigo, resultado e timestamp
- userId derivado de `inelegis_uid`

---

## Retenção

Os tempos abaixo refletem o comportamento padrão do código:
- Eventos de analytics no Redis: TTL de 90 dias (por evento)
- Histórico no Redis: TTL configurável por `REDIS_HISTORY_TTL` (padrão: 365 dias)
- Cookie `inelegis_uid`: max-age típico de 12 meses

---

## Seus controles

Você pode:
- Apagar `localStorage` do site para remover preferências e aceite de termos
- Apagar cookies do site para redefinir `inelegis_uid`
- Desabilitar analytics via console do navegador (quando disponível): `Analytics.disable()`

---

## Contato

Para dúvidas sobre privacidade e dados:
- Issues: https://github.com/rkvasne/inelegis/issues
- Segurança (canal privado): https://github.com/rkvasne/inelegis/security/advisories/new

