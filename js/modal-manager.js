'use strict';

/**
 * Gerenciador de Modal
 * Encapsula toda a lógica de controle do modal
 */

const ModalManager = {
  // Estado privado
  _state: {
    isOpen: false,
    lastFocusedElement: null,
    trapHandler: null,
    currentContent: ''
  },

  /**
   * Abre o modal com conteúdo
   */
  open(tipoResultado, status, conteudo) {
    const modal = document.getElementById('modalResultado');
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalContent || !modalBody) {
      console.error('Elementos do modal não encontrados');
      return;
    }

    // Armazenar conteúdo
    this._state.currentContent = conteudo;
    this._state.isOpen = true;

    // Definir classe do modal
    modalContent.className = `modal-content modal-modern ${tipoResultado}`;

    // Inserir conteúdo de forma segura
    if (window.Sanitizer) {
      window.Sanitizer.safeInnerHTML(modalBody, conteudo);
    } else {
      modalBody.innerHTML = conteudo;
    }

    // Mostrar modal com animação
    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('show');
      modalContent.style.opacity = '1';
      modalContent.style.transform = 'translateY(0) scale(1)';
    });

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';

    // Configurar foco e trap
    this._setupFocusTrap(modalContent);
  },

  /**
   * Fecha o modal
   */
  close() {
    const modal = document.getElementById('modalResultado');
    const modalContent = modal.querySelector('.modal-content');

    if (!modal || !modalContent) return;

    // Animar saída
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.95)';

    // Aguardar animação
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';

      // Limpar estado
      this._state.isOpen = false;
      this._cleanupFocusTrap(modalContent);
    }, 300);
  },

  /**
   * Verifica se modal está aberto
   */
  isOpen() {
    return this._state.isOpen;
  },

  /**
   * Obtém conteúdo atual do modal
   */
  getCurrentContent() {
    return this._state.currentContent;
  },

  /**
   * Exporta conteúdo do modal
   */
  exportContent() {
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');

    if (!modalBody) return null;

    let textoExportar = '';

    // Adicionar título
    if (modalTitle) {
      textoExportar += `${modalTitle.textContent}\n`;
    }
    if (modalSubtitle) {
      textoExportar += `${modalSubtitle.textContent}\n`;
    }
    textoExportar += '='.repeat(50) + '\n\n';

    // Extrair texto do corpo
    const statusCard = modalBody.querySelector('.modal-status-card');
    if (statusCard) {
      const statusLabel = statusCard.querySelector('.status-label');
      const statusValue = statusCard.querySelector('.status-value');
      if (statusLabel && statusValue) {
        textoExportar += `${statusLabel.textContent}: ${statusValue.textContent}\n\n`;
      }
    }

    // Extrair informações do grid
    const infoItems = modalBody.querySelectorAll('.info-item');
    infoItems.forEach(item => {
      const label = item.querySelector('.info-label');
      const value = item.querySelector('.info-value');
      if (label && value) {
        textoExportar += `${label.textContent}: ${value.textContent}\n`;
      }
    });
    textoExportar += '\n';

    // Extrair ASE info
    const aseInfo = modalBody.querySelector('.modal-ase-info');
    if (aseInfo) {
      textoExportar += `${aseInfo.textContent.trim()}\n\n`;
    }

    // Extrair seções
    const sections = modalBody.querySelectorAll('.modal-section');
    sections.forEach(section => {
      const header = section.querySelector('.section-header');
      const content = section.querySelector('.section-content');
      if (header) {
        textoExportar += `${header.textContent.trim()}\n`;
        textoExportar += '-'.repeat(30) + '\n';
      }
      if (content) {
        textoExportar += `${content.textContent.trim()}\n\n`;
      }
    });

    // Adicionar rodapé
    textoExportar += '='.repeat(50) + '\n';
    textoExportar += 'Inelegis - Sistema de Consulta de Inelegibilidade Eleitoral\n';
    textoExportar += 'Base de dados: TRE-SP (Out/2024) - CRE-RO (02/06/2025)\n';
    textoExportar += `Exportado em: ${new Date().toLocaleString('pt-BR')}\n`;

    return textoExportar;
  },

  /**
   * Configura trap de foco para acessibilidade
   */
  _setupFocusTrap(modalContent) {
    // Salvar elemento com foco anterior
    this._state.lastFocusedElement = document.activeElement;

    // Focar no modal
    modalContent.setAttribute('tabindex', '-1');
    modalContent.focus();

    // Criar handler de trap
    const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    this._state.trapHandler = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = Array.from(
        modalContent.querySelectorAll(focusableSelectors)
      ).filter(el => !el.hasAttribute('disabled'));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalContent.addEventListener('keydown', this._state.trapHandler);
  },

  /**
   * Remove trap de foco
   */
  _cleanupFocusTrap(modalContent) {
    if (this._state.trapHandler && modalContent) {
      modalContent.removeEventListener('keydown', this._state.trapHandler);
      this._state.trapHandler = null;
    }

    // Restaurar foco
    if (this._state.lastFocusedElement && 
        typeof this._state.lastFocusedElement.focus === 'function') {
      this._state.lastFocusedElement.focus();
    }
    this._state.lastFocusedElement = null;
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ModalManager.isOpen()) {
      ModalManager.close();
    }
  });
}
