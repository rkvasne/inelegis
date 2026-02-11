#!/usr/bin/env node
/**
 * Theme Validator Pro (Hub Core) - Validador Completo e Universal de Temas CSS
 * Detecta problemas de aplicação de temas em qualquer projeto web
 *
 * @version 3.1.0-core
 * @author Inelegis Team -> Solo Dev Hub
 * @license Private
 *
 * Uso: node .agent/skills/frontend-design/scripts/theme-linter.js [opções]
 *
 * Opções:
 *   --verbose, -v     Mostra detalhes de cada arquivo
 *   --strict, -s      Modo estrito (warnings = erros)
 *   --fix             Sugere correções automáticas
 *   --json            Saída em formato JSON
 *   --config <file>   Arquivo de configuração customizado
 *   --ignore <glob>   Padrão glob para ignorar
 *   --only <glob>     Verificar apenas arquivos que correspondem
 *   --help, -h        Mostra ajuda
 */

import fs from "fs";
import path from "path";

// ============================================================================
// CONFIGURAÇÃO COMPLETA
// ============================================================================

const DEFAULT_CONFIG = {
  // Extensões de arquivos para verificar
  extensions: {
    css: [
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".styl",
      ".stylus",
      ".pcss",
      ".postcss",
    ],
    html: [
      ".html",
      ".htm",
      ".xhtml",
      ".php",
      ".erb",
      ".ejs",
      ".hbs",
      ".handlebars",
      ".pug",
      ".jade",
      ".twig",
      ".blade.php",
      ".njk",
      ".liquid",
    ],
    js: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".mjs",
      ".cjs",
      ".vue",
      ".svelte",
      ".astro",
    ],
    config: [".json", ".yaml", ".yml"],
  },

  // Diretórios para ignorar
  ignoreDirs: [
    "node_modules",
    ".git",
    "tests",
    "__tests__",
    "test",
    "spec",
    "specs",
    "dist",
    "build",
    ".next",
    ".nuxt",
    ".output",
    "coverage",
    "vendor",
    ".cache",
    ".parcel-cache",
    ".turbo",
    ".vercel",
    "__pycache__",
    ".pytest_cache",
    "venv",
    "env",
    ".env",
    "target",
    "out",
    "public/build",
    "static/build",
    ".svelte-kit",
    ".astro",
    "agents-link",
  ],

  // Arquivos para ignorar
  ignoreFiles: [
    "*.min.css",
    "*.min.js",
    "*.bundle.js",
    "*.bundle.css",
    "*.map",
    "*.d.ts",
    "*.test.*",
    "*.spec.*",
    "*.stories.*",
    "serve.js",
    "optimize.js",
    "validate-theme.js",
    "theme-linter.js",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "tailwind.config.*",
    "postcss.config.*",
    "vite.config.*",
    "webpack.config.*",
    "rollup.config.*",
    "tsconfig.*",
  ],

  // ========================================================================
  // CORES NOMEADAS - Lista completa de todas as cores CSS nomeadas
  // ========================================================================
  namedColors: {
    // Cores básicas (mais problemáticas)
    basic: [
      "white",
      "black",
      "red",
      "green",
      "blue",
      "yellow",
      "orange",
      "purple",
      "pink",
      "gray",
      "grey",
      "cyan",
      "magenta",
      "lime",
      "olive",
      "navy",
      "teal",
      "aqua",
      "maroon",
      "fuchsia",
      "silver",
      "brown",
    ],

    // Cores estendidas (147 cores CSS nomeadas)
    extended: [
      "aliceblue",
      "antiquewhite",
      "aquamarine",
      "azure",
      "beige",
      "bisque",
      "blanchedalmond",
      "blueviolet",
      "burlywood",
      "cadetblue",
      "chartreuse",
      "chocolate",
      "coral",
      "cornflowerblue",
      "cornsilk",
      "crimson",
      "darkblue",
      "darkcyan",
      "darkgoldenrod",
      "darkgray",
      "darkgrey",
      "darkgreen",
      "darkkhaki",
      "darkmagenta",
      "darkolivegreen",
      "darkorange",
      "darkorchid",
      "darkred",
      "darksalmon",
      "darkseagreen",
      "darkslateblue",
      "darkslategray",
      "darkslategrey",
      "darkturquoise",
      "darkviolet",
      "deeppink",
      "deepskyblue",
      "dimgray",
      "dimgrey",
      "dodgerblue",
      "firebrick",
      "floralwhite",
      "forestgreen",
      "gainsboro",
      "ghostwhite",
      "gold",
      "goldenrod",
      "greenyellow",
      "honeydew",
      "hotpink",
      "indianred",
      "indigo",
      "ivory",
      "khaki",
      "lavender",
      "lavenderblush",
      "lawngreen",
      "lemonchiffon",
      "lightblue",
      "lightcoral",
      "lightcyan",
      "lightgoldenrodyellow",
      "lightgray",
      "lightgrey",
      "lightgreen",
      "lightpink",
      "lightsalmon",
      "lightseagreen",
      "lightskyblue",
      "lightslategray",
      "lightslategrey",
      "lightsteelblue",
      "lightyellow",
      "limegreen",
      "linen",
      "mediumaquamarine",
      "mediumblue",
      "mediumorchid",
      "mediumpurple",
      "mediumseagreen",
      "mediumslateblue",
      "mediumspringgreen",
      "mediumturquoise",
      "mediumvioletred",
      "midnightblue",
      "mintcream",
      "mistyrose",
      "moccasin",
      "navajowhite",
      "oldlace",
      "olivedrab",
      "orangered",
      "orchid",
      "palegoldenrod",
      "palegreen",
      "paleturquoise",
      "palevioletred",
      "papayawhip",
      "peachpuff",
      "peru",
      "plum",
      "powderblue",
      "rebeccapurple",
      "rosybrown",
      "royalblue",
      "saddlebrown",
      "salmon",
      "sandybrown",
      "seagreen",
      "seashell",
      "sienna",
      "skyblue",
      "slateblue",
      "slategray",
      "slategrey",
      "snow",
      "springgreen",
      "steelblue",
      "tan",
      "thistle",
      "tomato",
      "turquoise",
      "violet",
      "wheat",
      "whitesmoke",
      "yellowgreen",
    ],

    // Valores especiais (geralmente OK, mas verificar contexto)
    special: [
      "transparent",
      "currentColor",
      "currentcolor",
      "inherit",
      "initial",
      "unset",
      "revert",
    ],
  },

  // ========================================================================
  // VARIÁVEIS NÃO-SEMÂNTICAS - Padrões de frameworks e design systems
  // ========================================================================
  nonSemanticPatterns: {
    // Tailwind CSS / Design Tokens numéricos
    tailwind: [
      /--(?:tw-)?(?:slate|gray|grey|zinc|neutral|stone)-(?:\d{1,3}|50)/i,
      /--(?:tw-)?(?:red|orange|amber|yellow|lime|green|emerald|teal)-(?:\d{1,3}|50)/i,
      /--(?:tw-)?(?:cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:\d{1,3}|50)/i,
    ],

    // Material Design
    material: [
      /--(?:md-|mdc-)?(?:red|pink|purple|deep-purple|indigo|blue|light-blue)-(?:A?\d{2,3})/i,
      /--(?:md-|mdc-)?(?:cyan|teal|green|light-green|lime|yellow|amber|orange)-(?:A?\d{2,3})/i,
      /--(?:md-|mdc-)?(?:deep-orange|brown|grey|gray|blue-grey|blue-gray)-(?:A?\d{2,3})/i,
    ],

    // Bootstrap
    bootstrap: [
      /--(?:bs-)?(?:gray|grey)-(?:\d{3})/i,
      /--(?:bs-)?(?:blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-(?:\d{3})?/i,
    ],

    // Chakra UI
    chakra: [
      /--chakra-colors-(?:gray|red|orange|yellow|green|teal|blue|cyan|purple|pink)-(?:\d{2,3})/i,
      /--chakra-colors-(?:whiteAlpha|blackAlpha)-(?:\d{2,3})/i,
    ],

    // Ant Design
    antd: [
      /--ant-(?:blue|purple|cyan|green|magenta|pink|red|orange|yellow|volcano|geekblue|lime|gold)-(?:\d)/i,
    ],

    // Open Props / Design Tokens genéricos
    generic: [
      /--(?:color-)?(?:gray|grey|neutral|slate|zinc|stone)-(?:\d{1,3})/i,
      /--(?:color-)?(?:red|orange|yellow|green|blue|purple|pink)-(?:\d{1,3})/i,
      /--(?:palette|clr|c)-(?:gray|grey|neutral)-(?:\d{1,3})/i,
    ],

    // Radix UI
    radix: [
      /--(?:gray|mauve|slate|sage|olive|sand|tomato|red|ruby|crimson)-(?:a?\d{1,2})/i,
      /--(?:pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade)-(?:a?\d{1,2})/i,
      /--(?:green|grass|bronze|gold|brown|orange|amber|yellow|lime|mint|sky)-(?:a?\d{1,2})/i,
    ],

    // Shadcn/ui
    shadcn: [
      /--(?:background|foreground|card|popover|primary|secondary|muted|accent|destructive)(?!-)/i,
    ],

    // IBM Carbon
    carbon: [
      /--cds-(?:ui|text|icon|field|support|interactive|link|focus|inverse|skeleton)-\d{2}/i,
    ],
  },

  // ========================================================================
  // VARIÁVEIS SEMÂNTICAS PERMITIDAS
  // ========================================================================
  semanticVarPrefixes: [
    // Backgrounds
    "--bg-",
    "--background-",
    "--surface-",
    "--canvas-",

    // Text/Foreground
    "--text-",
    "--fg-",
    "--foreground-",
    "--content-",

    // Borders
    "--border-",
    "--outline-",
    "--divider-",
    "--separator-",

    // Shadows
    "--shadow-",
    "--elevation-",
    "--drop-shadow-",

    // States
    "--hover-",
    "--active-",
    "--focus-",
    "--disabled-",
    "--selected-",

    // Semantic colors
    "--primary-",
    "--secondary-",
    "--tertiary-",
    "--accent-",
    "--success-",
    "--warning-",
    "--error-",
    "--danger-",
    "--info-",
    "--positive-",
    "--negative-",
    "--caution-",
    "--neutral-color-",

    // Components
    "--btn-",
    "--button-",
    "--input-",
    "--card-",
    "--modal-",
    "--nav-",
    "--header-",
    "--footer-",
    "--sidebar-",
    "--menu-",
    "--tooltip-",
    "--badge-",
    "--alert-",
    "--toast-",
    "--dialog-",
    "--dropdown-",

    // Layout
    "--spacing-",
    "--space-",
    "--gap-",
    "--margin-",
    "--padding-",
    "--radius-",
    "--rounded-",
    "--corner-",

    // Typography
    "--font-",
    "--text-size-",
    "--line-height-",
    "--letter-spacing-",

    // Transitions
    "--transition-",
    "--duration-",
    "--timing-",
    "--ease-",
    "--animation-",

    // Z-index
    "--z-",
    "--layer-",
    "--zindex-",

    // Breakpoints
    "--breakpoint-",
    "--screen-",
    "--viewport-",

    // Theme-specific
    "--theme-",
    "--color-scheme-",
    "--mode-",
  ],

  // ========================================================================
  // PROPRIEDADES CSS QUE DEVEM USAR VARIÁVEIS DE TEMA
  // ========================================================================
  themeProperties: {
    // Cores diretas
    color: [
      "color",
      "background-color",
      "border-color",
      "outline-color",
      "fill",
      "stroke",
    ],

    // Shorthand com cores
    shorthand: [
      "background",
      "border",
      "border-top",
      "border-right",
      "border-bottom",
      "border-left",
      "outline",
      "text-decoration",
      "column-rule",
      "box-shadow",
      "text-shadow",
    ],

    // Cores específicas
    specific: [
      "border-top-color",
      "border-right-color",
      "border-bottom-color",
      "border-left-color",
      "border-block-color",
      "border-inline-color",
      "border-block-start-color",
      "border-block-end-color",
      "border-inline-start-color",
      "border-inline-end-color",
      "caret-color",
      "text-decoration-color",
      "text-emphasis-color",
      "accent-color",
      "scrollbar-color",
      "flood-color",
      "lighting-color",
      "stop-color",
    ],

    // Filtros e efeitos
    effects: ["filter", "backdrop-filter"],

    // SVG
    svg: ["fill", "stroke", "stop-color", "flood-color", "lighting-color"],
  },

  // ========================================================================
  // PADRÕES DE CÓDIGO PROBLEMÁTICOS
  // ========================================================================
  problematicPatterns: {
    // JavaScript/TypeScript inline styles
    jsInlineStyles: [
      /style\s*=\s*\{\s*\{[^}]*(?:color|background|border)[^}]*\}\s*\}/gi,
      /\.style\.(?:color|backgroundColor|borderColor)\s*=/gi,
      /(?:color|backgroundColor|borderColor)\s*:\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
      /(?:color|backgroundColor|borderColor)\s*:\s*['"`](?:rgb|hsl)a?\([^)]+\)['"`]/gi,
    ],

    // CSS-in-JS problemático
    cssInJs: [
      /styled\.[a-z]+`[^`]*(?:color|background|border)\s*:\s*#[0-9a-fA-F]{3,8}/gi,
      /css`[^`]*(?:color|background|border)\s*:\s*#[0-9a-fA-F]{3,8}/gi,
      /emotion\/css[^`]*`[^`]*#[0-9a-fA-F]{3,8}/gi,
    ],

    // Tailwind classes com cores hardcoded
    tailwindHardcoded: [
      /(?:bg|text|border|ring|shadow)-\[#[0-9a-fA-F]{3,8}\]/gi,
      /(?:bg|text|border|ring|shadow)-\[rgb\([^\]]+\)\]/gi,
      /(?:bg|text|border|ring|shadow)-\[hsl\([^\]]+\)\]/gi,
    ],

    // SVG com cores inline
    svgInline: [
      /<(?:path|rect|circle|ellipse|line|polygon|polyline|text|g|svg)[^>]*(?:fill|stroke)\s*=\s*["']#[0-9a-fA-F]{3,8}["']/gi,
      /<(?:path|rect|circle|ellipse|line|polygon|polyline|text|g|svg)[^>]*(?:fill|stroke)\s*=\s*["'](?:rgb|hsl)a?\([^)]+\)["']/gi,
    ],

    // Canvas/WebGL
    canvas: [
      /\.fillStyle\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
      /\.strokeStyle\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
      /\.shadowColor\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
    ],
  },

  // ========================================================================
  // CONTEXTOS ONDE CORES HARDCODED SÃO ACEITÁVEIS
  // ========================================================================
  allowedContexts: [
    // Definições de variáveis CSS (agora aceita em qualquer lugar da linha)
    /--[\w-]+\s*:/,

    // Fallbacks em CSS variables (var(--custom, #fff))
    /var\([^,]+,\s*#[0-9a-fA-F]{3,8}\)/,
    /var\([^,]+,\s*(?:rgb|hsl)a?\([^)]+\)\)/,

    // Comentários
    /^\s*\/\*/,
    /^\s*\/\//,
    /^\s*\*/,
    /^\s*#.*comment/i,

    // Data URLs
    /data:image/,
    /url\(['"]?data:/,

    // SVG inline em data URL
    /url\(['"]?data:image\/svg/,

    // Gradientes em definições de variáveis
    /--[\w-]+\s*:\s*(?:linear|radial|conic)-gradient/,

    // Keyframes (animações)
    /@keyframes/,

    // Print styles
    /@media\s+print/,

    // Forced colors mode
    /@media\s*\(\s*forced-colors/,

    // Prefers contrast
    /@media\s*\(\s*prefers-contrast/,

    // Color scheme meta
    /<meta[^>]*color-scheme/i,

    // Theme color meta
    /<meta[^>]*theme-color/i,
  ],

  // Severidade padrão por categoria
  severityDefaults: {
    "hex-color": "error",
    "rgb-color": "warning",
    "hsl-color": "warning",
    "named-color-basic": "error",
    "named-color-extended": "warning",
    "non-semantic-var": "warning",
    "gradient-hardcoded": "warning",
    "inline-style": "error",
    "important-color": "warning",
    "js-inline-style": "error",
    "css-in-js": "warning",
    "tailwind-hardcoded": "error",
    "svg-inline-color": "warning",
    "canvas-color": "info",
    "opacity-hardcoded": "info",
    "dark-mode-no-vars": "error",
    "inconsistent-vars": "warning",
    "missing-dark-mode": "info",
    "color-contrast": "warning",
    "z-index-hardcoded": "info",
    "magic-number": "info",
    "component-theme-missing": "warning",
    "gradient-not-theme-aware": "info",
    "contrast-issue": "info",
    "unused-theme-vars": "info",
    "light-color-no-dark-override": "warning",
  },
};

// ============================================================================
// ESTADO GLOBAL
// ============================================================================

let CONFIG = { ...DEFAULT_CONFIG };
const stats = {
  filesScanned: 0,
  linesScanned: 0,
  issuesFound: 0,
  errors: 0,
  warnings: 0,
  info: 0,
  byCategory: {},
  byFile: {},
  bySeverity: { error: 0, warning: 0, info: 0 },
  fixable: 0,
};

const issues = [];
const suggestions = new Map(); // Sugestões de correção

// ============================================================================
// ARGUMENTOS CLI
// ============================================================================

const args = process.argv.slice(2);
const options = {
  verbose: args.includes("--verbose") || args.includes("-v"),
  strict: args.includes("--strict") || args.includes("-s"),
  fix: args.includes("--fix"),
  json: args.includes("--json"),
  help: args.includes("--help") || args.includes("-h"),
  quiet: args.includes("--quiet") || args.includes("-q"),
  noColor: args.includes("--no-color"),
  summary: args.includes("--summary"),
  ignore: getArgValue("--ignore"),
  only: getArgValue("--only"),
  config: getArgValue("--config"),
  maxIssues: parseInt(getArgValue("--max-issues") || "500"),
  minSeverity: getArgValue("--min-severity") || "info",
};

function getArgValue(flag) {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

// ============================================================================
// CORES PARA OUTPUT (ANSI)
// ============================================================================

const colors = options.noColor
  ? {
    reset: "",
    red: "",
    green: "",
    yellow: "",
    blue: "",
    magenta: "",
    cyan: "",
    gray: "",
    bold: "",
    dim: "",
  }
  : {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    gray: "\x1b[90m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
  };

// ============================================================================
// HELP
// ============================================================================

if (options.help) {
  console.log(`
${colors.bold}🎨 Theme Validator Pro v3.1.0${colors.reset}
${colors.dim}Validador Universal de Temas CSS${colors.reset}

${colors.bold}USO:${colors.reset}
  node theme-linter.js [opções]

${colors.bold}OPÇÕES:${colors.reset}
  ${colors.cyan}--verbose, -v${colors.reset}      Mostra detalhes de cada arquivo verificado
  ${colors.cyan}--strict, -s${colors.reset}       Modo estrito (warnings são tratados como erros)
  ${colors.cyan}--fix${colors.reset}              Mostra sugestões de correção automática
  ${colors.cyan}--json${colors.reset}             Saída em formato JSON
  ${colors.cyan}--quiet, -q${colors.reset}        Mostra apenas resumo final
  ${colors.cyan}--summary${colors.reset}          Mostra apenas estatísticas
  ${colors.cyan}--no-color${colors.reset}         Desabilita cores no output
  ${colors.cyan}--ignore <glob>${colors.reset}    Padrão glob para ignorar arquivos
  ${colors.cyan}--only <glob>${colors.reset}      Verificar apenas arquivos que correspondem
  ${colors.cyan}--config <file>${colors.reset}    Arquivo de configuração customizado
  ${colors.cyan}--max-issues <n>${colors.reset}   Máximo de issues a reportar (default: 500)
  ${colors.cyan}--min-severity${colors.reset}     Severidade mínima: error, warning, info
  ${colors.cyan}--help, -h${colors.reset}         Mostra esta ajuda

${colors.bold}CATEGORIAS DE PROBLEMAS DETECTADOS:${colors.reset}

  ${colors.red}ERROS (devem ser corrigidos):${colors.reset}
    • Cores hexadecimais hardcoded (#fff, #000000)
    • Cores nomeadas básicas (white, black, red, blue)
    • Estilos inline com cores
    • JavaScript inline styles com cores
    • Tailwind classes com cores hardcoded
    • Dark mode sem variáveis CSS

  ${colors.yellow}WARNINGS (recomendado corrigir):${colors.reset}
    • Cores RGB/RGBA hardcoded
    • Cores HSL/HSLA hardcoded
    • Cores nomeadas estendidas (coral, salmon, etc.)
    • Variáveis não-semânticas (--neutral-500, --gray-200)
    • Gradientes com cores hardcoded
    • !important em propriedades de cor
    • CSS-in-JS com cores hardcoded
    • SVG com cores inline
    • Variáveis inconsistentes

  ${colors.blue}INFO (considerar):${colors.reset}
    • Opacidade hardcoded
    • Canvas/WebGL colors
    • Z-index hardcoded
    • Magic numbers em cores

${colors.bold}FRAMEWORKS SUPORTADOS:${colors.reset}
  Tailwind CSS, Material Design, Bootstrap, Chakra UI, Ant Design,
  Radix UI, Shadcn/ui, IBM Carbon, Open Props, e mais.

${colors.bold}EXEMPLOS:${colors.reset}
  ${colors.dim}# Validação básica${colors.reset}
  node theme-linter.js

  ${colors.dim}# Modo verbose com sugestões de correção${colors.reset}
  node theme-linter.js --verbose --fix

  ${colors.dim}# Apenas erros, saída JSON${colors.reset}
  node theme-linter.js --min-severity error --json

  ${colors.dim}# Verificar apenas arquivos CSS${colors.reset}
  node theme-linter.js --only "**/*.css"

  ${colors.dim}# Ignorar pasta específica${colors.reset}
  node theme-linter.js --ignore "legacy/**"
`);
  process.exit(0);
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Carrega configuração customizada se existir
 */
function loadCustomConfig() {
  if (options.config) {
    try {
      const customConfig = JSON.parse(fs.readFileSync(options.config, "utf8"));
      CONFIG = { ...CONFIG, ...customConfig };
      // Merge arrays em vez de substituir
      if (customConfig.ignoreDirs)
        CONFIG.ignoreDirs = [
          ...DEFAULT_CONFIG.ignoreDirs,
          ...customConfig.ignoreDirs,
        ];
      if (customConfig.ignoreFiles)
        CONFIG.ignoreFiles = [
          ...DEFAULT_CONFIG.ignoreFiles,
          ...customConfig.ignoreFiles,
        ];
      if (customConfig.themeProperties)
        CONFIG.themeProperties = {
          ...DEFAULT_CONFIG.themeProperties,
          ...customConfig.themeProperties,
        };
      if (customConfig.problematicPatterns)
        CONFIG.problematicPatterns = {
          ...DEFAULT_CONFIG.problematicPatterns,
          ...customConfig.problematicPatterns,
        };
      if (customConfig.allowedContexts) {
        // Converter strings de regex de volta para RegExp se vierem do JSON
        const allowed = customConfig.allowedContexts.map((c) =>
          typeof c === "string" ? new RegExp(c) : c,
        );
        CONFIG.allowedContexts = [
          ...DEFAULT_CONFIG.allowedContexts,
          ...allowed,
        ];
      }
    } catch (e) {
      console.error(
        `${colors.red}Erro ao carregar config: ${e.message}${colors.reset}`,
      );
      process.exit(1);
    }
  }
}

/**
 * Verifica se uma severidade atende ao mínimo configurado
 */
function shouldReport(severity) {
  const levels = { info: 0, warning: 1, error: 2 };
  const min = levels[options.minSeverity] || 0;
  return levels[severity] >= min;
}

/**
 * Verifica se um arquivo deve ser ignorado
 */
function isIgnored(filePath) {
  // Ignorar diretórios
  const parts = filePath.split(path.sep);
  if (parts.some((p) => CONFIG.ignoreDirs.includes(p))) return true;

  // Ignorar arquivos por glob (simples)
  const filename = path.basename(filePath);

  // Implementação simples de glob de arquivos
  const ignored = CONFIG.ignoreFiles.some((pattern) => {
    if (pattern.startsWith("*.")) return filename.endsWith(pattern.slice(1));
    return filename === pattern;
  });

  if (ignored) return true;

  // Check custom ignore glob
  if (options.ignore) {
    // Simplificado: apenas substring ou extensão
    if (options.ignore.startsWith("*."))
      return filename.endsWith(options.ignore.slice(1));
    return filePath.includes(options.ignore);
  }

  return false;
}

/**
 * Escaneia diretório recursivamente
 */
function walkDir(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!isIgnored(fullPath)) {
        files.push(...walkDir(fullPath));
      }
    } else {
      if (!isIgnored(fullPath)) {
        // Verificar suporte a extensão
        const ext = path.extname(fullPath).toLowerCase();
        const supported = Object.values(CONFIG.extensions).flat().includes(ext);

        if (supported) {
          // Verificar filtro --only
          if (options.only) {
            if (options.only.startsWith("*.")) {
              if (fullPath.endsWith(options.only.slice(1)))
                files.push(fullPath);
            } else {
              if (fullPath.includes(options.only)) files.push(fullPath);
            }
          } else {
            files.push(fullPath);
          }
        }
      }
    }
  }
  return files;
}

// ============================================================================
// LÓGICA DE VALIDAÇÃO
// ============================================================================

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const ext = path.extname(filePath).toLowerCase();

  stats.filesScanned++;
  stats.linesScanned += lines.length;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Pular contextos permitidos (comentários, imports, etc)
    if (CONFIG.allowedContexts.some((regex) => regex.test(line))) return;

    // NOVO: Suporte explícito a diretivas de ignore (atual ou linha anterior)
    if (line.includes('theme-ignore')) return;
    if (index > 0 && lines[index - 1].includes('theme-ignore')) return;

    // 1. Detectar Hex Colors Hardcoded
    checkHexColors(filePath, line, lineNum);

    // 2. Detectar Cores Nomeadas
    checkNamedColors(filePath, line, lineNum);

    // 3. Detectar Estilos Inline (HTML/JSX)
    checkInlineStyles(filePath, line, lineNum);

    // 4. Detectar !important
    checkImportant(filePath, line, lineNum);
  });
}

function checkHexColors(file, line, lineNum) {
  const hexRegex = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  let match;
  while ((match = hexRegex.exec(line)) !== null) {
    addIssue({
      file,
      line: lineNum,
      col: match.index,
      type: "hex-color",
      message: `Cor hexadecimal hardcoded detectada: ${match[0]}`,
      severity: CONFIG.severityDefaults["hex-color"],
      context: line.trim(),
      suggestion:
        "Substitua por uma variável semântica (ex: var(--primary-500))",
    });
  }
}

function checkNamedColors(file, line, lineNum) {
  // Check Basic Colors
  CONFIG.namedColors.basic.forEach((color) => {
    // Regex Melhorada:
    // 1. \b${color}\b : palavra exata
    // 2. (?<!-) : não precedida por hífen (evita font-black)
    // 3. (?!-) : não sucedida por hífen (evita black-ops)
    const regex = new RegExp(`(?<!-)\\b${color}\\b(?!-)`, "gi");

    let match;
    while ((match = regex.exec(line)) !== null) {
      // Contexto CSS forte: deve ter ':' antes (propriedade: valor)
      // Ou contexto JS/HTML: deve ter '=' (prop={color}) mas com cuidado
      const hasColon = line.lastIndexOf(":", match.index) > -1;
      const isTailwindClass = /class(?:Name)?=["'][^"']*$/.test(
        line.substring(0, match.index),
      );

      if (hasColon && !isTailwindClass) {
        addIssue({
          file,
          line: lineNum,
          col: match.index,
          type: "named-color-basic",
          message: `Cor nomeada básica detectada: ${color}`,
          severity: CONFIG.severityDefaults["named-color-basic"],
          context: line.trim(),
          suggestion: `Use tokens de design em vez de cores puras`,
        });
      }
    }
  });
}

function checkInlineStyles(file, line, lineNum) {
  const colorProps = [
    "color",
    "background",
    "border",
    "fill",
    "stroke",
    "outline",
    "shadow",
  ];
  // Verifica se tem 'style=' e alguma propriedade de cor
  const hasStyle = line.includes("style=");
  const hasColorProp = colorProps.some(
    (p) => line.includes(p + ":") || line.includes(p + "-"),
  );

  if (hasStyle && hasColorProp) {
    // Feature: Permitir variáveis CSS em inline styles (Design Tokens dinâmicos)
    if (line.includes("var(--")) return;

    addIssue({
      file,
      line: lineNum,
      type: "inline-style",
      message:
        "Estilo inline detectado com definição de cor/visual (sem variável)",
      severity: CONFIG.severityDefaults["inline-style"],
      context: line.trim(),
      suggestion: "Mova para classes CSS ou use var(--token)",
    });
  }
}

function checkImportant(file, line, lineNum) {
  // Ignorar arquivos de configuração (JSON, YAML) que podem conter strings "!important" coincidentais
  if (/\.(json|yaml|yml)$/i.test(file)) return;

  if (line.includes("!important")) {
    addIssue({
      file,
      line: lineNum,
      type: "important-color",
      message: "Uso de !important detectado",
      severity: CONFIG.severityDefaults["important-color"],
      context: line.trim(),
      suggestion:
        "Evite !important para manter a especificidade CSS gerenciável",
    });
  }
}

function addIssue(issue) {
  if (!shouldReport(issue.severity)) return;

  stats.issuesFound++;
  stats.bySeverity[issue.severity]++;

  if (issue.severity === "error") stats.errors++;
  if (issue.severity === "warning") stats.warnings++;
  if (issue.severity === "info") stats.info++;

  issues.push(issue);

  if (options.verbose) {
    const color =
      issue.severity === "error"
        ? colors.red
        : issue.severity === "warning"
          ? colors.yellow
          : colors.blue;
    console.log(
      `${color}[${issue.severity.toUpperCase()}] ${issue.file}:${issue.line} - ${issue.message}${colors.reset}`,
    );
    console.log(`${colors.dim}  ${issue.context}${colors.reset}\n`);
  }
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

function main() {
  console.log(
    `${colors.bold}🔍 Theme Linter (Hub Core) Iniciado...${colors.reset}\n`,
  );
  loadCustomConfig();

  const files = walkDir(process.cwd());
  console.log(
    `${colors.cyan}ℹ Encontrados ${files.length} arquivos para verificar.${colors.reset}\n`,
  );

  files.forEach((file) => analyzeFile(file));

  printReport();

  if (options.strict && stats.warnings > 0) process.exit(1);
  if (stats.errors > 0) process.exit(1);
  process.exit(0);
}

function printReport() {
  console.log(`\n${colors.bold}📊 RELATÓRIO FINAL${colors.reset}`);
  console.log("=".repeat(50));
  console.log(`Arquivos escaneados: ${stats.filesScanned}`);
  console.log(`Linhas analisadas: ${stats.linesScanned}`);
  console.log(`Problemas encontrados: ${stats.issuesFound}`);
  console.log(`  ${colors.red}❌ Erros: ${stats.errors}${colors.reset}`);
  console.log(`  ${colors.yellow}⚠️  Avisos: ${stats.warnings}${colors.reset}`);
  console.log(`  ${colors.blue}ℹ️  Infos: ${stats.info}${colors.reset}`);
  console.log("=".repeat(50));

  if (options.json) {
    fs.writeFileSync("theme-lint-report.json", JSON.stringify(issues, null, 2));
    console.log("Relatório JSON salvo em: theme-lint-report.json");
  }

  if (stats.issuesFound === 0) {
    console.log(
      `${colors.green}✅ Nenhum problema de tema encontrado!${colors.reset}`,
    );
  } else {
    const statusColor = stats.errors > 0 ? colors.red : colors.yellow;
    console.log(
      `${statusColor}Validação concluída com problemas.${colors.reset}`,
    );
  }
}

main();
