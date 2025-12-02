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

### 🔍 `search-index.js` - Busca Otimizada
**Propósito:** Otimizar performance de busca usando índices e cache

**Funções:**
- `buildLeiIndex(leisDisponiveis, tabelaInelegibilidade)` - Constrói índice
- `getItensPorLei(codigoLei, leisDisponiveis, tabelaInelegibilidade)` - Obtém itens
- `buscar(codigoLei, numeroArtigo, leisDisponiveis, tabelaInelegibilidade)` - Busca otimizada
- `clearCache()` - Limpa cache

**Exemplo:**
```javascript
// Busca otimizada (usa cache)
const resultado = SearchIndex.buscar(
  'CP',
  '121, §2º',
  leisDisponiveis,
  tabelaInelegibilidade
);

if (resultado) {
  console.log('Encontrado:', resultado);
}
```

---

## 🔗 Dependências

### Ordem de Carregamento
Os módulos devem ser carregados nesta ordem no HTML:

```html
<!-- 1. Módulos base (sem dependências) -->
<script src="js/sanitizer.js"></script>
<script src="js/storage.js"></script>

<!-- 2. Módulos de processamento -->
<script src="js/formatters.js"></script>
<script src="js/exceptions.js"></script>

<!-- 3. Módulos de UI -->
<script src="js/modal-manager.js"></script>

<!-- 4. Módulos de busca (dependem dos anteriores) -->
<script src="js/search-index.js"></script>

<!-- 5. Dados e lógica principal -->
<script src="data.js"></script>
<script src="script.js"></script>
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

## 📊 Performance

### Antes da Modularização
- Busca: ~50ms
- Código duplicado: 15%
- Manutenibilidade: Baixa

### Depois da Modularização
- Busca: ~5ms (90% mais rápido)
- Código duplicado: <5%
- Manutenibilidade: Alta

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
- [Release Notes v0.0.9](../../../docs/history/RELEASE-NOTES-v0.0.9.md)

---

## 🤝 Contribuindo

Ao adicionar novos módulos:

1. Seguir padrão de nomenclatura: `nome-modulo.js`
2. Adicionar comentário JSDoc no topo
3. Exportar para `window` se necessário
4. Criar testes correspondentes
5. Atualizar este README

---

## 📝 Changelog

### v0.0.9 (02/12/2025)
- ✅ Versão dos módulos, badges e metadados atualizados para 0.0.9
- ✅ Ajustes de paths para `public/` + `src/` com novo pipeline `sync-js`
- ✅ Docs sincronizados com release notes mais recentes

### v0.0.8 (02/12/2025)
- ✅ Sistema de toast e modal para UX
- ✅ Verificação de termos no menu
- ✅ Cache desabilitado (sem Service Worker)
- ✅ Header com tons de azul

### v0.0.7 (02/12/2025)
- ✅ `search-history.js` - Sincronização com Redis
- ✅ `analytics.js` - Envio de eventos para API

### v0.0.6 (01/12/2025)
- ✅ Criação inicial dos 6 módulos
- ✅ Implementação de testes
- ✅ Documentação completa

---

**Última atualização:** 02 de dezembro de 2025  
**Versão:** 0.0.9
