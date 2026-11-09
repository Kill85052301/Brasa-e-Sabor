/* Entradas únicas; conteúdo visível por padrão, sem listeners de rolagem. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('motion-ready')) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) {
    root.classList.remove('motion-ready');
    return;
  }

  const running = new Map();
  let pending = 0;
  const detachPreference = () => {
    if (preference.removeEventListener) preference.removeEventListener('change', stopMotion);
    else if (preference.removeListener) preference.removeListener(stopMotion);
  };
  const release = () => {
    if (pending || running.size) return;
    observer.disconnect();
    detachPreference();
  };
  const stopMotion = (event) => {
    if (!event.matches) return;
    root.classList.remove('motion-ready');
    observer.disconnect();
    running.forEach((animation, element) => {
      animation.cancel();
      element.classList.remove('is-entering');
    });
    running.clear();
    pending = 0;
    detachPreference();
  };
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      pending--;
      // A classe final persiste mesmo se a animação falhar ou for cancelada.
      element.classList.add('reveal-visible');
      if (preference.matches || element.matches(':focus-within')) continue;
      try {
        element.classList.add('is-entering');
        const animation = element.animate([
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 420, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' });
        running.set(element, animation);
        const cleanup = () => {
          element.classList.remove('is-entering');
          running.delete(element);
          release();
        };
        animation.finished.then(cleanup, cleanup);
      } catch {
        element.classList.remove('is-entering');
      }
    }
    release();
  }, { threshold: 0, rootMargin: '0px 0px -16px 0px' });

  document.querySelectorAll('main h1, main h2, main h3, main p, main .bloco, main img, .rodape p')
    .forEach((element) => {
      // Evita camadas e animações duplicadas dentro dos cartões.
      if (element.parentElement.closest('.bloco')) return;
      pending++;
      observer.observe(element);
    });
  if (preference.addEventListener) preference.addEventListener('change', stopMotion);
  else if (preference.addListener) preference.addListener(stopMotion);
  root.classList.add('motion-initialized');
  release();
})();
