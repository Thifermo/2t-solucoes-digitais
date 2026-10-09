/**
 * ============================================================================
 * 2T SOLUÇÕES DIGITAIS - SCRIPT PRINCIPAL (VANILLA JAVASCRIPT)
 * Arquitetura: Código limpo, desacoplado e documentado pedagogicamente.
 * 
 * Módulos Funcionais:
 * 1. Intersection Observer para Animação "Fade-In-Up" ao rolar a página
 * 2. Menu Mobile Drawer com Acessibilidade (ARIA & Trava de Scroll)
 * 3. Sticky Header com efeito dinâmico de Glassmorphism no Scroll
 * 4. Scroll Spy (Destaque do link de navegação ativo da seção atual)
 * 5. Rolagem suave assistida para links âncora
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de todos os módulos após o carregamento da árvore DOM
  initScrollReveal();
  initMobileMenu();
  initHeaderScroll();
  initScrollSpy();
});

/**
 * ----------------------------------------------------------------------------
 * 1. INTERSECTION OBSERVER ("FADE-IN-UP" REVEAL)
 * 
 * Por que usar Intersection Observer em vez do evento 'scroll'?
 * O Intersection Observer é executado de forma assíncrona na thread do navegador,
 * evitando gargalos de desempenho (reflow/repaint contínuos) comuns em listeners de scroll.
 * ----------------------------------------------------------------------------
 */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');

  // Configuração do observador: dispara quando 12% do elemento entra na viewport
  const observerOptions = {
    root: null, // Viewport padrão do navegador
    rootMargin: '0px 0px -40px 0px', // Gatilho sutil antes do fundo da tela
    threshold: 0.12 // 12% de visibilidade necessária
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      // Se o elemento entrou na área visível da tela
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Uma vez animado, paramos de observar o elemento para poupar memória
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  elementsToReveal.forEach(el => observer.observe(el));
}

/**
 * ----------------------------------------------------------------------------
 * 2. MENU MOBILE DRAWER & ACESSIBILIDADE
 * 
 * Gerencia a abertura e fechamento do menu lateral em telas menores,
 * sincronizando atributos ARIA para leitores de tela e bloqueando o scroll do body.
 * ----------------------------------------------------------------------------
 */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!navToggle || !mobileDrawer || !drawerBackdrop) return;

  // Função centralizada para abrir o menu
  function openMenu() {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
  }

  // Função centralizada para fechar o menu
  function closeMenu() {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = ''; // Restaura o scroll natural
  }

  // Alternância ao clicar no botão hambúrguer
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Fechar ao clicar no backdrop escurecido
  drawerBackdrop.addEventListener('click', closeMenu);

  // Fechar ao clicar em qualquer link de navegação do menu mobile
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Acessibilidade por teclado: fechar menu ao pressionar a tecla Escape (ESC)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 3. STICKY HEADER COM GLASSMORPHISM DINÂMICO
 * 
 * Adiciona a classe 'scrolled' quando a página é rolada mais de 30px,
 * intensificando o contraste do vidro (backdrop-filter) e a borda inferior.
 * ----------------------------------------------------------------------------
 */
function initHeaderScroll() {
  const siteHeader = document.getElementById('siteHeader');
  if (!siteHeader) return;

  const scrollThreshold = 30;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  // Listener com { passive: true } para não impactar na fluidez da rolagem
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * ----------------------------------------------------------------------------
 * 4. SCROLL SPY (INDICADOR DE SEÇÃO ATIVA)
 * 
 * Destaca visualmente no menu de navegação a seção que o usuário está lendo no momento.
 * ----------------------------------------------------------------------------
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');

  if (!sections.length || !desktopLinks.length) return;

  function highlightActiveLink() {
    // Linha de leitura imaginária no topo da tela com offset do header
    const scrollPosition = window.scrollY + 120;

    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop;
      const sectionId = currentSection.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveLink, { passive: true });
}
