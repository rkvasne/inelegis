/**
 * Validador de Tema
 * Verifica se todos os componentes usam variáveis CSS
 * @version 0.0.7
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Validando uso de variáveis de tema...\n');

// Padrões a buscar
const patterns = {
    hexColor: /#[0-9a-fA-F]{3,6}(?!;)/g,
    rgbColor: /rgb\([^)]+\)/g,
    rgbaColor: /rgba\([^)]+\)/g
};

// Arquivos para verificar
const filesToCheck = [
    'styles.css',
    'index.html',
    'consulta.html',
    'sobre.html',
    'faq.html',
    'landing.html'
];

let totalIssues = 0;
const issues = [];

// Verificar cada arquivo
filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Arquivo não encontrado: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Ignorar linhas de comentário
        if (line.trim().startsWith('/*') || line.trim().startsWith('//') || line.trim().startsWith('*')) {
            return;
        }

        // Ignorar definições de variáveis
        if (line.includes('--') && line.includes(':')) {
            return;
        }

        // Ignorar data URLs (SVGs inline não suportam variáveis CSS)
        if (line.includes('data:image') || line.includes('url(\'data:')) {
            return;
        }

        // Verificar cores hex
        const hexMatches = line.match(patterns.hexColor);
        if (hexMatches) {
            hexMatches.forEach(match => {
                issues.push({
                    file,
                    line: lineNum,
                    type: 'HEX',
                    value: match,
                    context: line.trim()
                });
                totalIssues++;
            });
        }

        // Verificar rgb/rgba (exceto em rgba(0, 0, 0, ...))
        const rgbMatches = line.match(patterns.rgbColor);
        if (rgbMatches) {
            rgbMatches.forEach(match => {
                if (!match.includes('0, 0, 0') && !match.includes('255, 255, 255')) {
                    issues.push({
                        file,
                        line: lineNum,
                        type: 'RGB',
                        value: match,
                        context: line.trim()
                    });
                    totalIssues++;
                }
            });
        }

        const rgbaMatches = line.match(patterns.rgbaColor);
        if (rgbaMatches) {
            rgbaMatches.forEach(match => {
                if (!match.includes('0, 0, 0') && !match.includes('255, 255, 255')) {
                    issues.push({
                        file,
                        line: lineNum,
                        type: 'RGBA',
                        value: match,
                        context: line.trim()
                    });
                    totalIssues++;
                }
            });
        }
    });
});

// Exibir resultados
if (totalIssues === 0) {
    console.log('✅ Nenhuma cor hardcoded encontrada!');
    console.log('🎉 Todos os componentes usam variáveis de tema.\n');
    process.exit(0);
} else {
    console.log(`⚠️  Encontradas ${totalIssues} cores hardcoded:\n`);

    // Agrupar por arquivo
    const byFile = {};
    issues.forEach(issue => {
        if (!byFile[issue.file]) {
            byFile[issue.file] = [];
        }
        byFile[issue.file].push(issue);
    });

    // Exibir por arquivo
    Object.keys(byFile).forEach(file => {
        console.log(`📄 ${file}:`);
        byFile[file].forEach(issue => {
            console.log(`   Linha ${issue.line}: ${issue.type} - ${issue.value}`);
            console.log(`   ${issue.context.substring(0, 80)}...`);
            console.log('');
        });
    });

    console.log('💡 Sugestão: Substitua as cores por variáveis CSS:');
    console.log('   - Use var(--primary-500) para cores primárias');
    console.log('   - Use var(--bg-primary) para backgrounds');
    console.log('   - Use var(--text-primary) para textos');
    console.log('   - Use var(--border-color) para bordas\n');

    process.exit(1);
}
