# 🧩 Sistema de Componentes

**Última atualização:** 01 de dezembro de 2025  
**Versão:** 1.0

Este documento explica o sistema de componentes implementado para evitar duplicação e corrupção de código HTML.

---

## 📦 Componentes Disponíveis

### 1. Header (`components/header.js`)
**Responsabilidade:** Cabeçalho do sistema com logo e informações de versão.

**Uso:**
```html
<script src="components/header.js"></script>
```

**Não edite:** O HTML do header diretamente nos arquivos `.html`

---

### 2. Navigation (`components/navigation.js`)
**Responsabilidade:** Menu de navegação com detecção automática de página ativa.

**Recursos:**
- ✅ Detecta automaticamente a página atual
- ✅ Marca o link ativo com classe `.active`
- ✅ Adiciona `aria-current="page"` para acessibilidade

**Uso:**
```html
<script src="components/navigation.js"></script>
```

---

### 3. Results Legend (`components/results-legend.js`)
**Responsabilidade:** Legenda de resultados (INELEGÍVEL, ELEGÍVEL, NÃO ENCONTRADO).

**⚠️ Importante:** Este componente é usado APENAS em `consulta.html`.

**Uso:**
```html
<!-- Apenas em consulta.html -->
<script src="components/results-legend.js"></script>
```

---

### 4. Footer (`components/footer.js`)
**Responsabilidade:** Rodapé com links para documentação no GitHub.

**Variações:**
- Footer padrão (index, consulta, sobre, faq)
- Footer landing (landing.html) com texto diferente

**Uso:**
```html
<script src="components/footer.js"></script>
```

---

### 5. Components Loader (`components/loader.js`)
**Responsabilidade:** Carrega todos os componentes na ordem correta.

**Uso recomendado:**
```html
<!-- No final do <body>, antes de outros scripts -->
<script src="components/loader.js"></script>
```

**Vantagens:**
- ✅ Carrega componentes na ordem correta
- ✅ Garante que não haja conflitos
- ✅ Dispara evento `componentsLoaded` quando pronto
- ✅ Logs detalhados no console

---

## 🔧 Como Usar

### Estrutura Básica de uma Página

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página | Inelegis</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- O header, nav e footer serão injetados automaticamente -->
    
    <main class="container mt-8">
        <!-- Seu conteúdo aqui -->
    </main>

    <!-- Carrega todos os componentes -->
    <script src="components/loader.js"></script>
    
    <!-- Seus scripts específicos da página -->
    <script src="script.js"></script>
</body>
</html>
```

### Para Consulta.html (com Legenda)

```html
<!-- Depois do loader.js -->
<script src="components/loader.js"></script>
<script src="components/results-legend.js"></script>
<script src="data.js"></script>
<script src="script.js"></script>
```

---

## ✏️ Como Editar Componentes

### ⚠️ NUNCA edite o HTML diretamente nos arquivos `.html`

**❌ ERRADO:**
```html
<!-- index.html -->
<header class="system-header">
    <div class="container">
        <!-- editando aqui -->
    </div>
</header>
```

**✅ CORRETO:**
```javascript
// components/header.js
const headerHTML = `
    <header class="system-header">
        <div class="container">
            <!-- edite aqui -->
        </div>
    </header>
`;
```

### Fluxo de Edição

1. **Identifique o componente** que precisa ser editado
2. **Abra o arquivo** em `components/[nome].js`
3. **Edite o template literal** (variável com HTML)
4. **Salve o arquivo**
5. **Teste em TODAS as páginas** que usam o componente
6. **Commit** quando tudo estiver funcionando

---

## 🧪 Testando Componentes

### Verificar se os Componentes Foram Carregados

Abra o Console do navegador (F12) e procure por:

```
[Components] Iniciando carregamento de componentes...
[Components] ✅ header.js carregado
[Components] ✅ navigation.js carregado
[Components] ✅ footer.js carregado
[Components] ✅ Todos os componentes carregados com sucesso
```

### Escutar o Evento de Componentes Prontos

```javascript
document.addEventListener('componentsLoaded', function() {
    console.log('Todos os componentes estão prontos!');
    // Seu código que depende dos componentes
});
```

---

## 🐛 Troubleshooting

### Componente não aparece na página

1. Verifique se o script está incluído no HTML
2. Abra o Console (F12) e procure por erros
3. Verifique se o caminho está correto (`components/nome.js`)
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

### Componente aparece duplicado

1. Verifique se você não tem o HTML E o componente
2. Remova o HTML manual do arquivo `.html`
3. Mantenha apenas o `<script>` do componente

### Estilos não aplicados

1. Os componentes injetam apenas HTML
2. Os estilos devem estar em `styles.css`
3. Verifique se as classes CSS estão corretas

---

## 📊 Benefícios do Sistema

| Antes | Depois |
|-------|--------|
| ❌ HTML duplicado em 5 arquivos | ✅ HTML em 1 arquivo |
| ❌ Edições manuais propensas a erros | ✅ Edição centralizada |
| ❌ Inconsistências entre páginas | ✅ Sempre consistente |
| ❌ Difícil de manter | ✅ Fácil de manter |
| ❌ Corrupção frequente | ✅ Protegido contra corrupção |

---

## 🚀 Próximos Passos

### Componentes Futuros (Sugestões)

- [ ] `components/modal.js` - Modal de resultados
- [ ] `components/toast.js` - Notificações toast
- [ ] `components/breadcrumb.js` - Breadcrumb de navegação
- [ ] `components/loading.js` - Indicador de carregamento

### Melhorias Planejadas

- [ ] Suporte a templates com parâmetros
- [ ] Sistema de cache de componentes
- [ ] Validação automática de HTML
- [ ] Hot reload em desenvolvimento

---

**Versão deste documento:** 1.0  
**Status:** ✅ Ativo  
**Manutenção:** Atualizar sempre que novos componentes forem adicionados
