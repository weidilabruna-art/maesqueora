/**
 * Exit Intent - Detecta quando usuário vai sair do domínio e redireciona para oferta
 * Só dispara quando tentar sair do site, não quando navegar internamente
 */

(function() {
    'use strict';
    
    // Verifica se já mostrou a oferta nesta sessão
    if (sessionStorage.getItem('oferta_saida_vista')) {
        return;
    }
    
    let exitIntentTriggered = false;
    let isNavigatingInternal = false;
    
    // Domínio atual
    const currentDomain = window.location.hostname;
    
    // Captura UID da URL se houver
    function getUID() {
        const params = new URLSearchParams(window.location.search);
        return params.get('uid') || '';
    }
    
    // Redireciona para página de oferta
    function triggerExitIntent() {
        if (exitIntentTriggered || isNavigatingInternal) return;
        exitIntentTriggered = true;
        
        const uid = getUID();
        const url = `/oferta-saida.php${uid ? '?uid=' + encodeURIComponent(uid) : ''}`;
        window.location.href = url;
    }
    
    // Detecta cliques em links - marca se é navegação interna
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href) {
            try {
                const linkUrl = new URL(link.href);
                // Se é link interno (mesmo domínio), não dispara exit intent
                if (linkUrl.hostname === currentDomain || link.href.startsWith('/') || link.href.startsWith('./') || link.href.startsWith('../')) {
                    isNavigatingInternal = true;
                }
            } catch (err) {
                // Link relativo, é interno
                isNavigatingInternal = true;
            }
        }
    }, true);
    
    // Detecta submissão de formulários - marca como navegação interna
    document.addEventListener('submit', function() {
        isNavigatingInternal = true;
    }, true);
    
    // Detecta movimento do mouse saindo da janela pelo topo (desktop)
    document.addEventListener('mouseout', function(e) {
        // Se o mouse saiu pelo topo da página
        if (!e.relatedTarget && !e.toElement && e.clientY < 10) {
            triggerExitIntent();
        }
    });
    
    console.log('[Exit Intent] Ativado - Só dispara ao sair do domínio');
})();
