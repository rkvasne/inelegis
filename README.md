# Ineleg-App - Sistema de Consulta de Inelegibilidade Eleitoral

**Versão:** 0.0.4  
**Última atualização:** 25 de outubro de 2025  
**Base de dados:** TRE-SP - Outubro 2024 - Revisada pela CRE-RO em 02/06/2025

Sistema web profissional para consulta de inelegibilidade baseado na legislação eleitoral brasileira (Lei Complementar nº 64/1990, atualizada pela LC 135/2010).

## 🎉 **Últimas Atualizações (25 de outubro de 2025)**

### 🎨 **v0.0.4 - Otimizações de Layout e Funcionalidades**
- ✅ Layout compacto: Radiobuttons em 2 colunas
- ✅ Guia de Uso e Legenda em 3 colunas
- ✅ Modal otimizado: Crime/Delito e Norma em 2 colunas
- ✅ Inputs padronizados (altura 37px, fonte consistente)
- ✅ Preview + botão Montar Artigo na mesma linha
- ✅ Ícones dos labels alinhados verticalmente
- ✅ Botão Exportar funcional (copia para área de transferência)
- ✅ Toast de confirmação animado
- ✅ Controle de acesso com bloqueio de menu (termos obrigatórios)
- ✅ Fonte Inter carregada via @import CSS
- ✅ Select padronizado com seta customizada

### ✅ **100% Conformidade TRE-SP Alcançada**
- ✅ Correção de discrepância no Código Penal Militar
- ✅ Alinhamento perfeito com XML oficial TRE-SP
- ✅ Validação completa de todos os 1.000+ artigos

### 🧹 **Limpeza e Organização**
- ✅ Remoção de arquivos CSS redundantes
- ✅ Consolidação em único arquivo CSS (styles.css)
- ✅ Estrutura de projeto otimizada
- ✅ Testes atualizados (19/19 passando)

## 🚀 Funcionalidades Principais

### ✨ Sistema Completo
- **Interface moderna** com design system profissional
- **Consulta rápida** de inelegibilidade eleitoral
- **Base oficial** TRE-SP atualizada e revisada pela CRE-RO
- **PWA completo** com Service Worker e cache offline
- **Acessibilidade WCAG 2.1** completa
- **Responsivo** para todos os dispositivos

### 🛠️ Tecnologias
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Styling:** CSS customizado com design system profissional
- **Build:** Sistema próprio de otimização e deploy
- **Deploy:** Docker, Nginx, scripts automatizados

## 📋 Como Usar

### 1. **Acesso ao Sistema**
- Abra `index.html` em qualquer navegador moderno
- Leia o disclaimer e confirme o conhecimento
- Clique em "Prosseguir para Consulta"

### 2. **Realizar Consulta**
- Selecione o tipo de comunicação (Condenação/Extinção)
- Escolha a lei/código aplicável
- Digite o artigo completo ou use o construtor
- Clique em "Buscar"

### 3. **Interpretar Resultado**
- **INELEGÍVEL**: Artigo gera inelegibilidade
- **ELEGÍVEL**: Artigo não gera inelegibilidade (exceção aplicável)
- **NÃO ENCONTRADO**: Artigo não está na tabela de inelegibilidade

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
# Build de produção
node scripts/optimize.js

# Deploy automatizado
node scripts/deploy.js

# Servidor de desenvolvimento
node scripts/serve.js
```

### Estrutura do Projeto
```
ineleg-app/
├── index.html          # Página inicial
├── consulta.html       # Página de consulta
├── sobre.html          # Página sobre
├── script.js           # Lógica principal
├── data.js            # Base de dados TRE-SP
├── styles-compact.css # Estilos do sistema
├── manifest.json      # PWA manifest
├── sw.js             # Service Worker
└── scripts/          # Scripts de build/deploy
```

## 📊 Base de Dados

### Fonte Oficial
- **TRE-SP**: Tabela exemplificativa de outubro de 2024
- **CRE-RO**: Revisão e correções de 02/06/2025
- **Leis incluídas**: 41 códigos/leis principais
- **Artigos**: Mais de 1.000 artigos catalogados

### Validação
- ✅ **Completude**: 100% das leis presentes
- ✅ **Precisão**: 100% de conformidade com XML oficial
- ✅ **Integridade**: 0 artigos faltantes
- ✅ **Atualização**: Trimestral recomendada

## 🚀 Deploy em Produção

### Opção 1: Deploy Manual
```bash
# 1. Executar build
node scripts/optimize.js

# 2. Copiar arquivos dist/ para servidor
scp -r dist/* user@server:/var/www/html/

# 3. Configurar HTTPS e headers de cache
```

### Opção 2: Deploy Automático
```bash
# Executar script de deploy
chmod +x deploy.sh
./deploy.sh
```

### Opção 3: Docker
```bash
# Build e execução
docker build -t ineleg-app .
docker run -d -p 80:80 ineleg-app
```

## 📚 Documentação Técnica

### ASE (Códigos de Situação Eleitoral)
- **ASE 337**: Suspensão de direitos políticos por inelegibilidade
- **ASE 370**: Suspensão por extinção da punibilidade
- **ASE 540**: Suspensão por outros motivos

### Manutenção de Dados
- **Frequência**: Trimestral (janeiro, abril, julho, outubro)
- **Fonte**: TRE-SP oficial
- **Validação**: Comparação com XML oficial
- **Backup**: Automático antes de atualizações

## ⚠️ Disclaimer Importante

**SISTEMA NÃO OFICIAL** - Este sistema é uma **ferramenta auxiliar** desenvolvida por servidor para uso de servidores dos TREs e **NÃO SUBSTITUI** a consulta direta na legislação atualizada. 

**Base de dados**: Utiliza dados oficiais do TRE-SP (outubro/2024) revisados pela CRE-RO (02/06/2025), mas as informações podem estar desatualizadas. 

**IMPORTANTE**: Sempre confirme na legislação vigente e nas orientações oficiais mais recentes antes de tomar decisões definitivas.

## 📞 Suporte

- **Desenvolvido por**: Servidor para uso de servidores dos TREs
- **Base de dados**: TRE-SP - Outubro 2024 - CRE-RO 02/06/2025
- **Status**: Sistema não oficial (ferramenta auxiliar)
- **Versão**: 0.0.2

---

*Sistema não oficial de Consulta de Inelegibilidade Eleitoral - Desenvolvido por servidor para uso de servidores dos TREs*