# Template de Commit Crítico

> Use este modelo quando for necessário documentar correções urgentes ligadas ao sistema de temas ou outros hotfixes de UI críticos.

```
fix: CRÍTICO - Remover media query que forçava tema escuro automaticamente

PROBLEMA RAIZ ENCONTRADO:
- Media query @media (prefers-color-scheme: dark) estava ativa
- Aplicava tema escuro automaticamente quando sistema estava em dark mode
- Usava :root:not(.light-theme) mas sistema usa .dark-theme
- Conflito entre CSS automático e JavaScript manual

CÓDIGO REMOVIDO:
```css
@media (prefers-color-scheme: dark) {
  :root:not(.light-theme) {
    --bg-primary: #0f172a;
    /* ... todas as variáveis do tema escuro ... */
  }
}
```

MOTIVO:
- Sistema de temas é controlado por JavaScript
- Classe .dark-theme no <html> define o tema
- Media query causava conflito e sobrescrevia preferência do usuário
- Usuário não conseguia mudar para tema claro

SOLUÇÃO:
- Removida media query prefers-color-scheme
- Tema agora é 100% controlado por JavaScript
- Classe .dark-theme é a única forma de ativar tema escuro
- Usuário tem controle total sobre o tema

IMPACTO:
- ✅ Tema claro funciona corretamente
- ✅ Tema escuro funciona corretamente
- ✅ Botão de alternância funcional
- ✅ Preferência do usuário respeitada
- ✅ Sem conflitos CSS/JS

NOTA:
- Se quiser reativar modo automático no futuro, código está comentado
- Usar classe .light-theme para forçar tema claro se reativar

Versão: 0.0.9
PRIORIDADE: CRÍTICA
```
