/* docs/script.js */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('presentation');
  const sections = Array.from(document.querySelectorAll('section'));
  const dotsContainer = document.querySelector('.nav-dots');
  const progressBar = document.querySelector('.progress-bar');
  let currentSectionIndex = 0;
  let isScrolling = false;

  // --- 1. Dynamic Indicator Dots Setup ---
  sections.forEach((section, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.setAttribute('data-target', idx);
    dot.addEventListener('click', () => {
      scrollToSection(idx);
    });
    dotsContainer.appendChild(dot);
  });
  
  const dots = Array.from(document.querySelectorAll('.dot'));

  // --- 2. Safe Scroll Transitions ---
  function scrollToSection(index) {
    if (index < 0 || index >= sections.length) return;
    isScrolling = true;
    currentSectionIndex = index;
    
    sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    updateNavigationElements(index);

    // Release scroll lock after animation completes (~700ms)
    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  // --- 3. Update Progress Markers & Accent States ---
  function updateNavigationElements(index) {
    // Top Progress Bar
    const progressPercent = (index / (sections.length - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Indicators highlight & positioning
    dots.forEach((dot, idx) => {
      dot.classList.remove('active', 'healthy', 'ir', 'liver', 'dual');
      if (idx === index) {
        dot.classList.add('active');
        
        // Match active section theme
        if (idx === 0 || idx === 4 || idx === 12) dot.classList.add('healthy');
        else if (idx === 2 || idx === 7 || idx === 13) dot.classList.add('ir');
        else if (idx === 5 || idx === 11) dot.classList.add('liver');
        else if (idx === 1 || idx === 6 || idx === 9 || idx === 14) dot.classList.add('dual');
      }
    });

    // Hide dots on Slide 15 (Closing)
    if (index === sections.length - 1) {
      dotsContainer.classList.add('hidden');
    } else {
      dotsContainer.classList.remove('hidden');
    }
  }

  // --- 4. Intersection Observer for Scroll Snapping ---
  const slideObserverOptions = {
    root: container,
    threshold: 0.5, // Trigger when section is 50% visible
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeIdx = sections.indexOf(entry.target);
        
        // Avoid setting class repeatedly if already active
        if (!entry.target.classList.contains('active-slide')) {
          sections.forEach(s => s.classList.remove('active-slide'));
          entry.target.classList.add('active-slide');
          
          currentSectionIndex = activeIdx;
          updateNavigationElements(activeIdx);
          triggerCountUps(activeIdx);
        }
      }
    });
  }, slideObserverOptions);

  sections.forEach(section => slideObserver.observe(section));

  // --- 5. Presenter Keyboard Triggers ---
  window.addEventListener('keydown', (e) => {
    // Block double triggers during smooth transition
    if (isScrolling) return;

    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
      if (currentSectionIndex < sections.length - 1) {
        e.preventDefault();
        scrollToSection(currentSectionIndex + 1);
      }
    } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
      if (currentSectionIndex > 0) {
        e.preventDefault();
        scrollToSection(currentSectionIndex - 1);
      }
    }
  });

  // --- 6. Number Count-up Animation Engine ---
  function animateCountUp(element, start, end, duration, decimals = 0, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = start + easeProgress * (end - start);
      
      element.textContent = currentValue.toFixed(decimals) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  // Trigger counters on active states
  function triggerCountUps(index) {
    // Section 8: Prevalence estimate (23.91 million)
    if (index === 7) {
      const element = document.getElementById('stat-prevalence');
      if (element && !element.classList.contains('counted')) {
        element.classList.add('counted');
        animateCountUp(element, 0.00, 23.91, 1500, 2, ' million');
      }
    }
    
    // Section 12: External validation results (0.583 and 0.557)
    if (index === 11) {
      const temporalVal = document.getElementById('stat-temporal');
      const populationVal = document.getElementById('stat-population');
      
      if (temporalVal && !temporalVal.classList.contains('counted')) {
        temporalVal.classList.add('counted');
        animateCountUp(temporalVal, 0.000, 0.583, 1400, 3, '');
      }
      
      if (populationVal && !populationVal.classList.contains('counted')) {
        populationVal.classList.add('counted');
        animateCountUp(populationVal, 0.000, 0.557, 1400, 3, '');
      }
    }
  }

  // Initialize view markers
  updateNavigationElements(0);
});
