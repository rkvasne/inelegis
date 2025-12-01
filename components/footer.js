// Footer Component - Injeta o footer em todas as páginas
// Este arquivo centraliza o HTML do footer para evitar duplicação e erros

(function () {
    'use strict';

    // HTML do footer (template literal para evitar corrupção)
    const footerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-info">
                        <p>&copy; 2025 Inelegis. Todos os direitos reservados.</p>
                        <p class="text-sm text-neutral-500">Versão 0.0.6</p>
                    </div>
                    <div class="footer-links">
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/CHANGELOG.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Changelog</a>
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/docs/MAINTENANCE.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Manutenção</a>
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/docs/DEVELOPMENT.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Documentação Técnica</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Variação para a landing page (texto diferente)
    const footerHTMLLanding = `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-text">
                        Tabela exemplificativa do TRE-SP atualizada em outubro de 2024 e
                        revisada pela CRE-RO em 02/06/2025
                    </div>
                    <div class="footer-links">
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/CHANGELOG.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Changelog</a>
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/docs/MAINTENANCE.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Manutenção</a>
                        <a href="https://github.com/rkvasne/ineleg-app/blob/main/docs/DEVELOPMENT.md" 
                           class="footer-link" 
                           target="_blank" 
                           rel="noopener noreferrer">Documentação Técnica</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Função para injetar o footer
    function injectFooter() {
        // Verifica se já existe um footer
        const existingFooter = document.querySelector('footer.footer');
        if (existingFooter) {
            console.log('[Footer Component] Footer já existe, pulando injeção');
            return;
        }

        // Detecta se é a landing page
        const isLandingPage = window.location.pathname.includes('landing');

        // Cria um elemento temporário para parsear o HTML
        const temp = document.createElement('div');
        temp.innerHTML = isLandingPage ? footerHTMLLanding : footerHTML;

        // Insere o footer antes do fechamento do body
        document.body.appendChild(temp.firstElementChild);

        console.log('[Footer Component] Footer injetado com sucesso');
    }

    // Injeta o footer quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();
