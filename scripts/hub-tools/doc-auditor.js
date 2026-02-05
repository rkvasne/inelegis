#!/usr/bin/env node

/**
 * Documentation Auditor (Hub Core)
 * Agente inteligente para gerenciar, analisar e garantir integridade da documentação
 *
 * @version 1.0.0-core
 * @author Inelegis Team -> Solo Dev Hub
 */

import fs from "fs";
import path from "path";

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
    // Pastas onde procurar documentação
    docFolders: ["docs", "documentation", "brain/prompts-library", "."],

    // Extensões de arquivos de documentação
    docExtensions: [".md", ".txt", ".rst"],

    // Arquivos obrigatórios na raiz
    requiredRootDocs: ["README.md", "CHANGELOG.md"],

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
        /\.bak/i,
    ],

    // Palavras-chave que indicam documento histórico
    historicalKeywords: [
        "concluído",
        "implementado",
        "finalizado",
        "completo",
        "histórico",
        "legacy",
    ],

    // Tamanho máximo recomendado para um documento (em KB)
    maxDocSize: 50,

    // Número máximo de linhas recomendado
    maxLines: 600,

    // Percentual de similaridade para considerar redundante (0-1)
    similarityThreshold: 0.85,
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
            missing: 0,
        };
        this.visitedDirs = new Set();
    }

    /**
     * Executa análise completa da documentação
     */
    async analyze() {
        console.log("📚 Doc Auditor (Hub Core) - Análise Iniciada\n");
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

        return {
            docs: this.docs,
            issues: this.issues,
            stats: this.stats,
        };
    }

    /**
     * Descobre todos os documentos no projeto
     */
    discoverDocuments() {
        console.log("🔍 Descobrindo documentos...\n");

        CONFIG.docFolders.forEach((folder) => {
            const folderPath = path.join(this.projectPath, folder);

            if (fs.existsSync(folderPath)) {
                this.scanDirectory(folderPath, folder);
            }
        });

        this.stats.total = this.docs.length;
        console.log(`✅ ${this.stats.total} documentos encontrados\n`);
    }

    /**
     * Escaneia diretório recursivamente
     */
    scanDirectory(dirPath, relativePath = "") {
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

        items.forEach((item) => {
            const fullPath = path.join(currentPath, item);
            // Evitar loop infinito com links simbólicos
            if (item === '.agent' || item === 'node_modules' || item === '.git') return;

            const relPath = path.join(relativePath, item);
            let stat;
            try { stat = fs.statSync(fullPath); } catch (e) { return; }

            if (stat.isDirectory()) {
                const ignoreDirs = [
                    ".git",
                    "node_modules",
                    "dist",
                    "build",
                    ".vercel",
                    ".vscode",
                    "coverage"
                ];
                if (!item.startsWith(".") && !ignoreDirs.includes(item)) {
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
                        sizeKB: Math.round((stat.size / 1024) * 10) / 10,
                        modified: stat.mtime,
                        content: null,
                        lines: 0,
                        issues: [],
                    });
                }
            }
        });
    }

    /**
     * Analisa cada documento individualmente
     */
    analyzeDocuments() {
        process.stdout.write("📊 Analisando ");

        this.docs.forEach((doc, index) => {
            if (index % 5 === 0) process.stdout.write(".");

            // Ler conteúdo
            try {
                doc.content = fs.readFileSync(doc.fullPath, "utf-8");
            } catch (e) {
                doc.content = "";
                return;
            }

            doc.lines = doc.content.split("\n").length;
            doc.metadata = this.extractFrontMatter(doc.content);
            doc.bodyContent = doc.metadata?.body || doc.content;

            doc.docStatus = this.determineDocStatus(doc);

            // Verificar tamanho
            if (doc.sizeKB > CONFIG.maxDocSize) {
                doc.issues.push({
                    type: "oversized",
                    severity: "warning",
                    message: `Documento muito grande (${doc.sizeKB}KB > ${CONFIG.maxDocSize}KB)`,
                });
                this.stats.oversized++;
            }

            // Verificar linhas
            if (doc.lines > CONFIG.maxLines) {
                doc.issues.push({
                    type: "too-long",
                    severity: "warning",
                    message: `Documento muito longo (${doc.lines} linhas > ${CONFIG.maxLines} linhas)`,
                });
            }

            // Verificar se é temporário
            if (this.isTemporary(doc)) {
                doc.issues.push({
                    type: "temporary",
                    severity: "error",
                    message: "Documento parece ser temporário/obsoleto",
                });
                this.stats.obsolete++;
            }

            // Verificar Links Markdown
            if (doc.path.endsWith('.md')) {
                this.checkMarkdownLinks(doc);
            }
        });
        console.log("\n");
    }

    checkMarkdownLinks(doc) {
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        const baseDir = path.dirname(doc.fullPath);

        while ((match = regex.exec(doc.content)) !== null) {
            const link = match[2];
            // Ignorar links externos/âncoras/imagens
            if (link.match(/^(http|#|mailto:)/) || link.match(/\.(png|jpg|gif|svg)$/i)) continue;

            const targetPath = path.resolve(baseDir, link.split('#')[0]);
            if (!fs.existsSync(targetPath)) {
                doc.issues.push({
                    type: "broken-link",
                    severity: "error",
                    message: `Link quebrado detectado: ${link}`
                });
            }
        }
    }

    /**
     * Detecta redundâncias entre documentos
     */
    detectRedundancies() {
        console.log("🔄 Detectando redundâncias...\n");

        for (let i = 0; i < this.docs.length; i++) {
            for (let j = i + 1; j < this.docs.length; j++) {
                const doc1 = this.docs[i];
                const doc2 = this.docs[j];

                // Ignorar se muito pequenos
                if (doc1.lines < 10 || doc2.lines < 10) continue;

                const content1 = doc1.bodyContent || doc1.content;
                const content2 = doc2.bodyContent || doc2.content;
                const similarity = this.calculateSimilarity(content1, content2);

                if (similarity > CONFIG.similarityThreshold) {
                    const issue = {
                        type: "redundant",
                        severity: "warning",
                        message: `${Math.round(similarity * 100)}% similar a ${doc2.name}`,
                        relatedDoc: doc2.name,
                    };

                    doc1.issues.push(issue);
                    this.stats.redundant++;
                }
            }
        }
    }

    detectObsolete() {
        console.log("🕰️ Verificando obsolescência...");
        const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        this.docs.forEach(doc => {
            if (doc.modified && (now - doc.modified.getTime() > ONE_YEAR_MS)) {
                doc.issues.push({
                    type: "stale",
                    severity: "info",
                    message: "Documento não modificado há mais de 1 ano"
                });
                this.stats.obsolete++;
            }
        });
    }

    checkRequiredDocs() {
        console.log("📋 Verificando docs obrigatórios...");
        CONFIG.requiredRootDocs.forEach(reqDoc => {
            const docPath = path.join(this.projectPath, reqDoc);
            if (!fs.existsSync(docPath)) {
                console.error(`❌ CRÍTICO: Documento obrigatório ausente na raiz: ${reqDoc}`);
                this.stats.missing++;
                // Injetar como issue em um doc virtual se possível, ou apenas logar
            }
        });
    }

    calculateSimilarity(text1, text2) {
        const words1 = new Set(text1.toLowerCase().match(/\b\w{4,}\b/g) || []);
        const words2 = new Set(text2.toLowerCase().match(/\b\w{4,}\b/g) || []);

        if (words1.size === 0 || words2.size === 0) return 0;

        const intersection = new Set([...words1].filter((x) => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }

    isTemporary(doc) {
        const bodySample = (doc.bodyContent || doc.content).substring(0, 500);
        return CONFIG.temporaryPatterns.some(
            (pattern) => pattern.test(doc.name) || pattern.test(bodySample),
        );
    }

    extractFrontMatter(content) {
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
        if (!match) return null;
        return { body: content.slice(match[0].length) };
    }

    determineDocStatus(doc) {
        return "active"; // Simplificado
    }
}

// CLI Execution
async function main() {
    const agent = new DocumentationAgent();
    await agent.analyze();

    // Enhanced Report
    console.log("=".repeat(50));
    console.log("📊 RELATÓRIO DETALHADO");
    console.log("=".repeat(50));
    console.log(`Docs Analisados: ${agent.stats.total}`);

    // Filtrar docs com issues
    const riskyDocs = agent.docs.filter(d => d.issues.length > 0);

    if (riskyDocs.length > 0) {
        console.log(`\n🚨 Documentos com Problemas (${riskyDocs.length}):`);
        riskyDocs.slice(0, 50).forEach(doc => { // Limit to 50 to avoid flood
            console.log(`\n📄 ${doc.path} (${doc.sizeKB}KB)`);
            doc.issues.forEach(issue => {
                const icon = issue.severity === 'error' ? '❌' : '⚠️';
                console.log(`   ${icon} ${issue.message}`);
            });
        });
        if (riskyDocs.length > 50) console.log(`\n... e mais ${riskyDocs.length - 50} documentos.`);
        process.exit(1);
    } else {
        console.log("\n✅ Documentação Íntegra!");
        process.exit(0);
    }
}

main();
