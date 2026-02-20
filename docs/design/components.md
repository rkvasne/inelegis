---
category: design
scope: components
status: reference
version: 0.3.11
---

# 🧩 Guia de Componentes Reutilizáveis

Este documento descreve o sistema de componentes reutilizáveis do Inelegis.

---

## 📚 Visão Geral

O sistema de componentes foi criado para:

- ✅ Centralizar a manutenção de elementos comuns
- ✅ Garantir consistência visual entre páginas
- ✅ Facilitar atualizações globais
- ✅ Reduzir duplicação de código
- ✅ Melhorar a testabilidade

---

## 🚀 Como Usar

### Configuração Básica

- Adicione os placeholders `header-placeholder` e `footer-placeholder` no HTML da página.
- Carregue `components.js` e `theme-manager.js` no final do `body` com `defer`.
- Inicialize com `Components.init('id-da-pagina')`.

```javascript
Components.init("consulta");
```

> **Nota:** A navegação principal é renderizada dentro do próprio header.

> **Fluxo pós-migração:** Sempre edite `src/js/modules/components.js` (fonte) e execute `npm run sync:js` ou `npm run dev` para sincronizar o bundle público (`public/assets/js/modules/components.js`) antes de testar/commitar.

---

## 📦 Componentes Disponíveis

### 1. Header

Renderiza o cabeçalho do sistema com logo, título e botão de tema.

**Uso:**

```javascript
const header = Components.renderHeader(currentPage);
```

**Parâmetros:**

- `currentPage` (string, opcional): ID da página atual

**Retorna:** String HTML

**Exemplo:**

```javascript
const header = Components.renderHeader("consulta");
// Renderiza header com todas as funcionalidades
```

**Características:**

- Logo do sistema
- Título "Inelegis"
- Botão de alternância de tema
- Versão do sistema
- Indicador de status

---

### 2. Footer

Renderiza o rodapé principal do site, sincronizado visualmente com o padrão do projeto.

**Uso:**

```javascript
// Renderizado automaticamente via Components.init()
// Mas pode ser chamado manualmente:
const footerHtml = Components.renderFooter("landing"); // ou 'internal'
```

**Estrutura CSS:**

- `.main-footer`: Container principal (fundo, padding, bordas)
- `.footer-content`: Grid de 3 colunas (1fr 1fr 1fr) com `gap: 40px` e largura máx alinhada ao container
- `.footer-links`: Coluna centralizada no grid, com itens alinhados à esquerda
- `.footer-bottom`: Linha de copyright e links secundários

**Nota:**
Existe um legado `.footer` (footer compacto) que não deve ser confundido com `.main-footer`.
O layout utiliza `display: grid` em desktop e cai para coluna única em mobile (< 768px).

---

### 3. Card

Renderiza um card customizável com título, subtítulo e conteúdo.

**Uso:**

```javascript
const card = Components.renderCard(options);
```

**Parâmetros (objeto):**

- `title` (string, opcional): Título do card
- `subtitle` (string, opcional): Subtítulo do card
- `content` (string, opcional): Conteúdo HTML do card
- `icon` (string, opcional): Path SVG do ícone
- `className` (string, opcional): Classes CSS adicionais

**Retorna:** String HTML

**Exemplo:**

```javascript
const card = Components.renderCard({
  title: "Bem-vindo",
  subtitle: "Sistema de Consulta",
  content: "<p>Conteúdo do card aqui</p>",
  className: "featured-card",
});
```

---

### 4. Button

Renderiza um botão customizável com diferentes tipos e estados.

**Uso:**

```javascript
const button = Components.renderButton(options);
```

**Parâmetros (objeto):**

- `text` (string, obrigatório): Texto do botão
- `type` (string, opcional): Tipo do botão ('primary', 'secondary', 'danger')
- `icon` (string, opcional): Path SVG do ícone
- `onClick` (string, opcional): Função JavaScript a ser chamada
- `disabled` (boolean, opcional): Se o botão está desabilitado
- `className` (string, opcional): Classes CSS adicionais

**Retorna:** String HTML

**Exemplo:**

```javascript
const button = Components.renderButton({
  text: "Buscar",
  type: "primary",
  icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  onClick: "realizarBusca()",
  disabled: false,
});
```

**Tipos disponíveis:**

- `primary` - Botão principal (azul)
- `secondary` - Botão secundário (cinza)
- `danger` - Botão de ação destrutiva (vermelho)

---

### 5. Alert

Renderiza um alerta com diferentes tipos e mensagens.

**Uso:**

```javascript
const alert = Components.renderAlert(options);
```

**Parâmetros (objeto):**

- `type` (string, opcional): Tipo do alerta ('success', 'warning', 'danger', 'info')
- `title` (string, opcional): Título do alerta
- `message` (string, opcional): Mensagem do alerta
- `dismissible` (boolean, opcional): Se o alerta pode ser fechado

**Retorna:** String HTML

**Exemplo:**

```javascript
const alert = Components.renderAlert({
  type: "warning",
  title: "Atenção",
  message: "Esta ação não pode ser desfeita.",
  dismissible: true,
});
```

**Tipos disponíveis:**

- `success` - Sucesso (verde)
- `warning` - Aviso (amarelo)
- `danger` - Erro (vermelho)
- `info` - Informação (azul)

---

## 🎨 Personalização

### Estilos CSS

Todos os componentes usam classes CSS padronizadas que podem ser customizadas:

```css
/* Header */
.system-header {
}
.system-brand {
}
.theme-toggle {
}

/* Navegação */
.nav {
}
.nav-link {
}
.nav-link.active {
}

/* Footer */
.footer {
}
.footer-link {
}

/* Card */
.card {
}
.card-header {
}
.card-body {
}

/* Button */
.btn {
}
.btn-primary {
}
.btn-secondary {
}
.btn-danger {
}

/* Alert */
.alert {
}
.alert-success {
}
.alert-warning {
}
.alert-danger {
}
.alert-info {
}
```

### Tema Escuro

Todos os componentes suportam tema escuro automaticamente através das variáveis CSS:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  /* ... */
}

.dark-theme {
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
  /* ... */
}
```

---

## 🧪 Testes

Execute os testes dos componentes:

```bash
npm run test:components
```

Todos os componentes possuem testes automatizados que verificam:

- ✅ Renderização correta
- ✅ Parâmetros obrigatórios e opcionais
- ✅ Classes CSS aplicadas
- ✅ Conteúdo dinâmico
- ✅ Estados (ativo, desabilitado, etc.)

---

## 📝 Exemplos Práticos

> 💡 Carregue `/assets/js/modules/theme-bootstrap.js` no `<head>` para aplicar o tema antes do primeiro paint. Se a página exigir confirmação dos termos, também inclua `/assets/js/modules/terms-gate.js` logo após o bootstrap.

### Página Completa

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Minha Página | Inelegis</title>
    <link rel="stylesheet" href="/styles/styles.css" />
    <script src="/assets/js/modules/theme-bootstrap.js?v=0.3.0"></script>
    <!-- Opcional: restringe acesso caso os termos não tenham sido aceitos -->
    <script src="/assets/js/modules/terms-gate.js?v=0.3.0"></script>
  </head>
  <body>
    <div id="header-placeholder"></div>
    <div id="nav-placeholder"></div>

    <main class="container">
      <h1>Minha Página</h1>
      <p>Conteúdo aqui...</p>
    </main>

    <div id="footer-placeholder"></div>

    <script src="/assets/js/modules/components.js?v=0.3.0" defer></script>
    <script src="/assets/js/modules/theme-manager.js?v=0.3.0" defer></script>
    <script>
      Components.init("minha-pagina");
    </script>
  </body>
</html>
```

### Card com Botão

```javascript
const cardContent = `
    <p>Descrição do card</p>
    ${Components.renderButton({
      text: "Ação",
      type: "primary",
      onClick: "minhaFuncao()",
    })}
`;

const card = Components.renderCard({
  title: "Título",
  subtitle: "Subtítulo",
  content: cardContent,
});

document.getElementById("container").innerHTML = card;
```

---

## 🔧 Manutenção

### Adicionando Novos Componentes

1. Faça as alterações em `src/js/modules/components.js`
2. Documente os parâmetros e retorno
3. Crie/atualize testes em `tests/components.test.js`
4. Atualize este documento

### Modificando Componentes Existentes

1. Faça as alterações em `src/js/modules/components.js`
2. Atualize os testes se necessário
3. Execute `npm run test:components`
4. Atualize a documentação

---

## 📐 Padrões de Layout

O sistema utiliza variáveis CSS globais para garantir consistência de alinhamento entre Landing Page e Aplicação.

### Container & Espaçamento

- **Largura Máxima (`--container-width`)**: `1312px`
  - Define o limite de largura do conteúdo central em telas grandes.
  - Alinhado com padrões modernos (referência: referência visual).

- **Gutter Lateral (`--page-gutter`)**: `1.5rem` (24px)
  - Espaçamento interno fixo nas laterais do container.
  - Aplicado uniformemente em Header, Main Content e Footer.

- **Breakpoints**:
  - Desktop: `>= 768px`
  - Mobile: `< 768px`

### Estrutura CSS Recomendada

Ao criar novas páginas, utilize a classe `.container` para herdar esses padrões automaticamente:

```css
.container {
  max-width: var(--container-width); /* 1312px */
  margin: 0 auto;
  padding: 0 var(--page-gutter); /* 24px */
}
```

### Grids & Colunas

Ao utilizar CSS Grid dentro do container, prefira unidades fracionárias (`fr`) em vez de porcentagens (`%`) quando houver `gap`, para evitar overflow horizontal.

**Correto:**

```css
grid-template-columns: 4fr 3fr 3fr;
gap: 40px;
```

**Evitar (causa overflow):**

```css
grid-template-columns: 40% 30% 30%; /* Soma 100% + gap = Overflow */
gap: 40px;
```

---

## 📚 Referências

- [development.md](../guides/development.md) - Guia técnico completo
- [README.md](../README.md) - Visão geral do projeto
- [src/js/components/components.js](../../src/js/components/components.js) - Fonte dos componentes
- [public/assets/js/components/components.js](../../public/assets/js/components/components.js) - Runtime (sincronizado)

---

_Última atualização: 20/02/2026 • v0.3.25 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
