---
docStatus: active
docScope: design
lastReviewed: 21/01/2026
---

# 🎨 Guia de Design da Landing Page

Este documento define os padrões visuais e estruturais específicos para a Landing Page do Inelegis, baseados na referência visual moderna (SaaS/Fintech) e alinhamento preciso.

Este documento reúne:
- Guia de design (regras de layout, alinhamento e responsividade)
- Template HTML copiável (referência completa)

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
- **Theme Toggle:** usar `id="theme-toggle"` e classe `btn-icon` no botão.

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

## 🧭 IDs de Seção

- **Hero:** `#inicio`
- **Recursos:** `#recursos`
- **Como funciona:** `#como-funciona`
- **Depoimentos:** `#depoimentos`
- **CTA final:** `#cta`

---

## 🎨 Tipografia e Cores

- **Fonte Principal:** Inter (Google Fonts).
- **Cores:**
  - Baseadas em variáveis CSS (`--text-primary`, `--bg-primary`, etc.) para suporte a Dark Mode.
  - Botões CTA: Cores sólidas com contraste alto (ex: Azul `--primary-500` no Dark Mode).

---

## 🧩 Template HTML (copiável)

> **⚠️ Nota Importante:** Para manter uma única fonte da verdade, o template completo HTML foi removido deste documento local.
> Utilize o template canônico disponível no repositório global de regras:
>
> **Localização:** `e:\Agents\templates\landing-page\template.html`

Use o template global como base e aplique as variáveis CSS específicas listadas na seção [Tipografia e Cores](#-tipografia-e-cores) deste documento.

## 📐 Sistema de Design (Espaçamento e Tipografia)

Para garantir consistência sem depender exclusivamente do template HTML, siga estas regras de design tokens extraídas do sistema:

### 📏 Espaçamentos (Spacings)
- **Container Gutter:** `1.5rem` (24px) (Desktop) / `1rem` (16px) (Mobile)
- **Section Padding:**
  - `Hero`: `4rem` top / `6rem` bottom
  - `Features/CTA`: `6rem` vertical
  - `Stats`: `3rem` vertical
- **Grid Gaps:**
  - `Features`: `2rem`
  - `Stats`: `3rem`

### ✍️ Tipografia (Typography Scale)
- **Hero Title:** `clamp(2.5rem, 5vw, 4rem)` (Font-weight: 900)
- **Hero Description:** `clamp(1.125rem, 2vw, 1.5rem)`
- **Section Title:** `clamp(2rem, 4vw, 3rem)` (Font-weight: 800)
- **Section Description:** `1.25rem`
- **Feature Title:** `1.5rem` (Font-weight: 700)
- **Stat Number:** `3.5rem` (Font-weight: 900)

## 🔗 Ver também
- [Decisões de Design](design-decisions.md)
- [Theme Validator](theme-validator.md)
