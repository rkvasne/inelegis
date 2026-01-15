---
docStatus: active
docScope: design
lastReviewed: 15/01/2026
---

# 🎨 Guia de Design da Landing Page

Este documento define os padrões visuais e estruturais específicos para a Landing Page do Inelegis, baseados na referência visual moderna (SaaS/Fintech) e alinhamento preciso.

Este é o documento de referência principal (fonte de verdade) para layout, alinhamento e responsividade.

---

## 📐 Dimensões & Layout

A Landing Page segue um layout "contained" para garantir legibilidade em telas ultra-wide e consistência visual.

### Referência Visual
- **Inspiração:** [referência visual]()
- **Estilo:** Clean, Modern SaaS, Dark/Light Mode support.

### Variáveis CSS Principais

Estas variáveis devem ser definidas no `:root` (arquivo `landing.css`):

```css
:root {
  /* Largura Máxima do Conteúdo */
  --content-max-width: 1312px; /* Referência referência visual */
  --nav-max-width: 1312px;     /* Header alinhado com conteúdo */
  
  /* Espaçamento Lateral (Gutter) */
  --page-gutter: 1.5rem;       /* 24px - Respiro lateral */
  
  /* Alturas */
  --header-height: 70px;
}
```

### Regras de Container
Todo o conteúdo principal deve estar dentro de um container que respeite essas variáveis:

```css
.container, 
.footer-content, 
.landing-nav {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  box-sizing: border-box;
}
```

---

## 🧩 Componentes Estruturais

### Header (`.landing-header`)
- **Posição:** `fixed` ou `sticky` no topo.
- **Largura:** 100% (com container interno limitado a 1312px).
- **Alinhamento:**
  - Esquerda: Logo/Marca.
  - Centro: Links de Navegação (Desktop).
  - Direita: Ações (Botão CTA, Theme Toggle).
- **Mobile:** Menu hambúrguer substitui links.

### Footer (`.main-footer`)
- **Estrutura de Grid:**
  - **NUNCA** use porcentagens (`%`) se houver `gap`. Use `fr`.
  - Exemplo: `grid-template-columns: 1fr 1fr 1fr;` com `gap: 40px`.
- **Alinhamento:**
  - Coluna 1 (Marca/Info): Alinhada à esquerda.
  - Coluna 2 (Links Rápidos): Bloco centralizado, itens alinhados à esquerda.
  - Coluna 3 (Transparência/Social):
    - O **bloco** deve alinhar à direita (`align-items: flex-end`) para casar com a margem do header.
    - O **conteúdo interno** (título, ícones) deve alinhar à esquerda (`align-items: flex-start`).
    - Use um wrapper `.footer-social-wrapper` para isso.

---

## 📱 Responsividade

### Breakpoints
- **Mobile:** `< 768px`
- **Tablet/Desktop:** `>= 768px`

### Comportamento Mobile
- **Header:** Links ocultos, menu hambúrguer visível.
- **Footer:** Grid vira coluna única (`1fr`), todo o texto centralizado (`text-align: center`, `align-items: center`).
- **Gutter:** Pode ser reduzido para `1rem` (16px) em telas muito pequenas (< 480px) se necessário, mas `1.5rem` é seguro.

---

## 🎨 Tipografia e Cores

- **Fonte Principal:** Inter (Google Fonts).
- **Cores:**
  - Baseadas em variáveis CSS (`--text-primary`, `--bg-primary`, etc.) para suporte a Dark Mode.
  - Botões CTA: Cores sólidas com contraste alto (ex: Azul `--primary-500` no Dark Mode).

---

## 🛠️ Template Base

Para criar novas seções ou páginas de marketing, utilize o template localizado em:
`docs/design/landing-template.md`

O template é uma referência copiável e deve permanecer alinhado às regras definidas neste guia.
