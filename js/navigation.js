/* Navegação progressiva: os links continuam disponíveis sem JavaScript. */
(() => {
  const header = document.querySelector('header');
  const button = header.querySelector('.menu-toggle');
  const menu = header.querySelector('#menu-principal');
  const compact = window.matchMedia('(max-width: 1100px)');
  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menu');
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      close();
      button.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) close();
  });
  const reset = () => {
    if (compact.matches && menu.contains(document.activeElement)) button.focus();
    close();
  };
  if (compact.addEventListener) compact.addEventListener('change', reset);
  else compact.addListener(reset);
  header.classList.add('menu-ready');
})();
