'use strict';

(function enforceTermsGate() {
    if (!localStorage.getItem('ineleg_termos_aceitos')) {
        window.location.href = 'index.html#termos';
    }
})();
