# Variáveis do GitHub Actions (CI/CD) — Referência Detalhada

Este documento explica **por que** cada variável é necessária no CI do Inelegis, com referência ao código, ao padrão do Hub e às alternativas.

---

## 1. Visão geral

O workflow `.github/workflows/ci-cd.yml` usa duas categorias de secrets no GitHub:

| Secret                          | Onde é usado                                           | Obrigatório?          |
| ------------------------------- | ------------------------------------------------------ | --------------------- |
| `HUB_ACCESS_TOKEN`              | Checkout do repositório `agents-rules` em `.agent/hub` | Sim (padrão Hub)      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Build e testes                                         | Depende (ver seção 3) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build e testes                                         | Depende (ver seção 3) |

---

## 2. HUB_ACCESS_TOKEN

### Por que é necessário

O repositório do Hub (`rkvasne/agents-rules`) é **privado**. O CI inicia um ambiente limpo; o checkout padrão do satélite não inclui `.agent/hub/`. O step "Checkout Agents Hub" usa um PAT para clonar o Hub em `.agent/hub` antes de rodar `npm run verify` e `npm run build`.

### Padrão do Hub

O Hub **exige** `HUB_ACCESS_TOKEN` para satélites que rodam pipelines que dependem de `.agent/hub/` (validação, verify, etc.). Documentado em:

- `docs/guides/guide-ci-quality-gate.md`
- `docs/guides/guide-env-layers.md` (camada "Governança e Ferramentas")
- `system/scaffolding/env/README.md`

### Documentação completa

Guia passo a passo: **[hub-access-token-ci.md](hub-access-token-ci.md)**.

---

## 3. NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

### Onde o CI usa essas variáveis

No `ci-cd.yml`:

```yaml
# Job quality-gate
- name: 🧪 Run Tests (Unit & Components)
  run: npm run test:all
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

# Job build-verification
- name: 🏗️ Build Project
  run: npm run build
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

### 3.1. Por que o Build precisa delas

O comando `npm run build` executa:

```
npm run supabase:config && node scripts/build.js
```

O primeiro passo, `supabase:config`, roda `scripts/build-supabase-config.js`, que:

1. Lê `process.env.NEXT_PUBLIC_SUPABASE_URL` e `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Se não houver `.env.local`, usa apenas as variáveis de ambiente (injetadas pelo CI)
3. Se alguma estiver vazia ou ausente, faz `process.exit(1)`:

```javascript
// scripts/build-supabase-config.js (linhas 59-81)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERRO: Variáveis do Supabase não encontradas...");
  process.exit(1);
}
```

4. Gera `public/assets/js/supabase-config.js` com `window.__SUPABASE_CONFIG__ = { url, anonKey }`

**Conclusão:** Sem essas variáveis, o build falha porque `build-supabase-config.js` encerra com código 1.

### 3.2. Por que os Testes as recebem

O job `quality-gate` passa as mesmas variáveis para `npm run test:all`. No código atual:

- `runDataTests()` está desativado ("Skipping data tests (Supabase-only mode)") — não conecta ao Supabase
- `runIntegrationTests()` só verifica se o arquivo `supabase-client.js` existe
- `runUnitTests()` importa `validator-service.js` → `supabase-client.js`; o cliente aceita strings vazias como fallback e não lança erro
- `runLayoutTests()` usa Puppeteer em HTML estático; não depende de Supabase

**Conclusão:** Os testes **não precisam** dessas variáveis para passar no estado atual. Elas são passadas por consistência e para o caso de testes de dados ou integração serem habilitados no futuro.

### 3.3. Aceita placeholders?

O `build-supabase-config.js` só exige que as variáveis sejam **truthy** (não vazias):

```javascript
if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}
```

Portanto, valores como `"https://placeholder.supabase.co"` e `"placeholder-key"` satisfazem a checagem. O Inelegis **pode** usar placeholders no CI; não é obrigatório usar credenciais reais.

---

## 4. Padrão do Hub vs Inelegis

### O que o Hub documenta

| Documento                    | Conteúdo relevante                                                                                                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **guide-ci-quality-gate.md** | Define apenas `HUB_ACCESS_TOKEN` para satélites. Não menciona variáveis Supabase.                                                                                                                                                                                                                              |
| **guide-ci-cd.md**           | Template genérico (padrão Suprix). Sugere **placeholders** quando o build precisa das variáveis Supabase: `NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co"` e `NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-key"` — com o comentário "Adicione variáveis falsas se necessário para o build passar". |
| **guide-env-layers.md**      | CI/CD usa `HUB_ACCESS_TOKEN`. Supabase Core é para app local e produção (Vercel), não para Secrets do GitHub.                                                                                                                                                                                                  |

### Inelegis hoje

O Inelegis usa **secrets reais** (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no GitHub. Não há evidência no repositório de uma decisão documentada para isso. Possíveis razões (não confirmadas):

- Configuração herdada de outro projeto
- Assunção de que testes ou build precisavam de conexão real
- Coerência com produção
- Configuração anterior ao guia do Hub com placeholders

### Não é um desvio deliberado

O Inelegis **pode** alinhar-se ao padrão do Hub usando placeholders no CI. O uso de secrets reais parece uma escolha de implementação, não uma exigência do código.

---

## 5. Outros satélites com Supabase

Satélites acoplados ao Hub que usam Supabase não precisam, por padrão, de secrets Supabase no GitHub. A necessidade depende do pipeline de cada projeto:

| Cenário                                                   | Precisa de secrets?                                     |
| --------------------------------------------------------- | ------------------------------------------------------- |
| Build gera config com credenciais e exige valores válidos | Possivelmente sim (se o script validar formato/domínio) |
| Build só exige variáveis não vazias (como o Inelegis)     | **Não** — placeholders atendem                          |
| Build não usa Supabase                                    | Não                                                     |
| Testes de integração com Supabase habilitados             | Sim, para testes que conectam ao banco                  |

O Hub **não** impõe secrets Supabase para todos os satélites; é específico de cada projeto.

---

## 6. Resumo e recomendações

### Resumo

1. **HUB_ACCESS_TOKEN:** Obrigatório para satélites que usam o Hub no CI (checkout de `.agent/hub`). Padrão do Hub.
2. **NEXT*PUBLIC_SUPABASE*\*:** Necessárias para o **build** do Inelegis porque `build-supabase-config.js` faz `process.exit(1)` se estiverem vazias. Os **testes** atuais não dependem delas.
3. **Placeholders:** O Inelegis aceita placeholders; não é obrigatório usar credenciais reais no CI.
4. **Padrão do Hub:** Sugere placeholders; Inelegis usa secrets reais por decisão de implementação não documentada.

### Recomendação

Para alinhar ao padrão do Hub e reduzir exposição de credenciais no CI, é possível alterar o workflow para:

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-key"
```

Ou manter as secrets reais se houver necessidade de testes de dados/integração contra o Supabase no futuro.

---

## 7. Referências de código

| Arquivo                              | Uso das variáveis                                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `scripts/build-supabase-config.js`   | Lê `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`; faz `process.exit(1)` se vazias (linhas 27-28, 59-81) |
| `scripts/test.js`                    | `runDataTests()` desativado (linha 194); demais testes não dependem de Supabase                                        |
| `src/js/services/supabase-client.js` | Usa `process.env` ou `window.__SUPABASE_CONFIG__`; aceita strings vazias como fallback                                 |
| `.github/workflows/ci-cd.yml`        | Injeta as variáveis nos steps de testes e build (linhas 47-49, 82-84)                                                  |

---

_Última atualização: 15/02/2026_
_Editado via: Cursor | Modelo: Auto | OS: Windows 11_
