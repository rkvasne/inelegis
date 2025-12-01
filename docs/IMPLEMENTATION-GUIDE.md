# 📘 Guia de Implementação - Refatoração Inelegis

Este guia detalha como implementar as melhorias criadas no plano de refatoração.

---

**Última atualização:** 01 de dezembro de 2025  
**Versão:** 0.0.6  
**Status:** ✅ Implementado

---

> **📌 NOTA IMPORTANTE:** Este guia descreve a implementação da refatoração v0.0.6 que foi **concluída em 01/12/2025**.  
> Mantido como **referência histórica** para futuras refatorações.  
> Para informações atuais sobre a arquitetura implementada, consulte [DEVELOPMENT.md](DEVELOPMENT.md).

---

## 🚀 Passo 1: Adicionar Módulos ao HTML

### Atualizar `consulta.html`

Adicione os scripts antes do fechamento do `</body>`:

```html
<!-- Módulos de Segurança e Utilidades -->
<script src="js/sanitizer.js"></script>
<script src="js/storage.js"></script>
<script src="js/formatters.js"></script>
<script src="js/exceptions.js"></script>
<script src="js/modal-manager.js"></script>
<script src="js/search-index.js"></script>

<!-- Scripts Principais -->
<script src="data.js"></script>
<script src="script.js"></script>
```

---

## 🔄 Passo 2: Atualizar `script.js`

### 2.1 Substituir Funções Duplicadas

**Remover:**
```javascript
// REMOVER estas funções duplicadas:
function aplicarFormatacaoAutomatica(valor) { ... }
function aplicarFormatacaoAutomatica2(valor) { ... }
function verificarExcecoesAplicaveis(item, artigoProcessado) { ... }
function verificarExcecoesAplicaveis2(item, artigoProcessado) { ... }
function processarArtigoCompleto(artigo) { ... }
function formatarArtigoCompleto(artigo) { ... }
```

**Substituir por:**
```javascript
// Usar módulos:
const formatado = ArtigoFormatter.formatar(valor);
const processado = ArtigoFormatter.processar(artigo);
const excecao = ExceptionValidator.verificar(item, artigoProcessado);
```

### 2.2 Atualizar Função de Busca

**Antes:**
```javascript
function realizarBusca() {
  const leiSelecionada = leiSelect.value.trim();
  const artigoDigitado = artigoInput.value.trim();
  
  const resultado = buscarInelegibilidadePorLeiEArtigo(leiSelecionada, artigoDigitado);
  // ...
}
```

**Depois:**
```javascript
function realizarBusca() {
  const leiSelecionada = leiSelect.value.trim();
  const artigoDigitado = artigoInput.value.trim();
  
  if (!leiSelecionada || !artigoDigitado) {
    alert('Por favor, selecione uma lei e digite o artigo.');
    return;
  }
  
  esconderSugestoes();
  
  // Usar busca otimizada com índice
  const resultado = SearchIndex.buscar(
    leiSelecionada,
    artigoDigitado,
    leisDisponiveis,
    tabelaInelegibilidade
  );
  
  if (resultado) {
    exibirResultado(resultado);
  } else {
    exibirNaoEncontrado(leiSelecionada, artigoDigitado);
  }
}
```

### 2.3 Atualizar Formatação Automática

**Antes:**
```javascript
artigoInput.addEventListener('input', function () {
  const valorAtual = this.value;
  const valorTrim = valorAtual.trim();
  
  if (valorTrim && valorTrim.length > 0) {
    const valorFormatado = aplicarFormatacaoAutomatica2(valorTrim);
    // ...
  }
});
```

**Depois:**
```javascript
artigoInput.addEventListener('input', function () {
  const valorAtual = this.value;
  const valorTrim = valorAtual.trim();
  
  if (valorTrim && valorTrim.length > 0) {
    const valorFormatado = ArtigoFormatter.formatar(valorTrim);
    
    if (valorFormatado !== valorTrim) {
      const posicaoCursor = this.selectionStart;
      this.value = valorFormatado;
      const novaPos = Math.min(
        posicaoCursor + (valorFormatado.length - valorTrim.length),
        valorFormatado.length
      );
      this.setSelectionRange(novaPos, novaPos);
    }
  }
  
  verificarCamposPreenchidos();
  debouncedSugestoes(valorTrim);
});
```

### 2.4 Atualizar Modal

**Remover:**
```javascript
// REMOVER variáveis globais:
let __modalTrapHandler = null;
let __lastFocusedElement = null;
let conteudoModalAtual = '';

// REMOVER função antiga:
function abrirModal(tipoResultado, status, conteudo) { ... }
function fecharModal() { ... }
```

**Substituir por:**
```javascript
// Usar ModalManager:
function abrirModal(tipoResultado, status, conteudo) {
  ModalManager.open(tipoResultado, status, conteudo);
}

function fecharModal() {
  ModalManager.close();
}

function exportarResultado() {
  const texto = ModalManager.exportContent();
  if (texto) {
    navigator.clipboard.writeText(texto).then(() => {
      mostrarToast('✅ Resultado copiado para área de transferência!', 'success');
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      mostrarToast('❌ Erro ao copiar. Tente novamente.', 'error');
    });
  }
}
```

### 2.5 Atualizar localStorage

**Antes:**
```javascript
localStorage.setItem('ineleg_termos_aceitos', 'true');
const termosAceitos = localStorage.getItem('ineleg_termos_aceitos') === 'true';
```

**Depois:**
```javascript
SecureStorage.setItem('termos_aceitos', true);
const termosAceitos = SecureStorage.getItem('termos_aceitos') === true;
```

---

## 🧪 Passo 3: Executar Testes

### 3.1 Testes Unitários

```bash
# Testar formatadores
node tests/formatters.test.js

# Testar validador de exceções
node tests/exceptions.test.js

# Executar todos os testes
npm test
```

### 3.2 Testes Manuais

1. **Teste de Busca:**
   - Abrir `consulta.html`
   - Selecionar "Código Penal"
   - Digitar "121, §2º"
   - Verificar resultado

2. **Teste de Formatação:**
   - Digitar "121, §1" (sem º)
   - Verificar se formata para "121, §1º"

3. **Teste de Modal:**
   - Realizar busca
   - Verificar abertura do modal
   - Testar botão "Exportar"
   - Testar fechamento com ESC

4. **Teste de localStorage:**
   - Aceitar termos
   - Recarregar página
   - Verificar se termos continuam aceitos

---

## 🔍 Passo 4: Validação

### 4.1 Lint

```bash
npm run lint
```

### 4.2 Build

```bash
npm run build
```

### 4.3 Verificar Dados

```bash
npm run validate
```

---

## 📦 Passo 5: Otimização (Opcional)

### 5.1 Minificar CSS

```bash
# Instalar ferramenta
npm install -D cssnano postcss-cli

# Minificar
npx postcss styles.css -o styles.min.css --use cssnano
```

### 5.2 Minificar JS

```bash
# Instalar ferramenta
npm install -D terser

# Minificar cada módulo
npx terser js/sanitizer.js -o js/sanitizer.min.js -c -m
npx terser js/storage.js -o js/storage.min.js -c -m
npx terser js/formatters.js -o js/formatters.min.js -c -m
npx terser js/exceptions.js -o js/exceptions.min.js -c -m
npx terser js/modal-manager.js -o js/modal-manager.min.js -c -m
npx terser js/search-index.js -o js/search-index.min.js -c -m
```

### 5.3 Atualizar HTML para usar versões minificadas

```html
<!-- Produção -->
<script src="js/sanitizer.min.js"></script>
<script src="js/storage.min.js"></script>
<!-- ... -->
```

---

## 🚨 Troubleshooting

### Problema: "Sanitizer is not defined"

**Solução:** Verificar se `js/sanitizer.js` está sendo carregado antes de `script.js`

### Problema: "ArtigoFormatter is not defined"

**Solução:** Verificar ordem de carregamento dos scripts no HTML

### Problema: Busca não retorna resultados

**Solução:** 
1. Verificar se `leisDisponiveis` e `tabelaInelegibilidade` estão definidos
2. Limpar cache: `SearchIndex.clearCache()`
3. Verificar console para erros

### Problema: Modal não abre

**Solução:**
1. Verificar se `ModalManager` está carregado
2. Verificar se elemento `#modalResultado` existe no HTML
3. Verificar console para erros

---

## ✅ Checklist de Implementação

### Preparação
- [ ] Fazer backup do código atual
- [ ] Criar branch de desenvolvimento
- [ ] Revisar documentação

### Implementação
- [ ] Adicionar scripts ao HTML
- [ ] Atualizar `script.js`
- [ ] Remover código duplicado
- [ ] Atualizar chamadas de funções
- [ ] Atualizar localStorage

### Testes
- [ ] Executar testes unitários
- [ ] Testes manuais de busca
- [ ] Testes de formatação
- [ ] Testes de modal
- [ ] Testes de acessibilidade

### Validação
- [ ] Lint sem erros
- [ ] Build com sucesso
- [ ] Dados validados
- [ ] Performance melhorada

### Deploy
- [ ] Testar em staging
- [ ] Validar em produção
- [ ] Monitorar erros
- [ ] Atualizar documentação

---

## 📊 Métricas de Sucesso

### Performance
- **Antes:** Busca em ~50ms
- **Meta:** Busca em ~5ms (90% mais rápido)

### Segurança
- **Antes:** 3 vulnerabilidades XSS
- **Meta:** 0 vulnerabilidades

### Qualidade
- **Antes:** 15% código duplicado
- **Meta:** < 5% código duplicado

### Testes
- **Antes:** 0% cobertura
- **Meta:** > 60% cobertura

---

## 🎯 Próximos Passos

Após implementação bem-sucedida:

1. **Fase 8:** Melhorias de Acessibilidade
2. **Fase 9:** Otimização de Assets
3. **Fase 10:** Documentação Completa
4. **Fase 11:** Preparação para v0.1.0

---

---

**Última atualização:** 01 de dezembro de 2025  
**Versão:** 0.0.6
