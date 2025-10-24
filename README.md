# Sistema de Consulta de Inelegibilidade

Sistema web profissional para consulta de inelegibilidade baseado na legislação eleitoral brasileira.

## 🚀 Versão 0.0.2 - Sistema Profissional Completo

### ✨ Principais Funcionalidades
- **Interface moderna** com design system profissional
- **Pipeline de desenvolvimento** completo (build, lint, test, deploy)
- **Otimização automática** (32.9% economia de tamanho)
- **Monitoramento de performance** em tempo real
- **PWA completo** com Service Worker
- **Testes automatizados** (100% passando)
- **Servidor de desenvolvimento** com live reload

### 🛠️ Stack Tecnológica
- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Styling:** Tailwind CSS (via CDN) + CSS customizado
- **Build:** Sistema próprio de build e otimização
- **Testing:** Testes unitários e de integração
- **PWA:** Manifest + Service Worker
- **Performance:** Monitoramento de Core Web Vitals

### 📁 Estrutura do Projeto
```
ineleg-app/
├── index.html              # Aplicação principal
├── styles.css              # Estilos customizados
├── script.js               # Lógica principal
├── data.js                 # Base de dados
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── js/                     # Módulos JavaScript
│   ├── config.js           # Configurações
│   ├── performance.js      # Monitoramento
│   ├── logger.js           # Sistema de logs
│   └── ...
├── scripts/                # Scripts de desenvolvimento
│   ├── build.js            # Sistema de build
│   ├── optimize.js         # Otimização
│   ├── deploy.js           # Deploy automatizado
│   ├── serve.js            # Servidor de desenvolvimento
│   └── ...
└── tests/                  # Testes automatizados
```

## 🚀 Como Usar

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (com live reload)
npm run dev

# Executar testes
npm run test

# Verificar qualidade do código
npm run check
```

### Build e Deploy
```bash
# Build de produção
npm run build

# Otimizar arquivos
npm run optimize

# Deploy completo
npm run deploy
```

## 🎨 Design System

### Paleta de Cores Profissional
- **Primary:** Azul institucional (#0ea5e9)
- **Secondary:** Amarelo dourado (#eab308)
- **Accent:** Verde justiça (#10b981)
- **Neutral:** Escala de cinzas moderna

### Componentes Modernos
- **Glassmorphism:** Efeito de vidro fosco
- **Animações suaves:** Transições de 200-300ms
- **Sombras modernas:** Múltiplas camadas
- **Tipografia:** Inter font com hierarquia clara

## 📊 Performance

### Métricas Alcançadas
- **Tamanho otimizado:** 83.5 KB (32.9% economia)
- **Core Web Vitals:** Monitoramento em tempo real
- **FPS:** Monitoramento de 60fps
- **Memória:** Controle de uso < 50MB

### Otimizações Implementadas
- **Minificação:** CSS, JS e HTML
- **Compressão:** Gzip habilitado
- **Cache:** Estratégias inteligentes
- **Lazy loading:** Recursos sob demanda

## 🧪 Testes

### Cobertura de Testes
- **Unitários:** Funções principais
- **Integração:** Fluxos completos
- **Funcionais:** Interface e UX
- **Dados:** Validação da base

### Executar Testes
```bash
npm run test        # Todos os testes
npm run lint        # Verificação de código
npm run validate    # Validação de dados
```

## 🔧 Configuração

### Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:
```bash
NODE_ENV=development
PORT=3000
BUILD_OPTIMIZE=true
PWA_ENABLED=true
```

### Configurações Avançadas
- **js/config.js:** Configurações da aplicação
- **scripts/:** Scripts de desenvolvimento
- **manifest.json:** Configurações PWA

## 📱 PWA (Progressive Web App)

### Funcionalidades
- **Instalável:** Como app nativo
- **Offline:** Funciona sem internet
- **Cache inteligente:** Recursos otimizados
- **Notificações:** Suporte a push (futuro)

## 🔍 Smoke Tests

### Cenários Testados
- **CP 121:** INELEGÍVEL (❌) - ASE 337 Motivo 7
- **CP 122:** INELEGÍVEL (❌) - Exceção caput
- **CP 163:** INELEGÍVEL (❌) - Exceções específicas
- **Lei 11.343/06 Art. 33 §3º:** ELEGÍVEL (✅) - Exceção aplicável

## 📚 Documentação

### Links Úteis
- **Documentação local:** [sobre.html](sobre.html)
- **Repositório:** [GitHub](https://github.com/rkvasne/ineleg-app)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Manutenção:** [MANUTENCAO.md](MANUTENCAO.md)

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Criar branch para feature
3. Executar testes (`npm run check`)
4. Commit com mensagem clara
5. Pull request para main

### Padrões de Código
- **ESLint:** Configuração personalizada
- **Prettier:** Formatação automática
- **Commits:** Conventional commits

## 📄 Licença

MIT License - Desenvolvido para a Justiça Eleitoral

---

**Versão:** 0.0.2  
**Repositório:** https://github.com/rkvasne/ineleg-app  
**Desenvolvido para:** Servidores da Justiça Eleitoral