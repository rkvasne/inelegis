---
category: design
scope: theme-validator
status: active
version: 3.1.0
---

# Theme Validator Pro v3.1.0

## Visão Geral

O Theme Validator Pro é um validador completo e universal de temas CSS que detecta problemas de aplicação de temas em qualquer projeto web.

### Características Principais

- Detecta 23+ categorias de problemas
- Suporta 9+ frameworks CSS populares
- Saída em texto ou JSON
- Sugestões de correção automática
- Configuração customizável
- Performance otimizada

---

## Instalação

O script já está incluído no projeto. Para usar em outros projetos:

```bash
# Copiar o script
cp scripts/validate-theme.js seu-projeto/scripts/

# Adicionar ao package.json
npm pkg set scripts.validate:theme="node scripts/validate-theme.js"
```

---

## Uso Básico

### Validação Simples

```bash
npm run validate:theme
```

### Com Sugestões de Correção

```bash
node scripts/validate-theme.js --fix
```

### Modo Verbose

```bash
node scripts/validate-theme.js --verbose
```

---

## Opções de Linha de Comando

| Opção       | Alias | Descrição                        |
| ----------- | ----- | -------------------------------- |
| `--verbose` | `-v`  | Mostra detalhes de cada arquivo  |
| `--strict`  | `-s`  | Warnings são tratados como erros |
| `--fix`     | -     | Mostra sugestões de correção     |
| `--json`    | -     | Saída em formato JSON            |
| `--quiet`   | `-q`  | Mostra apenas resumo final       |
| `--summary` | -     | Mostra apenas estatísticas       |

| `--no-color` | - | Desabilita cores no output |
| `--ignore <glob>` | - | Padrão glob para ignorar |
| `--only <glob>` | - | Verificar apenas arquivos específicos |
| `--config <file>` | - | Arquivo de configuração customizado |
| `--max-issues <n>` | - | Máximo de issues (default: 500) |
| `--min-severity` | - | error, warning ou info |
| `--help` | `-h` | Mostra ajuda |

---

## Categorias de Problemas

### Erros (Devem ser corrigidos)

1. **hex-color** - Cores hexadecimais hardcoded
2. **named-color-basic** - Cores nomeadas básicas (white, black, red)
3. **inline-style** - Estilos inline com cores
4. **js-inline-style** - JavaScript inline styles
5. **tailwind-hardcoded** - Tailwind classes com cores hardcoded
6. **dark-mode-no-vars** - Dark mode sem variáveis CSS

### Warnings (Recomendado corrigir)

7. **rgb-color** - Cores RGB/RGBA hardcoded
8. **hsl-color** - Cores HSL/HSLA hardcoded
9. **named-color-extended** - Cores nomeadas estendidas
10. **non-semantic-var** - Variáveis não-semânticas
11. **gradient-hardcoded** - Gradientes com cores hardcoded
12. **important-color** - !important em propriedades de cor
13. **css-in-js** - CSS-in-JS problemático
14. **svg-inline-color** - SVG com cores inline
15. **inconsistent-vars** - Variáveis inconsistentes
16. **component-theme-missing** - Componentes sem variáveis de tema

### Info (Considerar)

17. **opacity-hardcoded** - Opacidade hardcoded
18. **canvas-color** - Canvas/WebGL colors
19. **z-index-hardcoded** - Z-index hardcoded
20. **gradient-not-theme-aware** - Gradientes não adaptáveis
21. **contrast-issue** - Problemas de contraste
22. **unused-theme-vars** - Variáveis não utilizadas
23. **missing-dark-mode** - Dark mode ausente

---

## Frameworks Suportados

O validador detecta variáveis não-semânticas de:

- **Tailwind CSS** (`--slate-500`, `--gray-200`)
- **Material Design** (`--md-blue-500`)
- **Bootstrap** (`--bs-gray-500`)
- **Chakra UI** (`--chakra-colors-gray-500`)
- **Ant Design** (`--ant-blue-5`)
- **Radix UI** (`--gray-9`, `--blue-a9`)
- **Shadcn/ui**
- **IBM Carbon** (`--cds-ui-01`)
- **Open Props**

---

## Exemplos de Uso

### Validar Apenas CSS

```bash
node scripts/validate-theme.js --only "**/*.css"
```

### Ignorar Pasta Legacy

```bash
node scripts/validate-theme.js --ignore "legacy/**"
```

### Modo Estrito (CI/CD)

```bash
node scripts/validate-theme.js --strict
```

### Saída JSON

```bash
node scripts/validate-theme.js --json > theme-report.json
```

### Apenas Erros

```bash
node scripts/validate-theme.js --min-severity error
```

---

## Configuração Customizada

Crie `.themevalidator.json` na raiz do projeto:

```json
{
  "ignoreDirs": ["legacy", "vendor"],
  "ignoreFiles": ["*.generated.css"],
  "severityDefaults": {
    "hex-color": "warning",
    "named-color-basic": "error"
  },
  "semanticVarPrefixes": ["--custom-bg-", "--custom-text-"]
}
```

---

## Integração CI/CD

### GitHub Actions

```yaml
name: Theme Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run validate:theme
```

### GitLab CI

```yaml
validate-theme:
  script:
    - npm install
    - npm run validate:theme
```

---

## Saída JSON

Estrutura da saída JSON:

```json
{
  "version": "3.1.0",
  "timestamp": "2025-12-02T...",
  "summary": {
    "filesScanned": 41,
    "linesScanned": 13938,
    "totalIssues": 0,
    "errors": 0,
    "warnings": 0,
    "info": 0,
    "fixable": 0,
    "passed": true
  },
  "byCategory": {},
  "byFile": {},
  "issues": []
}
```

---

## Boas Práticas

### 1. Use Variáveis Semânticas

**Ruim:**

```css
.button {
  background: #0ea5e9;
  color: white;
}
```

**Bom:**

```css
.button {
  background: var(--primary-600);
  color: var(--text-on-primary);
}
```

### 2. Evite Cores Nomeadas

**Ruim:**

```css
.header {
  background: blue;
  color: white;
}
```

**Bom:**

```css
.header {
  background: var(--header-bg);
  color: var(--header-text);
}
```

### 3. Adapte ao Tema Escuro

**Ruim:**

```css
:root {
  --bg: #ffffff;
}
```

**Bom:**

```css
:root {
  --bg: #ffffff;
}

.dark-theme {
  --bg: #0f172a;
}
```

---

## Troubleshooting

### Muitos Falsos Positivos

Use `--ignore` ou configure `.themevalidator.json`:

```bash
node scripts/validate-theme.js --ignore "vendor/**"
```

### Performance Lenta

Limite os arquivos verificados:

```bash
node scripts/validate-theme.js --only "src/**/*.css"
```

### Variáveis Não Utilizadas

Isso é apenas informativo. Você pode:

- Remover as variáveis
- Adicionar comentário explicativo
- Ignorar a categoria

---

## FAQ

**P: O validador suporta SCSS/SASS?**  
R: Sim, suporta .css, .scss, .sass, .less, .styl e mais.

**P: Posso usar em projetos React/Vue?**  
R: Sim, detecta problemas em JSX, TSX, Vue, Svelte, etc.

**P: Como integrar com pre-commit hooks?**  
R: Use husky:

```bash
npx husky add .husky/pre-commit "npm run validate:theme"
```

**P: O validador modifica arquivos?**  
R: Não, apenas reporta problemas. Use `--fix` para ver sugestões.

---

## Changelog

### v3.1.0 (02/12/2025)

- Adicionadas 4 novas verificações avançadas
- Suporte a detecção de componentes críticos
- Verificação de gradientes adaptáveis
- Detecção de problemas de contraste
- Identificação de variáveis não utilizadas

### v3.0.0 (02/12/2025)

- Reescrita completa do validador
- Suporte a 9+ frameworks
- 23+ categorias de problemas
- Saída JSON
- Configuração customizável

---

## Licença

MIT License - Veja LICENSE para detalhes.

---

## Suporte

- Issues: https://github.com/rkvasne/inelegis/issues
- Docs: https://github.com/rkvasne/inelegis/blob/main/docs/

---

_Última atualização: 23/02/2026 • v0.3.27 (Hub v0.6.1)_
_Editado via: Codex CLI | Modelo: GPT-5 | OS: Windows 11_
