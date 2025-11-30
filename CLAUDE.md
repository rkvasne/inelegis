# CLAUDE.md - Guia Técnico do Projeto

**Última atualização:** 24 de outubro de 2025

Este arquivo fornece orientações para ferramenta de IA (claude.ai/code) ao trabalhar com este repositório.

**⚠️ Nota:** Para uma visão completa da documentação, consulte [DOCUMENTACAO.md](DOCUMENTACAO.md)

## Project Overview

**Inelegis** is a **non-official** single-page application (SPA) for Brazilian Electoral Ineligibility Consultation. It helps TRE-SP (Electoral Justice) servers determine if criminal convictions trigger electoral ineligibility based on Brazilian electoral law (Lei Complementar nº 64/1990, updated by LC 135/2010).

**Development**: Created by a server for use by TRE servers
**Data Source**: Official TRE-SP data (October 2024) reviewed by CRE-RO (02/06/2025)
**Status**: Non-official auxiliary tool

**Technology**: Vanilla JavaScript with build system (no external dependencies)

**Deployment**: Build with `node scripts/optimize.js` then deploy `dist/` folder

## Running & Development

Since this is a frontend application with build system:

- **Development**: Run `node scripts/serve.js` for local development server
- **Production**: Run `node scripts/optimize.js` to build optimized version
- **Deploy**: Run `node scripts/deploy.js` for automated deployment
- **All files**: Deploy `dist/` folder contents to web server

## Code Architecture

### Core Files

**[index.html](index.html)** - HTML structure containing:
- Search form with communication type toggle (Condenação/Extinção)
- Law code dropdown and article input field
- Result display modal
- Information panels and legal disclaimers
- Legend explaining result types

**[script.js](script.js)** - Application logic (762 lines) organized into functional groups:

1. **Search Logic**: `realizarBusca()`, `buscarInelegibilidadePorLeiEArtigo()` - Core query handling
2. **Article Processing**: `processarArtigoCompleto()`, `processarParteArtigo()` - Parse complex article notation (e.g., "121, §2º, I, 'a' c/c 312")
3. **Formatting**: `aplicarFormatacaoAutomatica()` - Auto-correct user input (§1 → §1º, cc → c/c, a → "a")
4. **UI Management**: `exibirResultado()`, `abrirModal()`, `fecharModal()` - Modal and result display
5. **Suggestions**: `mostrarSugestoes()`, `obterSugestoesPorLei()` - Real-time article suggestions
6. **Keyboard Shortcuts**: Implemented hotkeys (Ctrl+L, Ctrl+A, Ctrl+Enter, F1, Esc)

**[data.js](data.js)** - Data configuration (632 lines):

1. **leisDisponiveis** - Array of 40+ law codes (Código Penal, CLT, Lei Falimentar, Lei 11.343/06, etc.)
2. **tabelaInelegibilidade** - Master object mapping articles to ineligibility rules:
   - Boolean flag: does this article generate ineligibility?
   - Crime classification (numbered 1-10)
   - Exception articles that don't trigger ineligibility
   - Code references and observations

**[styles-compact.css](styles-compact.css)** - Professional CSS design system (1,200+ lines):
- Corporate color palette and design tokens
- Responsive layout with modern components
- Glassmorphism effects and animations
- Accessibility-compliant styling
- Print-friendly media queries

### Data Structure Example

From `data.js`, the ineligibility table follows this pattern:
```javascript
tabelaInelegibilidade = {
  "121": {
    "gera_inelegibilidade": true,
    "crime_categoria": 1,
    "excecoes": [],
    "codigo": "D"
  },
  // ... more articles
}
```

### Key Feature: Complex Article Parsing

The application supports Brazilian legal article notation:
- Simple: `121`
- With paragraphs: `121, §2º`
- With incisions: `121, §2º, I`
- With subsections: `121, §2º, I, "a"`
- Concurrent citations: `121 c/c 312`
- Combined: `121, §2º, I, "a" c/c 312 c/c 213`

Regular expressions in script.js handle extraction and matching of these components.

## Important Patterns

### Search Result Types

Three possible outcomes displayed in modal:
1. **GERA INELEGIBILIDADE** (red) - Article triggers ineligibility, use ASE 337 notation
2. **NÃO GERA INELEGIBILIDADE** (green) - No ineligibility triggered
3. **NÃO ENCONTRADO** (gray) - Article not in reference table

### Communication Types

- **Condenação (ASE 337)**: Suspension of political rights due to conviction
- **Extinção (ASE 370)**: Extinction of punishment/liability suspension

Toggle between these with radio buttons or F1 keyboard shortcut.

### Automatic Formatting

User input is automatically formatted to match legal standards:
- `§1` becomes `§1º`
- `cc` becomes `c/c`
- `a` becomes `"a"` (in subsection context)
- Spaces and commas normalized

## Data Maintenance

The ineligibility data in `data.js` maps directly to:
- Official TRE-SP ineligibility table (October 2024, corrected 02/06/2025)
- Reference PDF and XML files in repository root

**If electoral law changes:**
1. Update the `tabelaInelegibilidade` object in `data.js`
2. Add new laws to `leisDisponiveis` array if needed
3. Test with relevant article numbers

## Documentation References

- **[README.md](README.md)** - Features, keyboard shortcuts, usage examples
- **MANUAL-ASE.txt** - Electoral system manual with ASE code explanations
- **PDF/XML tables** - Official TRE-SP reference data

## Browser Compatibility

- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Uses Clipboard API and Flexbox CSS
- Responsive design for desktop/mobile

## Documentação Consolidada

### 📚 Documentos Principais

1. **[DOCUMENTACAO.md](DOCUMENTACAO.md)** - Índice da documentação (COMECE AQUI!)
2. **[VERSAO_2.0.md](VERSAO_2.0.md)** - Melhorias implementadas na v2.0
3. **[MANUTENCAO.md](MANUTENCAO.md)** - Validação de dados e checklist de manutenção

### Versão Atual

**Version**: v0.0.2 (24 de outubro de 2025)
**Status**: ✅ 100% conformity with official TRE-SP data (October 2024)

### Rápido Acesso

- **Novas features v0.0.2?** → Leia [CHANGELOG.md](CHANGELOG.md)
- **Manutenção de dados?** → Leia [MANUTENCAO.md](MANUTENCAO.md)
- **Documentação completa?** → Leia [DOCUMENTACAO.md](DOCUMENTACAO.md)

## Common Tasks

**Search for how articles are validated**: Look at `buscarInelegibilidadePorLeiEArtigo()` in script.js - parses article notation and matches against the table.

**Add a new law code**: Add to `leisDisponiveis` array in data.js, then add entries to `tabelaInelegibilidade` for articles under that law.

**Modify result display**: Edit `exibirResultado()` in script.js - controls the modal content and styling.

**Change keyboard shortcuts**: Search for `addEventListener('keydown'` in script.js - all hotkeys are defined there.

**Update styling**: colors and layout are in styles.css - main color palette uses purple gradient variables.

**Update ineligibility table**: Edit `tabelaInelegibilidade` array in data.js - each entry maps articles to crime categories and exceptions.


## Sistema Profissional (v0.0.2)
- Tailwind (CDN) + theme palette inline; no build step.
- sobre.html added as local documentation entry.
- Modal status bar and chips/badges for legend; inputs with primary focus ring.
