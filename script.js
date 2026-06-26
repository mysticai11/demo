document.addEventListener('DOMContentLoaded', () => {
  // 1. Intersection Observer for standard reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        // Unobserve to keep it shown after scrolling past
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach(el => observer.observe(el));

  // 2. Intersection Observer for Neon Data Bars
  const neonObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const neonObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  }, neonObserverOptions);

  const neonBars = document.querySelectorAll('.neon-bar');
  neonBars.forEach(bar => neonObserver.observe(bar));
});

// Smooth scroll for the hero indicator
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
