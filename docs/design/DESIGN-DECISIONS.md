---
docStatus: historical
docScope: design
lastReviewed: 2026-01-10
---
# 🎨 Decisões de Design - Inelegis

**Última atualização:** 01 de dezembro de 2025  
**Versão:** 0.0.7

Este documento explica as principais decisões de design e arquitetura do projeto.

---

## 🤔 Por que Vanilla JS ao invés de Frameworks?

### Decisão: Manter Vanilla JavaScript

**Contexto:**
Foi considerado o uso de Shadcn UI, Radix UI ou outros frameworks modernos para o sistema de componentes e tema.

**Análise das Opções:**

#### 1. Shadcn UI
**Prós:**
- ✅ Componentes prontos e acessíveis
- ✅ Design system completo
- ✅ Baseado em Radix + Tailwind

**Contras:**
- ❌ Requer Tailwind CSS (reescrita completa do CSS)
- ❌ Requer React ou adaptação significativa
- ❌ Aumenta bundle size (~100KB+)
- ❌ Adiciona complexidade de build
- ❌ Overhead de framework

#### 2. Radix UI
**Prós:**
- ✅ Primitivos acessíveis
- ✅ Unstyled (você estiliza)
- ✅ Foco em acessibilidade

**Contras:**
- ❌ Requer React
- ❌ Overhead de framework (~50KB+)
- ❌ Curva de aprendizado
- ❌ Complexidade adicional

#### 3. Vanilla JS (Escolhido) ✅
**Prós:**
- ✅ Zero dependências de runtime
- ✅ Bundle size mínimo (~5KB)
- ✅ Performance máxima
- ✅ Controle total do código
- ✅ Fácil manutenção
- ✅ Sem build complexo
- ✅ Compatibilidade universal
- ✅ Carregamento instantâneo

**Contras:**
- ⚠️ Requer implementação manual de componentes
- ⚠️ Mais código para escrever inicialmente

### Decisão Final

**Escolhemos Vanilla JS** pelos seguintes motivos:

1. **Performance é Crítica:**
   - Sistema usado por servidores públicos
   - Pode ser acessado de redes lentas
   - Cada KB conta

2. **Simplicidade:**
   - Projeto já está 90% completo
   - Adicionar framework seria regressão
   - Manutenção mais simples

3. **Controle Total:**
   - Customização completa
   - Sem limitações de framework
   - Código transparente

4. **Sustentabilidade:**
   - Sem dependências para atualizar
   - Sem breaking changes de terceiros
   - Código que funciona por anos

---

## 🎨 Sistema de Tema

### Arquitetura Escolhida

**Variáveis CSS + JavaScript Mínimo**

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

**Por quê?**

1. **CSS Nativo:**
   - Suporte universal
   - Performance nativa do navegador
   - Transições automáticas

2. **JavaScript Mínimo:**
   - Apenas para toggle e persistência
   - ~160 linhas de código
   - Sem overhead

3. **Escalável:**
   - Fácil adicionar novos temas
   - Variáveis reutilizáveis
   - Manutenção centralizada

---

## 🧩 Sistema de Componentes

### Arquitetura Escolhida

**Template Strings + Renderização Dinâmica**

```javascript
function renderCard({ title, content }) {
    return `
        <div class="card">
            <h2>${title}</h2>
            <div>${content}</div>
        </div>
    `;
}
```

**Por quê?**

1. **Simplicidade:**
   - Fácil de entender
   - Fácil de modificar
   - Sem JSX ou compilação

2. **Performance:**
   - Renderização direta no DOM
   - Sem Virtual DOM overhead
   - Rápido e eficiente

3. **Flexibilidade:**
   - Aceita HTML customizado
   - Fácil composição
   - Sem limitações

---

## 📊 Comparação de Bundle Size

| Solução | Bundle Size | Tempo de Carregamento* |
|---------|-------------|------------------------|
| **Vanilla JS (atual)** | ~5KB | ~50ms |
| Shadcn + React | ~120KB | ~800ms |
| Radix + React | ~80KB | ~600ms |
| Vue 3 | ~50KB | ~400ms |

*Estimativas em rede 3G

---

## 🎯 Princípios de Design

### 1. Performance First
- Cada byte conta
- Carregamento instantâneo
- Sem bloqueios

### 2. Simplicidade
- Código legível
- Fácil manutenção
- Sem magia

### 3. Acessibilidade
- Semântica HTML
- ARIA quando necessário
- Contraste adequado

### 4. Sustentabilidade
- Código que dura
- Sem dependências frágeis
- Fácil de entender

---

## 🔮 Futuro

### Quando Considerar um Framework?

Considere migrar para um framework SE:

1. **Equipe Crescer:**
   - Mais de 3 desenvolvedores ativos
   - Necessidade de padrões rígidos

2. **Complexidade Aumentar:**
   - Mais de 50 componentes
   - Estado global complexo
   - Rotas dinâmicas

3. **Requisitos Mudarem:**
   - Aplicativo mobile nativo
   - Sincronização real-time
   - Offline-first

### Por Enquanto...

**Vanilla JS é a escolha certa!** ✅

- Projeto pequeno/médio
- Performance crítica
- Equipe pequena
- Requisitos estáveis

---

## 📚 Referências

### Artigos que Influenciaram

- [The Cost of JavaScript Frameworks](https://timkadlec.com/remembers/2020-04-21-the-cost-of-javascript-frameworks/)
- [Vanilla JS vs Frameworks](https://www.freecodecamp.org/news/vanilla-javascript-vs-frameworks/)
- [You Might Not Need a Framework](https://youmightnotneedaframework.com/)

### Projetos Similares

- [You Don't Need jQuery](https://github.com/nefe/You-Dont-Need-jQuery)
- [Vanilla JS Toolkit](https://vanillajstoolkit.com/)
- [PlainJS](https://plainjs.com/)

---

## 💡 Lições Aprendidas

### O que Funcionou Bem

1. **Variáveis CSS:**
   - Tema escuro trivial de implementar
   - Manutenção centralizada
   - Performance excelente

2. **Componentes Simples:**
   - Fácil de testar
   - Fácil de modificar
   - Sem surpresas

3. **Zero Build:**
   - Deploy direto
   - Sem configuração complexa
   - Debugging simples

### O que Poderia Melhorar

1. **Type Safety:**
   - Considerar JSDoc para tipos
   - Ou TypeScript sem build (via comments)

2. **Testes E2E:**
   - Adicionar Playwright ou Cypress
   - Testar fluxos completos

3. **Documentação:**
   - Mais exemplos visuais
   - Playground interativo

---

## 🎉 Conclusão

**A decisão de usar Vanilla JS foi adequada ao objetivo do projeto.**

Resultados:
- ✅ Simplicidade de deploy (páginas estáticas)
- ✅ Menos dependências no runtime
- ✅ Debugging direto no navegador

Para medir tamanho e artefatos localmente, use os scripts do projeto (ex.: `npm run size` e `npm run build`).

---

**Dúvidas?** Consulte a [documentação completa](../README.md) ou abra uma [issue no GitHub](https://github.com/rkvasne/inelegis/issues).
