'use strict';

/**
 * DOM Manipulation Module
 * Handles direct DOM updates, previews, and visual feedbacks.
 */

// Dependencies
const getModalManager = () => window.ModalManager;
const getSanitizer = () => window.Sanitizer;

export function mostrarToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>',
        info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };

    const html = `
        <div class="toast-content">
            <div class="toast-icon">
                ${icons[type] || icons.info}
            </div>
            <div class="toast-message">${msg}</div>
        </div>
    `;

    const Sanitizer = getSanitizer();
    if (Sanitizer) {
        Sanitizer.safeInnerHTML(toast, html);
    } else {
        toast.innerHTML = html;
    }

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 4000);

    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    });
}

export function abrirModal(tipoResultado, status, conteudo) {
    const ModalManager = getModalManager();
    if (ModalManager) {
        ModalManager.open(tipoResultado, status, conteudo);
    } else {
        console.error('ModalManager not found');
    }
}

export function fecharModal() {
    const ModalManager = getModalManager();
    if (ModalManager) {
        ModalManager.close();
    }
}

export function esconderSugestoes(sugestoesDiv) {
    if (!sugestoesDiv) return;
    sugestoesDiv.classList.remove('show');
    setTimeout(() => {
        sugestoesDiv.innerHTML = '';
    }, 200);
}
