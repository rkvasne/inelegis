#!/usr/bin/env node
/**
 * Theme Validator Pro - Validador Completo e Universal de Temas CSS
 * Detecta problemas de aplicação de temas em qualquer projeto web
 * 
 * @version 3.1.0
 * @author Inelegis Team
 * @license MIT
 * 
 * Uso: node scripts/validate-theme.js [opções]
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

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURAÇÃO COMPLETA
// ============================================================================

const DEFAULT_CONFIG = {
    // Extensões de arquivos para verificar
    extensions: {
        css: ['.css', '.scss', '.sass', '.less', '.styl', '.stylus', '.pcss', '.postcss'],
        html: ['.html', '.htm', '.xhtml', '.php', '.erb', '.ejs', '.hbs', '.handlebars', '.pug', '.jade', '.twig', '.blade.php', '.njk', '.liquid'],
        js: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.vue', '.svelte', '.astro'],
        config: ['.json', '.yaml', '.yml']
    },
    
    // Diretórios para ignorar
    ignoreDirs: [
        'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', '.output',
        'coverage', 'vendor', '.cache', '.parcel-cache', '.turbo', '.vercel',
        '__pycache__', '.pytest_cache', 'venv', 'env', '.env', 'target',
        'out', 'public/build', 'static/build', '.svelte-kit', '.astro'
    ],

    // Arquivos para ignorar
    ignoreFiles: [
        '*.min.css', '*.min.js', '*.bundle.js', '*.bundle.css',
        '*.map', '*.d.ts', '*.test.*', '*.spec.*', '*.stories.*',
        'serve.js', 'optimize.js', 'validate-theme.js',
        'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
        'tailwind.config.*', 'postcss.config.*', 'vite.config.*',
        'webpack.config.*', 'rollup.config.*', 'tsconfig.*'
    ],
    
    // ========================================================================
    // CORES NOMEADAS - Lista completa de todas as cores CSS nomeadas
    // ========================================================================
    namedColors: {
        // Cores básicas (mais problemáticas)
        basic: [
            'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
            'pink', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'olive', 'navy',
            'teal', 'aqua', 'maroon', 'fuchsia', 'silver', 'brown'
        ],
        
        // Cores estendidas (147 cores CSS nomeadas)
        extended: [
            'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige', 'bisque',
            'blanchedalmond', 'blueviolet', 'burlywood', 'cadetblue', 'chartreuse',
            'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'darkblue',
            'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki',
            'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
            'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
            'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
            'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'gainsboro',
            'ghostwhite', 'gold', 'goldenrod', 'greenyellow', 'honeydew', 'hotpink',
            'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
            'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
            'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink',
            'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
            'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 'mediumaquamarine',
            'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue',
            'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
            'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab',
            'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
            'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'plum', 'powderblue',
            'rebeccapurple', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown',
            'seagreen', 'seashell', 'sienna', 'skyblue', 'slateblue', 'slategray', 'slategrey',
            'snow', 'springgreen', 'steelblue', 'tan', 'thistle', 'tomato', 'turquoise',
            'violet', 'wheat', 'whitesmoke', 'yellowgreen'
        ],
        
        // Valores especiais (geralmente OK, mas verificar contexto)
        special: ['transparent', 'currentColor', 'currentcolor', 'inherit', 'initial', 'unset', 'revert']
    },

    // ========================================================================
    // VARIÁVEIS NÃO-SEMÂNTICAS - Padrões de frameworks e design systems
    // ========================================================================
    nonSemanticPatterns: {
        // Tailwind CSS / Design Tokens numéricos
        tailwind: [
            /--(?:tw-)?(?:slate|gray|grey|zinc|neutral|stone)-(?:\d{1,3}|50)/i,
            /--(?:tw-)?(?:red|orange|amber|yellow|lime|green|emerald|teal)-(?:\d{1,3}|50)/i,
            /--(?:tw-)?(?:cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:\d{1,3}|50)/i
        ],
        
        // Material Design
        material: [
            /--(?:md-|mdc-)?(?:red|pink|purple|deep-purple|indigo|blue|light-blue)-(?:A?\d{2,3})/i,
            /--(?:md-|mdc-)?(?:cyan|teal|green|light-green|lime|yellow|amber|orange)-(?:A?\d{2,3})/i,
            /--(?:md-|mdc-)?(?:deep-orange|brown|grey|gray|blue-grey|blue-gray)-(?:A?\d{2,3})/i
        ],
        
        // Bootstrap
        bootstrap: [
            /--(?:bs-)?(?:gray|grey)-(?:\d{3})/i,
            /--(?:bs-)?(?:blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-(?:\d{3})?/i
        ],
        
        // Chakra UI
        chakra: [
            /--chakra-colors-(?:gray|red|orange|yellow|green|teal|blue|cyan|purple|pink)-(?:\d{2,3})/i,
            /--chakra-colors-(?:whiteAlpha|blackAlpha)-(?:\d{2,3})/i
        ],
        
        // Ant Design
        antd: [
            /--ant-(?:blue|purple|cyan|green|magenta|pink|red|orange|yellow|volcano|geekblue|lime|gold)-(?:\d)/i
        ],
        
        // Open Props / Design Tokens genéricos
        generic: [
            /--(?:color-)?(?:gray|grey|neutral|slate|zinc|stone)-(?:\d{1,3})/i,
            /--(?:color-)?(?:red|orange|yellow|green|blue|purple|pink)-(?:\d{1,3})/i,
            /--(?:palette|clr|c)-(?:gray|grey|neutral)-(?:\d{1,3})/i
        ],
        
        // Radix UI
        radix: [
            /--(?:gray|mauve|slate|sage|olive|sand|tomato|red|ruby|crimson)-(?:a?\d{1,2})/i,
            /--(?:pink|plum|purple|violet|iris|indigo|blue|cyan|teal|jade)-(?:a?\d{1,2})/i,
            /--(?:green|grass|bronze|gold|brown|orange|amber|yellow|lime|mint|sky)-(?:a?\d{1,2})/i
        ],
        
        // Shadcn/ui
        shadcn: [
            /--(?:background|foreground|card|popover|primary|secondary|muted|accent|destructive)(?!-)/i
        ],
        
        // IBM Carbon
        carbon: [
            /--cds-(?:ui|text|icon|field|support|interactive|link|focus|inverse|skeleton)-\d{2}/i
        ]
    },

    // ========================================================================
    // VARIÁVEIS SEMÂNTICAS PERMITIDAS
    // ========================================================================
    semanticVarPrefixes: [
        // Backgrounds
        '--bg-', '--background-', '--surface-', '--canvas-',
        
        // Text/Foreground
        '--text-', '--fg-', '--foreground-', '--content-',
        
        // Borders
        '--border-', '--outline-', '--divider-', '--separator-',
        
        // Shadows
        '--shadow-', '--elevation-', '--drop-shadow-',
        
        // States
        '--hover-', '--active-', '--focus-', '--disabled-', '--selected-',
        
        // Semantic colors
        '--primary-', '--secondary-', '--tertiary-', '--accent-',
        '--success-', '--warning-', '--error-', '--danger-', '--info-',
        '--positive-', '--negative-', '--caution-', '--neutral-color-',
        
        // Components
        '--btn-', '--button-', '--input-', '--card-', '--modal-', '--nav-',
        '--header-', '--footer-', '--sidebar-', '--menu-', '--tooltip-',
        '--badge-', '--alert-', '--toast-', '--dialog-', '--dropdown-',
        
        // Layout
        '--spacing-', '--space-', '--gap-', '--margin-', '--padding-',
        '--radius-', '--rounded-', '--corner-',
        
        // Typography
        '--font-', '--text-size-', '--line-height-', '--letter-spacing-',
        
        // Transitions
        '--transition-', '--duration-', '--timing-', '--ease-', '--animation-',
        
        // Z-index
        '--z-', '--layer-', '--zindex-',
        
        // Breakpoints
        '--breakpoint-', '--screen-', '--viewport-',
        
        // Theme-specific
        '--theme-', '--color-scheme-', '--mode-'
    ],
    
    // ========================================================================
    // PROPRIEDADES CSS QUE DEVEM USAR VARIÁVEIS DE TEMA
    // ========================================================================
    themeProperties: {
        // Cores diretas
        color: ['color', 'background-color', 'border-color', 'outline-color', 'fill', 'stroke'],
        
        // Shorthand com cores
        shorthand: [
            'background', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
            'outline', 'text-decoration', 'column-rule', 'box-shadow', 'text-shadow'
        ],
        
        // Cores específicas
        specific: [
            'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
            'border-block-color', 'border-inline-color', 'border-block-start-color',
            'border-block-end-color', 'border-inline-start-color', 'border-inline-end-color',
            'caret-color', 'text-decoration-color', 'text-emphasis-color', 'accent-color',
            'scrollbar-color', 'flood-color', 'lighting-color', 'stop-color'
        ],
        
        // Filtros e efeitos
        effects: ['filter', 'backdrop-filter'],
        
        // SVG
        svg: ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color']
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
            /(?:color|backgroundColor|borderColor)\s*:\s*['"`](?:rgb|hsl)a?\([^)]+\)['"`]/gi
        ],
        
        // CSS-in-JS problemático
        cssInJs: [
            /styled\.[a-z]+`[^`]*(?:color|background|border)\s*:\s*#[0-9a-fA-F]{3,8}/gi,
            /css`[^`]*(?:color|background|border)\s*:\s*#[0-9a-fA-F]{3,8}/gi,
            /emotion\/css[^`]*`[^`]*#[0-9a-fA-F]{3,8}/gi
        ],
        
        // Tailwind classes com cores hardcoded
        tailwindHardcoded: [
            /(?:bg|text|border|ring|shadow)-\[#[0-9a-fA-F]{3,8}\]/gi,
            /(?:bg|text|border|ring|shadow)-\[rgb\([^\]]+\)\]/gi,
            /(?:bg|text|border|ring|shadow)-\[hsl\([^\]]+\)\]/gi
        ],
        
        // SVG com cores inline
        svgInline: [
            /<(?:path|rect|circle|ellipse|line|polygon|polyline|text|g|svg)[^>]*(?:fill|stroke)\s*=\s*["']#[0-9a-fA-F]{3,8}["']/gi,
            /<(?:path|rect|circle|ellipse|line|polygon|polyline|text|g|svg)[^>]*(?:fill|stroke)\s*=\s*["'](?:rgb|hsl)a?\([^)]+\)["']/gi
        ],
        
        // Canvas/WebGL
        canvas: [
            /\.fillStyle\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
            /\.strokeStyle\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi,
            /\.shadowColor\s*=\s*['"`]#[0-9a-fA-F]{3,8}['"`]/gi
        ]
    },
    
    // ========================================================================
    // CONTEXTOS ONDE CORES HARDCODED SÃO ACEITÁVEIS
    // ========================================================================
    allowedContexts: [
        // Definições de variáveis CSS
        /^\s*--[\w-]+\s*:/,
        
        // Comentários
        /^\s*\/\*/, /^\s*\/\//, /^\s*\*/, /^\s*#.*comment/i,
        
        // Data URLs
        /data:image/, /url\(['"]?data:/,
        
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
        /<meta[^>]*theme-color/i
    ],
    
    // Severidade padrão por categoria
    severityDefaults: {
        'hex-color': 'error',
        'rgb-color': 'warning',
        'hsl-color': 'warning',
        'named-color-basic': 'error',
        'named-color-extended': 'warning',
        'non-semantic-var': 'warning',
        'gradient-hardcoded': 'warning',
        'inline-style': 'error',
        'important-color': 'warning',
        'js-inline-style': 'error',
        'css-in-js': 'warning',
        'tailwind-hardcoded': 'error',
        'svg-inline-color': 'warning',
        'canvas-color': 'info',
        'opacity-hardcoded': 'info',
        'dark-mode-no-vars': 'error',
        'inconsistent-vars': 'warning',
        'missing-dark-mode': 'info',
        'color-contrast': 'warning',
        'z-index-hardcoded': 'info',
        'magic-number': 'info',
        'component-theme-missing': 'warning',
        'gradient-not-theme-aware': 'info',
        'contrast-issue': 'info',
        'unused-theme-vars': 'info',
        'light-color-no-dark-override': 'warning'
    }
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
    fixable: 0
};

const issues = [];
const suggestions = new Map(); // Sugestões de correção

// ============================================================================
// ARGUMENTOS CLI
// ============================================================================

const args = process.argv.slice(2);
const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    strict: args.includes('--strict') || args.includes('-s'),
    fix: args.includes('--fix'),
    json: args.includes('--json'),
    help: args.includes('--help') || args.includes('-h'),
    quiet: args.includes('--quiet') || args.includes('-q'),
    noColor: args.includes('--no-color'),
    summary: args.includes('--summary'),
    ignore: getArgValue('--ignore'),
    only: getArgValue('--only'),
    config: getArgValue('--config'),
    maxIssues: parseInt(getArgValue('--max-issues') || '500'),
    minSeverity: getArgValue('--min-severity') || 'info'
};

function getArgValue(flag) {
    const index = args.indexOf(flag);
    return index !== -1 && args[index + 1] ? args[index + 1] : null;
}

// ============================================================================
// CORES PARA OUTPUT (ANSI)
// ============================================================================

const colors = options.noColor ? {
    reset: '', red: '', green: '', yellow: '', blue: '', magenta: '', cyan: '', gray: '', bold: '', dim: ''
} : {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m',
    dim: '\x1b[2m'
};

// ============================================================================
// HELP
// ============================================================================

if (options.help) {
    console.log(`
${colors.bold}🎨 Theme Validator Pro v3.1.0${colors.reset}
${colors.dim}Validador Universal de Temas CSS${colors.reset}

${colors.bold}USO:${colors.reset}
  node scripts/validate-theme.js [opções]

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
  node scripts/validate-theme.js

  ${colors.dim}# Modo verbose com sugestões de correção${colors.reset}
  node scripts/validate-theme.js --verbose --fix

  ${colors.dim}# Apenas erros, saída JSON${colors.reset}
  node scripts/validate-theme.js --min-severity error --json

  ${colors.dim}# Verificar apenas arquivos CSS${colors.reset}
  node scripts/validate-theme.js --only "**/*.css"

  ${colors.dim}# Ignorar pasta específica${colors.reset}
  node scripts/validate-theme.js --ignore "legacy/**"
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
            const customConfig = JSON.parse(fs.readFileSync(options.config, 'utf8'));
            CONFIG = { ...DEFAULT_CONFIG, ...customConfig };
            if (!options.quiet) console.log(`${colors.cyan}ℹ${colors.reset} Configuração carregada: ${options.config}`);
        } catch (e) {
            console.error(`${colors.red}✗${colors.reset} Erro ao carregar config: ${e.message}`);
        }
    }
    
    // Procurar .themercvalidator.json ou theme-validator.config.json
    const configFiles = ['.themevalidator.json', 'theme-validator.config.json', '.themevalidatorrc'];
    for (const file of configFiles) {
        if (fs.existsSync(file)) {
            try {
                const customConfig = JSON.parse(fs.readFileSync(file, 'utf8'));
                CONFIG = { ...DEFAULT_CONFIG, ...customConfig };
                if (!options.quiet) console.log(`${colors.cyan}ℹ${colors.reset} Configuração encontrada: ${file}`);
                break;
            } catch (e) { /* ignore */ }
        }
    }
}

/**
 * Verifica se um arquivo deve ser ignorado
 */
function shouldIgnoreFile(filePath) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Verificar padrões de ignore
    for (const pattern of CONFIG.ignoreFiles) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
        if (regex.test(fileName)) return true;
    }
    
    // Verificar --ignore
    if (options.ignore) {
        const ignoreRegex = new RegExp(options.ignore.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        if (ignoreRegex.test(relativePath)) return true;
    }
    
    // Verificar --only
    if (options.only) {
        const onlyRegex = new RegExp(options.only.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        if (!onlyRegex.test(relativePath)) return true;
    }
    
    return false;
}

/**
 * Verifica se uma linha deve ser ignorada
 */
function shouldIgnoreLine(line, content, lineIndex) {
    const trimmed = line.trim();
    
    // Verificar contextos permitidos
    for (const pattern of CONFIG.allowedContexts) {
        if (pattern.test(trimmed)) return true;
    }
    
    // Verificar se está dentro de um bloco de comentário
    const beforeLine = content.substring(0, content.split('\n').slice(0, lineIndex).join('\n').length);
    const openComments = (beforeLine.match(/\/\*/g) || []).length;
    const closeComments = (beforeLine.match(/\*\//g) || []).length;
    if (openComments > closeComments) return true;
    
    // Ignorar linhas de definição de variáveis
    if (/^\s*--[\w-]+\s*:/.test(trimmed)) return true;
    
    // Ignorar @import, @use, @forward
    if (/^\s*@(?:import|use|forward)/.test(trimmed)) return true;
    
    // Ignorar URLs de fontes
    if (/url\s*\([^)]*(?:fonts|woff|ttf|otf|eot)/i.test(line)) return true;
    
    return false;
}

/**
 * Obtém o tipo de arquivo
 */
function getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (CONFIG.extensions.css.includes(ext)) return 'css';
    if (CONFIG.extensions.html.includes(ext)) return 'html';
    if (CONFIG.extensions.js.includes(ext)) return 'js';
    if (CONFIG.extensions.config.includes(ext)) return 'config';
    
    return null;
}

/**
 * Adiciona uma issue
 */
function addIssue(category, severity, file, line, column, message, context, suggestion, fixable = false) {
    // Verificar severidade mínima
    const severityOrder = { error: 3, warning: 2, info: 1 };
    if (severityOrder[severity] < severityOrder[options.minSeverity]) return;
    
    // Verificar limite de issues
    if (issues.length >= options.maxIssues) return;
    
    const issue = {
        category,
        severity,
        file,
        line,
        column: column || 0,
        message,
        context: context ? context.substring(0, 150) + (context.length > 150 ? '...' : '') : '',
        suggestion,
        fixable
    };
    
    issues.push(issue);
    stats.issuesFound++;
    stats.bySeverity[severity]++;
    stats[severity === 'error' ? 'errors' : severity === 'warning' ? 'warnings' : 'info']++;
    
    if (!stats.byCategory[category]) stats.byCategory[category] = 0;
    stats.byCategory[category]++;
    
    if (!stats.byFile[file]) stats.byFile[file] = 0;
    stats.byFile[file]++;
    
    if (fixable) stats.fixable++;
}


// ============================================================================
// VERIFICADORES DE CORES
// ============================================================================

/**
 * Verifica cores hexadecimais
 */
function checkHexColors(line, lineNum, file, fileType) {
    // Padrão para cores hex (3, 4, 6 ou 8 dígitos)
    const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F\w-])/g;
    
    let match;
    while ((match = hexPattern.exec(line)) !== null) {
        const color = match[0];
        const column = match.index;
        
        // Ignorar se está dentro de var()
        const before = line.substring(0, match.index);
        if (/var\s*\([^)]*$/.test(before)) continue;
        
        // Ignorar se é parte de um ID CSS (#header, #main)
        if (/^\s*#[\w-]+\s*\{/.test(line) || /^\s*#[\w-]+\s*,/.test(line)) continue;
        
        // Ignorar se está em um seletor
        if (fileType === 'css' && !line.includes(':')) continue;
        
        // Ignorar cores em URLs
        if (/url\s*\([^)]*$/.test(before)) continue;
        
        // Determinar sugestão baseada no contexto
        let suggestion = 'Use var(--bg-primary), var(--text-primary), etc.';
        if (/background/i.test(line)) suggestion = 'Use var(--bg-*) para backgrounds';
        else if (/color/i.test(line) && !/background/i.test(line)) suggestion = 'Use var(--text-*) para cores de texto';
        else if (/border/i.test(line)) suggestion = 'Use var(--border-*) para bordas';
        else if (/shadow/i.test(line)) suggestion = 'Use var(--shadow-*) para sombras';
        
        addIssue(
            'hex-color',
            CONFIG.severityDefaults['hex-color'],
            file, lineNum, column,
            `Cor hexadecimal hardcoded: ${color}`,
            line.trim(),
            suggestion,
            true
        );
    }
}

/**
 * Verifica cores RGB/RGBA
 */
function checkRgbColors(line, lineNum, file) {
    const rgbPattern = /rgba?\s*\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
    
    let match;
    while ((match = rgbPattern.exec(line)) !== null) {
        const color = match[0];
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        // Ignorar preto/branco em sombras
        if ((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)) {
            if (/shadow/i.test(line)) continue;
        }
        
        // Ignorar se está dentro de var()
        const before = line.substring(0, match.index);
        if (/var\s*\([^)]*$/.test(before)) continue;
        
        addIssue(
            'rgb-color',
            CONFIG.severityDefaults['rgb-color'],
            file, lineNum, match.index,
            `Cor RGB hardcoded: ${color}`,
            line.trim(),
            'Use variáveis CSS semânticas',
            true
        );
    }
}

/**
 * Verifica cores HSL/HSLA
 */
function checkHslColors(line, lineNum, file) {
    const hslPattern = /hsla?\s*\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%?\s*[,\s]\s*[\d.]+%?(?:\s*[,\/]\s*[\d.%]+)?\s*\)/gi;
    
    let match;
    while ((match = hslPattern.exec(line)) !== null) {
        const before = line.substring(0, match.index);
        if (/var\s*\([^)]*$/.test(before)) continue;
        
        addIssue(
            'hsl-color',
            CONFIG.severityDefaults['hsl-color'],
            file, lineNum, match.index,
            `Cor HSL hardcoded: ${match[0]}`,
            line.trim(),
            'Use variáveis CSS semânticas',
            true
        );
    }
}

/**
 * Verifica cores nomeadas
 */
function checkNamedColors(line, lineNum, file, fileType) {
    // Propriedades que podem ter cores
    const allProps = [
        ...CONFIG.themeProperties.color,
        ...CONFIG.themeProperties.shorthand,
        ...CONFIG.themeProperties.specific
    ];
    
    const propPattern = new RegExp(`(${allProps.join('|')})\\s*:\\s*([^;{}]+)`, 'gi');
    
    let propMatch;
    while ((propMatch = propPattern.exec(line)) !== null) {
        const prop = propMatch[1];
        const value = propMatch[2].toLowerCase();
        
        // Verificar cores básicas (mais problemáticas)
        for (const color of CONFIG.namedColors.basic) {
            const colorRegex = new RegExp(`\\b${color}\\b(?!-)`, 'i');
            if (colorRegex.test(value)) {
                // Ignorar valores especiais em contextos apropriados
                if (color === 'transparent' && /background/i.test(prop)) continue;
                if (color === 'inherit' || color === 'initial' || color === 'unset') continue;
                
                addIssue(
                    'named-color-basic',
                    CONFIG.severityDefaults['named-color-basic'],
                    file, lineNum, propMatch.index,
                    `Cor nomeada básica: '${color}'`,
                    line.trim(),
                    `Substitua '${color}' por uma variável CSS semântica`,
                    true
                );
            }
        }
        
        // Verificar cores estendidas
        for (const color of CONFIG.namedColors.extended) {
            const colorRegex = new RegExp(`\\b${color}\\b(?!-)`, 'i');
            if (colorRegex.test(value)) {
                addIssue(
                    'named-color-extended',
                    CONFIG.severityDefaults['named-color-extended'],
                    file, lineNum, propMatch.index,
                    `Cor nomeada estendida: '${color}'`,
                    line.trim(),
                    `Considere usar variável CSS ao invés de '${color}'`,
                    true
                );
            }
        }
    }
}


/**
 * Verifica variáveis não-semânticas
 */
function checkNonSemanticVars(line, lineNum, file) {
    // Verificar todos os padrões de frameworks
    for (const [framework, patterns] of Object.entries(CONFIG.nonSemanticPatterns)) {
        for (const pattern of patterns) {
            const matches = line.match(pattern);
            if (matches) {
                for (const match of matches) {
                    addIssue(
                        'non-semantic-var',
                        CONFIG.severityDefaults['non-semantic-var'],
                        file, lineNum, line.indexOf(match),
                        `Variável não-semântica (${framework}): ${match}`,
                        line.trim(),
                        'Use variáveis semânticas como --bg-primary, --text-secondary',
                        false
                    );
                }
            }
        }
    }
}

/**
 * Verifica gradientes com cores hardcoded
 */
function checkGradients(line, lineNum, file) {
    const gradientPattern = /(linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\([^)]+\)/gi;
    
    let match;
    while ((match = gradientPattern.exec(line)) !== null) {
        const gradient = match[0];
        
        // Ignorar se está em definição de variável
        if (/^\s*--[\w-]+\s*:/.test(line)) continue;
        
        // Verificar cores hex
        if (/#[0-9a-fA-F]{3,8}/.test(gradient)) {
            addIssue(
                'gradient-hardcoded',
                CONFIG.severityDefaults['gradient-hardcoded'],
                file, lineNum, match.index,
                'Gradiente com cor hexadecimal hardcoded',
                line.trim(),
                'Use variáveis: linear-gradient(var(--primary-500), var(--primary-700))',
                true
            );
        }
        
        // Verificar cores RGB/HSL
        if (/rgba?\s*\(|hsla?\s*\(/i.test(gradient)) {
            addIssue(
                'gradient-hardcoded',
                CONFIG.severityDefaults['gradient-hardcoded'],
                file, lineNum, match.index,
                'Gradiente com cor RGB/HSL hardcoded',
                line.trim(),
                'Use variáveis CSS no gradiente',
                true
            );
        }
        
        // Verificar cores nomeadas
        for (const color of CONFIG.namedColors.basic) {
            if (new RegExp(`\\b${color}\\b`, 'i').test(gradient)) {
                addIssue(
                    'gradient-hardcoded',
                    CONFIG.severityDefaults['gradient-hardcoded'],
                    file, lineNum, match.index,
                    `Gradiente com cor nomeada: '${color}'`,
                    line.trim(),
                    'Use variáveis CSS no gradiente',
                    true
                );
                break;
            }
        }
    }
}

/**
 * Verifica estilos inline HTML
 */
function checkInlineStyles(line, lineNum, file) {
    const inlinePattern = /style\s*=\s*["']([^"']+)["']/gi;
    
    let match;
    while ((match = inlinePattern.exec(line)) !== null) {
        const style = match[1];
        
        // Verificar cores hardcoded
        if (/#[0-9a-fA-F]{3,8}/.test(style)) {
            addIssue(
                'inline-style',
                CONFIG.severityDefaults['inline-style'],
                file, lineNum, match.index,
                'Cor hexadecimal em estilo inline',
                line.trim(),
                'Use classes CSS com variáveis de tema',
                true
            );
        }
        
        if (/rgba?\s*\(|hsla?\s*\(/i.test(style)) {
            addIssue(
                'inline-style',
                CONFIG.severityDefaults['inline-style'],
                file, lineNum, match.index,
                'Cor RGB/HSL em estilo inline',
                line.trim(),
                'Use classes CSS com variáveis de tema',
                true
            );
        }
        
        // Verificar cores nomeadas em inline
        for (const color of CONFIG.namedColors.basic) {
            if (new RegExp(`(?:color|background)\\s*:\\s*${color}\\b`, 'i').test(style)) {
                addIssue(
                    'inline-style',
                    CONFIG.severityDefaults['inline-style'],
                    file, lineNum, match.index,
                    `Cor nomeada '${color}' em estilo inline`,
                    line.trim(),
                    'Use classes CSS com variáveis de tema',
                    true
                );
                break;
            }
        }
    }
}

/**
 * Verifica !important em propriedades de cor
 */
function checkImportantColors(line, lineNum, file) {
    const allColorProps = [
        ...CONFIG.themeProperties.color,
        ...CONFIG.themeProperties.shorthand,
        ...CONFIG.themeProperties.specific
    ];
    
    for (const prop of allColorProps) {
        const pattern = new RegExp(`${prop}\\s*:[^;]*!important`, 'gi');
        if (pattern.test(line)) {
            addIssue(
                'important-color',
                CONFIG.severityDefaults['important-color'],
                file, lineNum, 0,
                `!important em '${prop}' pode quebrar temas`,
                line.trim(),
                'Evite !important - use especificidade CSS adequada',
                false
            );
        }
    }
}


// ============================================================================
// VERIFICADORES JAVASCRIPT/TYPESCRIPT
// ============================================================================

/**
 * Verifica estilos inline em JavaScript
 */
function checkJsInlineStyles(line, lineNum, file) {
    for (const pattern of CONFIG.problematicPatterns.jsInlineStyles) {
        const matches = line.match(pattern);
        if (matches) {
            for (const match of matches) {
                addIssue(
                    'js-inline-style',
                    CONFIG.severityDefaults['js-inline-style'],
                    file, lineNum, line.indexOf(match),
                    'Cor hardcoded em estilo JavaScript inline',
                    line.trim(),
                    'Use variáveis CSS ou classes ao invés de cores inline',
                    true
                );
            }
        }
    }
}

/**
 * Verifica CSS-in-JS
 */
function checkCssInJs(line, lineNum, file) {
    for (const pattern of CONFIG.problematicPatterns.cssInJs) {
        if (pattern.test(line)) {
            addIssue(
                'css-in-js',
                CONFIG.severityDefaults['css-in-js'],
                file, lineNum, 0,
                'Cor hardcoded em CSS-in-JS',
                line.trim(),
                'Use variáveis CSS: color: var(--text-primary)',
                true
            );
        }
    }
}

/**
 * Verifica Tailwind classes com cores hardcoded
 */
function checkTailwindHardcoded(line, lineNum, file) {
    for (const pattern of CONFIG.problematicPatterns.tailwindHardcoded) {
        const matches = line.match(pattern);
        if (matches) {
            for (const match of matches) {
                addIssue(
                    'tailwind-hardcoded',
                    CONFIG.severityDefaults['tailwind-hardcoded'],
                    file, lineNum, line.indexOf(match),
                    `Tailwind com cor hardcoded: ${match}`,
                    line.trim(),
                    'Use classes de tema Tailwind ou variáveis CSS',
                    true
                );
            }
        }
    }
}

/**
 * Verifica SVG com cores inline
 */
function checkSvgInlineColors(line, lineNum, file) {
    for (const pattern of CONFIG.problematicPatterns.svgInline) {
        const matches = line.match(pattern);
        if (matches) {
            for (const match of matches) {
                // Ignorar currentColor
                if (/currentColor/i.test(match)) continue;
                
                addIssue(
                    'svg-inline-color',
                    CONFIG.severityDefaults['svg-inline-color'],
                    file, lineNum, line.indexOf(match),
                    'SVG com cor hardcoded',
                    line.trim().substring(0, 100),
                    'Use fill="currentColor" ou variáveis CSS',
                    true
                );
            }
        }
    }
}

/**
 * Verifica Canvas/WebGL colors
 */
function checkCanvasColors(line, lineNum, file) {
    for (const pattern of CONFIG.problematicPatterns.canvas) {
        const matches = line.match(pattern);
        if (matches) {
            for (const match of matches) {
                addIssue(
                    'canvas-color',
                    CONFIG.severityDefaults['canvas-color'],
                    file, lineNum, line.indexOf(match),
                    'Canvas com cor hardcoded',
                    line.trim(),
                    'Considere usar variáveis CSS via getComputedStyle()',
                    false
                );
            }
        }
    }
}

// ============================================================================
// VERIFICADORES DE ARQUIVO COMPLETO
// ============================================================================

/**
 * Verifica se tem dark mode sem variáveis
 */
function checkDarkModeWithoutVars(content, file) {
    const darkModePatterns = [
        /\.dark\b/i,
        /\.dark-mode\b/i,
        /\.dark-theme\b/i,
        /\[data-theme\s*=\s*["']dark["']\]/i,
        /\[data-mode\s*=\s*["']dark["']\]/i,
        /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/i,
        /\.theme-dark\b/i,
        /:root\.dark\b/i
    ];
    
    let hasDarkMode = false;
    for (const pattern of darkModePatterns) {
        if (pattern.test(content)) {
            hasDarkMode = true;
            break;
        }
    }
    
    if (hasDarkMode) {
        const usesVars = /var\s*\(\s*--/i.test(content);
        
        if (!usesVars) {
            addIssue(
                'dark-mode-no-vars',
                CONFIG.severityDefaults['dark-mode-no-vars'],
                file, 0, 0,
                'Dark mode detectado mas não usa variáveis CSS',
                'Arquivo tem seletores de dark mode sem var(--...)',
                'Use variáveis CSS para facilitar a troca de temas',
                false
            );
        }
    }
}

/**
 * Verifica consistência de variáveis
 */
function checkVariableConsistency(content, file) {
    const varsUsed = new Set();
    const varPattern = /var\s*\(\s*(--[\w-]+)/g;
    
    let match;
    while ((match = varPattern.exec(content)) !== null) {
        varsUsed.add(match[1]);
    }
    
    if (varsUsed.size === 0) return;
    
    let semanticCount = 0;
    let nonSemanticCount = 0;
    const nonSemanticVars = [];
    
    for (const varName of varsUsed) {
        const isSemantic = CONFIG.semanticVarPrefixes.some(prefix => varName.startsWith(prefix));
        
        let isNonSemantic = false;
        for (const patterns of Object.values(CONFIG.nonSemanticPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(varName)) {
                    isNonSemantic = true;
                    nonSemanticVars.push(varName);
                    break;
                }
            }
            if (isNonSemantic) break;
        }
        
        if (isSemantic) semanticCount++;
        if (isNonSemantic) nonSemanticCount++;
    }
    
    if (semanticCount > 0 && nonSemanticCount > 0) {
        addIssue(
            'inconsistent-vars',
            CONFIG.severityDefaults['inconsistent-vars'],
            file, 0, 0,
            `Mix de variáveis semânticas (${semanticCount}) e não-semânticas (${nonSemanticCount})`,
            `Variáveis não-semânticas: ${nonSemanticVars.slice(0, 5).join(', ')}${nonSemanticVars.length > 5 ? '...' : ''}`,
            'Padronize o uso de variáveis semânticas em todo o projeto',
            false
        );
    }
}

/**
 * Verifica se arquivo CSS deveria ter suporte a dark mode
 */
function checkMissingDarkMode(content, file) {
    // Verificar se é um arquivo CSS principal
    const isMainCss = /styles?\.css$|main\.css$|global\.css$|app\.css$/i.test(file);
    
    if (!isMainCss) return;
    
    // Verificar se tem :root com variáveis
    const hasRootVars = /:root\s*\{[^}]*--[\w-]+\s*:/i.test(content);
    
    if (hasRootVars) {
        // Verificar se tem dark mode
        const hasDarkMode = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark|\.dark\s*\{|\.dark-mode\s*\{|\[data-theme\s*=\s*["']dark/i.test(content);
        
        if (!hasDarkMode) {
            addIssue(
                'missing-dark-mode',
                CONFIG.severityDefaults['missing-dark-mode'],
                file, 0, 0,
                'Arquivo principal CSS sem suporte a dark mode',
                'Variáveis CSS definidas em :root mas sem dark mode',
                'Adicione @media (prefers-color-scheme: dark) ou .dark { }',
                false
            );
        }
    }
}

/**
 * Verifica opacidade hardcoded
 */
function checkHardcodedOpacity(line, lineNum, file) {
    const opacityPattern = /opacity\s*:\s*(0\.\d+)/gi;
    
    let match;
    while ((match = opacityPattern.exec(line)) !== null) {
        const value = parseFloat(match[1]);
        
        // Ignorar valores comuns
        if ([0, 0.5, 1].includes(value)) continue;
        
        // Ignorar se está em hover/focus/transition
        if (/hover|focus|active|transition|animation/i.test(line)) continue;
        
        addIssue(
            'opacity-hardcoded',
            CONFIG.severityDefaults['opacity-hardcoded'],
            file, lineNum, match.index,
            `Opacidade hardcoded: ${match[1]}`,
            line.trim(),
            'Considere usar variável CSS para opacidade se for parte do tema',
            false
        );
    }
}

/**
 * Verifica z-index hardcoded
 */
function checkZIndexHardcoded(line, lineNum, file) {
    const zIndexPattern = /z-index\s*:\s*(\d+)/gi;
    
    let match;
    while ((match = zIndexPattern.exec(line)) !== null) {
        const value = parseInt(match[1]);
        
        // Ignorar valores baixos e comuns
        if (value <= 10 || value === 100 || value === 1000) continue;
        
        // Verificar se usa variável
        if (/var\s*\(/.test(line)) continue;
        
        addIssue(
            'z-index-hardcoded',
            CONFIG.severityDefaults['z-index-hardcoded'],
            file, lineNum, match.index,
            `Z-index hardcoded: ${value}`,
            line.trim(),
            'Use variáveis CSS para z-index: var(--z-modal), var(--z-tooltip)',
            false
        );
    }
}


/**
 * Verifica se cores claras têm override no dark theme
 */
function checkLightColorsInDarkTheme(content, file) {
    // Cores claras que precisam de override no dark theme
    const lightColorVars = [
        '--primary-50', '--primary-100', '--primary-200',
        '--success-50', '--success-100', '--success-200',
        '--warning-50', '--warning-100', '--warning-200',
        '--danger-50', '--danger-100', '--danger-200',
        '--info-50', '--info-100', '--info-200'
    ];
    
    // Verificar se o arquivo tem definição de :root
    const hasRootDef = /:root\s*\{/.test(content);
    if (!hasRootDef) return;
    
    // Verificar se tem dark theme
    const hasDarkTheme = /\.dark-theme\s*\{|@media\s*\(\s*prefers-color-scheme\s*:\s*dark/.test(content);
    if (!hasDarkTheme) return;
    
    // Para cada cor clara, verificar se é usada e se tem override
    for (const colorVar of lightColorVars) {
        // Verificar se a variável é definida em :root
        const rootDefPattern = new RegExp(`:root[^}]*${colorVar.replace(/[-]/g, '\\-')}\\s*:`, 'i');
        if (!rootDefPattern.test(content)) continue;
        
        // Verificar se a variável é usada no código
        const usagePattern = new RegExp(`var\\(${colorVar.replace(/[-]/g, '\\-')}\\)`, 'g');
        const usages = content.match(usagePattern);
        if (!usages || usages.length === 0) continue;
        
        // Verificar se tem override no dark theme
        const darkOverridePattern = new RegExp(`\\.dark-theme[^}]*${colorVar.replace(/[-]/g, '\\-')}\\s*:|@media[^}]*prefers-color-scheme\\s*:\\s*dark[^}]*${colorVar.replace(/[-]/g, '\\-')}\\s*:`, 'i');
        
        if (!darkOverridePattern.test(content)) {
            addIssue(
                'light-color-no-dark-override',
                'warning',
                file, 0, 0,
                `Cor clara ${colorVar} usada ${usages.length}x mas sem override no dark theme`,
                `${colorVar} pode causar baixo contraste no modo escuro`,
                `Adicione override no .dark-theme: ${colorVar}: rgba(...) com cor mais escura`,
                false
            );
        }
    }
}

/**
 * Verifica se componentes críticos usam variáveis de tema apropriadas
 */
function checkCriticalComponentsTheme(content, file) {
    // Componentes críticos que devem usar variáveis de tema
    const criticalComponents = [
        {
            selector: /\.system-header\s*\{[^}]*background\s*:[^}]*\}/gi,
            name: 'Header',
            requiredVars: ['--header-bg', '--primary-'],
            property: 'background'
        },
        {
            selector: /\.footer\s*\{[^}]*background\s*:[^}]*\}/gi,
            name: 'Footer',
            requiredVars: ['--footer-bg', '--bg-'],
            property: 'background'
        },
        {
            selector: /\.nav-link\.active\s*\{[^}]*(?:background|color)\s*:[^}]*\}/gi,
            name: 'Nav Link Active',
            requiredVars: ['--nav-active-', '--primary-'],
            property: 'background/color'
        }
    ];
    
    for (const component of criticalComponents) {
        const matches = content.match(component.selector);
        if (matches) {
            for (const match of matches) {
                // Verificar se usa variáveis apropriadas
                const usesRequiredVar = component.requiredVars.some(varPrefix => 
                    match.includes(`var(${varPrefix}`)
                );
                
                // Verificar se tem cores hardcoded
                const hasHardcodedColor = /#[0-9a-fA-F]{3,8}/.test(match) || 
                                         /rgba?\s*\(/.test(match) ||
                                         /hsla?\s*\(/.test(match);
                
                if (!usesRequiredVar || hasHardcodedColor) {
                    addIssue(
                        'component-theme-missing',
                        'warning',
                        file, 0, 0,
                        `${component.name} não usa variáveis de tema apropriadas`,
                        match.substring(0, 100),
                        `Use variáveis como ${component.requiredVars.join(' ou ')} para ${component.property}`,
                        false
                    );
                }
            }
        }
    }
}

/**
 * Verifica se gradientes são adaptáveis ao tema
 */
function checkGradientThemeAdaptability(content, file) {
    // Buscar gradientes que sempre usam as mesmas cores
    const gradientPattern = /(linear|radial|conic)-gradient\s*\([^)]+\)/gi;
    const lines = content.split('\n');
    
    let match;
    while ((match = gradientPattern.exec(content)) !== null) {
        const gradient = match[0];
        
        // Verificar se o gradiente está em uma definição de variável
        const lineIndex = content.substring(0, match.index).split('\n').length - 1;
        const line = lines[lineIndex];
        
        if (/^\s*--[\w-]+\s*:/.test(line)) {
            // Está em uma variável, verificar se há override no dark theme
            const varName = line.match(/--[\w-]+/)[0];
            const hasDarkOverride = new RegExp(`\\.dark-theme[^}]*${varName}|@media[^}]*prefers-color-scheme\\s*:\\s*dark[^}]*${varName}`).test(content);
            
            if (!hasDarkOverride && /#[0-9a-fA-F]{3,8}/.test(gradient)) {
                addIssue(
                    'gradient-not-theme-aware',
                    'info',
                    file, lineIndex + 1, 0,
                    `Gradiente em ${varName} pode não adaptar ao tema escuro`,
                    line.trim(),
                    `Considere criar override no .dark-theme ou usar variáveis de cor`,
                    false
                );
            }
        }
    }
}

/**
 * Verifica contraste de cores em componentes ativos/hover
 */
function checkActiveStateContrast(content, file) {
    // Padrões de estados ativos que precisam de bom contraste
    const activePatterns = [
        {
            pattern: /\.active[^}]*color\s*:\s*([^;]+)/gi,
            name: 'Estado ativo'
        },
        {
            pattern: /:hover[^}]*color\s*:\s*([^;]+)/gi,
            name: 'Estado hover'
        },
        {
            pattern: /:focus[^}]*color\s*:\s*([^;]+)/gi,
            name: 'Estado focus'
        }
    ];
    
    for (const {pattern, name} of activePatterns) {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const colorValue = match[1].trim();
            
            // Verificar se usa cores muito claras (potencial problema de contraste)
            const veryLightColors = ['white', '#fff', '#ffffff', 'rgba(255, 255, 255'];
            const usesVeryLight = veryLightColors.some(color => colorValue.includes(color));
            
            if (usesVeryLight && !colorValue.includes('var(')) {
                const lineIndex = content.substring(0, match.index).split('\n').length - 1;
                addIssue(
                    'contrast-issue',
                    'info',
                    file, lineIndex + 1, 0,
                    `${name} usa cor muito clara que pode ter contraste inadequado no dark mode`,
                    match[0].substring(0, 80),
                    'Use variáveis de tema que adaptam ao modo claro/escuro',
                    false
                );
            }
        }
    }
}

/**
 * Verifica se há variáveis de tema definidas mas não usadas
 */
function checkUnusedThemeVariables(content, file) {
    // Extrair variáveis definidas
    const definedVars = new Set();
    const definePattern = /--[\w-]+\s*:/g;
    let match;
    while ((match = definePattern.exec(content)) !== null) {
        const varName = match[0].replace(':', '').trim();
        definedVars.add(varName);
    }
    
    // Extrair variáveis usadas
    const usedVars = new Set();
    const usePattern = /var\s*\(\s*(--[\w-]+)/g;
    while ((match = usePattern.exec(content)) !== null) {
        usedVars.add(match[1]);
    }
    
    // Encontrar variáveis definidas mas não usadas
    const unusedVars = [];
    for (const varName of definedVars) {
        if (!usedVars.has(varName)) {
            // Ignorar variáveis de cores base (podem ser usadas em outras variáveis)
            if (!varName.match(/--(?:primary|success|warning|danger|info|neutral)-\d+/)) {
                unusedVars.push(varName);
            }
        }
    }
    
    if (unusedVars.length > 0 && unusedVars.length < 10) {
        addIssue(
            'unused-theme-vars',
            'info',
            file, 0, 0,
            `${unusedVars.length} variável(is) de tema definida(s) mas não usada(s)`,
            `Variáveis não usadas: ${unusedVars.slice(0, 5).join(', ')}`,
            'Remova variáveis não utilizadas ou use-as no código',
            false
        );
    }
}

// ============================================================================
// PROCESSAMENTO DE ARQUIVOS
// ============================================================================

/**
 * Processa um arquivo
 */
function processFile(filePath) {
    const fileType = getFileType(filePath);
    if (!fileType) return;
    
    if (shouldIgnoreFile(filePath)) return;
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const relativePath = path.relative(process.cwd(), filePath);
        
        stats.filesScanned++;
        stats.linesScanned += lines.length;
        
        if (options.verbose && !options.quiet) {
            console.log(`${colors.dim}📄 ${relativePath}${colors.reset}`);
        }
        
        // Verificações por linha
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            if (shouldIgnoreLine(line, content, index)) return;
            
            // Verificações CSS
            if (fileType === 'css' || fileType === 'html') {
                checkHexColors(line, lineNum, relativePath, fileType);
                checkRgbColors(line, lineNum, relativePath);
                checkHslColors(line, lineNum, relativePath);
                checkNamedColors(line, lineNum, relativePath, fileType);
                checkNonSemanticVars(line, lineNum, relativePath);
                checkGradients(line, lineNum, relativePath);
                checkImportantColors(line, lineNum, relativePath);
                checkHardcodedOpacity(line, lineNum, relativePath);
                checkZIndexHardcoded(line, lineNum, relativePath);
            }
            
            // Verificações HTML
            if (fileType === 'html') {
                checkInlineStyles(line, lineNum, relativePath);
                checkSvgInlineColors(line, lineNum, relativePath);
            }
            
            // Verificações JavaScript/TypeScript
            if (fileType === 'js') {
                checkJsInlineStyles(line, lineNum, relativePath);
                checkCssInJs(line, lineNum, relativePath);
                checkTailwindHardcoded(line, lineNum, relativePath);
                checkSvgInlineColors(line, lineNum, relativePath);
                checkCanvasColors(line, lineNum, relativePath);
                checkHexColors(line, lineNum, relativePath, fileType);
            }
        });
        
        // Verificações de arquivo completo
        if (fileType === 'css') {
            checkDarkModeWithoutVars(content, relativePath);
            checkVariableConsistency(content, relativePath);
            checkMissingDarkMode(content, relativePath);
            checkLightColorsInDarkTheme(content, relativePath);
            checkCriticalComponentsTheme(content, relativePath);
            checkGradientThemeAdaptability(content, relativePath);
            checkActiveStateContrast(content, relativePath);
            checkUnusedThemeVariables(content, relativePath);
        }
        
    } catch (error) {
        if (!options.quiet) {
            console.error(`${colors.red}✗${colors.reset} Erro ao ler ${filePath}: ${error.message}`);
        }
    }
}

/**
 * Percorre diretórios recursivamente
 */
function walkDir(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            
            try {
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    if (!CONFIG.ignoreDirs.includes(file)) {
                        walkDir(filePath);
                    }
                } else {
                    processFile(filePath);
                }
            } catch (e) {
                // Ignorar erros de permissão
            }
        }
    } catch (e) {
        // Ignorar erros de diretório
    }
}

// ============================================================================
// OUTPUT E RELATÓRIOS
// ============================================================================

/**
 * Retorna ícone para categoria
 */
function getCategoryIcon(category) {
    const icons = {
        'hex-color': '🎨',
        'rgb-color': '🌈',
        'hsl-color': '🌈',
        'named-color-basic': '📛',
        'named-color-extended': '📛',
        'non-semantic-var': '🏷️',
        'gradient-hardcoded': '🌅',
        'inline-style': '📝',
        'important-color': '⚡',
        'js-inline-style': '⚙️',
        'css-in-js': '💅',
        'tailwind-hardcoded': '🌬️',
        'svg-inline-color': '🖼️',
        'canvas-color': '🎨',
        'opacity-hardcoded': '👁️',
        'dark-mode-no-vars': '🌙',
        'inconsistent-vars': '🔀',
        'missing-dark-mode': '🌑',
        'z-index-hardcoded': '📊',
        'component-theme-missing': '🧩',
        'gradient-not-theme-aware': '🌈',
        'contrast-issue': '👁️',
        'unused-theme-vars': '🗑️',
        'light-color-no-dark-override': '🌓'
    };
    return icons[category] || '•';
}

/**
 * Formata nome da categoria
 */
function formatCategory(category) {
    const names = {
        'hex-color': 'Cores Hexadecimais',
        'rgb-color': 'Cores RGB/RGBA',
        'hsl-color': 'Cores HSL/HSLA',
        'named-color-basic': 'Cores Nomeadas (Básicas)',
        'named-color-extended': 'Cores Nomeadas (Estendidas)',
        'non-semantic-var': 'Variáveis Não-Semânticas',
        'gradient-hardcoded': 'Gradientes Hardcoded',
        'inline-style': 'Estilos Inline HTML',
        'important-color': '!important em Cores',
        'js-inline-style': 'Estilos Inline JS',
        'css-in-js': 'CSS-in-JS',
        'tailwind-hardcoded': 'Tailwind Hardcoded',
        'svg-inline-color': 'SVG Cores Inline',
        'canvas-color': 'Canvas Colors',
        'opacity-hardcoded': 'Opacidade Hardcoded',
        'dark-mode-no-vars': 'Dark Mode sem Variáveis',
        'inconsistent-vars': 'Variáveis Inconsistentes',
        'missing-dark-mode': 'Dark Mode Ausente',
        'z-index-hardcoded': 'Z-Index Hardcoded',
        'component-theme-missing': 'Componente sem Variáveis de Tema',
        'gradient-not-theme-aware': 'Gradiente Não Adaptável',
        'contrast-issue': 'Problema de Contraste',
        'unused-theme-vars': 'Variáveis Não Utilizadas',
        'light-color-no-dark-override': 'Cor Clara sem Override Dark'
    };
    return names[category] || category;
}

/**
 * Exibe resultados em formato texto
 */
function displayTextResults() {
    console.log('\n' + '═'.repeat(70));
    console.log(`${colors.bold}📊 RESULTADOS DA VALIDAÇÃO DE TEMA${colors.reset}`);
    console.log('═'.repeat(70) + '\n');
    
    // Estatísticas gerais
    console.log(`${colors.cyan}📁 Arquivos verificados:${colors.reset} ${stats.filesScanned}`);
    console.log(`${colors.cyan}📝 Linhas analisadas:${colors.reset} ${stats.linesScanned.toLocaleString()}`);
    console.log(`${colors.cyan}🔍 Problemas encontrados:${colors.reset} ${stats.issuesFound}`);
    console.log(`   ${colors.red}❌ Erros:${colors.reset} ${stats.errors}`);
    console.log(`   ${colors.yellow}⚠️  Warnings:${colors.reset} ${stats.warnings}`);
    console.log(`   ${colors.blue}ℹ️  Info:${colors.reset} ${stats.info}`);
    
    if (stats.fixable > 0) {
        console.log(`   ${colors.green}🔧 Corrigíveis:${colors.reset} ${stats.fixable}`);
    }
    
    // Por categoria
    if (Object.keys(stats.byCategory).length > 0) {
        console.log(`\n${colors.bold}📋 Por Categoria:${colors.reset}`);
        const sorted = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
        for (const [category, count] of sorted) {
            const icon = getCategoryIcon(category);
            const name = formatCategory(category);
            console.log(`   ${icon} ${name}: ${count}`);
        }
    }
    
    // Top arquivos com mais problemas
    if (Object.keys(stats.byFile).length > 0 && !options.summary) {
        console.log(`\n${colors.bold}📄 Arquivos com mais problemas:${colors.reset}`);
        const topFiles = Object.entries(stats.byFile)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        for (const [file, count] of topFiles) {
            console.log(`   ${colors.dim}${count}${colors.reset} ${file}`);
        }
    }
    
    // Detalhes dos problemas
    if (issues.length > 0 && !options.quiet && !options.summary) {
        console.log('\n' + '─'.repeat(70));
        console.log(`${colors.bold}📝 DETALHES DOS PROBLEMAS${colors.reset}`);
        console.log('─'.repeat(70));
        
        // Agrupar por arquivo
        const byFile = {};
        for (const issue of issues) {
            if (!byFile[issue.file]) byFile[issue.file] = [];
            byFile[issue.file].push(issue);
        }
        
        for (const [file, fileIssues] of Object.entries(byFile)) {
            console.log(`\n${colors.cyan}📄 ${file}${colors.reset}`);
            
            // Ordenar por linha
            fileIssues.sort((a, b) => a.line - b.line);
            
            for (const issue of fileIssues) {
                const icon = issue.severity === 'error' ? `${colors.red}❌` : 
                             issue.severity === 'warning' ? `${colors.yellow}⚠️` : 
                             `${colors.blue}ℹ️`;
                
                console.log(`   ${icon}${colors.reset} ${colors.dim}L${issue.line}:${colors.reset} ${issue.message}`);
                
                if (issue.context) {
                    console.log(`      ${colors.dim}${issue.context}${colors.reset}`);
                }
                
                if (options.fix && issue.suggestion) {
                    console.log(`      ${colors.green}💡 ${issue.suggestion}${colors.reset}`);
                }
            }
        }
    }
    
    // Resultado final
    console.log('\n' + '═'.repeat(70));
    
    if (stats.errors === 0 && stats.warnings === 0) {
        console.log(`${colors.green}${colors.bold}✅ VALIDAÇÃO PASSOU${colors.reset}`);
        console.log(`${colors.green}🎉 Todos os componentes usam variáveis de tema corretamente!${colors.reset}`);
    } else if (stats.errors === 0) {
        console.log(`${colors.yellow}${colors.bold}⚠️  VALIDAÇÃO PASSOU COM WARNINGS${colors.reset}`);
        console.log(`${colors.yellow}💡 Considere corrigir os ${stats.warnings} warning(s) para melhor manutenibilidade.${colors.reset}`);
    } else {
        console.log(`${colors.red}${colors.bold}❌ VALIDAÇÃO FALHOU${colors.reset}`);
        console.log(`${colors.red}💡 Corrija os ${stats.errors} erro(s) encontrado(s).${colors.reset}`);
    }
    
    console.log('═'.repeat(70) + '\n');
}

/**
 * Exibe resultados em formato JSON
 */
function displayJsonResults() {
    const result = {
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        summary: {
            filesScanned: stats.filesScanned,
            linesScanned: stats.linesScanned,
            totalIssues: stats.issuesFound,
            errors: stats.errors,
            warnings: stats.warnings,
            info: stats.info,
            fixable: stats.fixable,
            passed: stats.errors === 0
        },
        byCategory: stats.byCategory,
        byFile: stats.byFile,
        issues: issues
    };
    
    console.log(JSON.stringify(result, null, 2));
}


// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

function main() {
    const startTime = Date.now();
    
    // Carregar configuração
    loadCustomConfig();
    
    // Header
    if (!options.json && !options.quiet) {
        console.log(`${colors.bold}${colors.cyan}🎨 Theme Validator Pro v3.0.0${colors.reset}`);
        console.log(`${colors.dim}Validador Universal de Temas CSS${colors.reset}\n`);
        
        if (options.verbose) {
            console.log(`${colors.dim}Opções: ${JSON.stringify({
                strict: options.strict,
                fix: options.fix,
                minSeverity: options.minSeverity,
                maxIssues: options.maxIssues
            })}${colors.reset}\n`);
        }
        
        console.log(`${colors.dim}Iniciando validação...${colors.reset}\n`);
    }
    
    // Executar validação
    walkDir(process.cwd());
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Exibir resultados
    if (options.json) {
        displayJsonResults();
    } else {
        displayTextResults();
        console.log(`${colors.dim}⏱️  Tempo de execução: ${duration}ms${colors.reset}\n`);
    }
    
    // Exit code
    if (options.strict && (stats.errors > 0 || stats.warnings > 0)) {
        process.exit(1);
    } else if (stats.errors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

// Executar
main();
