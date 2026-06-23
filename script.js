/* script.js */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Navigation Active Link Highlights & Back-To-Top ---
  const sections = Array.from(document.querySelectorAll('section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100; // offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Show/hide back to top button after scrolling past hero section (approx 600px)
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  // --- 2. Intersection Observer for Scroll Reveals & Counters ---
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Trigger count-ups if they exist inside this section
        if (entry.target.id === 'results') {
          triggerResultsAnimations();
        }
        
        // Trigger architecture link lines animations
        if (entry.target.id === 'method') {
          triggerArchLines();
        }
      }
    });
  }, observerOptions);

  // Observe all sections and reveal containers
  sections.forEach(sec => observer.observe(sec));
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- 3. Number Count-up Animation Engine ---
  function animateCountUp(element, start, end, duration, decimals = 0, prefix = '', suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentValue = start + easeProgress * (end - start);
      
      element.textContent = prefix + currentValue.toFixed(decimals) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  let resultsAnimated = false;
  function triggerResultsAnimations() {
    if (resultsAnimated) return;
    resultsAnimated = true;

    // Trigger prevalence count-up: 23.91 million
    const prevalenceStat = document.getElementById('stat-prevalence');
    if (prevalenceStat) {
      animateCountUp(prevalenceStat, 0.00, 23.91, 2000, 2, '', ' million');
    }

    // Trigger OOD validation stats
    const temporalStat = document.getElementById('stat-temporal');
    if (temporalStat) {
      animateCountUp(temporalStat, 0.000, 0.583, 1600, 3, 'ρ = ');
    }

    const populationStat = document.getElementById('stat-population');
    if (populationStat) {
      animateCountUp(populationStat, 0.000, 0.557, 1600, 3, 'ρ = ');
    }

    // Add visible class to charts inside results section
    const chartCard = document.querySelector('.results-chart-card');
    if (chartCard) {
      chartCard.classList.add('visible');
    }
    
    const calCard = document.querySelector('.results-subgroup-cal');
    if (calCard) {
      calCard.classList.add('visible');
    }
  }

  function triggerArchLines() {
    const lines = document.querySelectorAll('.link-line');
    lines.forEach(line => {
      line.classList.add('active');
    });
  }

  // --- 4. Section 6 Technical Details Panel Toggling ---
  window.toggleDetails = function() {
    const trigger = document.querySelector('.toggle-trigger');
    const panel = document.querySelector('.expand-panel');
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      trigger.classList.remove('open');
    } else {
      panel.classList.add('open');
      trigger.classList.add('open');
    }
  };

  // --- 5. Section 7 VAE Map Demo Widget Logic ---
  const profiles = {
    healthy: {
      name: 'Metabolically Healthy',
      color: 'var(--healthy)',
      z1: -0.85,
      z2: -0.92,
      x: 115,
      y: 292,
      hasPath: false
    },
    ir: {
      name: 'IR-Dominant',
      color: 'var(--ir-risk)',
      z1: 1.25,
      z2: -0.65,
      x: 325,
      y: 265,
      hasPath: true,
      path: 'M 325 265 C 240 285, 180 300, 80 320',
      safeZoneX: 80,
      safeZoneY: 320,
      waypoint: { x: 230, y: 285, label: '"Triglycerides ↓"' }
    },
    steatosis: {
      name: 'Steatosis-Dominant',
      color: 'var(--liver-risk)',
      z1: -0.55,
      z2: 1.35,
      x: 145,
      y: 65,
      hasPath: true,
      path: 'M 145 65 C 130 170, 110 220, 80 320',
      safeZoneX: 80,
      safeZoneY: 320,
      waypoint: { x: 130, y: 170, label: '"Triglycerides ↓"' }
    },
    dual: {
      name: 'Dual-Burden',
      color: 'var(--dual-risk)',
      z1: 1.45,
      z2: 1.20,
      x: 345,
      y: 80,
      hasPath: true,
      path: 'M 345 80 C 260 160, 180 220, 80 320',
      safeZoneX: 80,
      safeZoneY: 320,
      waypoint: { x: 260, y: 160, label: '"Triglycerides ↓"' }
    }
  };

  // Generate illustrative population density dots
  const scatterGroup = document.getElementById('population-scatter');
  if (scatterGroup) {
    const numDots = 90;
    // Generate dots clustered mostly in the healthy quadrant (bottom-left, around cx=100, cy=300)
    for (let i = 0; i < numDots; i++) {
      let cx, cy;
      // Normal/Gaussian distribution approximation
      const u1 = Math.random();
      const u2 = Math.random();
      const randStd = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      if (Math.random() < 0.70) {
        // Clustered in healthy quadrant
        cx = 100 + randStd * 45;
        cy = 300 + (Math.random() - 0.5) * 80;
      } else {
        // Spread thin over other quadrants
        cx = Math.random() * 360 + 20;
        cy = Math.random() * 360 + 20;
      }

      // Constrain coordinates within SVG bounds
      cx = Math.max(15, Math.min(385, cx));
      cy = Math.max(15, Math.min(385, cy));

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx.toFixed(1));
      circle.setAttribute('cy', cy.toFixed(1));
      circle.setAttribute('r', (Math.random() * 1.5 + 1.5).toFixed(1));
      circle.setAttribute('fill', 'var(--muted)');
      circle.setAttribute('opacity', (Math.random() * 0.15 + 0.15).toFixed(2));
      scatterGroup.appendChild(circle);
    }
  }

  // Handle Demo Patient Selection
  window.selectDemoProfile = function(profileKey, element) {
    // Remove active state from all pills
    document.querySelectorAll('.profile-pill').forEach(pill => {
      pill.classList.remove('active');
    });

    // Set clicked pill active
    element.classList.add('active');

    const profile = profiles[profileKey];
    if (!profile) return;

    // 1. Update Title Banner above map
    const banner = document.getElementById('demo-banner');
    banner.className = 'demo-banner visible';
    banner.textContent = profile.name;
    banner.style.color = profile.color;

    // 2. Animate Map Pin
    const pinGroup = document.getElementById('demo-pin-group');
    pinGroup.setAttribute('transform', `translate(${profile.x}, ${profile.y})`);
    pinGroup.style.color = profile.color;

    // 3. Update Readout coordinates (animated count-up/down)
    const z1Readout = document.getElementById('readout-z1');
    const z2Readout = document.getElementById('readout-z2');
    
    // Read current displayed values
    const currentZ1 = parseFloat(z1Readout.textContent) || 0.00;
    const currentZ2 = parseFloat(z2Readout.textContent) || 0.00;
    
    animateCountUp(z1Readout, currentZ1, profile.z1, 800, 2);
    animateCountUp(z2Readout, currentZ2, profile.z2, 800, 2);

    // Fade in readout panel
    document.getElementById('demo-readout').classList.add('visible');

    // 4. Handle Trajectory Route Drawing & Safe Zone Visibility
    const routePath = document.getElementById('demo-route-line');
    const safeZone = document.getElementById('demo-safe-zone');
    const waypointGroup = document.getElementById('demo-waypoint-group');

    // Reset waypoint container
    waypointGroup.innerHTML = '';
    waypointGroup.style.opacity = '0';

    if (profile.hasPath) {
      // Show safe zone marker
      safeZone.setAttribute('transform', `translate(0, 0)`);
      safeZone.style.opacity = '1';

      // Set path definition
      routePath.setAttribute('d', profile.path);
      routePath.style.stroke = profile.color;
      
      // Compute path length to draw dynamically
      const pathLength = routePath.getTotalLength();
      routePath.style.strokeDasharray = pathLength;
      routePath.style.strokeDashoffset = pathLength;
      
      // Trigger a reflow
      routePath.getBoundingClientRect();
      
      // Draw path line
      routePath.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
      routePath.style.strokeDashoffset = '0';

      // After path draws (~1200ms), reveal waypoints
      setTimeout(() => {
        if (profile.waypoint) {
          // Render waypoint dot
          const wCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          wCircle.setAttribute('cx', profile.waypoint.x);
          wCircle.setAttribute('cy', profile.waypoint.y);
          wCircle.setAttribute('r', '5');
          wCircle.setAttribute('fill', 'var(--text)');
          wCircle.setAttribute('stroke', profile.color);
          wCircle.setAttribute('stroke-width', '2');
          
          // Render waypoint text label
          const wText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          wText.setAttribute('x', profile.waypoint.x + 12);
          wText.setAttribute('y', profile.waypoint.y + 4);
          wText.setAttribute('fill', 'var(--text)');
          wText.setAttribute('font-size', '11');
          wText.setAttribute('font-family', "'Inter', sans-serif");
          wText.setAttribute('font-weight', '500');
          wText.textContent = profile.waypoint.label.replace(/"/g, ''); // strip outer quotes for visual render

          waypointGroup.appendChild(wCircle);
          waypointGroup.appendChild(wText);

          // Fade in waypoint
          waypointGroup.style.transition = 'opacity 0.5s ease';
          waypointGroup.style.opacity = '1';
        }
      }, 1000);

    } else {
      // Hide route path & safe zone
      routePath.style.transition = 'none';
      routePath.style.strokeDashoffset = '400';
      routePath.setAttribute('d', '');
      safeZone.style.opacity = '0';
    }
  };

  // Initially select nothing, or select Metabolically Healthy to show layout active
  // Let's keep it unselected as requested by default
});
