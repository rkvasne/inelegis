# 📚 ÍNDICE DE DOCUMENTAÇÃO - Ineleg-App

**Última atualização:** 23 de outubro de 2025
**Versão:** 2.0

---

## 🎯 GUIA RÁPIDO

Esta seção ajuda você a encontrar rapidamente o que precisa:

### Para **entender o projeto**
→ Leia: **[CLAUDE.md](CLAUDE.md)** (guia técnico do projeto)

### Para **usar a aplicação**
→ Leia: **[README.md](README.md)** (funcionalidades e uso)

### Para **entender as ASE (códigos)**
→ Leia: **[MANUAL-ASE.txt](MANUAL-ASE.txt)** (orientação operacional)

### Para **conhecer as melhorias v2.0**
→ Leia: **[VERSAO_2.0.md](VERSAO_2.0.md)** (todas as melhorias em um lugar)

### Para **manutenção de dados**
→ Leia: **[MANUTENCAO.md](MANUTENCAO.md)** (checklist e validação)

---

## 📖 DOCUMENTAÇÃO COMPLETA

### 1. **CLAUDE.md** (Essencial para desenvolvedores)
**O que contém:**
- Visão geral do projeto
- Arquitetura e estrutura do código
- Como executar a aplicação
- Comandos úteis
- Tarefas comuns
- Data validation & maintenance

**Quando usar:**
- Primeira coisa a ler para entender o projeto
- Referência para desenvolvimento futuro
- Guia de manutenção de dados

---

### 2. **README.md** (Original - Para usuários finais)
**O que contém:**
- Descrição da aplicação
- Funcionalidades
- Uso básico
- Compatibilidade

**Quando usar:**
- Entender o que a aplicação faz
- Como usar (não técnico)

---

### 3. **MANUAL-ASE.txt** (Original - Guia operacional)
**O que contém:**
- Explicação detalhada das ASE (códigos de comunicação)
- ASE 337 (Suspensão de Direitos Políticos)
- ASE 370 (Extinção de Impedimento)
- ASE 540 (Ocorrência a Examinar em Inscrição)
- Tabelas de datas
- Exemplos práticos

**Quando usar:**
- Usuários operacionais (servidores TRE)
- Entender quando usar cada ASE
- Referência de datas e procedimentos

---

### 4. **VERSAO_2.0.md** (Novo - Consolidado)
**O que contém:**
- Resumo de todas as melhorias v2.0
- Problema identificado (input, busca, exceções)
- Solução implementada
- Exemplos de comportamento
- Como testar
- Performance
- Compatibilidade

**Quando usar:**
- Entender o que mudou na v2.0
- Documentação das melhorias
- Referência para usuários que atualizaram

---

### 5. **MANUTENCAO.md** (Novo - Consolidado)
**O que contém:**
- Validação de dados (98% conformidade TRE-SP)
- Checklist trimestral de manutenção
- Como atualizar dados
- Leis e artigos suportados
- Leis revogadas (histórico)
- Próximos passos recomendados

**Quando usar:**
- Manutenção periódica
- Validação de dados
- Atualização de legislação

---

## ✅ CONSOLIDAÇÃO DE ARQUIVOS (23 de outubro de 2025)

Os seguintes arquivos redundantes foram **eliminados** para manter a documentação limpa e organizada:

| Arquivo | Razão | Consolidado em |
|---------|-------|---|
| MELHORIAS_BUSCA.md | Duplicado e muito longo | VERSAO_2.0.md |
| CORRECAO_BUSCA_121.md | Detalhe específico | VERSAO_2.0.md |
| RELATORIO_VALIDACAO_DADOS.md | Muito longo (300+ linhas) | MANUTENCAO.md |
| relatorio-validacao-completo.md | Duplicado | MANUTENCAO.md |
| relatorio-validacao-outras-leis.md | Duplicado | MANUTENCAO.md |
| resumo-validacao.md | Duplicado | MANUTENCAO.md |
| checklist-manutencao.md | Integrado | MANUTENCAO.md |

**Resultado:** Documentação mais limpa e sem redundâncias. Acesso mais fácil aos documentos relevantes.

---

## 🗂️ ESTRUTURA RECOMENDADA

```
ineleg-app/
│
├── 📄 DOCUMENTACAO.md          ← VOCÊ ESTÁ AQUI (índice)
│
├── 🚀 CLAUDE.md                ← Guia técnico (leia primeiro)
├── 📖 README.md                ← Descrição geral
├── 📋 MANUAL-ASE.txt           ← Guia operacional
│
├── 🆕 VERSAO_2.0.md            ← Melhorias implementadas
├── 🔧 MANUTENCAO.md            ← Validação e manutenção
│
├── 🧠 script.js                ← Código principal
├── 📊 data.js                  ← Dados de inelegibilidade
├── 🎨 styles.css               ← Estilos
├── 📱 index.html               ← HTML
│
└── 📊 XML e PDFs (referência original TRE-SP)
```

---

## 📚 COMO USAR ESTA DOCUMENTAÇÃO

### Você é **desenvolvedor** novo no projeto?
1. Leia: **CLAUDE.md** (arquitetura)
2. Explore: **script.js** (código)
3. Consulte: **VERSAO_2.0.md** (melhorias recentes)
4. Mantenha: **MANUTENCAO.md** (para updates)

### Você é **usuário operacional** (servidor TRE)?
1. Leia: **README.md** (visão geral)
2. Consulte: **MANUAL-ASE.txt** (como usar ASE)
3. Refira-se: **VERSAO_2.0.md** (novas features)

### Você é **administrador** do sistema?
1. Leia: **MANUTENCAO.md** (checklist)
2. Consulte: **CLAUDE.md** (estrutura)
3. Acompanhe: **VERSAO_2.0.md** (atualizações)

### Você quer **corrigir um bug**?
1. Busque em: **VERSAO_2.0.md** (se recente)
2. Procure em: **CLAUDE.md** (estrutura do código)
3. Teste com: Exemplos em **MANUTENCAO.md**

---

## 🔄 CICLO DE ATUALIZAÇÃO RECOMENDADO

### Trimestral (3 meses)
- Executar checklist em **MANUTENCAO.md**
- Verificar atualizações legislativas TRE-SP
- Validar dados.js contra XML oficial

### Anual
- Revisar **VERSAO_2.0.md** para novas funcionalidades
- Atualizar **CLAUDE.md** se houver mudanças arquiteturais
- Backup completo de dados e documentação

### Quando há novo release
- Atualizar **VERSAO_2.0.md** (ou criar VERSAO_3.0.md)
- Adicionar novas entradas ao histórico
- Notificar usuários via **README.md**

---

## 📞 PERGUNTAS FREQUENTES

**P: Por que tantos arquivos foram consolidados?**
R: Para evitar redundância e confusão. Documentação espalhada causa inconsistências.

**P: Posso deletar os arquivos antigos?**
R: Recomendo manter por 6 meses para referência histórica, depois deletar.

**P: Onde fico sabendo sobre bugs/melhorias?**
R: Consulte **VERSAO_2.0.md** para tudo que mudou na versão atual.

**P: Como atualizar os dados?**
R: Leia **MANUTENCAO.md**, seção "Como atualizar data.js".

**P: A documentação está em português-br?**
R: Sim, toda documentação está em português-br conforme solicitado.

---

## ✅ CHECKLIST DE DOCUMENTAÇÃO

- ✅ Documentação centralizada em **DOCUMENTACAO.md** (este arquivo)
- ✅ Guia técnico em **CLAUDE.md** (atualizado)
- ✅ Melhorias consolidadas em **VERSAO_2.0.md** (com novos recursos)
- ✅ Manutenção consolidada em **MANUTENCAO.md**
- ✅ Arquivos redundantes eliminados (7 arquivos removidos)
- ✅ Sem redundâncias entre arquivos principais
- ✅ Índice navegável para fácil acesso
- ✅ Links funcionais entre documentos
- ✅ Data de atualização sincronizada (23 de outubro de 2025)

---

## 📌 PRÓXIMAS MELHORIAS DOCUMENTADAS

Veja **VERSAO_2.0.md**, seção "Próximas Melhorias Sugeridas" para funcionalidades futuras.

---

**Última atualização:** 23 de outubro de 2025
**Versão:** 2.0
**Status:** ✅ Documentação limpa, sem redundâncias, atualizada com novos recursos


## UI e Tema – Atualização v0.0.1
- Tailwind via CDN (sem build) e paleta inspirada em candyland.
- Nav sticky + breadcrumb, link para sobre.html (📘 Documentação alternativa).
- Seções estáticas padronizadas (cards, badges, ícones). 
- Acessibilidade: role="region", aria-labelledby, foco visível.
- Paleta utilitária CSS adicionada a styles.css.
