# Guia de Desenvolvimento

**Última atualização:** 02 de dezembro de 2025
**Versão atual:** 0.0.8

Este arquivo fornece orientações técnicas para desenvolvedores trabalhando neste repositório.

**⚠️ Nota:** Para uma visão completa da documentação, consulte [README.md](../README.md).

---

## 💻 Visão Geral do Projeto

**Inelegis** é um conjunto de páginas estáticas integradas (index, consulta, sobre, faq, landing) **não oficial** para Consulta de Inelegibilidade Eleitoral. Ela auxilia servidores da Justiça Eleitoral a determinar se condenações criminais geram inelegibilidade com base na Lei Complementar nº 64/1990 (atualizada pela LC 135/2010).

- **Desenvolvimento**: Criado por um servidor para uso por servidores.
- **Fonte de Dados**: Dados oficiais do TRE-SP (Outubro 2024) revisados pela CRE-RO (02/06/2025).
- **Status**: Ferramenta auxiliar não oficial.
- **Tecnologia**: Vanilla JavaScript com sistema de build (sem dependências externas de runtime).
- **Deploy**: Build com `npm run build` (scripts/build.js) e deploy da pasta `dist/`.

---

## 🚀 Execução e Desenvolvimento

Como esta é uma aplicação frontend com sistema de build:

- **Desenvolvimento**: Execute `npm run dev` (ou `node scripts/serve.js`) para o servidor local.
- **Produção**: Execute `npm run build` (ou `node scripts/build.js`) para gerar a versão otimizada.
- **Deploy**: O conteúdo da pasta `dist/` é o que deve ser publicado.

---

## 🏗 Arquitetura do Código

### Arquivos Principais

**[index.html](../public/index.html)** - Estrutura HTML contendo:
- Formulário de busca com alternância de tipo de comunicação (Condenação/Extinção).
- Dropdown de leis e campo de artigo.
- Modal de exibição de resultados.
- Painéis de informação e avisos legais.
- Legenda explicando os tipos de resultado.

**[script.js](../src/js/script.js)** - Lógica da aplicação organizada em grupos funcionais:
1. **Lógica de Busca**: `realizarBusca()` - Núcleo da consulta (usa SearchIndex).
2. **Gerenciamento de UI**: `exibirResultado()` - Exibição de resultados (usa ModalManager).
3. **Sugestões**: `mostrarSugestoes()`, `obterSugestoesPorLei()` - Sugestões em tempo real.

### Módulos JavaScript (v0.0.7+)

**[modules/sanitizer.js](../src/js/modules/sanitizer.js)** - Segurança:
- `escapeHtml()` - Previne XSS
- `safeInnerHTML()` - Inserção segura de HTML
- `sanitizeAttributes()` - Remove atributos perigosos

**[modules/storage.js](../src/js/modules/storage.js)** - Armazenamento:
- `setItem()` - Salva com validação e expiração
- `getItem()` - Recupera com validação
- `cleanExpired()` - Limpeza automática

**[modules/formatters.js](../src/js/modules/formatters.js)** - Formatação:
- `formatar()` - Auto-correção (§1 → §1º, cc → c/c)
- `processar()` - Parse de notação complexa
- `extrairArtigos()` - Extração de números

**[modules/exceptions.js](../src/js/modules/exceptions.js)** - Validação:
- `verificar()` - Verifica exceções aplicáveis
- `filtrarPorArtigo()` - Filtra exceções relevantes

**[modules/modal-manager.js](../src/js/modules/modal-manager.js)** - Interface:
- `open()` - Abre modal com conteúdo
- `close()` - Fecha modal
- `exportContent()` - Exporta resultado

**[modules/search-index.js](../src/js/modules/search-index.js)** - Performance:
- `buscar()` - Busca otimizada com cache
- `buildLeiIndex()` - Constrói índices
- `clearCache()` - Limpa cache

**[modules/search-history.js](../src/js/modules/search-history.js)** - Histórico (v0.0.8):
- `add()` - Adiciona consulta (com detecção de duplicatas)
- `getRecent()` - Obtém consultas recentes
- `getFrequent()` - Obtém consultas frequentes
- `getStats()` - Estatísticas de uso
- `clear()` / `remove()` - Intencionalmente desabilitados (logam um aviso e retornam `false`)
- Persistência: histórico fica somente no Redis via `/api/search-history`; o front guarda apenas um `userId` em cookie (`inelegis_uid`) para correlacionar sessões, sem gravar dados de histórico no `localStorage`.

**[modules/history-ui.js](../src/js/modules/history-ui.js)** - Interface do Histórico (v0.0.7):
- `init()` - Inicializa painel de histórico
- `open()` - Abre painel lateral
- `renderRecent()` - Renderiza consultas recentes
- `renderStats()` - Renderiza estatísticas
- `exportHistory()` - Exporta histórico

**[modules/theme-manager.js](../src/js/modules/theme-manager.js)** - Gerenciamento de Tema (v0.0.7):
- `init()` - Inicializa tema (detecta preferência do sistema)
- `toggle()` - Alterna entre claro/escuro
- `apply()` - Aplica tema específico
- `getCurrent()` - Obtém tema atual

**[modules/components.js](../src/js/modules/components.js)** - Componentes Reutilizáveis (v0.0.7):
- `init()` - Inicializa componentes na página
- `renderHeader()` - Renderiza header com tema toggle
- `renderNav()` - Renderiza navegação
- `renderFooter()` - Renderiza footer
- `renderCard()` - Renderiza cards customizáveis
- `renderButton()` - Renderiza botões
- `renderAlert()` - Renderiza alertas
6. **Atalhos de Teclado**: Implementação de hotkeys (Ctrl+L, Ctrl+A, Ctrl+Enter, F1, Esc).

**[data.js](../src/js/data.js)** - Configuração de dados:
1. **leisDisponiveis** - Array com mais de 40 códigos de leis.
2. **tabelaInelegibilidade** - Array de objetos descrevendo cada ocorrência documentada na planilha do TRE-SP:
  - `norma`: string com a referência textual (“Art. 121, § 2º…”)
  - `excecoes`: lista de exceções em texto livre
  - `crime`: categoria/observação exibida no modal
  - `codigo`: identificador da lei usada para filtro
  - `observacao` (opcional)

**[styles.css](../public/styles/styles.css)** - Sistema de design CSS profissional:
- Paleta de cores corporativa e tokens de design.
- Layout responsivo com componentes modernos.
- Efeitos de glassmorphism e animações.
- Estilização acessível e media queries para impressão.

### Exemplo de Estrutura de Dados

Em `data.js`, cada item de `tabelaInelegibilidade` segue este padrão:
```javascript
{
  norma: "Arts. 121, 121-A, 122, §1º a § 7º, 123 a 127",
  excecoes: ["Art. 121, § 3º", "Art. 122, caput"],
  crime: "Crimes contra a vida (9)",
  codigo: "CP",
  observacao: "campo opcional"
}
```

### Feature Chave: Parse de Artigos Complexos

A aplicação suporta notação de artigos jurídicos brasileiros:
- Simples: `121`
- Com parágrafos: `121, §2º`
- Com incisos: `121, §2º, I`
- Com alíneas: `121, §2º, I, "a"`
- Citações concorrentes: `121 c/c 312`
- Combinado: `121, §2º, I, "a" c/c 312 c/c 213`

Expressões regulares em `src/js/script.js` lidam com a extração e correspondência desses componentes.

---

## 📏 Padrões Importantes

### Tipos de Resultado de Busca

Três resultados possíveis exibidos no modal:
1. **GERA INELEGIBILIDADE** (vermelho) - Artigo gera inelegibilidade, use notação ASE 337.
2. **NÃO GERA INELEGIBILIDADE** (verde) - Não gera inelegibilidade.
3. **NÃO ENCONTRADO** (cinza) - Artigo não consta na tabela de referência.

### Tipos de Comunicação

- **Condenação (ASE 337)**: Suspensão de direitos políticos devido a condenação.
- **Extinção (ASE 370)**: Extinção de punibilidade/suspensão.

Alternância entre estes com botões de rádio ou atalho F1.

### Formatação Automática

A entrada do usuário é formatada automaticamente para padrões legais:
- `§1` torna-se `§1º`
- `cc` torna-se `c/c`
- `a` torna-se `"a"` (em contexto de alínea)
- Espaços e vírgulas normalizados

---

## 🔧 Manutenção de Dados

Os dados de inelegibilidade em `src/js/data.js` mapeiam diretamente para:
- Tabela oficial de inelegibilidade do TRE-SP.
- Arquivos PDF e XML de referência na pasta `docs/references/`.

**Se a lei eleitoral mudar:**
1. Atualize o objeto `tabelaInelegibilidade` em `data.js`.
2. Adicione novas leis ao array `leisDisponiveis` se necessário.
3. Teste com números de artigos relevantes.

---

## 📚 Referências de Documentação

- **[README.md](../README.md)** - Funcionalidades, atalhos, exemplos de uso.
- **[manual-ase.md](references/manual-ase.md)** - Manual do sistema eleitoral com explicações de códigos ASE.
- **Tabelas PDF/XML** - Dados oficiais de referência do TRE-SP em `docs/references/`.

---

## 🌐 Compatibilidade de Navegador

- Navegadores modernos apenas (Chrome, Firefox, Safari, Edge).
- Requer suporte a ES6+.
- Usa Clipboard API e Flexbox CSS.
- Design responsivo para desktop/mobile.

---

## 📝 Tarefas Comuns

**Entender validação de artigos**: Veja `buscarInelegibilidadePorLeiEArtigo()` em `src/js/script.js` - faz o parse da notação e busca na tabela (a migração completa para `SearchIndex.buscar()` ainda está em andamento).

**Adicionar nova lei**: Adicione ao array `leisDisponiveis` em `src/js/data.js`, depois adicione entradas em `tabelaInelegibilidade`.

**Modificar exibição de resultado**: Edite `exibirResultado()` em `src/js/script.js` - controla o conteúdo e estilo do modal.

**Alterar atalhos**: Busque por `addEventListener('keydown'` em `src/js/script.js`.

**Atualizar estilos**: Cores e layout estão em `public/styles/styles.css`.

**Atualizar tabela de inelegibilidade**: Edite o array `tabelaInelegibilidade` em `src/js/data.js`.


---

## 🎨 Validação de Temas

### Theme Validator Pro v3.0.0

Script avançado para detectar problemas de aplicação de temas CSS em qualquer projeto.

```bash
# Validação básica
npm run validate:theme

# Com sugestões de correção
node scripts/validate-theme.js --fix

# Apenas erros (ignorar warnings)
node scripts/validate-theme.js --min-severity error

# Saída JSON para CI/CD
node scripts/validate-theme.js --json

# Verificar apenas arquivos CSS
node scripts/validate-theme.js --only "**/*.css"

# Modo verbose com detalhes
node scripts/validate-theme.js --verbose --fix
```

> ⚠️ **Observação**: O Theme Validator pode exibir o aviso "Arquivo principal CSS sem suporte a dark mode" para `public/styles/styles.css`. A aplicação trata o modo escuro via classe `dark-theme` aplicada pelo JavaScript, portanto a mensagem é apenas informativa e não exige alteração imediata.

### Categorias de Problemas Detectados

**Erros (devem ser corrigidos):**
- Cores hexadecimais hardcoded (`#fff`, `#000000`)
- Cores nomeadas básicas (`white`, `black`, `red`, `blue`)
- Estilos inline com cores
- JavaScript inline styles com cores
- Tailwind classes com cores hardcoded (`bg-[#fff]`)
- Dark mode sem variáveis CSS

**Warnings (recomendado corrigir):**
- Cores RGB/RGBA hardcoded
- Cores HSL/HSLA hardcoded
- Cores nomeadas estendidas (`coral`, `salmon`, etc.)
- Variáveis não-semânticas (`--neutral-500`, `--gray-200`)
- Gradientes com cores hardcoded
- `!important` em propriedades de cor
- CSS-in-JS com cores hardcoded
- SVG com cores inline

**Info (considerar):**
- Opacidade hardcoded
- Canvas/WebGL colors
- Z-index hardcoded

### Frameworks Suportados

O script detecta variáveis não-semânticas de:
- Tailwind CSS (`--slate-500`, `--gray-200`)
- Material Design (`--md-blue-500`)
- Bootstrap (`--bs-gray-500`)
- Chakra UI (`--chakra-colors-gray-500`)
- Ant Design (`--ant-blue-5`)
- Radix UI (`--gray-9`, `--blue-a9`)
- Shadcn/ui
- IBM Carbon
- Open Props

### Configuração Customizada

Crie `.themevalidator.json` na raiz do projeto:

```json
{
  "ignoreDirs": ["legacy", "vendor"],
  "ignoreFiles": ["*.generated.css"],
  "severityDefaults": {
    "hex-color": "warning",
    "named-color-basic": "error"
  }
}
```

---

## 🧪 Testes

### Testes Unitários

O projeto possui testes automatizados para os módulos principais:

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar teste específico
node tests/formatters.test.js
node tests/exceptions.test.js
```

### Cobertura de Testes

- **formatters.test.js**: 10 testes para formatação de artigos
- **exceptions.test.js**: 10 testes para validação de exceções
- **theme-manager.test.js**: 10 testes para gerenciamento de tema
- **components.test.js**: 25 testes para componentes reutilizáveis
- **Cobertura total**: ~80% dos módulos críticos

### Adicionar Novos Testes

1. Criar arquivo em `tests/` com sufixo `.test.js`
2. Seguir padrão dos testes existentes
3. Adicionar ao script `test:unit` no package.json

---

## 🔒 Segurança

### Práticas Implementadas

- **CSP (Content Security Policy)**: Configurado em `vercel.json`
- **Sanitização de HTML**: Uso de `Sanitizer.safeInnerHTML()`
- **Validação de localStorage**: Timestamp e expiração automática
- **Sem innerHTML direto**: Sempre usar módulos de sanitização

### Checklist de Segurança

- [ ] Nunca usar `innerHTML` diretamente
- [ ] Sempre sanitizar entrada do usuário
- [ ] Validar dados do localStorage
- [ ] Usar `SecureStorage` para persistência
- [ ] Testar contra XSS

---

## ⚡ Performance

### Otimizações Implementadas

- **Índices de Busca**: Cache pré-construído por lei
- **Busca O(1)**: Acesso direto via índice
- **Cache Inteligente**: Validade de 1 hora
- **Pré-processamento**: Artigos extraídos ao construir índice

### Métricas

- Busca: ~5ms (antes: ~50ms)
- Cache hit rate: >90%
- Tamanho total: ~227KB

---

**Última atualização:** 02/12/2025
