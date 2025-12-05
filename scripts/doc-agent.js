#!/usr/bin/env node

/**
 * Documentation Agent
 * Agente inteligente para gerenciar, analisar e manter documentação de projetos
 * 
 * @version 1.0.0
 * @author Baseado nas lições do projeto Inelegis
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
    // Pastas onde procurar documentação
    docFolders: ['docs', 'documentation', '.'],
    
    // Extensões de arquivos de documentação
    docExtensions: ['.md', '.txt', '.rst'],
    
    // Arquivos obrigatórios na raiz
    requiredRootDocs: ['README.md', 'CHANGELOG.md'],
    
    // Padrões de arquivos temporários/obsoletos
    temporaryPatterns: [
        /LIMPEZA/i,
        /IMPLEMENTACAO-COMPLETA/i,
        /STATUS-IMPLEMENTACAO/i,
        /ANALISE-DOCUMENTACAO/i,
        /ATUALIZACAO-/i,
        /RESUMO-/i,
        /-TEMP\b/i,
        /-OLD/i,
        /\.backup/i,
        /\.bak/i
    ],
    
    // Palavras-chave que indicam documento histórico
    historicalKeywords: [
        'concluído',
        'implementado',
        'finalizado',
        'completo',
        'histórico',
        'legacy'
    ],
    
    // Tamanho máximo recomendado para um documento (em KB)
    maxDocSize: 50,
    
    // Número máximo de linhas recomendado
    maxLines: 500
};

// ============================================
// CLASSES PRINCIPAIS
// ============================================

class DocumentationAgent {
    constructor(projectPath = process.cwd()) {
        this.projectPath = projectPath;
        this.docs = [];
        this.issues = [];
        this.stats = {
            total: 0,
            redundant: 0,
            obsolete: 0,
            oversized: 0,
            missing: 0
        };
        this.visitedDirs = new Set();
    }

    /**
     * Executa análise completa da documentação
     */
    async analyze() {
        console.log('📚 Documentation Agent - Análise Iniciada\n');
        console.log(`📁 Projeto: ${this.projectPath}\n`);

        // 1. Descobrir documentos
        this.discoverDocuments();
        
        // 2. Analisar cada documento
        this.analyzeDocuments();
        
        // 3. Detectar redundâncias
        this.detectRedundancies();
        
        // 4. Detectar obsoletos
        this.detectObsolete();
        
        // 5. Verificar documentos obrigatórios
        this.checkRequiredDocs();
        
        // 6. Gerar relatório
        this.generateReport();
        
        return {
            docs: this.docs,
            issues: this.issues,
            stats: this.stats
        };
    }

    /**
     * Descobre todos os documentos no projeto
     */
    discoverDocuments() {
        console.log('🔍 Descobrindo documentos...\n');
        
        CONFIG.docFolders.forEach(folder => {
            const folderPath = path.join(this.projectPath, folder);
            
            if (!fs.existsSync(folderPath)) return;
            
            this.scanDirectory(folderPath, folder);
        });
        
        this.stats.total = this.docs.length;
        console.log(`✅ ${this.stats.total} documentos encontrados\n`);
    }

    /**
     * Escaneia diretório recursivamente
     */
    scanDirectory(dirPath, relativePath = '') {
        let currentPath;
        try {
            currentPath = fs.realpathSync(dirPath);
        } catch (error) {
            return;
        }

        if (this.visitedDirs.has(currentPath)) {
            return;
        }
        this.visitedDirs.add(currentPath);

        const items = fs.readdirSync(currentPath);
        
        items.forEach(item => {
            const fullPath = path.join(currentPath, item);
            const relPath = path.join(relativePath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Ignorar node_modules, .git, dist, etc
                const ignoreDirs = ['.git', 'node_modules', 'dist', 'build', '.vercel', '.vscode'];
                if (!item.startsWith('.') && !ignoreDirs.includes(item)) {
                    this.scanDirectory(fullPath, relPath);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                if (CONFIG.docExtensions.includes(ext)) {
                    this.docs.push({
                        name: item,
                        path: relPath,
                        fullPath: fullPath,
                        size: stat.size,
                        sizeKB: Math.round(stat.size / 1024 * 10) / 10,
                        modified: stat.mtime,
                        content: null,
                        lines: 0,
                        issues: []
                    });
                }
            }
        });
    }

    /**
     * Analisa cada documento individualmente
     */
    analyzeDocuments() {
        console.log('📊 Analisando documentos...\n');
        
        this.docs.forEach(doc => {
            // Ler conteúdo
            doc.content = fs.readFileSync(doc.fullPath, 'utf-8');
            doc.lines = doc.content.split('\n').length;
            doc.metadata = this.extractFrontMatter(doc.content);
            doc.bodyContent = doc.metadata?.body || doc.content;

            doc.docStatus = this.determineDocStatus(doc);
            
            // Verificar tamanho
            if (doc.sizeKB > CONFIG.maxDocSize) {
                doc.issues.push({
                    type: 'oversized',
                    severity: 'warning',
                    message: `Documento muito grande (${doc.sizeKB}KB > ${CONFIG.maxDocSize}KB)`
                });
                this.stats.oversized++;
            }
            
            // Verificar linhas
            if (doc.lines > CONFIG.maxLines) {
                doc.issues.push({
                    type: 'too-long',
                    severity: 'warning',
                    message: `Documento muito longo (${doc.lines} linhas > ${CONFIG.maxLines} linhas)`
                });
            }
            
            // Verificar se é temporário
            if (this.isTemporary(doc)) {
                doc.issues.push({
                    type: 'temporary',
                    severity: 'error',
                    message: 'Documento parece ser temporário/obsoleto'
                });
                this.stats.obsolete++;
            }
            
            // Verificar se é histórico
            if (doc.docStatus === 'historical' && !doc.metadata?.data?.docStatus) {
                doc.issues.push({
                    type: 'historical',
                    severity: 'info',
                    message: 'Documento parece ser histórico - considere marcar ou mover'
                });
            }
        });
    }

    /**
     * Detecta redundâncias entre documentos
     */
    detectRedundancies() {
        console.log('🔄 Detectando redundâncias...\n');
        
        for (let i = 0; i < this.docs.length; i++) {
            for (let j = i + 1; j < this.docs.length; j++) {
                const doc1 = this.docs[i];
                const doc2 = this.docs[j];
                
                const content1 = doc1.bodyContent || doc1.content;
                const content2 = doc2.bodyContent || doc2.content;
                const similarity = this.calculateSimilarity(content1, content2);
                
                if (similarity > 0.7) { // 70% similar
                    const issue = {
                        type: 'redundant',
                        severity: 'warning',
                        message: `${Math.round(similarity * 100)}% similar a ${doc2.name}`,
                        relatedDoc: doc2.name
                    };
                    
                    doc1.issues.push(issue);
                    this.stats.redundant++;
                }
            }
        }
    }

    /**
     * Detecta documentos obsoletos
     */
    detectObsolete() {
        console.log('🗑️  Detectando obsoletos...\n');
        
        this.docs.forEach(doc => {
            // Verificar data de modificação (mais de 6 meses)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            
            if (doc.modified < sixMonthsAgo && !this.isEssential(doc)) {
                doc.issues.push({
                    type: 'outdated',
                    severity: 'warning',
                    message: `Não modificado há mais de 6 meses (${doc.modified.toLocaleDateString()})`
                });
            }
        });
    }

    /**
     * Verifica documentos obrigatórios
     */
    checkRequiredDocs() {
        console.log('✅ Verificando documentos obrigatórios...\n');
        
        CONFIG.requiredRootDocs.forEach(required => {
            const found = this.docs.find(doc => 
                doc.name === required && doc.path === required
            );
            
            if (!found) {
                this.issues.push({
                    type: 'missing',
                    severity: 'error',
                    message: `Documento obrigatório ausente: ${required}`
                });
                this.stats.missing++;
            }
        });
    }

    /**
     * Calcula similaridade entre dois textos
     */
    calculateSimilarity(text1, text2) {
        // Algoritmo simples baseado em palavras comuns
        const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
        const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return intersection.size / union.size;
    }

    /**
     * Verifica se documento é temporário
     */
    isTemporary(doc) {
        const bodySample = (doc.bodyContent || doc.content).substring(0, 500);
        return CONFIG.temporaryPatterns.some(pattern => 
            pattern.test(doc.name) || pattern.test(bodySample)
        );
    }

    /**
     * Extrai front matter (YAML simples)
     */
    extractFrontMatter(content) {
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
        if (!match) return null;

        const raw = match[1];
        const data = {};

        raw.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            if (!trimmed.includes(':')) return;
            const [key, ...rest] = trimmed.split(':');
            const value = rest.join(':').trim().replace(/^['"]|['"]$/g, '');
            if (!key) return;
            data[key.trim()] = value;
        });

        const bodyStart = content.slice(match[0].length);
        const body = bodyStart.replace(/^\r?\n/, '');
        return { data, body };
    }

    /**
     * Determina status do documento (active/reference/historical)
     */
    determineDocStatus(doc) {
        if (doc.metadata?.data?.docStatus) {
            return doc.metadata.data.docStatus.toLowerCase();
        }

        return this.containsHistoricalKeywords(doc.bodyContent || doc.content)
            ? 'historical'
            : 'active';
    }

    containsHistoricalKeywords(text) {
        const sample = (text || '').substring(0, 1000).toLowerCase();
        return CONFIG.historicalKeywords.some(keyword => sample.includes(keyword));
    }

    /**
     * Verifica se documento é essencial
     */
    isEssential(doc) {
        const essentialNames = [
            'README.md',
            'CHANGELOG.md',
            'CONTRIBUTING.md',
            'LICENSE',
            'SECURITY.md',
            'CODE_OF_CONDUCT.md'
        ];
        
        return essentialNames.includes(doc.name);
    }

    /**
     * Gera relatório completo
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RELATÓRIO DE DOCUMENTAÇÃO');
        console.log('='.repeat(60) + '\n');
        
        // Estatísticas gerais
        console.log('📈 Estatísticas Gerais:');
        console.log(`   Total de documentos: ${this.stats.total}`);
        console.log(`   Redundantes: ${this.stats.redundant}`);
        console.log(`   Obsoletos: ${this.stats.obsolete}`);
        console.log(`   Muito grandes: ${this.stats.oversized}`);
        console.log(`   Obrigatórios ausentes: ${this.stats.missing}\n`);
        
        // Documentos com problemas
        const docsWithIssues = this.docs.filter(doc => doc.issues.length > 0);
        
        if (docsWithIssues.length > 0) {
            console.log('⚠️  Documentos com Problemas:\n');
            
            docsWithIssues.forEach(doc => {
                console.log(`   📄 ${doc.path} (${doc.sizeKB}KB, ${doc.lines} linhas)`);
                doc.issues.forEach(issue => {
                    const icon = issue.severity === 'error' ? '❌' : 
                                issue.severity === 'warning' ? '⚠️' : 'ℹ️';
                    console.log(`      ${icon} ${issue.message}`);
                });
                console.log('');
            });
        }
        
        // Problemas gerais
        if (this.issues.length > 0) {
            console.log('🚨 Problemas Gerais:\n');
            this.issues.forEach(issue => {
                const icon = issue.severity === 'error' ? '❌' : '⚠️';
                console.log(`   ${icon} ${issue.message}`);
            });
            console.log('');
        }
        
        // Recomendações
        this.generateRecommendations();
        
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Gera recomendações
     */
    generateRecommendations() {
        console.log('💡 Recomendações:\n');
        
        const recommendations = [];
        
        if (this.stats.redundant > 0) {
            recommendations.push('Consolidar documentos redundantes');
        }
        
        if (this.stats.obsolete > 0) {
            recommendations.push('Remover ou arquivar documentos obsoletos');
        }
        
        if (this.stats.oversized > 0) {
            recommendations.push('Dividir documentos muito grandes');
        }
        
        if (this.stats.missing > 0) {
            recommendations.push('Criar documentos obrigatórios ausentes');
        }
        
        // Verificar se há muitos documentos
        if (this.stats.total > 20) {
            recommendations.push('Considerar consolidação - muitos documentos podem dificultar manutenção');
        }
        
        if (recommendations.length === 0) {
            console.log('   ✅ Documentação está em bom estado!\n');
        } else {
            recommendations.forEach((rec, i) => {
                console.log(`   ${i + 1}. ${rec}`);
            });
            console.log('');
        }
    }

    /**
     * Exporta relatório para arquivo
     */
    exportReport(outputPath = 'doc-analysis-report.json') {
        const report = {
            timestamp: new Date().toISOString(),
            project: this.projectPath,
            stats: this.stats,
            docs: this.docs.map(doc => ({
                name: doc.name,
                path: doc.path,
                sizeKB: doc.sizeKB,
                lines: doc.lines,
                modified: doc.modified,
                issues: doc.issues
            })),
            issues: this.issues
        };
        
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
        console.log(`📝 Relatório exportado para: ${outputPath}\n`);
    }
}

// ============================================
// CLI
// ============================================

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'analyze';
    
    const agent = new DocumentationAgent();
    
    switch (command) {
        case 'analyze':
        case 'audit':
            await agent.analyze();
            if (args.includes('--export')) {
                agent.exportReport();
            }
            break;
            
        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;
            
        default:
            console.log(`❌ Comando desconhecido: ${command}`);
            console.log('Use "node doc-agent.js help" para ver comandos disponíveis\n');
            process.exit(1);
    }
}

function showHelp() {
    console.log(`
📚 Documentation Agent - Ajuda

COMANDOS:
  analyze, audit    Analisa a documentação do projeto
  help             Mostra esta ajuda

OPÇÕES:
  --export         Exporta relatório para JSON

EXEMPLOS:
  node doc-agent.js analyze
  node doc-agent.js analyze --export
  node doc-agent.js help

CONFIGURAÇÃO:
  Edite as constantes no início do arquivo para personalizar:
  - docFolders: Pastas onde procurar documentação
  - docExtensions: Extensões de arquivos
  - temporaryPatterns: Padrões de arquivos temporários
  - maxDocSize: Tamanho máximo recomendado (KB)
  - maxLines: Número máximo de linhas

BASEADO EM:
  Lições aprendidas do projeto Inelegis v0.0.7
  - 3 limpezas realizadas
  - 12 documentos redundantes removidos
  - 5 arquivos de código morto removidos
  - Documentação consolidada e organizada
`);
}

// ============================================
// EXECUÇÃO
// ============================================

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    });
}

module.exports = { DocumentationAgent, CONFIG };
