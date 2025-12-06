// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // -----------------------------
  // 1. MENÚ MÓVIL (ICONO HAMBURGUESA)
  // -----------------------------
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu   = document.getElementById('navmenu');

  if (navToggle && navMenu) {
    // Abrir/cerrar menú móvil
    navToggle.addEventListener('click', () => {
      body.classList.toggle('mobile-nav-active');

      // Cambiar icono (tres rayas <-> X)
      navToggle.classList.toggle('bi-list');
      navToggle.classList.toggle('bi-x');
    });

    // Cerrar menú móvil al hacer clic en un enlace del menú
    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active');
          navToggle.classList.add('bi-list');
          navToggle.classList.remove('bi-x');
        }
      });
    });
  }

  // -----------------------------
  // 2. BOTÓN SCROLL-TOP (FLECHA)
  // -----------------------------
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    const toggleScrollTop = () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('active');
      } else {
        scrollTopBtn.classList.remove('active');
      }
    };

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -----------------------------
  // 3. INICIALIZAR AOS (ANIMACIONES)
  // -----------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      once: true
    });
  }
});

