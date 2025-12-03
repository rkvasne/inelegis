#!/usr/bin/env node

/**
 * Script de Integração dos Módulos
 * 
 * Este script integra os novos módulos JavaScript no script.js,
 * substituindo funções duplicadas e implementando as novas APIs.
 * 
 * Uso: node scripts/integrate-modules.js
 */

const fs = require('fs');
const path = require('path');
const paths = require('./project-paths');

console.log('🔄 Iniciando integração dos módulos...\n');

// Ler script.js
const scriptPath = paths.js.main;
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Backup
const backupPath = `${scriptPath}.backup`;
fs.writeFileSync(backupPath, scriptContent, 'utf8');
console.log(`✅ Backup criado: ${path.basename(backupPath)}\n`);

// Lista de substituições
const replacements = [
    {
        name: 'Formatação Automática',
        search: /aplicarFormatacaoAutomatica2?\(/g,
        replace: 'ArtigoFormatter.formatar(',
        count: 0
    },
    {
        name: 'Processamento de Artigo',
        search: /processarArtigoCompleto\(/g,
        replace: 'ArtigoFormatter.processar(',
        count: 0
    },
    {
        name: 'Formatação Completa',
        search: /formatarArtigoCompleto\(/g,
        replace: 'ArtigoFormatter.formatarCompleto(',
        count: 0
    },
    {
        name: 'Verificação de Exceções',
        search: /verificarExcecoesAplicaveis2?\(/g,
        replace: 'ExceptionValidator.verificar(',
        count: 0
    },
    {
        name: 'localStorage.setItem',
        search: /localStorage\.setItem\(/g,
        replace: 'SecureStorage.setItem(',
        count: 0
    },
    {
        name: 'localStorage.getItem',
        search: /localStorage\.getItem\(/g,
        replace: 'SecureStorage.getItem(',
        count: 0
    }
];

// Aplicar substituições
console.log('📝 Aplicando substituições:\n');
replacements.forEach(replacement => {
    const matches = scriptContent.match(replacement.search);
    if (matches) {
        replacement.count = matches.length;
        scriptContent = scriptContent.replace(replacement.search, replacement.replace);
        console.log(`   ✅ ${replacement.name}: ${replacement.count} ocorrências`);
    } else {
        console.log(`   ⏭️  ${replacement.name}: nenhuma ocorrência`);
    }
});

// Adicionar comentário no topo
const header = `/**
 * INELEGIS - Sistema de Consulta de Inelegibilidade Eleitoral
 * 
 * Versão: 0.1.0
 * Última atualização: 01 de dezembro de 2025
 * 
 * Este arquivo utiliza os seguintes módulos:
 * - src/js/modules/sanitizer.js: Prevenção XSS
 * - src/js/modules/storage.js: localStorage seguro
 * - src/js/modules/formatters.js: Formatação de artigos
 * - src/js/modules/exceptions.js: Validação de exceções
 * - src/js/modules/modal-manager.js: Gerenciamento de modal
 * - src/js/modules/search-index.js: Busca otimizada
 */

`;

scriptContent = header + scriptContent;

// Salvar arquivo atualizado
fs.writeFileSync(scriptPath, scriptContent, 'utf8');

console.log('\n✅ Integração concluída!\n');
console.log('📊 Resumo:');
const totalReplacements = replacements.reduce((sum, r) => sum + r.count, 0);
console.log(`   - ${totalReplacements} substituições realizadas`);
console.log(`   - Backup salvo em: ${path.basename(backupPath)}`);
console.log(`   - Arquivo atualizado: ${path.relative(paths.root, scriptPath)}\n`);

console.log('⚠️  Próximos passos:');
console.log(`   1. Revisar ${path.relative(paths.root, scriptPath)} para verificar mudanças`);
console.log('   2. Executar testes: npm test');
console.log('   3. Testar manualmente no navegador');
console.log('   4. Se tudo OK, remover funções duplicadas antigas\n');
