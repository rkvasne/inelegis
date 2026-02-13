# 🛰️ Supabase Structure (Hub Bridge)

Este diretório contém os resultados da extração da estrutura do banco de dados (metadados).

## 🎯 Padrão Ponteiro (Zero Duplicação)

Seguindo os princípios do **Solo Dev Hub**, este projeto não duplica os scripts de extração. O Inelegis consome a lógica centralizada no Hub através de um **Adaptador de Satélite**.

- **Lógica Centralizada:** `.agent/hub/system/supabase-structure/`
- **Adaptador Local:** `supabase/structure/adapter.js`

## 🛠️ Como usar

Os comandos de extração estão mapeados no `package.json` da raiz:

```bash
# Extrair estrutura completa
npm run db:extract:all

# Diagnóstico rápido de saúde do banco
npm run db:extract:diag

# Extrair apenas tabelas e colunas
npm run db:extract:tables
```

## ⚙️ Evolução do Adapter (Bridge v2)

O `adapter.js` foi simplificado para usar o padrão nativo do Hub:

- Executa os scripts centralizados via `.agent/hub/system/supabase-structure/*`.
- Define `--outDir supabase/structure` para gravação local dos `.json`.
- Injeta variáveis de `.env.local`/`.env` do satélite no processo filho para reforçar isolamento de contexto.
- Removeu a lógica antiga de mover arquivos após execução.

## 📂 Resultados

Os arquivos `.json` gerados são salvos diretamente nesta pasta (`supabase/structure/`). Eles servem como documentação técnica da versão atual do seu banco no Supabase.

---

_A lógica destes scripts é mantida no Hub Central para garantir que todos os projetos satélites usem as mesmas ferramentas e padrões de auditoria._

---

_Última atualização: 13/02/2026 • v0.3.11 (Hub v0.5.5)_
_Editado via: Cursor | Modelo: gpt-5.3-codex | OS: Windows 11_
