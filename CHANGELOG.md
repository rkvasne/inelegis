---
docStatus: active
docScope: release-history
lastReviewed: 21/01/2026
---
# Changelog

**Versão atual:** 0.2.0

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### ⚙️ CI/CD & DevOps
- **Pipeline GitHub Actions**: Implementado workflow completo de CI/CD (`.github/workflows/ci-cd.yml`) com Quality Gate (Audit, Lint, Testes, Validação de Tema) e Build Verification.
- **Scripts**:
  - Removido `scripts/deploy.js` (redundante/obsoleto).
  - Movido e renomeado `deploy.sh` da raiz para `scripts/deploy-server.sh` (organização).
- **Documentação**: Criado guia `docs/guides/devops.md` detalhando o pipeline de automação.

### 📚 Documentation
- Unificação de documentação: remoção de arquivos `release-notes-*` (conteúdo consolidado no CHANGELOG).
- Unificação do template da landing dentro de `docs/design/landing-page.md`.
- Padronização de metadados (front matter) em `README.md`, `docs/README.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md` e `SECURITY.md`.
- Atualização de links internos e índice central em `docs/README.md`.
- AGENTS.md atualizado com referência ao repositório global de regras.
- Adicionada seção “Ferramentas e Versões Recomendadas” em `docs/guides/development.md`.
  - Node.js 22.x; ESLint 9.39.x; Prettier 3.8.x; HTML-validate 10.6.x; Puppeteer 24.35.x; ioredis 5.9.x; dotenv 17.2.x.

### 📐 Layout & Design
- **Container**: Ajustada largura máxima para `1312px` (referência: referência visual).
- **Gutter**: Padronizado espaçamento lateral (padding) para `1.5rem` (24px).
- **Responsividade**: Unificado breakpoint de tablet/desktop para `768px`.
- **Header/Footer**: Alinhamento perfeito das margens internas com o conteúdo principal.

### ⚙️ CI/CD
- **Testes**: Configurado script de teste para pular (skip) validação de layout via Puppeteer se o navegador não puder ser iniciado (fix para Vercel/Serverless).

### 🎨 UI/UX
- Cards da página inicial renomeados para `card-primary`/`card-secondary` e opacidade via variável.
- Rodapé de componentes com seção de transparência e CTA “GitHub”.
- Mensagem de “Nenhuma lei encontrada” sem estilos inline no JavaScript.
- **Footer**:
  - Sincronização de layout com projeto Dahora App (Grid 40% / 30% / 30%).
  - Correção de conflito de classes (`.footer-content`) que comprimia a largura do rodapé.
  - **Melhoria Visual**: Removida borda sólida e adicionada sombra suave para melhor separação do conteúdo (Sistema e Landing Page).
  - **Dark Mode**: Ajustado fundo do rodapé (`--bg-tertiary`) para contraste mais leve em relação ao corpo da página.
  - **Marca**: Cor do texto "Inelegis" e ícone padronizados com o cabeçalho em todos os temas e páginas.
  - **Lógica de Logo**: Implementado `ThemeManager.updateLogo` aprimorado para sincronizar logos do rodapé (`.theme-aware-logo`) com o tema ativo.
  - **Header**: Ajustada lógica para utilizar logo claro em todas as páginas quando em modo escuro (correção para páginas internas).
  - **Dark Mode**: Aumentado contraste do fundo do rodapé (`Slate 900`) para melhor diferenciação do corpo da página.
  - Largura forçada para 100% dentro do container de 1200px para evitar "shrink" indesejado.
  - Redesign completo para estilo minimalista e compacto.
  - Altura reduzida com espaçamento otimizado entre elementos.
  - Tipografia ajustada: Fonte 15px para copyright e 13px para descrição e links.
  - Alinhamento visual unificado entre Landing Page e páginas internas.
- Remoção da borda/“card” ao redor da logo no rodapé.
- Breakpoint de altura fixa ajustado para incluir 768px (desktop).
- **Favicon**:
  - Atualizado para `logo-dark.ico` em todas as páginas e modos (Claro/Escuro) para consistência.
- **Cards**:
  - Melhorado contraste de subtítulos no tema escuro (ex.: “Confirme os termos...”).
- **Legenda de Resultados**:
  - Títulos ("INELEGÍVEL", "ELEGÍVEL", "NÃO ENCONTRADO") transformados em badges.
  - Badges agora ficam em linha separada da descrição.
  - Cores dos badges correspondem à cor da borda do card (Vermelho, Verde, Laranja) para melhor destaque e organização.

### 🎨 CSS & Tema
- Substituição de cores e opacidades hardcoded por variáveis de tema.
- Atualizações em `landing.css` para CTA, rodapé e menu mobile.

### 🧪 Validação
- Validador de tema ignora o diretório `agents-link`.

## [0.2.0] - 05/12/2025

### 🎨 UI/UX - Padronização Visual Completa
- **Heroes Unificados**: Todas as páginas (Index, FAQ, Sobre, Histórico) agora possuem hero sections com visual consistente:
  - Background: `var(--bg-secondary)` com `border-bottom`
  - Títulos: 1.875rem (1.5rem mobile)
  - Subtítulos: 1rem (0.9375rem mobile)
  - Padding padronizado em todas as páginas
- **Breadcrumbs**: Adicionados em FAQ, Sobre, Histórico e Consulta para navegação consistente
- **Botões**:
  - Corrigido contraste do `btn-primary` no tema escuro (cores hex diretas para garantir visibilidade)
  - Ajustado estado `disabled` para melhor visibilidade em ambos os temas
  - Texto do botão principal simplificado: "Acessar Sistema de Consulta" → "Acessar Consulta"
- **Modal de Resultados**:
  - "Não Encontrado" agora usa cor laranja/warning (diferenciando de vermelho/inelegível)
  - Ícone atualizado para interrogação (consistente com legenda)
  - Corrigido contraste do texto de conclusão no tema escuro
- **Legenda da Consulta**: "Não Encontrado" agora usa cores warning (laranja) em vez de neutro
- **Ícones do Histórico**: Padronizados com cores primárias (azul) como nas outras páginas
- **CTA do FAQ**: Transformado em card centralizado para consistência visual
- **Landing Page**: Corrigido modal de atalhos que aparecia visível após o footer

### 📝 Textos e Conteúdo
- **Página Inicial**:
  - Subtítulo atualizado com fonte completa: "Consulte crimes que ensejam inelegibilidade eleitoral com base na tabela do TRE-SP (outubro/2024), revisada pela CRE-RO (junho2025)"
  - Link "Conheça mais sobre o Inelegis" transformado em botão CTA centralizado
- **Página Sobre**: Subtítulo simplificado para versão mais concisa
- **Página Histórico**: Subtítulo melhorado para "Acompanhe suas consultas, exporte relatórios e visualize estatísticas"

### 🏗 Arquitetura
- Estilos do modal de atalhos adicionados ao `landing.css` para funcionamento correto na landing page
- Novos estilos CSS para `.modal-section.modal-info` (usado em "Não Encontrado")
- Classe `.nao-encontrado` criada para diferenciação visual no modal

### 📚 Documentação
- Versão incrementada para 0.2.0
- CHANGELOG atualizado com todas as mudanças de UI/UX
- README atualizado com nova versão

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
- **Limpeza de Legado**: Remoção do arquivo `src/js/data.js` (dados brutos não normalizados) e atualização dos scripts de build para usar apenas a fonte normalizada.
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

### 📚 Documentation
- Unificação e limpeza de toda a documentação do projeto.
- Atualização de versão para `0.1.4` em todos os arquivos (`package.json`, HTMLs, CHANGELOG).

---

## [0.1.3] - 04/12/2025
...
