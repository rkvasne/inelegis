# 📚 ÍNDICE DE DOCUMENTAÇÃO - Inelegis

**Última atualização:** 30 de novembro de 2025
**Versão:** 0.0.5
**Status:** ✅ 100% Conformidade TRE-SP
**Tipo:** Sistema não oficial (ferramenta auxiliar)

---

## 🎯 GUIA RÁPIDO

Esta seção ajuda você a encontrar rapidamente o que precisa:

### Para **entender o projeto**
→ Leia: **[CLAUDE.md](CLAUDE.md)** (guia técnico do projeto)

### Para **usar a aplicação**
→ Leia: (funcionalidades e uso)

### Para **entender as ASE (códigos)**
→ Leia: **[MANUAL-ASE.txt](MANUAL-ASE.txt)** (orientação operacional)



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



---

### 5. **MANUTENCAO.md** (Novo - Consolidado)
**O que contém:**
- Validação de dados (100% conformidade TRE-SP)
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

| RELATORIO_VALIDACAO_DADOS.md | Muito longo (300+ linhas) | MANUTENCAO.md |
| relatorio-validacao-completo.md | Duplicado | MANUTENCAO.md |
| relatorio-validacao-outras-leis.md | Duplicado | MANUTENCAO.md |
| resumo-validacao.md | Duplicado | MANUTENCAO.md |
| checklist-manutencao.md | Integrado | MANUTENCAO.md |

**Resultado:** Documentação mais limpa e sem redundâncias. Acesso mais fácil aos documentos relevantes.

---

## 🗂️ ESTRUTURA RECOMENDADA

```
inelegis/
│
├── 📄 DOCUMENTACAO.md          ← VOCÊ ESTÁ AQUI (índice)
│
├── 🚀 CLAUDE.md                ← Guia técnico (leia primeiro)
├── 📖 README.md                ← Descrição geral
├── 📋 MANUAL-ASE.txt           ← Guia operacional
│

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

4. Mantenha: **MANUTENCAO.md** (para updates)

### Você é **usuário operacional** (servidor TRE)?
1. Leia: **README.md** (visão geral)
2. Consulte: **MANUAL-ASE.txt** (como usar ASE)


### Você é **administrador** do sistema?
1. Leia: **MANUTENCAO.md** (checklist)
2. Consulte: **CLAUDE.md** (estrutura)


### Você quer **corrigir um bug**?
1. Busque em: **CHANGELOG.md** (se recente)
2. Procure em: **CLAUDE.md** (estrutura do código)
3. Teste com: Exemplos em **MANUTENCAO.md**

---

## 🔄 CICLO DE ATUALIZAÇÃO RECOMENDADO

### Trimestral (3 meses)
- Executar checklist em **MANUTENCAO.md**
- Verificar atualizações legislativas TRE-SP
- Validar dados.js contra XML oficial

### Anual
- Revisar **CHANGELOG.md** para novas funcionalidades
- Atualizar **CLAUDE.md** se houver mudanças arquiteturais
- Backup completo de dados e documentação

### Quando há novo release
- Atualizar **CHANGELOG.md**
- Adicionar novas entradas ao histórico
- Notificar usuários via **README.md**

---

## 📞 PERGUNTAS FREQUENTES

**P: Por que tantos arquivos foram consolidados?**
R: Para evitar redundância e confusão. Documentação espalhada causa inconsistências.

**P: Posso deletar os arquivos antigos?**
R: Recomendo manter por 6 meses para referência histórica, depois deletar.

**P: Onde fico sabendo sobre bugs/melhorias?**
R: Consulte **CHANGELOG.md** para tudo que mudou na versão atual.

**P: Como atualizar os dados?**
R: Leia **MANUTENCAO.md**, seção "Como atualizar data.js".

**P: A documentação está em português-br?**
R: Sim, toda documentação está em português-br conforme solicitado.

---

## ✅ CHECKLIST DE DOCUMENTAÇÃO

- ✅ Documentação centralizada em **DOCUMENTACAO.md** (este arquivo)
- ✅ Guia técnico em **CLAUDE.md** (atualizado)
- ✅ Manutenção consolidada em **MANUTENCAO.md** (100% conformidade)
- ✅ Histórico de versões em **CHANGELOG.md** (atualizado)
- ✅ Arquivos redundantes eliminados (10 arquivos removidos)
- ✅ Sem redundâncias entre arquivos principais
- ✅ Índice navegável para fácil acesso
- ✅ Links funcionais entre documentos
- ✅ Data de atualização sincronizada (Janeiro 2025)
- ✅ Status de conformidade: 100% TRE-SP

---

## 📌 PRÓXIMAS MELHORIAS DOCUMENTADAS

Veja **CHANGELOG.md**, seção "Próximas Melhorias Sugeridas" para funcionalidades futuras.

---

**Última atualização:** 30 de novembro de 2025
**Versão:** 0.0.5
**Status:** ✅ Documentação limpa, sem redundâncias, atualizada com novos recursos


## Sistema Profissional – v0.0.5
- Tailwind via CDN (sem build) e paleta inspirada em candyland.
- Nav sticky + breadcrumb, link para sobre.html (📘 Documentação alternativa).
- Seções estáticas padronizadas (cards, badges, ícones). 
- Acessibilidade: role="region", aria-labelledby, foco visível.
- Paleta utilitária CSS adicionada a styles.css.
