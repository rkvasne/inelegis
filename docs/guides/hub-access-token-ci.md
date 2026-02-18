# Configurar HUB_ACCESS_TOKEN para CI/CD (Satélites)

Como o repositório do Hub (`agents-rules`) é **privado**, o GitHub Actions do satélite precisa de um token para clonar o Hub em `.agent/hub/` durante o pipeline. Este guia resume o que está configurado no Inelegis e como replicar em outros satélites.

---

## O que está configurado neste repositório (Inelegis)

### 1. GitHub Actions (CI/CD)

- **Arquivo:** `.github/workflows/ci-cd.yml`
- **Uso do token:** Em dois jobs (`quality-gate` e `build-verification`), o step **Checkout Agents Hub** faz:
  - `actions/checkout@v4` do repositório `rkvasne/agents-rules`
  - `path: .agent/hub`
  - `token: ${{ secrets.HUB_ACCESS_TOKEN }}`
- Ou seja: o secret **HUB_ACCESS_TOKEN** precisa existir em **Settings > Secrets and variables > Actions** do repositório do satélite (ex.: `inelegis` / `inelegis-app`).

### 2. Variáveis de ambiente locais

- **`.env.example`:** Contém a chave `HUB_ACCESS_TOKEN=your-hub-token` na seção Governança (para documentar; não commitar valor real).
- **`.env.local`:** Cada dev pode definir `HUB_ACCESS_TOKEN` para scripts locais que usam o Hub (ex.: validadores que leem `.agent/hub/`).
- **`.vscode/settings.json`:** Lista `HUB_ACCESS_TOKEN` em `envFiles` para o debug usar `.env.local` sem expor o token no código.

### 3. Documentação

- **`docs/guides/variaveis-ambiente.md`:** Descreve `HUB_ACCESS_TOKEN` como PAT do GitHub com acesso ao repositório do Hub.

---

## O que está configurado no Hub (Agents)

- **Template de env:** `system/scaffolding/env/.env.example` inclui `HUB_ACCESS_TOKEN=your-hub-token` na camada “Governança e Ferramentas”.
- **Regra:** `system/scaffolding/env/README.md` e `docs/guides/guide-env-layers.md`: “HUB_ACCESS_TOKEN pode existir no `.env.local` para scripts locais e **deve existir como Secret no CI**”.
- **Guia de CI:** `docs/guides/guide-ci-quality-gate.md` explica o uso de PAT para checkout do Hub no GitHub Actions e recomenda a Opção 1 (PAT).

Nenhuma configuração “no Hub” é necessária além de manter o repositório `agents-rules` (e o nome/organização usados no workflow). O token é criado e guardado **no GitHub da conta/organização** e usado **nos repositórios dos satélites**.

---

## Como configurar em outros projetos satélites

### Passo 1: Criar o token no GitHub (uma vez por conta/organização)

1. GitHub → **Settings** (da conta ou da org) → **Developer settings** → **Personal access tokens** (ou **Fine-grained tokens**).
2. Crie um token com:
   - **Fine-grained:** Permissão **Contents: Read-only** (ou **Read** conforme o tipo) no repositório do Hub (`rkvasne/agents-rules` ou o que for usado).
   - **Classic:** Escopo `repo` (ou no mínimo leitura do repo privado do Hub).
3. Copie o valor (ex.: `ghp_...`). Você usará só nos próximos passos; não commite.

### Passo 2: Adicionar o secret no repositório do satélite

1. Abra o **repositório do novo satélite** no GitHub.
2. **Settings** → **Secrets and variables** → **Actions**.
3. **New repository secret**:
   - **Name:** `HUB_ACCESS_TOKEN`
   - **Value:** o token gerado no Passo 1.
4. Salve.

### Passo 3: Workflow do satélite

No `.github/workflows/ci-cd.yml` (ou equivalente) do satélite:

- Faça **dois checkouts**: primeiro o próprio repositório, depois o Hub em `.agent/hub` usando o token:

```yaml
- name: Checkout Satélite
  uses: actions/checkout@v4

- name: Checkout Agents Hub (.agent/hub)
  uses: actions/checkout@v4
  with:
    repository: rkvasne/agents-rules # ou org/repo do Hub
    path: .agent/hub
    ref: main
    token: ${{ secrets.HUB_ACCESS_TOKEN }}
```

- Repita esse bloco de “Checkout Agents Hub” em **cada job** que rodar `npm run verify`, `npm run build` ou qualquer comando que dependa de `.agent/hub/` (para que cada job tenha o Hub no path correto).

### Passo 4: Opcional no satélite

- **`.env.example`:** Incluir `HUB_ACCESS_TOKEN=your-hub-token` na seção de governança (só documentação).
- **Docs:** Referenciar este guia ou o `guide-ci-quality-gate.md` do Hub (em `.agent/hub/docs/guides/`) para quem for configurar outro satélite.

---

## Resumo

| Onde                    | O quê                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hub (Agents)**        | Apenas documentação e template (`.env.example`, `guide-env-layers.md`, `guide-ci-quality-gate.md`). Nenhum secret ou config especial no repositório do Hub.                |
| **Satélite (Inelegis)** | Secret `HUB_ACCESS_TOKEN` no GitHub do repo; workflow em `.github/workflows/ci-cd.yml` usando `secrets.HUB_ACCESS_TOKEN` no checkout do Hub; `.env.example` e docs locais. |
| **Outros satélites**    | Mesmo secret `HUB_ACCESS_TOKEN` no GitHub do **cada** repo satélite; mesmo padrão de checkout no workflow; opcionalmente `.env.example` e doc.                             |

O mesmo token (PAT) pode ser reutilizado em vários repositórios satélites; basta adicionar o secret `HUB_ACCESS_TOKEN` em cada um e usar o mesmo trecho de checkout no CI.

_Última atualização: 15/02/2026_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
