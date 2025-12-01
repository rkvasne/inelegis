# 🤝 Guia de Contribuição

Obrigado pelo seu interesse em contribuir para o **Inelegis**! 🎉

Este documento é um guia para ajudar você a contribuir para este projeto. Seja corrigindo bugs, adicionando novas funcionalidades, melhorando a documentação ou traduzindo, sua ajuda é muito bem-vinda.

## 📋 Índice

- [Código de Conduta](#-código-de-conduta)
- [Como Posso Contribuir?](#-como-posso-contribuir)
  - [Reportando Bugs](#-reportando-bugs)
  - [Sugerindo Melhorias](#-sugerindo-melhorias)
  - [Seu Primeiro Pull Request](#-seu-primeiro-pull-request)
- [Ambiente de Desenvolvimento](#-ambiente-de-desenvolvimento)
- [Guia de Estilo](#-guia-de-estilo)
  - [Mensagens de Commit](#-mensagens-de-commit)
  - [Padrões de Código](#-padrões-de-código)
- [Licença](#-licença)

---

## 📜 Código de Conduta

Este projeto e todos os seus participantes estão sob o [Código de Conduta do Contribuidor](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Ao participar, espera-se que você mantenha este código. Por favor, relate comportamentos inaceitáveis para os mantenedores do projeto.

---

## 🚀 Como Posso Contribuir?

### 🐛 Reportando Bugs

Bugs são rastreados como [GitHub Issues](https://github.com/rkvasne/inelegis-app/issues). Ao criar uma issue, explique o problema e inclua detalhes adicionais para ajudar os mantenedores a reproduzi-lo:

*   **Use um título claro e descritivo.**
*   **Descreva os passos exatos para reproduzir o problema.**
*   **Descreva o comportamento esperado e o que aconteceu de fato.**
*   **Inclua screenshots e GIFs animados** se possível.
*   **Informe o ambiente:** Navegador, Sistema Operacional, Versão.

### 💡 Sugerindo Melhorias

Sugestões de melhorias também são rastreadas como [GitHub Issues](https://github.com/rkvasne/inelegis-app/issues).

*   **Use um título claro e descritivo.**
*   **Forneça uma descrição detalhada da sugestão.**
*   **Explique por que essa melhoria seria útil** para a maioria dos usuários.

### 📥 Seu Primeiro Pull Request

1.  **Fork o repositório** e clone-o localmente.
2.  **Crie uma branch** para sua edição: `git checkout -b feature/minha-feature` ou `fix/meu-fix`.
3.  **Faça suas alterações** seguindo os padrões de código.
4.  **Teste suas alterações** para garantir que nada quebrou.
5.  **Commit suas alterações** seguindo o padrão de commits.
6.  **Push para a branch**: `git push origin feature/minha-feature`.
7.  **Abra um Pull Request** no repositório original.

---

## 💻 Ambiente de Desenvolvimento

Para configurar seu ambiente de desenvolvimento local:

### Pré-requisitos

*   Node.js 18+
*   Git

### Configuração

1.  Clone o repositório:
    ```bash
    git clone https://github.com/rkvasne/inelegis-app.git
    cd inelegis-app
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Acesse `http://localhost:3000`.

---

## 🎨 Guia de Estilo

### 📝 Mensagens de Commit

Utilizamos o padrão **[Conventional Commits](https://www.conventionalcommits.org/)**. Isso ajuda a criar um histórico de commits legível e automatizar a geração de changelogs.

Estrutura:
```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

Tipos comuns:
*   `feat`: Nova funcionalidade
*   `fix`: Correção de bug
*   `docs`: Alterações apenas na documentação
*   `style`: Alterações que não afetam o significado do código (espaços, formatação, etc)
*   `refactor`: Alteração de código que não corrige um bug nem adiciona uma feature
*   `perf`: Alteração de código que melhora a performance
*   `test`: Adição ou correção de testes
*   `chore`: Alterações no processo de build, ferramentas auxiliares, etc

Exemplos:
*   `feat: adiciona filtro de busca por data`
*   `fix(css): corrige alinhamento do header no mobile`
*   `docs: atualiza instruções de instalação no README`

### 🧱 Padrões de Código

*   **HTML**: Semântico e acessível. Use tags apropriadas (`<header>`, `<main>`, `<nav>`, etc).
*   **CSS**: Organizado e modular. Evite estilos inline. Use variáveis CSS para cores e espaçamentos.
*   **JavaScript**: Moderno (ES6+). Use `const` e `let`. Evite `var`. Comente funções complexas.

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT do projeto.
