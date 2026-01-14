---
docStatus: active
docScope: runtime
lastReviewed: 14/01/2026
---
# 📦 Módulos JavaScript - Inelegis

Esta pasta contém os módulos JavaScript do projeto Inelegis, criados como parte do plano de refatoração v0.0.6.

---

## 📋 Módulos Disponíveis

### 🔒 `sanitizer.js` - Sanitização e Segurança
**Propósito:** Prevenir ataques XSS (Cross-Site Scripting)

**Funções:**
- `escapeHtml(text)` - Escapa caracteres HTML perigosos
- `createTextNode(text)` - Cria nós de texto seguros
- `safeInnerHTML(element, htmlString)` - Insere HTML de forma segura
- `sanitizeAttributes(element)` - Remove atributos perigosos

**Exemplo:**
```javascript
// INSEGURO (não fazer):
element.innerHTML = userInput;

// SEGURO:
Sanitizer.safeInnerHTML(element, userInput);
```

---

### 💾 `storage.js` - Armazenamento Seguro
**Propósito:** Gerenciamento seguro de localStorage com validação e expiração

**Funções:**
- `setItem(key, value, expiryMs)` - Salva com timestamp e expiração
- `getItem(key)` - Recupera com validação
- `removeItem(key)` - Remove item
- `clear()` - Limpa todos os itens do app
- `hasItem(key)` - Verifica existência
- `cleanExpired()` - Remove itens expirados

**Exemplo:**
```javascript
// Salvar com expiração de 90 dias
SecureStorage.setItem('termos_aceitos', true, 90 * 24 * 60 * 60 * 1000);

// Recuperar
const aceito = SecureStorage.getItem('termos_aceitos');
```

---

### ✏️ `formatters.js` - Formatação de Artigos
**Propósito:** Consolidar todas as funções de formatação de artigos

**Funções:**
- `normalizar(texto)` - Remove acentos e normaliza
- `formatar(valor)` - Aplica formatação automática
- `processar(artigo)` - Processa artigo em componentes
- `processarParte(parte)` - Processa parte do artigo
- `formatarCompleto(artigo)` - Formata para exibição
- `formatarParte(parte)` - Formata parte do artigo
- `extrairArtigos(texto)` - Extrai números de artigos

**Exemplo:**
```javascript
// Formatar entrada do usuário
const formatado = ArtigoFormatter.formatar('121, §1');
// Resultado: '121, §1º'

// Processar artigo completo
const processado = ArtigoFormatter.processar('121, §2º, I, "a"');
// Resultado: { artigo: '121', paragrafo: '2', inciso: 'I', alinea: 'a', ... }
```

---

### ✅ `exceptions.js` - Validação de Exceções
**Propósito:** Verificar exceções aplicáveis aos artigos consultados

**Funções:**
- `normalizar(texto)` - Normaliza texto para comparação
- `verificar(item, artigoProcessado)` - Verifica exceções aplicáveis
- `filtrarPorArtigo(excecoes, artigoProcessado)` - Filtra exceções do mesmo artigo

**Exemplo:**
```javascript
const item = {
  excecoes: ['Art. 121, §3º', 'Art. 122, caput']
};
const artigo = { artigo: '121', paragrafo: '3' };

const excecao = ExceptionValidator.verificar(item, artigo);
if (excecao) {
  console.log('Exceção aplicável:', excecao);
  // Resultado: 'Art. 121, §3º'
}
```

---

### 🪟 `modal-manager.js` - Gerenciamento de Modal
**Propósito:** Centralizar toda a lógica de controle do modal

**Funções:**
- `open(tipoResultado, status, conteudo)` - Abre modal
- `close()` - Fecha modal
- `isOpen()` - Verifica se está aberto
- `getCurrentContent()` - Obtém conteúdo atual
- `exportContent()` - Exporta conteúdo formatado

**Exemplo:**
```javascript
// Abrir modal
ModalManager.open('inelegivel', 'INELEGÍVEL', htmlContent);

// Fechar modal
ModalManager.close();

// Exportar conteúdo
const texto = ModalManager.exportContent();
navigator.clipboard.writeText(texto);
```

---

### 🔍 `search-index.js` (Descontinuado)
Substituído por `data-normalizado.js` com `DataNormalizer.query` e índices internos. Todas as consultas devem usar exclusivamente dados **pré-normalizados**.

---

## 🔗 Dependências

### Ordem de Carregamento
Os módulos e dados devem ser carregados nesta ordem no HTML:

```html
<!-- 1. Módulos base (sem dependências) -->
<script src="/assets/js/modules/sanitizer.js?v=0.2.0" defer></script>
<script src="/assets/js/modules/storage.js?v=0.2.0" defer></script>

<!-- 2. Módulos de processamento -->
<script src="/assets/js/modules/formatters.js?v=0.2.0" defer></script>
<script src="/assets/js/modules/exceptions.js?v=0.2.0" defer></script>

<!-- 3. Módulos de UI -->
<script src="/assets/js/modules/modal-manager.js?v=0.2.0" defer></script>

<!-- 4. Dados normalizados (fonte única de verdade) -->
<script src="/assets/js/data-normalizado.js" defer></script>

<!-- 5. API de consulta e lógica principal -->
<script src="/assets/js/consulta-normalizado.js" defer></script>
<script src="/assets/js/script.js" defer></script>
```

---

## 🧪 Testes

Cada módulo possui testes correspondentes em `/tests/`:

```bash
# Testar formatadores
node tests/formatters.test.js

# Testar validador de exceções
node tests/exceptions.test.js

# Executar todos os testes
npm run test:unit
```

---

## 🔒 Segurança

Todos os módulos seguem práticas de segurança:

- ✅ Sanitização de entrada
- ✅ Validação de dados
- ✅ Prevenção XSS
- ✅ Tratamento de erros
- ✅ Sem eval() ou innerHTML direto

---

## 📚 Documentação Adicional

- [Histórico da Refatoração](../../../docs/history/refatoracao-v0.0.6.md)
- [Changelog](../../../CHANGELOG.md)

---

## 🤝 Contribuindo

Ao adicionar novos módulos:

1. Seguir padrão de nomenclatura: `nome-modulo.js`
2. Adicionar comentário JSDoc no topo
3. Exportar para `window` se necessário
4. Criar testes correspondentes
5. Atualizar este README

---
- ✅ Documentação completa

---

**Versão:** 0.2.0
