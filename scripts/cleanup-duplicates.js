#!/usr/bin/env node

/**
 * Script de Limpeza de Código Duplicado
 * 
 * Remove funções antigas que foram substituídas pelos módulos.
 * 
 * Uso: node scripts/cleanup-duplicates.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpeza de código duplicado...\n');

// Ler script.js
const scriptPath = path.join(__dirname, '..', 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Backup
const backupPath = path.join(__dirname, '..', 'script.js.cleanup-backup');
fs.writeFileSync(backupPath, scriptContent, 'utf8');
console.log('✅ Backup criado: script.js.cleanup-backup\n');

// Funções a remover (com seus blocos completos)
const functionsToRemove = [
    {
        name: 'aplicarFormatacaoAutomatica (primeira versão)',
        pattern: /\/\/ Aplicar formatação automática ao artigo\s*\nfunction aplicarFormatacaoAutomatica\(valor\) \{[\s\S]*?\n\}/m
    },
    {
        name: 'aplicarFormatacaoAutomatica2',
        pattern: /\/\/ Aplicar formatação automática \(versão robusta com §\/º e diacríticos\)\s*\nfunction aplicarFormatacaoAutomatica2\(valor\) \{[\s\S]*?\n\}/m
    },
    {
        name: 'processarArtigoCompleto',
        pattern: /function processarArtigoCompleto\(artigo\) \{[\s\S]*?\n\}/m
    },
    {
        name: 'formatarArtigoCompleto',
        pattern: /\/\/ Formatar artigo completo para exibição\s*\nfunction formatarArtigoCompleto\(artigo\) \{[\s\S]*?\n\}/m
    },
    {
        name: 'verificarExcecoesAplicaveis (primeira versão)',
        pattern: /function verificarExcecoesAplicaveis\(item, artigoProcessado\) \{[\s\S]*?\n\}/m
    },
    {
        name: 'verificarExcecoesAplicaveis2',
        pattern: /function verificarExcecoesAplicaveis2\(item, artigoProcessado\) \{[\s\S]*?\n\}/m
    }
];

console.log('🗑️  Removendo funções duplicadas:\n');

let totalRemoved = 0;
functionsToRemove.forEach(func => {
    const match = scriptContent.match(func.pattern);
    if (match) {
        scriptContent = scriptContent.replace(func.pattern, '');
        console.log(`   ✅ ${func.name} removida`);
        totalRemoved++;
    } else {
        console.log(`   ⏭️  ${func.name} não encontrada`);
    }
});

// Limpar linhas vazias excessivas
scriptContent = scriptContent.replace(/\n{3,}/g, '\n\n');

// Salvar arquivo limpo
fs.writeFileSync(scriptPath, scriptContent, 'utf8');

console.log(`\n✅ Limpeza concluída!\n`);
console.log('📊 Resumo:');
console.log(`   - ${totalRemoved} funções removidas`);
console.log(`   - Backup salvo em: script.js.cleanup-backup`);
console.log(`   - Arquivo atualizado: script.js\n`);

console.log('⚠️  Próximos passos:');
console.log('   1. Executar testes: npm test');
console.log('   2. Testar manualmente no navegador');
console.log('   3. Se tudo OK, remover backups\n');
