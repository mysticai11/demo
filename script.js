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

    // Show/hide back to top button after scrolling past hero section
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

    // Trigger prevalence percentage count-up
    const prevalencePct = document.getElementById('stat-prev-pct');
    if (prevalencePct) {
      animateCountUp(prevalencePct, 0.00, 29.89, 2000, 2);
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

    // Add visible class to charts and subgroup calibration inside results section
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

  // --- 4. Technical Details Panel Toggling ---
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

  // --- 5. FAQ Accordion Expand/Collapse ---
  const faqCards = document.querySelectorAll('.faq-card');
  window.toggleFaq = function(index) {
    const card = faqCards[index];
    const isOpen = card.classList.contains('open');
    
    // Close other open FAQ cards
    faqCards.forEach(c => {
      c.classList.remove('open');
      c.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!isOpen) {
      card.classList.add('open');
      const answer = card.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  };

  // Bind click handlers to FAQ headers
  document.querySelectorAll('.faq-question').forEach((elem, index) => {
    elem.addEventListener('click', () => {
      toggleFaq(index);
    });
  });

  // --- 6. Live Interactive Demo Widget Logic ---
  // Mapped to 640x400 map viewBox:
  // z1 linear mapping from [-3.5, 3.5] to [60, 580]
  // z2 linear mapping from [-3.5, 3.5] to [350, 50] (inverted)
  const profiles = {
    healthy: {
      name: 'Healthy',
      desc: 'Metabolically healthy normal-weight profile — all biomarkers within baseline limits.',
      color: 'var(--healthy)',
      score: 1.4,
      liverFat: 210,
      risk: 8,
      x: 216,
      y: 256,
      hasPath: false
    },
    ir: {
      name: 'IR-dominant',
      desc: 'Insulin-resistance dominant metabolic risk — elevated fasting insulin.',
      color: 'var(--ir-risk)',
      score: 3.6,
      liverFat: 228,
      risk: 54,
      x: 439,
      y: 226,
      hasPath: true,
      waypoint: 'Fasting insulin lower',
      bowOffset: 40
    },
    steatosis: {
      name: 'Steatosis-dominant',
      desc: 'Hepatic steatosis dominant metabolic risk — elevated triglycerides.',
      color: 'var(--liver-risk)',
      score: 1.6,
      liverFat: 268,
      risk: 58,
      x: 275,
      y: 127,
      hasPath: true,
      waypoint: 'Triglycerides lower',
      bowOffset: -40
    },
    dual: {
      name: 'Dual-burden',
      desc: 'Dual-burden insulin resistance and steatosis risk — concurrent elevations across both axes.',
      color: 'var(--dual-risk)',
      score: 3.3,
      liverFat: 286,
      risk: 82,
      x: 446,
      y: 123,
      hasPath: true,
      waypoint: 'Triglycerides lower',
      bowOffset: 50
    }
  };

  // Generate illustrative population density dots on the map
  const scatterGroup = document.getElementById('population-scatter');
  if (scatterGroup) {
    const numDots = 55;
    for (let i = 0; i < numDots; i++) {
      let x, y;
      if (Math.random() < 0.65) {
        // Clustered towards the healthy zone (bottom-left, center around 216, 256)
        x = 216 + (Math.random() - 0.5) * 160;
        y = 256 + (Math.random() - 0.5) * 100;
      } else {
        // Spread thin over the whole map
        x = 40 + Math.random() * 560;
        y = 50 + Math.random() * 300;
      }
      // Constrain coordinates within bounds
      x = Math.max(50, Math.min(590, x));
      y = Math.max(60, Math.min(340, y));

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('r', (Math.random() * 1.5 + 1.5).toFixed(1));
      circle.setAttribute('fill', 'var(--muted)');
      circle.setAttribute('opacity', (Math.random() * 0.15 + 0.15).toFixed(2));
      scatterGroup.appendChild(circle);
    }
  }

  // Bezier trajectory mathematics (quadratic Bezier path and its midpoint)
  function getBezierPath(startX, startY, endX, endY, offsetVal) {
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { path: '', midX, midY };
    
    const px = -dy / len;
    const py = dx / len;
    
    // Offset control point to bow outward
    const controlX = midX + px * offsetVal;
    const controlY = midY + py * offsetVal;
    
    // B(0.5) on quadratic Bezier is (P0 + 2*P1 + P2)/4
    const curveMidX = (startX + 2 * controlX + endX) / 4;
    const curveMidY = (startY + 2 * controlY + endY) / 4;
    
    return {
      path: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
      midX: curveMidX,
      midY: curveMidY
    };
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
    banner.style.color = profile.color;
    banner.textContent = `${profile.name} — ${profile.desc}`;

    // 2. Animate Map Pin
    const pinGroup = document.getElementById('demo-pin-group');
    pinGroup.style.opacity = '1';
    pinGroup.setAttribute('transform', `translate(${profile.x}, ${profile.y})`);
    pinGroup.style.color = profile.color;

    // 3. Update Metric Cards (animated count-up/down)
    const scoreVal = document.getElementById('readout-score');
    const liverFatVal = document.getElementById('readout-liverfat');
    const riskVal = document.getElementById('readout-risk');

    const currentScore = parseFloat(scoreVal.textContent) || 0.0;
    const currentLiverFat = parseInt(liverFatVal.textContent) || 0;
    const currentRisk = parseInt(riskVal.textContent) || 0;

    animateCountUp(scoreVal, currentScore, profile.score, 600, 1);
    animateCountUp(liverFatVal, currentLiverFat, profile.liverFat, 600, 0, '', ' mg/dL');
    animateCountUp(riskVal, currentRisk, profile.risk, 600, 0, '', '%');

    // 4. Handle Trajectory Route Drawing & Safe Zone Visibility
    const routePath = document.getElementById('demo-route-line');
    const safeZone = document.getElementById('demo-safe-zone');
    const waypointGroup = document.getElementById('demo-waypoint-group');

    // Reset waypoint container
    waypointGroup.innerHTML = '';
    waypointGroup.style.opacity = '0';

    if (profile.hasPath) {
      // Show safe zone marker
      safeZone.style.opacity = '1';

      // Compute curved route to safe zone (216, 256)
      const pathInfo = getBezierPath(profile.x, profile.y, 216, 256, profile.bowOffset);
      
      routePath.setAttribute('d', pathInfo.path);
      routePath.style.stroke = 'var(--healthy)';
      routePath.classList.add('visible');

      // Create waypoint dot
      const wCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      wCircle.setAttribute('cx', pathInfo.midX);
      wCircle.setAttribute('cy', pathInfo.midY);
      wCircle.setAttribute('r', '5');
      wCircle.setAttribute('fill', 'var(--text)');
      wCircle.setAttribute('stroke', 'var(--healthy)');
      wCircle.setAttribute('stroke-width', '2');
      
      // Create waypoint label text
      const wText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      wText.setAttribute('x', pathInfo.midX + 12);
      wText.setAttribute('y', pathInfo.midY + 4);
      wText.setAttribute('fill', 'var(--text)');
      wText.setAttribute('font-size', '11');
      wText.setAttribute('font-family', "'Inter', sans-serif");
      wText.setAttribute('font-weight', '600');
      wText.textContent = profile.waypoint;

      waypointGroup.appendChild(wCircle);
      waypointGroup.appendChild(wText);

      // Fade in waypoint after a tiny delay
      setTimeout(() => {
        waypointGroup.style.transition = 'opacity 0.5s ease';
        waypointGroup.style.opacity = '1';
      }, 400);

    } else {
      // Hide route path & safe zone
      routePath.classList.remove('visible');
      routePath.setAttribute('d', '');
      safeZone.style.opacity = '0';
    }
  };
});
