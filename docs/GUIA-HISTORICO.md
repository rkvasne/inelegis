# 📜 Guia do Histórico de Consultas

---

**Versão:** 0.0.6  
**Data:** 01 de dezembro de 2025

---

## 🎯 O que é?

O **Histórico de Consultas** é uma funcionalidade que registra automaticamente todas as suas buscas no Inelegis, permitindo:
- Revisar consultas anteriores
- Identificar padrões de busca
- Exportar dados para relatórios
- Acessar rapidamente consultas frequentes

---

## 📍 Onde Encontrar?

### Botão de Histórico
Na página de consulta (`consulta.html`), ao lado do botão **"Buscar"**, você encontrará o botão **"Histórico"** com um ícone de relógio ⏰.

```
┌─────────────────────────────────────┐
│ Lei: [Código Penal ▼]               │
│ Artigo: [155, §1º, I    ] [Buscar] [Histórico] │
└─────────────────────────────────────┘
```

---

## 🚀 Como Usar?

### 1. Fazer uma Consulta
1. Selecione uma lei
2. Digite o artigo
3. Clique em **"Buscar"**
4. ✅ A consulta é **automaticamente salva** no histórico!

### 2. Abrir o Histórico
1. Clique no botão **"Histórico"**
2. Um painel lateral desliza da direita
3. Você verá 3 abas: **Recentes**, **Frequentes**, **Estatísticas**

### 3. Navegar pelas Abas

#### 📋 Recentes
- Mostra as **últimas 10 consultas**
- Exibe: Lei, Artigo, Resultado, Data/Hora
- Permite **remover** consultas individuais (ícone X)

#### 🔥 Frequentes
- Mostra as **10 consultas mais repetidas**
- Exibe: Lei, Artigo, Resultado, Contador (ex: "5x consultado")
- Útil para identificar artigos mais pesquisados

#### 📊 Estatísticas
- **Total de consultas**
- **Inelegíveis vs Elegíveis** (contadores)
- **Top 5 leis mais consultadas**
- **Top 10 artigos mais consultados**

### 4. Exportar Histórico
1. Clique no botão **"Exportar"** (ícone de download)
2. O histórico é copiado para área de transferência
3. Cole em um documento (Word, Notepad, etc.)

### 5. Limpar Histórico
1. Clique no botão **"Limpar"** (ícone de lixeira)
2. Confirme a ação
3. ⚠️ **Atenção:** Esta ação não pode ser desfeita!

### 6. Fechar o Painel
- Clique no **X** no canto superior direito
- Ou pressione **ESC** no teclado

---

## 💾 Armazenamento

### Onde os dados são salvos?
- Os dados são salvos no **localStorage** do navegador
- Usa o módulo **SecureStorage** para segurança
- Máximo de **50 consultas** armazenadas
- Dados persistem entre sessões

### Segurança
- ✅ Dados criptografados
- ✅ Validação de integridade
- ✅ Expiração automática (se configurado)
- ✅ Apenas no seu navegador (não enviado para servidor)

---

## 🎨 Interface

### Cores dos Resultados
- 🔴 **Vermelho**: Inelegível
- 🟢 **Verde**: Elegível

### Exemplo Visual

```
┌─────────────────────────────────────┐
│ 📜 Histórico de Consultas      [X]  │
├─────────────────────────────────────┤
│ [Recentes] [Frequentes] [Estatísticas] │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ CP - Art. 155, §1º, I          │ │
│ │ INELEGÍVEL                      │ │
│ │ 01/12/2025 19:30               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ LC 64/90 - Art. 1º, I, "a"     │ │
│ │ INELEGÍVEL                      │ │
│ │ 01/12/2025 19:25               │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [📥 Exportar] [🗑️ Limpar]          │
└─────────────────────────────────────┘
```

---

## 📱 Responsividade

### Desktop
- Painel lateral de **400px**
- Desliza da direita para esquerda

### Mobile
- Painel ocupa **100% da tela**
- Mesma funcionalidade
- Otimizado para toque

---

## 🔧 Funcionalidades Técnicas

### Módulos Utilizados
1. **SearchHistory** (`js/search-history.js`)
   - Gerenciamento de dados
   - CRUD de consultas
   - Estatísticas

2. **HistoryUI** (`js/history-ui.js`)
   - Interface visual
   - Renderização de abas
   - Eventos de usuário

3. **SecureStorage** (`js/storage.js`)
   - Armazenamento seguro
   - Validação de dados
   - Expiração

### API Pública

```javascript
// Adicionar consulta
HistoryUI.addSearch({
    lei: 'CP',
    artigo: '155, §1º, I',
    resultado: 'inelegivel',
    timestamp: new Date().toISOString()
});

// Abrir painel
HistoryUI.open();

// Fechar painel
HistoryUI.close();

// Obter estatísticas
const stats = SearchHistory.getStats();

// Exportar para texto
const texto = SearchHistory.exportToText();
```

---

## ❓ Perguntas Frequentes

### 1. Os dados são enviados para algum servidor?
**Não!** Todos os dados ficam apenas no seu navegador.

### 2. Posso acessar o histórico de outro computador?
**Não.** O histórico é local de cada navegador.

### 3. O que acontece se eu limpar os dados do navegador?
O histórico será **perdido**. Exporte antes se precisar manter.

### 4. Quantas consultas posso armazenar?
Até **50 consultas**. As mais antigas são removidas automaticamente.

### 5. Posso desativar o histórico?
Sim, basta não usar o botão. As consultas só são salvas quando você busca.

### 6. O histórico afeta a performance?
**Não.** O armazenamento é otimizado e não impacta a velocidade.

---

## 🎯 Casos de Uso

### Para Advogados
- Revisar consultas de casos anteriores
- Identificar artigos mais relevantes
- Exportar para relatórios de clientes

### Para Estudantes
- Acompanhar estudos de direito eleitoral
- Revisar artigos estudados
- Estatísticas de aprendizado

### Para Pesquisadores
- Coletar dados de consultas
- Analisar padrões de busca
- Exportar para análise

---

## 🚀 Próximas Melhorias

### Planejadas
- [ ] Sincronização entre dispositivos (opcional)
- [ ] Filtros avançados de busca
- [ ] Gráficos de estatísticas
- [ ] Exportação em PDF
- [ ] Tags personalizadas
- [ ] Notas em consultas

---

## 📚 Documentação Relacionada

- [Guia de Desenvolvimento](DEVELOPMENT.md)
- [Implementação Completa](IMPLEMENTACAO-COMPLETA.md)
- [js/README.md](../js/README.md)

---

**Aproveite o Histórico de Consultas!** 📜✨

Se tiver dúvidas ou sugestões, abra uma issue no GitHub.
