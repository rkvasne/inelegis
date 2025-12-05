# Changelog

**Última atualização:** 05 de dezembro de 2025
**Versão atual:** 0.1.9

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.1.9] - 2025-12-05

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

### 📚 Documentação
- Consolidação do índice geral (`docs/README.md`) com mapa único, guideline de formato e links para todos os subdiretórios.
- Criação de `docs/history/RELEASE-NOTES-v0.1.0.md`, removendo duplicação de conteúdo do README.
- Revisão do `README.md` para apontar apenas para fontes oficiais e atualizar badge, links e metadados de versão.

### 🧩 Manutenção
- Versão do projeto promovida para `0.1.9` no `package.json`, badges e documentos.
- Atualização dos campos "Última atualização" e referências cruzadas para manter consistência com o estado atual do repositório.

## [0.1.4] - 2025-12-04

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

## [0.1.3] - 2025-12-04
...
