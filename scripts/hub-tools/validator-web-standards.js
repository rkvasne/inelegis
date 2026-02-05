#!/usr/bin/env node

/**
 * Web Standards Validator (Hub Core)
 * Validador unificado de Links, SEO e Acessibilidade para projetos Frontend
 *
 * Funde a lógica do 'validate-html-links.js' e 'lint.js' do projeto Inelegis.
 *
 * @version 1.0.0-core
 * @license Private
 */

import fs from "fs";
import path from "path";

// ============================================
// CONFIGURAÇÃO
// ============================================

const CONFIG = {
    // Diretório raiz para scan (pode ser sobrescrito via CLI)
    rootDir: ".",

    // Pastas para ignorar
    ignoreDirs: [
        "node_modules",
        ".git",
        ".next",
        "dist",
        "build",
        ".agent",
        "coverage"
    ],

    // Extensões para analisar
    extensions: [".html", ".htm"],

    // Regras de validação
    rules: {
        // SEO
        doctype: { required: true, pattern: /<!DOCTYPE html>/i, msg: "Falta <!DOCTYPE html>" },
        lang: { required: true, pattern: /<html[^>]+lang=["'][^"']+["']/i, msg: "Falta atributo lang no <html>" },
        charset: { required: true, pattern: /<meta[^>]+charset=["'][^"']+["']/i, msg: "Falta charset UTF-8" },
        viewport: { required: true, pattern: /<meta[^>]+name=["']viewport["']/i, msg: "Falta meta viewport" },
        title: { required: true, pattern: /<title>/i, msg: "Falta tag <title>" },

        // Acessibilidade
        imgAlt: {
            required: true, check: (content) => {
                const matches = content.match(/<img([^>]+)>/gi) || [];
                const bad = matches.filter(tag => !tag.includes('alt='));
                return bad.length === 0;
            }, msg: "Imagens sem atributo alt detectadas"
        },

        // Performance/Segurança
        noInlineStyles: {
            level: 'warning',
            check: (content) => {
                const styles = content.match(/style=["'][^"']+["']/gi) || [];
                // Ignorar estilos que usam (var(--)) ou definem (--prop:) variáveis CSS
                const bad = styles.filter(s => {
                    const usesVar = /var\s*\(\s*--/.test(s);
                    // Match style="--foo" ou style='--foo'
                    const definesVar = /style=["']\s*--/.test(s);
                    return !(usesVar || definesVar);
                });
                return bad.length === 0;
            },
            msg: "Estilos inline hardcoded detectados (use CSS classes ou var())"
        },
        noHttp: { level: 'error', check: (content) => !/http:\/\//.test(content), msg: "Links HTTP inseguros detectados (use HTTPS)" }
    }
};

// ============================================
// CLASSE PRINCIPAL
// ============================================

class WebValidator {
    constructor(startDir) {
        this.startDir = path.resolve(startDir);
        this.stats = {
            files: 0,
            linksTotal: 0,
            linksBroken: 0,
            seoErrors: 0,
            warnings: 0
        };
        this.issues = [];
    }

    async run() {
        console.log("🌐 Web Standards Validator (Hub Core)\n");
        console.log(`📂 Escaneando: ${this.startDir}\n`);

        const files = this.walk(this.startDir);
        this.stats.files = files.length;

        console.log(`📄 Encontrados ${files.length} arquivos HTML.`);

        if (files.length === 0) {
            console.log("⚠️ Nenhum arquivo HTML encontrado. Encerrando.");
            return;
        }

        files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');

            // Remover Scripts, Styles e Comentários para evitar falsos positivos
            const safeContent = content
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<!--([\s\S]*?)-->/gim, "");

            // 1. Validar Padrões (SEO/A11y)
            this.validateStandards(file, safeContent);

            // 2. Validar Links Internos
            this.validateLinks(file, safeContent);
        });

        this.printReport();
    }

    /**
     * Crawler recursivo
     */
    walk(dir) {
        let results = [];
        const list = fs.readdirSync(dir);

        list.forEach(file => {
            file = path.join(dir, file);
            const stat = fs.statSync(file);
            const name = path.basename(file);

            if (stat && stat.isDirectory()) {
                if (!CONFIG.ignoreDirs.includes(name)) {
                    results = results.concat(this.walk(file));
                }
            } else {
                if (CONFIG.extensions.includes(path.extname(file))) {
                    results.push(file);
                }
            }
        });
        return results;
    }

    /**
     * Valida regras de SEO e Acessibilidade
     */
    validateStandards(file, content) {
        const relPath = path.relative(this.startDir, file);

        for (const [key, rule] of Object.entries(CONFIG.rules)) {
            let passed = true;

            if (rule.pattern) {
                passed = rule.pattern.test(content);
            } else if (rule.check) {
                passed = rule.check(content);
            }

            if (!passed) {
                const level = rule.level || 'error';
                this.addIssue({
                    file: relPath,
                    type: 'standard',
                    rule: key,
                    message: rule.msg,
                    level: level
                });

                if (level === 'error') this.stats.seoErrors++;
                else this.stats.warnings++;
            }
        }
    }

    /**
     * Valida Links Internos e Âncoras
     */
    validateLinks(file, content) {
        const relFile = path.relative(this.startDir, file);
        const dir = path.dirname(file);

        // Regex para capturar href e src
        const regex = /(?:href|src)=["']([^"']+)["']/gi;
        let match;

        while ((match = regex.exec(content)) !== null) {
            const link = match[1];
            this.stats.linksTotal++;

            // Ignorar links externos, mailto, tel, scripts, hashtags vazias
            if (link.match(/^(https?:|mailto:|tel:|javascript:|#$)/)) continue;

            // Validar Âncoras (#section)
            if (link.startsWith('#')) {
                const id = link.substring(1);
                if (!this.hasId(content, id)) {
                    this.addIssue({ file: relFile, type: 'link', message: `Âncora não encontrada: ${link}`, level: 'error' });
                    this.stats.linksBroken++;
                }
                continue;
            }

            // Validar Arquivos Relativos
            let targetPath;
            const cleanLink = link.split(/[?#]/)[0]; // Remove query params e hashes

            // Se começar com /, é relativo à raiz (assumindo rootDir como web root)
            if (cleanLink.startsWith('/')) {
                targetPath = path.join(this.startDir, cleanLink);
            } else {
                targetPath = path.join(dir, cleanLink);
            }

            // Feature: Fallback para clean URLs (ex: href="home" -> home.html)
            if (!fs.existsSync(targetPath)) {
                if (!path.extname(targetPath)) {
                    if (fs.existsSync(targetPath + '.html')) {
                        targetPath = targetPath + '.html';
                    }
                }
            }

            if (!fs.existsSync(targetPath)) {
                this.addIssue({ file: relFile, type: 'link', message: `Arquivo não encontrado: ${link}`, level: 'error' });
                this.stats.linksBroken++;
            }
        }
    }

    hasId(content, id) {
        // Procura id="foo" ou name="foo"
        const regex = new RegExp(`(?:id|name)=["']${id}["']`, 'i');
        return regex.test(content);
    }

    addIssue(issue) {
        this.issues.push(issue);
    }

    printReport() {
        console.log("\n" + "=".repeat(60));
        console.log("📊 RELATÓRIO FINAL");
        console.log("=".repeat(60));
        console.log(`Arquivos: ${this.stats.files}`);
        console.log(`Links Verificados: ${this.stats.linksTotal}`);
        console.log(`Links Quebrados: ${this.stats.linksBroken}`);
        console.log(`Erros de Validacao: ${this.stats.seoErrors}`);
        console.log(`Avisos: ${this.stats.warnings}\n`);

        if (this.issues.length > 0) {
            this.issues.forEach(issue => {
                const icon = issue.level === 'error' ? '❌' : '⚠️';
                console.log(`${icon} [${issue.file}] ${issue.message}`);
            });
            console.log("\n❌ FALHA NA VALIDAÇÃO");
            process.exit(1);
        } else {
            console.log("✅ TODOS OS TESTES PASSARAM");
            process.exit(0);
        }
    }
}

// Execução
const startDir = process.argv[2] || process.cwd();
const validator = new WebValidator(startDir);
validator.run().catch(err => {
    console.error("Erro fatal:", err);
    process.exit(1);
});
