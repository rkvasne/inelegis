'use strict';

/**
 * Core Utilities for Ineleg App
 * Handles debugging logging and common helper functions.
 */

const DEBUG_LOG_ENABLED = (() => {
    if (typeof globalThis === 'undefined') {
        return false;
    }
    if (globalThis.INelegisDebug === true) {
        return true;
    }
    if (globalThis.process && globalThis.process.env && globalThis.process.env.INELEGIS_DEBUG === 'true') {
        return true;
    }
    return false;
})();

export function debugLog(...args) {
    if (DEBUG_LOG_ENABLED) {
        console.debug('[Inelegis]', ...args);
    }
}

/**
 * Enhanced focus trap for accessibility in modals
 * @param {HTMLElement} modalElement 
 */
export function trapFocusInModal(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}
