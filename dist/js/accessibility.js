/**
 * Melhorias de acessibilidade
 */
;(function() {
  'use strict';
  
  const A11y = {
    init() {
      this.setupKeyboardNavigation();
      this.setupScreenReaderSupport();
      this.setupFocusManagement();
      this.setupColorContrastToggle();
    },
    
    setupKeyboardNavigation() {
      // Atalhos de teclado globais
      document.addEventListener('keydown', (e) => {
        // Alt + 1: Focar no select de leis
        if (e.altKey && e.key === '1') {
          e.preventDefault();
          document.getElementById('leiSelect')?.focus();
        }
        
        // Alt + 2: Focar no campo de artigo
        if (e.altKey && e.key === '2') {
          e.preventDefault();
          document.getElementById('artigoInput')?.focus();
        }
        
        // Alt + 3: Executar busca
        if (e.altKey && e.key === '3') {
          e.preventDefault();
          document.getElementById('searchBtn')?.click();
        }
        
        // Alt + H: Mostrar ajuda de atalhos
        if (e.altKey && e.key === 'h') {
          e.preventDefault();
          this.showKeyboardHelp();
        }
      });
    },
    
    setupScreenReaderSupport() {
      // Anunciar mudanças de estado
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(announcer);
      
      this.announcer = announcer;
    },
    
    announce(message) {
      if (this.announcer) {
        this.announcer.textContent = message;
      }
    },
    
    setupFocusManagement() {
      // Indicador visual de foco melhorado
      const style = document.createElement('style');
      style.textContent = `
        .focus-visible {
          outline: 3px solid #667eea !important;
          outline-offset: 2px !important;
        }
        
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: #000;
          color: #fff;
          padding: 8px;
          text-decoration: none;
          z-index: 9999;
          border-radius: 4px;
        }
        
        .skip-link:focus {
          top: 6px;
        }
      `;
      document.head.appendChild(style);
      
      // Adicionar skip link
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Pular para conteúdo principal';
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      // Marcar conteúdo principal
      const main = document.querySelector('main');
      if (main) {
        main.id = 'main-content';
        main.setAttribute('tabindex', '-1');
      }
    },
    
    setupColorContrastToggle() {
      // Botão para alternar alto contraste
      const contrastBtn = document.createElement('button');
      contrastBtn.textContent = '🎨 Alto Contraste';
      contrastBtn.className = 'contrast-toggle';
      contrastBtn.setAttribute('aria-label', 'Alternar modo de alto contraste');
      contrastBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 1000;
        padding: 8px 12px;
        background: #333;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      `;
      
      contrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        contrastBtn.textContent = isHighContrast ? '🎨 Contraste Normal' : '🎨 Alto Contraste';
        
        // Salvar preferência
        localStorage.setItem('high-contrast', isHighContrast);
        
        this.announce(isHighContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
      });
      
      document.body.appendChild(contrastBtn);
      
      // Restaurar preferência
      if (localStorage.getItem('high-contrast') === 'true') {
        contrastBtn.click();
      }
      
      // Estilos de alto contraste
      const contrastStyle = document.createElement('style');
      contrastStyle.textContent = `
        .high-contrast {
          filter: contrast(150%) brightness(120%);
        }
        
        .high-contrast * {
          text-shadow: none !important;
          box-shadow: none !important;
        }
        
        .high-contrast .modal-content {
          border: 3px solid #000 !important;
        }
      `;
      document.head.appendChild(contrastStyle);
    },
    
    showKeyboardHelp() {
      const helpModal = document.createElement('div');
      helpModal.className = 'modal show';
      helpModal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" role="dialog" aria-labelledby="help-title" aria-modal="true">
          <div class="modal-header">
            <h2 id="help-title">Atalhos de Teclado</h2>
            <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
          </div>
          <div class="modal-body">
            <dl>
              <dt>Alt + 1</dt>
              <dd>Focar no campo de seleção de lei</dd>
              
              <dt>Alt + 2</dt>
              <dd>Focar no campo de artigo</dd>
              
              <dt>Alt + 3</dt>
              <dd>Executar busca</dd>
              
              <dt>Alt + D</dt>
              <dd>Abrir documentação</dd>
              
              <dt>Alt + H</dt>
              <dd>Mostrar esta ajuda</dd>
              
              <dt>F1</dt>
              <dd>Alternar entre Condenação e Extinção</dd>
              
              <dt>Ctrl + L</dt>
              <dd>Focar no select de leis</dd>
              
              <dt>Ctrl + A</dt>
              <dd>Focar no campo artigo</dd>
              
              <dt>Ctrl + Enter</dt>
              <dd>Buscar rapidamente</dd>
              
              <dt>Escape</dt>
              <dd>Fechar modal</dd>
            </dl>
          </div>
        </div>
      `;
      
      document.body.appendChild(helpModal);
      helpModal.querySelector('.modal-close').focus();
    }
  };
  
  // Expor globalmente
  window.App = window.App || {};
  window.App.a11y = A11y;
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => A11y.init());
  } else {
    A11y.init();
  }
})();