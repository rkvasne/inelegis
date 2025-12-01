# Guia de Desenvolvimento

**Última atualização:** 01 de dezembro de 2025
**Versão atual:** 0.0.6

Este arquivo fornece orientações técnicas para desenvolvedores trabalhando neste repositório.

**⚠️ Nota:** Para uma visão completa da documentação, consulte [README.md](../README.md).

---

## 💻 Visão Geral do Projeto

**Inelegis** é uma aplicação de página única (SPA) **não oficial** para Consulta de Inelegibilidade Eleitoral. Ela auxilia servidores da Justiça Eleitoral a determinar se condenações criminais geram inelegibilidade com base na Lei Complementar nº 64/1990 (atualizada pela LC 135/2010).

- **Desenvolvimento**: Criado por um servidor para uso por servidores.
- **Fonte de Dados**: Dados oficiais do TRE-SP (Outubro 2024) revisados pela CRE-RO (02/06/2025).
- **Status**: Ferramenta auxiliar não oficial.
- **Tecnologia**: Vanilla JavaScript com sistema de build (sem dependências externas de runtime).
- **Deploy**: Build com `node scripts/optimize.js` e deploy da pasta `dist/`.

---

## 🚀 Execução e Desenvolvimento

Como esta é uma aplicação frontend com sistema de build:

- **Desenvolvimento**: Execute `npm run dev` (ou `node scripts/serve.js`) para o servidor local.
- **Produção**: Execute `npm run build` (ou `node scripts/optimize.js`) para gerar a versão otimizada.
- **Deploy**: O conteúdo da pasta `dist/` é o que deve ser publicado.

---

## 🏗 Arquitetura do Código

### Arquivos Principais

**[index.html](../index.html)** - Estrutura HTML contendo:
- Formulário de busca com alternância de tipo de comunicação (Condenação/Extinção).
- Dropdown de leis e campo de artigo.
- Modal de exibição de resultados.
- Painéis de informação e avisos legais.
- Legenda explicando os tipos de resultado.

**[script.js](../script.js)** - Lógica da aplicação organizada em grupos funcionais:
1. **Lógica de Busca**: `realizarBusca()` - Núcleo da consulta (usa SearchIndex).
2. **Gerenciamento de UI**: `exibirResultado()` - Exibição de resultados (usa ModalManager).
3. **Sugestões**: `mostrarSugestoes()`, `obterSugestoesPorLei()` - Sugestões em tempo real.

### Módulos JavaScript (v0.0.6+)

**[js/sanitizer.js](../js/sanitizer.js)** - Segurança:
- `escapeHtml()` - Previne XSS
- `safeInnerHTML()` - Inserção segura de HTML
- `sanitizeAttributes()` - Remove atributos perigosos

**[js/storage.js](../js/storage.js)** - Armazenamento:
- `setItem()` - Salva com validação e expiração
- `getItem()` - Recupera com validação
- `cleanExpired()` - Limpeza automática

**[js/formatters.js](../js/formatters.js)** - Formatação:
- `formatar()` - Auto-correção (§1 → §1º, cc → c/c)
- `processar()` - Parse de notação complexa
- `extrairArtigos()` - Extração de números

**[js/exceptions.js](../js/exceptions.js)** - Validação:
- `verificar()` - Verifica exceções aplicáveis
- `filtrarPorArtigo()` - Filtra exceções relevantes

**[js/modal-manager.js](../js/modal-manager.js)** - Interface:
- `open()` - Abre modal com conteúdo
- `close()` - Fecha modal
- `exportContent()` - Exporta resultado

**[js/search-index.js](../js/search-index.js)** - Performance:
- `buscar()` - Busca otimizada com cache
- `buildLeiIndex()` - Constrói índices
- `clearCache()` - Limpa cache
6. **Atalhos de Teclado**: Implementação de hotkeys (Ctrl+L, Ctrl+A, Ctrl+Enter, F1, Esc).

**[data.js](../data.js)** - Configuração de dados:
1. **leisDisponiveis** - Array com mais de 40 códigos de leis.
2. **tabelaInelegibilidade** - Objeto mestre mapeando artigos para regras de inelegibilidade:
   - Flag booleana: gera inelegibilidade?
   - Categoria do crime (1-10).
   - Exceções que não geram inelegibilidade.
   - Referências de código e observações.

**[styles.css](../styles.css)** - Sistema de design CSS profissional:
- Paleta de cores corporativa e tokens de design.
- Layout responsivo com componentes modernos.
- Efeitos de glassmorphism e animações.
- Estilização acessível e media queries para impressão.

### Exemplo de Estrutura de Dados

Em `data.js`, a tabela de inelegibilidade segue este padrão:
```javascript
tabelaInelegibilidade = {
  "121": {
    "gera_inelegibilidade": true,
    "crime_categoria": 1,
    "excecoes": [],
    "codigo": "D"
  },
  // ... mais artigos
}
```

### Feature Chave: Parse de Artigos Complexos

A aplicação suporta notação de artigos jurídicos brasileiros:
- Simples: `121`
- Com parágrafos: `121, §2º`
- Com incisos: `121, §2º, I`
- Com alíneas: `121, §2º, I, "a"`
- Citações concorrentes: `121 c/c 312`
- Combinado: `121, §2º, I, "a" c/c 312 c/c 213`

Expressões regulares em `script.js` lidam com a extração e correspondência desses componentes.

---

## 📏 Padrões Importantes

### Tipos de Resultado de Busca

Três resultados possíveis exibidos no modal:
1. **GERA INELEGIBILIDADE** (vermelho) - Artigo gera inelegibilidade, use notação ASE 337.
2. **NÃO GERA INELEGIBILIDADE** (verde) - Não gera inelegibilidade.
3. **NÃO ENCONTRADO** (cinza) - Artigo não consta na tabela de referência.

### Tipos de Comunicação

- **Condenação (ASE 337)**: Suspensão de direitos políticos devido a condenação.
- **Extinção (ASE 370)**: Extinção de punibilidade/suspensão.

Alternância entre estes com botões de rádio ou atalho F1.

### Formatação Automática

A entrada do usuário é formatada automaticamente para padrões legais:
- `§1` torna-se `§1º`
- `cc` torna-se `c/c`
- `a` torna-se `"a"` (em contexto de alínea)
- Espaços e vírgulas normalizados

---

## 🔧 Manutenção de Dados

Os dados de inelegibilidade em `data.js` mapeiam diretamente para:
- Tabela oficial de inelegibilidade do TRE-SP.
- Arquivos PDF e XML de referência na pasta `docs/references/`.

**Se a lei eleitoral mudar:**
1. Atualize o objeto `tabelaInelegibilidade` em `data.js`.
2. Adicione novas leis ao array `leisDisponiveis` se necessário.
3. Teste com números de artigos relevantes.

---

## 📚 Referências de Documentação

- **[README.md](../README.md)** - Funcionalidades, atalhos, exemplos de uso.
- **[MANUAL-ASE.txt](references/manual-ase.txt)** - Manual do sistema eleitoral com explicações de códigos ASE.
- **Tabelas PDF/XML** - Dados oficiais de referência do TRE-SP em `docs/references/`.

---

## 🌐 Compatibilidade de Navegador

- Navegadores modernos apenas (Chrome, Firefox, Safari, Edge).
- Requer suporte a ES6+.
- Usa Clipboard API e Flexbox CSS.
- Design responsivo para desktop/mobile.

---

## 📝 Tarefas Comuns

**Entender validação de artigos**: Veja `buscarInelegibilidadePorLeiEArtigo()` em `script.js` - faz o parse da notação e busca na tabela.

**Adicionar nova lei**: Adicione ao array `leisDisponiveis` em `data.js`, depois adicione entradas em `tabelaInelegibilidade`.

**Modificar exibição de resultado**: Edite `exibirResultado()` em `script.js` - controla o conteúdo e estilo do modal.

**Alterar atalhos**: Busque por `addEventListener('keydown'` em `script.js`.

**Atualizar estilos**: Cores e layout estão em `styles.css`.

**Atualizar tabela de inelegibilidade**: Edite o array `tabelaInelegibilidade` em `data.js`.


---

## 🧪 Testes

### Testes Unitários

O projeto possui testes automatizados para os módulos principais:

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar teste específico
node tests/formatters.test.js
node tests/exceptions.test.js
```

### Cobertura de Testes

- **formatters.test.js**: 10 testes para formatação de artigos
- **exceptions.test.js**: 10 testes para validação de exceções
- **Cobertura total**: ~60% dos módulos críticos

### Adicionar Novos Testes

1. Criar arquivo em `tests/` com sufixo `.test.js`
2. Seguir padrão dos testes existentes
3. Adicionar ao script `test:unit` no package.json

---

## 🔒 Segurança

### Práticas Implementadas

- **CSP (Content Security Policy)**: Configurado em `vercel.json`
- **Sanitização de HTML**: Uso de `Sanitizer.safeInnerHTML()`
- **Validação de localStorage**: Timestamp e expiração automática
- **Sem innerHTML direto**: Sempre usar módulos de sanitização

### Checklist de Segurança

- [ ] Nunca usar `innerHTML` diretamente
- [ ] Sempre sanitizar entrada do usuário
- [ ] Validar dados do localStorage
- [ ] Usar `SecureStorage` para persistência
- [ ] Testar contra XSS

---

## ⚡ Performance

### Otimizações Implementadas

- **Índices de Busca**: Cache pré-construído por lei
- **Busca O(1)**: Acesso direto via índice
- **Cache Inteligente**: Validade de 1 hora
- **Pré-processamento**: Artigos extraídos ao construir índice

### Métricas

- Busca: ~5ms (antes: ~50ms)
- Cache hit rate: >90%
- Tamanho total: ~227KB

---

**Última atualização:** 01/12/2024
