# Plano de Melhoria UI/UX - Inelegis v0.3.2

Melhorar a experiência do usuário na consulta de inelegibilidade, corrigindo problemas visuais no Analisador de Sentenças e adicionando flexibilidade na Busca Simples.

## 🎯 Objetivos
- Corrigir a legibilidade dos resultados da extração (Análise de Sentença).
- Adicionar suporte a "busca item a item" (Parágrafo, Inciso, Alínea) na busca simples.
- Melhorar a clareza do seletor de leis (Código + Nome).
- Refinar o fluxo de informações para que o usuário se sinta mais orientado.

## 🛠️ Arquitetura e Design (Modo Arquiteto/Frontend)

### 1. Novo Layout de Resultados da Extração
- **Norma/Artigo**: Usar badges ou grid para separar claramente o código da norma do número do artigo.
- **ASE/Motivo**: Melhorar o espaçamento entre o código ASE e a fundamentação legal (Alínea/Item).
- **Cards de Informação**: Mostrar um resumo do que foi encontrado antes de exigir o clique em "Ver".

### 2. Busca Simples "Item a Item"
- Adicionar campos opcionais: `Parágrafo`, `Inciso`, `Alínea`.
- Estes campos devem aparecer de forma harmônica, possivelmente em um grid colapsável ou logo abaixo do artigo.

### 3. Seletor de Leis
- Alterar `ValidatorUI.setupLeiSelect` para concatenar `codigo` - `nome`.

## 📋 Lista de Tarefas

### Fase 1: Fundamentação e Estilos
- [ ] **T1.1**: Atualizar `styles.css` com novas utilidades de espaçamento e tipografia para os resultados.
- [ ] **T1.2**: Criar estilos para os novos inputs da busca simples (grid responsivo).

### Fase 2: Refatoração da Busca Simples
- [ ] **T2.1**: Alterar `public/consulta.html` para incluir campos de Parágrafo, Inciso e Alínea no `simple-mode-content`.
- [ ] **T2.2**: Atualizar `ValidatorUI.js` para ler esses novos campos.
- [ ] **T2.3**: Ajustar `ValidatorService.js` e a chamada RPC para passar todos os parâmetros.
- [ ] **T2.4**: Melhorar `ValidatorUI.setupLeiSelect` para mostrar o nome completo da lei.

### Fase 3: Refinamento do Analisador de Sentença
- [ ] **T3.1**: Atualizar `AnalyzerUI.js` para renderizar as linhas da tabela com o novo design (separando claramente Norma de Artigo).
- [ ] **T3.2**: Ajustar a renderização do campo ASE para evitar o "encavalamento" de texto visto na imagem.
- [ ] **T3.3**: Adicionar um "Quick Preview" ou descrição do crime na própria linha, se disponível.

### Fase 4: Validação e Polish
- [ ] **T4.1**: Testar fluxos de busca com exceções específicas (ex: Art. 121, §2º, inciso II).
- [ ] **T4.2**: Verificar responsividade em telas menores.

## 🚀 Phase X: Verificação Final
- [ ] Lint: `npm run lint`
- [ ] Script de UX: `python .agent/hub/capabilities/frontend-design/scripts/ux_audit.py .`
- [ ] Verificação visual manual (Simular o ambiente da imagem enviada).
