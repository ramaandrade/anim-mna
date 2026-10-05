/**
 * app.js
 * Ponto de entrada de AnimM&A: O Jogo do Controle Corporativo
 */

import { UIManager } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o gerenciador de UI
  const ui = new UIManager();

  // Registro de Service Worker para PWA Offline
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('✅ ServiceWorker do AnimM&A registrado com sucesso:', reg.scope);
        })
        .catch(err => {
          console.warn('⚠️ Falha ao registrar ServiceWorker:', err);
        });
    });
  }

  // Tratamento do prompt de instalação do PWA
  let deferredPrompt;
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaBtn = document.getElementById('pwa-install-btn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) {
      pwaBanner.classList.remove('hidden');
    }
  });

  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Instalação PWA: ${outcome}`);
        deferredPrompt = null;
        if (pwaBanner) {
          pwaBanner.classList.add('hidden');
        }
      }
    });
  }
});
