/* =========================================================
   2T SOLUÇÕES DIGITAIS - script.js
   JavaScript Vanilla, apenas o essencial:
   1. Menu mobile (abrir/fechar)
   2. Rolagem suave para as seções
   ========================================================= */

(function () {
  'use strict';

  // ---------- Referências aos elementos ----------
  var menuToggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');

  // ---------- 1. MENU MOBILE ----------

  // Abre ou fecha o menu e atualiza os atributos de acessibilidade
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  // Clique no botão hambúrguer
  menuToggle.addEventListener('click', function () {
    var isOpen = menu.classList.contains('is-open');
    setMenu(!isOpen);
  });

  // Fecha o menu ao apertar ESC
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  // ---------- 2. ROLAGEM SUAVE ----------

  // Respeita quem prefere menos animação no sistema
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seleciona todos os links internos (href começando com "#")
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var targetId = link.getAttribute('href');
      var target = document.querySelector(targetId);

      // Se o destino não existir, deixa o navegador agir normalmente
      if (!target) return;

      event.preventDefault();

      // Fecha o menu mobile após clicar em um link
      setMenu(false);

      // O deslocamento do header fixo é tratado no CSS (scroll-margin-top)
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
})();
