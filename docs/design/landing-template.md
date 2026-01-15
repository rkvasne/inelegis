---
docStatus: reference
docScope: design
lastReviewed: 15/01/2026
---
# 📄 Template de Landing Page (Markdown)

Este documento fornece o template base para páginas de marketing (Landing Pages) do Inelegis, padronizado em Markdown. O conteúdo HTML completo está incluído como referência em bloco de código para fácil cópia e adaptação.

## 🎯 Objetivo
- Padronizar estrutura e metadados em formato Markdown
- Facilitar revisão e versionamento
- Manter um único ponto de referência para novos materiais de marketing

## ✅ Fonte de verdade
As regras de layout, alinhamento e responsividade da landing page ficam em:
- `docs/design/landing-page.md`

Este arquivo existe para fornecer um HTML completo (copiável) que segue essas regras.

## 🧩 Referência HTML

```html
<!DOCTYPE html>
<html lang="pt-BR" class="dark-theme">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page Template - Inelegis</title>
    <meta name="description" content="Template base para páginas de marketing do Inelegis">
    
    <!-- Fontes -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Estilos (Ajuste o caminho conforme necessário) -->
    <link rel="stylesheet" href="../../../public/styles/landing.css">
    
    <style>
        /* Estilos inline apenas para visualização do template se o CSS não carregar */
        body { margin: 0; font-family: 'Inter', sans-serif; }
        .placeholder-section {
            padding: 4rem 0;
            border-bottom: 1px dashed var(--border-color, #ccc);
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header class="landing-header">
        <nav class="landing-nav">
            <a href="#" class="nav-brand">
                <div class="nav-logo" style="background: var(--primary-500); border-radius: 6px;"></div>
                <span class="nav-title">Inelegis</span>
            </a>

            <div class="nav-links">
                <a href="#como-funciona" class="nav-link">Como Funciona</a>
                <a href="#recursos" class="nav-link">Recursos</a>
                <a href="#sobre" class="nav-link">Sobre</a>
                <a href="#faq" class="nav-link">FAQ</a>
            </div>

            <div class="nav-actions">
                <button class="btn btn-primary">Acessar Sistema</button>
            </div>

            <!-- Mobile Menu Button -->
            <button class="mobile-menu-btn" aria-label="Menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </nav>
    </header>

    <!-- Main Content -->
    <main style="padding-top: 80px;"> <!-- Padding para compensar header fixo -->
        
        <!-- Hero Section (Exemplo) -->
        <section class="hero" style="padding: 4rem 0;">
            <div class="container">
                <h1>Título Principal</h1>
                <p>Subtítulo descrevendo a proposta de valor.</p>
            </div>
        </section>

        <!-- Content Section -->
        <section class="placeholder-section">
            <div class="container">
                <h2>Seção de Conteúdo</h2>
                <p>O container deve ter max-width: 1312px e padding-x: 24px.</p>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="main-footer">
        <div class="footer-content">
            <!-- Coluna 1: Marca -->
            <div class="footer-brand">
                <div class="brand">
                    <div class="brand-icon" style="background: var(--primary-500);"></div>
                    <div class="logo">Inelegis</div>
                </div>
                <p>Consulta de Inelegibilidade Eleitoral</p>
            </div>

            <!-- Coluna 2: Links (bloco centralizado, itens alinhados à esquerda) -->
            <div class="footer-links">
                <h4>Links Rápidos</h4>
                <ul class="link-list">
                    <li><a href="#">Início</a></li>
                    <li><a href="#">Consulta</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>

            <!-- Coluna 3: Transparência (Alinhada à direita, conteúdo à esquerda) -->
            <div class="footer-social">
                <div class="footer-social-wrapper">
                    <h4>Transparência</h4>
                    <div class="social-icons">
                        <a href="#" aria-label="Código Fonte">
                            <!-- Icon GitHub -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 A5.07 5.07 0 0 0 19.91 1 S18.73.65 16 2.48 a13.38 13.38 0 0 0-7 0 C6.27.65 5.09 1 5.09 1 A5.07 5.07 0 0 0 5 4.77 a5.44 5.44 0 0 0-1.5 3.78 c0 5.42 3.3 6.61 6.44 7 A3.37 3.37 0 0 0 9 18.13 V22"></path></svg>
                        </a>
                        <a href="#" aria-label="Histórico de Versões">
                            <!-- Icon File -->
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2 v16 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2-2 V8 z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>© 2026 Inelegis • <a href="#">GitHub</a></p>
        </div>
    </footer>

</body>
</html>
```

## 🔗 Ver também
- [Guia de Design da Landing Page](landing-page.md)
- [Decisões de Design](design-decisions.md)
- [Theme Validator](theme-validator.md)
