# 🔒 Guia de Proteção Contra Corrupção de Código

**Última atualização:** 01 de dezembro de 2025

Este documento explica como o projeto está protegido contra corrupção acidental de HTML e fornece diretrizes para edições seguras.

---

## 🛡️ Componentes Protegidos

### Footer Component (`components/footer.js`)

O footer foi componentizado para evitar duplicação e corrupção. **NUNCA edite o HTML do footer diretamente nos arquivos `.html`**.

**Como atualizar o footer:**

1. Edite apenas o arquivo `components/footer.js`
2. O footer será automaticamente injetado em todas as páginas
3. Teste em todas as páginas antes de commitar

**Vantagens:**
- ✅ Uma única fonte de verdade
- ✅ Impossível ter footers diferentes entre páginas
- ✅ Mudanças propagam automaticamente
- ✅ Menos propenso a erros de edição

---

## ⚠️ Áreas Sensíveis

### 1. Seções com Muitas Tags Aninhadas

**Problema:** Tags HTML profundamente aninhadas são fáceis de corromper.

**Solução:** Use comentários para marcar início e fim:

```html
<!-- INÍCIO: Legenda de Resultados -->
<div class="results-legend">
    <!-- conteúdo -->
</div>
<!-- FIM: Legenda de Resultados -->
```

### 2. Código JavaScript Inline

**Problema:** Scripts inline podem "vazar" para fora das tags `<script>`.

**Solução:** 
- Sempre use `<script>` com fechamento explícito
- Nunca deixe scripts sem fechar
- Prefira arquivos `.js` externos

### 3. SVGs Inline

**Problema:** SVGs têm muitas tags e são fáceis de quebrar.

**Solução:**
- Mantenha SVGs em uma linha quando possível
- Use comentários para marcar SVGs complexos

---

## 📋 Checklist Antes de Editar HTML

Antes de fazer qualquer edição em arquivos `.html`:

- [ ] Faça backup ou commit do estado atual
- [ ] Identifique exatamente qual seção precisa ser editada
- [ ] Use comentários para marcar a área
- [ ] Edite apenas o necessário
- [ ] Valide o HTML após a edição
- [ ] Teste no navegador
- [ ] Verifique se não quebrou outras seções

---

## 🔧 Ferramentas de Validação

### Validar HTML Localmente

```bash
# Instalar validador (se necessário)
npm install -g html-validator-cli

# Validar um arquivo
html-validator --file=index.html
```

### Validar Antes de Commit

Adicione ao `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Valida HTML antes de permitir commit
for file in $(git diff --cached --name-only | grep -E '\.html$'); do
    echo "Validando $file..."
    # Adicione validação aqui
done
```

---

## 🚨 Se Algo Quebrar

### Restauração Rápida

```bash
# Restaurar um arquivo específico do último commit
git restore arquivo.html

# Restaurar todos os HTMLs
git restore *.html

# Ver diferenças antes de restaurar
git diff arquivo.html
```

### Backup Manual

Sempre mantenha backups antes de edições grandes:

```bash
# Criar backup
cp arquivo.html arquivo.html.backup

# Restaurar do backup
cp arquivo.html.backup arquivo.html
```

---

## 💡 Melhores Práticas

### 1. Componentização

Sempre que possível, extraia seções repetidas para componentes JavaScript:

```javascript
// Exemplo: components/header.js
const headerHTML = `<header>...</header>`;
document.body.insertAdjacentHTML('afterbegin', headerHTML);
```

### 2. Templates Literais

Use template literals para HTML complexo:

```javascript
const card = `
    <div class="card">
        <h2>${title}</h2>
        <p>${description}</p>
    </div>
`;
```

### 3. Validação Automática

Adicione validação no build:

```json
{
  "scripts": {
    "validate": "html-validator --file=*.html",
    "prebuild": "npm run validate"
  }
}
```

---

## 📚 Recursos Adicionais

- [HTML Validator](https://validator.w3.org/)
- [MDN: HTML Best Practices](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)
- [Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html)

---

**Versão deste documento:** 1.0  
**Status:** ✅ Ativo
