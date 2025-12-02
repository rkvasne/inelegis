# 📚 Documentation Agent

Agente inteligente para gerenciar, analisar e manter documentação de projetos.

---

## 🎯 Propósito

Baseado nas lições aprendidas do projeto Inelegis v0.0.7, onde realizamos 3 limpezas que removeram:
- 12 documentos redundantes/obsoletos
- 5 arquivos de código morto
- Consolidação completa da documentação

Este agente automatiza a detecção de problemas comuns em documentação.

---

## 🚀 Como Usar

### Análise Básica

```bash
node scripts/doc-agent.js analyze
```

### Análise com Exportação

```bash
node scripts/doc-agent.js analyze --export
```

### Ajuda

```bash
node scripts/doc-agent.js help
```

---

## 🔍 O que o Agente Detecta

### 1. Documentos Redundantes
- Compara conteúdo entre documentos
- Detecta similaridade > 70%
- Sugere consolidação

### 2. Documentos Obsoletos
- Identifica padrões de nomes temporários
- Verifica data de modificação
- Detecta palavras-chave de conclusão

### 3. Documentos Muito Grandes
- Tamanho > 50 KB
- Linhas > 500
- Sugere divisão

### 4. Documentos Ausentes
- Verifica README.md
- Verifica CHANGELOG.md
- Outros obrigatórios configuráveis

### 5. Documentos Históricos
- Detecta palavras-chave (concluído, implementado, etc.)
- Sugere marcação ou movimentação

---

## ⚙️ Configuração

Edite as constantes no início do arquivo `doc-agent.js`:

```javascript
const CONFIG = {
    // Pastas onde procurar documentação
    docFolders: ['docs', 'documentation', '.'],
    
    // Extensões de arquivos
    docExtensions: ['.md', '.txt', '.rst'],
    
    // Arquivos obrigatórios
    requiredRootDocs: ['README.md', 'CHANGELOG.md'],
    
    // Padrões de temporários
    temporaryPatterns: [
        /LIMPEZA/i,
        /IMPLEMENTACAO-COMPLETA/i,
        /STATUS-/i,
        /ANALISE-/i,
        /RESUMO-/i,
        /-TEMP/i,
        /-OLD/i
    ],
    
    // Palavras-chave históricas
    historicalKeywords: [
        'concluído',
        'implementado',
        'finalizado'
    ],
    
    // Limites
    maxDocSize: 50,  // KB
    maxLines: 500
};
```

---

## 📊 Exemplo de Relatório

```
📚 Documentation Agent - Análise Iniciada

📁 Projeto: /path/to/project

🔍 Descobrindo documentos...
✅ 15 documentos encontrados

📊 Analisando documentos...
🔄 Detectando redundâncias...
🗑️  Detectando obsoletos...
✅ Verificando documentos obrigatórios...

============================================================
📊 RELATÓRIO DE DOCUMENTAÇÃO
============================================================

📈 Estatísticas Gerais:
   Total de documentos: 15
   Redundantes: 2
   Obsoletos: 1
   Muito grandes: 1
   Obrigatórios ausentes: 0

⚠️  Documentos com Problemas:

   📄 docs/ANALISE-DOCUMENTACAO.md (77KB, 850 linhas)
      ⚠️ Documento muito grande (77KB > 50KB)
      ⚠️ Documento muito longo (850 linhas > 500 linhas)
      ❌ Documento parece ser temporário/obsoleto
      
   📄 docs/ATUALIZACAO-DOCS.md (6KB, 120 linhas)
      ⚠️ 85% similar a CHANGELOG-DOCS.md

💡 Recomendações:

   1. Consolidar documentos redundantes
   2. Remover ou arquivar documentos obsoletos
   3. Dividir documentos muito grandes

============================================================
```

---

## 🎓 Lições Aplicadas

### Do Projeto Inelegis

1. **Detectar Redundância**
   - ANALISE-DOCUMENTACAO.md vs CHANGELOG-DOCS.md
   - ATUALIZACAO-DOCS-HISTORICOS.md vs CHANGELOG-DOCS.md

2. **Detectar Obsoletos**
   - LIMPEZA-FINAL.md (ação concluída)
   - IMPLEMENTACAO-COMPLETA.md (implementação concluída)
   - STATUS-IMPLEMENTACAO.md (status final)

3. **Detectar Código Morto**
   - COMPONENTS.md (documentando código não usado)
   - components/*.js (arquivos não carregados)

4. **Marcar Históricos**
   - history/refatoracao-v0.0.6.md (plano + execução + lições)

---

## 🔧 Integração com CI/CD

### GitHub Actions

```yaml
name: Documentation Check

on: [push, pull_request]

jobs:
  doc-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Analyze Documentation
        run: node scripts/doc-agent.js analyze --export
      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: doc-analysis
          path: doc-analysis-report.json
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

node scripts/doc-agent.js analyze
```

---

## 📝 Adicionando ao package.json

```json
{
  "scripts": {
    "doc:check": "node scripts/doc-agent.js analyze",
    "doc:audit": "node scripts/doc-agent.js analyze --export"
  }
}
```

---

## 🎯 Casos de Uso

### 1. Auditoria Regular
Execute mensalmente para manter documentação limpa:
```bash
npm run doc:check
```

### 2. Antes de Release
Verifique documentação antes de publicar versão:
```bash
npm run doc:audit
```

### 3. Code Review
Inclua análise em PRs que modificam documentação

### 4. Onboarding
Novos desenvolvedores podem entender estrutura da documentação

---

## 🚀 Próximas Melhorias

### Planejadas
- [ ] Detecção de links quebrados
- [ ] Verificação de formatação Markdown
- [ ] Sugestões automáticas de consolidação
- [ ] Geração de índice automático
- [ ] Detecção de duplicação de seções
- [ ] Análise de legibilidade
- [ ] Suporte a outros formatos (RST, AsciiDoc)

### Contribuições
Pull requests são bem-vindos! Veja CONTRIBUTING.md

---

## 📚 Referências

- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [Documentation Best Practices](https://www.writethedocs.org/guide/)

---

## 📄 Licença

MIT - Baseado no projeto Inelegis

---

**Criado com base nas lições do Inelegis v0.0.7** 🎉

