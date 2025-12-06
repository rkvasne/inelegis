# Release Notes - v0.2.0

**Data:** 05 de dezembro de 2025  
**Tipo:** Minor Release - Padronização Visual Completa

---

## Resumo

Esta versão marca a conclusão da padronização visual completa do sistema Inelegis. Todas as páginas agora seguem um design system consistente, com heroes unificados, breadcrumbs padronizados, e melhorias significativas de contraste e usabilidade em ambos os temas (claro e escuro).

---

## Principais Mudanças

### 🎨 UI/UX

#### Heroes Unificados
- Todas as páginas (Index, FAQ, Sobre, Histórico) possuem hero sections com visual consistente
- Background padronizado com `var(--bg-secondary)` e `border-bottom`
- Tipografia unificada: títulos 1.875rem, subtítulos 1rem

#### Sistema de Cores
- **Não Encontrado**: Agora usa laranja/warning para diferenciar de vermelho/inelegível
- **Botões no Dark Mode**: Contraste corrigido com cores hex diretas
- **Estado Disabled**: Melhor visibilidade em ambos os temas

#### Navegação
- Breadcrumbs adicionados em todas as páginas internas (FAQ, Sobre, Histórico, Consulta)
- CTA do FAQ transformado em card centralizado

### 📝 Conteúdo

- Textos revisados e simplificados em todas as páginas
- Subtítulo da página inicial inclui fonte completa dos dados
- Botão principal simplificado para "Acessar Consulta"

### 🐛 Correções

- Modal de atalhos na landing page (aparecia visível após footer)
- Contraste do texto de conclusão no modal "Não Encontrado"
- Ícones do histórico padronizados com cores primárias

---

## Arquivos Modificados

- `public/index.html` - Hero, textos, botão CTA
- `public/faq.html` - Hero, breadcrumbs, CTA em card
- `public/sobre.html` - Hero fora do container, breadcrumbs
- `public/historico.html` - Hero section separado, breadcrumbs
- `public/consulta.html` - Breadcrumbs adicionados
- `public/styles/styles.css` - Novos estilos de heroes, modal, legenda
- `public/styles/landing.css` - Estilos do modal de atalhos
- `public/assets/js/script.js` - Classe e ícone do "Não Encontrado"
- `package.json` - Versão 0.2.0
- `README.md` - Versão atualizada
- `CHANGELOG.md` - Registro completo das mudanças

---

## Compatibilidade

- ✅ Todos os navegadores modernos
- ✅ Tema claro e escuro
- ✅ Responsivo (desktop, tablet, mobile)
- ✅ Acessibilidade mantida

---

## Próximos Passos

O sistema está completo e pronto para uso em produção. Futuras atualizações serão focadas em:
- Manutenção e correções de bugs
- Atualizações da base de dados conforme novas tabelas oficiais
- Melhorias de performance se necessário
