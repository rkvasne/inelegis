# Changelog Archive (Version 0.1.x)

Todas as alterações notáveis do projeto Inelegis durante a fase inicial (v0.1.x).

---

## [0.1.9] - 05/12/2025

### 🎨 UI/UX & Design

- **Histórico de Consultas**:
  - Refatoração completa do layout para uso de cards (`features-grid`).
  - Estatísticas organizadas em grid de 3 colunas para melhor visualização de totais.
  - Correção de espaçamentos entre painéis de "Consultas Recentes/Frequentes" e seção de "Estatísticas".
  - Tabelas e badges padronizados com o design system.
- **Página de Consulta**:
  - Atualização dos ícones dos cards de comunicação:
    - "Condenação" agora usa ícone de cadeado com indicador visual vermelho (`danger`).
    - "Extinção da Punibilidade" usa ícone de check com indicador verde (`success`).
- **Sistema de Design**:
  - Correção de variáveis de espaçamento inexistentes.
  - Melhoria de contraste e sombras nos cards do tema claro.
  - Padronização dos botões do modal ("Fechar" e "Exportar") com tamanhos iguais e correção de cor no hover (uso de `bg-tertiary` para contraste).
- **Página FAQ**:
  - Correção completa do layout (hero, busca, categorias, acordeões).
  - Ajuste fino de posição da barra de busca (subida de 25px e descida de 5px conforme solicitado).
  - Transições e responsividade revisadas.
- **Página Inicial**:
  - Restauração do indicador visual (mãozinha) antes do checkbox de consentimento.
  - Alinhamento do conjunto "mãozinha + checkbox + texto" dentro do card de acesso.

### 🏗 Arquitetura & Backend

- **Limpeza de Legado**: Remoção de arquivo `src/js/data.js` (dados brutos não normalizados) e atualização dos scripts de build para usar apenas a fonte normalizada.
- **Ambiente de Desenvolvimento**:
  - Remoção de mock local para API de histórico.
  - Obrigatoriedade de configuração do Redis (`REDIS_URL`) no ambiente de desenvolvimento para garantir paridade com produção.

### 📚 Documentação

- Consolidação do índice geral (`docs/README.md`) com mapa único, guideline de formato e links para todos os subdiretórios.
- Criação de `docs/history/RELEASE-NOTES-v0.1.0.md`, removendo duplicação de conteúdo do README.
- Revisão do `README.md` para apontar apenas para fontes oficiais e atualizar badge, links e metadados de versão.
- Inclusão dos Release Notes para `v0.1.3`, `v0.1.4` e `v0.1.9` em `docs/history/`.

### 🧩 Manutenção

- Versão do projeto promovida para `0.1.9` no `package.json`, badges e documentos.
- Atualização dos campos "Última atualização" e referências cruzadas para manter consistência com o estado atual do repositório.

### 🔐 Segurança & Acesso

- Remoção do bloqueio por consentimento das páginas públicas `sobre` e `faq` (bloqueio permanece apenas na página `consulta`).
- Melhoria do controle visual de desabilitação de link de consulta quando os termos não estão aceitos.

## [0.1.8] - 03/12/2025

### 🛠 Plataforma

- Padronização de versão de assets com `?v=0.1.8` nas páginas públicas.
- Dev Server com live reload, sincronização automática de assets (`src/js` → `public/assets/js`) e fallback de rotas.

### 🧭 Funcionalidades

- Página **Histórico (Admin)** inicial com cards compactos e estatísticas agregadas.
- Consolidação de módulos utilitários em `public/assets/js/modules/` (storage, formatters, exceptions, modal-manager, components).

### 🔐 Segurança & Acesso

- Introdução do guard de consentimento apenas para a página `consulta`.
- Indicação visual de desabilitado para acesso à consulta quando termos não aceitos.

### 📚 Documentação

- Inclusão de `docs/history/RELEASE-NOTES-v0.1.8.md` com resumo das mudanças.

## [0.1.7] - 04/12/2025

### Correções & UX

- FAQ: melhorias em espaçamentos e estados de hover dos cards.
- Busca na FAQ: autoexpansão de itens quando termo > 2 caracteres.
- Acessibilidade: `aria-disabled` e foco consistentes em links desabilitados do header.
- Atalhos de teclado: refinamentos para foco e navegação (busca e modal).

## [0.1.6.1] - 05/12/2025

Hotfix pontual na página inicial:

- Correção de erro de redeclaração de variável `arrowIndicator` que impedia o indicador de consentimento.
- Override de CSS para posicionamento estático do indicador junto ao checkbox.
- Troca do SVG por emoji de mão para consistência cross-browser.

## [0.1.6] - 04/12/2025

### Correções & UX

- Página Inicial: confiabilidade do indicador de consentimento (exibir/ocultar).
- Consentimento: desabilitação do link de consulta com feedback visual.
- Tipografia: tamanhos e espaçamentos consistentes em botões e labels.
- Toasts: textos e animações de saída ajustados.

## [0.1.5] - 04/12/2025

### Correções & UX

- Modal: padronização de botões do rodapé (tamanhos e espaçamentos).
- Tema claro: sombras e contraste refinados em cards.
- Transições: ajustes sutis para reduzir reflow.
- Pequenos bugs: correções de alinhamento em headers e grids.

## [0.1.4.1] - 04/12/2025

Pequeno hotfix de UI/UX:

- Ajuste fino da posição da barra de busca da FAQ (subida de 25px e descida de 5px) com correção de sobreposição e z-index.
- Restauração de media query removida por engano para responsividade do modal.
- Fallback de cor para o indicador visual usando variáveis de tema.

## [0.1.4] - 04/12/2025

### 🎨 UI/UX & Design

- **Modal de Resultados Compactado**: Otimização do layout para telas menores (notebooks).
  - Redução de padding e margens nos cards.
  - Ajuste de line-height e espaçamento de textos para maior densidade de informação sem perder legibilidade.
  - Unificação do estilo de cards para alertas e informações.
- **Correções Visuais**:
  - Restauração do indicador visual ("mãozinha") acima do seletor de lei.
  - Ajuste de tipografia do modal para alinhar com o sistema de design (fontes menores e mais equilibradas).
  - Melhoria de contraste no disclaimer de exceções.

### 📚 Documentação

- Unificação e limpeza de toda a documentação do projeto.
- Atualização de versão para `0.1.4` em todos os arquivos (`package.json`, HTMLs, CHANGELOG).

---

## [0.1.3] - 04/12/2025

_Para ver o histórico completo das versões v0.1.x, consulte a documentação de auditoria legacy._

---

_Última sincronização: 13/02/2026_
