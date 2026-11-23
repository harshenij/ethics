/**
 * ETHICAL MED-AI: Main Application Controller
 * Handles Navigation, Theme Engine, Workflow Interactive Stepper,
 * Matrix Tabs, Animated Statistics, Hero Canvas, and UI Micro-interactions.
 */

(function () {
  'use strict';

  function initApp() {
    /* --------------------------------------------------------------------------
       1. Theme Engine (Dark / Light Mode)
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function getSavedTheme() {
      try {
        return localStorage.getItem('medai-theme') || 'dark';
      } catch (e) {
        return 'dark';
      }
    }

    function setSavedTheme(theme) {
      try {
        localStorage.setItem('medai-theme', theme);
      } catch (e) {
        // Ignored if storage restricted
      }
    }

    function updateThemeIcon(theme) {
      if (!themeIcon) return;
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
        if (themeToggleBtn) {
          themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
        }
      } else {
        themeIcon.className = 'fa-solid fa-sun';
        if (themeToggleBtn) {
          themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
          themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
        }
      }
    }

    const initialTheme = getSavedTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        setSavedTheme(newTheme);
        updateThemeIcon(newTheme);
        window.dispatchEvent(new Event('themeChanged'));
      });
    }

    /* --------------------------------------------------------------------------
       2. Scroll Progress Bar & Back to Top Button
       -------------------------------------------------------------------------- */
    const scrollProgressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    function handleScroll() {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0 && scrollProgressBar) {
        const scrolled = (winScroll / height) * 100;
        scrollProgressBar.style.width = scrolled + '%';
      }

      if (backToTopBtn) {
        if (winScroll > 450) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    /* --------------------------------------------------------------------------
       3. Mobile Navigation Drawer
       -------------------------------------------------------------------------- */
    const mobileToggleBtn = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggleBtn && navMenu) {
      mobileToggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        mobileToggleBtn.innerHTML = isOpen
          ? '<i class="fa-solid fa-xmark"></i>'
          : '<i class="fa-solid fa-bars"></i>';
        mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      });

      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            mobileToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            mobileToggleBtn.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    /* --------------------------------------------------------------------------
       4. Active Navigation Highlighting on Scroll
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
      const scrollY = window.pageYOffset + 120;

      sections.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop;
        const sectionId = current.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (correspondingLink) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            correspondingLink.classList.add('active');
          } else {
            correspondingLink.classList.remove('active');
          }
        }
      });
    }

    window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

    /* --------------------------------------------------------------------------
       5. Animated Statistics Counters
       -------------------------------------------------------------------------- */
    const statsElements = [
      { id: 'stat-hic', target: 81.4, decimals: 1, prefix: '', suffix: '%' },
      { id: 'stat-lmic', target: 2.8, decimals: 1, prefix: '<', suffix: '%' },
      { id: 'stat-gap', target: 4.8, decimals: 1, prefix: '', suffix: 'x' },
      { id: 'stat-parity', target: 99.2, decimals: 1, prefix: '', suffix: '%' }
    ];

    let statsAnimated = false;

    function animateStats() {
      if (statsAnimated) return;

      statsElements.forEach((item) => {
        const el = document.getElementById(item.id);
        if (!el) return;

        let current = 0;
        const duration = 1800;
        const steps = 50;
        const increment = item.target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= item.target) {
            current = item.target;
            clearInterval(timer);
          }
          el.textContent = `${item.prefix}${current.toFixed(item.decimals)}${item.suffix}`;
        }, stepTime);
      });

      statsAnimated = true;
    }

    const statsContainer = document.querySelector('.hero-stats-grid');
    if (statsContainer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateStats();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(statsContainer);
    } else {
      animateStats();
    }

    /* --------------------------------------------------------------------------
       6. Interactive Ethical Workflow Stepper
       -------------------------------------------------------------------------- */
    const workflowStepsData = [
      {
        stepNum: 'Step 1 of 6',
        title: 'Global Data Collection & Multi-Center Consortiums',
        desc: 'Form data-sharing alliances across diverse geographical hospitals, ensuring patient cohorts include multiple ethnicities, age brackets, genders, socioeconomic demographics, and geographic regions. Raw datasets are captured using standardized DICOM and HL7 protocols.',
        checkpoints: [
          'Geographic diversity quotas established across at least 3 global regions',
          'Balanced representation across Fitzpatrick Skin Types I through VI',
          'Standardized clinical imaging protocols across disparate hardware vendors'
        ],
        tools: 'Tools: Federated Health Consortia, Open Health Imaging Repositories, DICOM Standardizers'
      },
      {
        stepNum: 'Step 2 of 6',
        title: 'Data Diversity Check & Representational Audit',
        desc: 'Before feeding raw data into machine learning pipelines, conduct quantitative demographic audits to identify data deserts, historical underrepresentation, label imbalances, and missing covariates.',
        checkpoints: [
          'Compute demographic stratification metrics across age, biological sex, and ethnicity',
          'Identify and document historical expenditure or socioeconomic proxy biases',
          'Publish formal Data Sheets for Datasets (DataCards) documenting curation provenance'
        ],
        tools: 'Tools: Google DataCards, IBM AI Fairness 360 (AIF360), Facets Data Visualizer'
      },
      {
        stepNum: 'Step 3 of 6',
        title: 'Fair AI Model Training & Algorithmic Regularization',
        desc: 'Train deep learning architectures with integrated fairness loss penalties rather than pure empirical risk minimization. Use sample reweighting, group fairness constraints, and adversarial debiasing layers to prevent models from learning spurious demographic shortcuts.',
        checkpoints: [
          'Incorporate demographic parity or equalized odds regularization into loss functions',
          'Adversarial debiasing heads preventing internal representation encoding of sensitive attributes',
          'Multi-task learning heads encouraging domain-invariant anatomical feature extraction'
        ],
        tools: 'Tools: Fairlearn, PyTorch Fairness Toolkit, TensorFlow Constrained Optimization (TFCO)'
      },
      {
        stepNum: 'Step 4 of 6',
        title: 'Disaggregated Subgroup Bias Testing',
        desc: 'Evaluate model performance not on aggregate accuracy alone, but disaggregated across intersecting patient cohorts. Calculate False Negative Rate (FNR), False Positive Rate (FPR), and Area Under Curve (AUC) for each demographic stratum.',
        checkpoints: [
          'Verification that subgroup performance disparity gap does not exceed 3%',
          'Equalized Odds verification: equal True Positive and False Positive rates across groups',
          'Stress-testing on out-of-distribution clinical datasets from community hospitals'
        ],
        tools: 'Tools: Aequitas Bias Audit Toolkit, Fairlearn Metrics, Saliency / Grad-CAM Explainability'
      },
      {
        stepNum: 'Step 5 of 6',
        title: 'Ethical Validation & Multidisciplinary Review Board',
        desc: 'Convene an independent oversight committee comprising practicing physicians, bioethicists, machine learning engineers, and patient advocacy representatives to validate clinical utility, fail-safe mechanisms, and patient consent compliance.',
        checkpoints: [
          'Independent Institutional Review Board (IRB) ethical safety sign-off',
          'Model Cards for Model Reporting published with documented operational boundaries',
          'Clear clinical fallback and human-in-the-loop escalation protocols'
        ],
        tools: 'Governance: WHO AI Health Guidelines, IEEE 7000 Ethics Standard, EU AI Act High-Risk Checklist'
      },
      {
        stepNum: 'Step 6 of 6',
        title: 'Fair Medical AI Deployment & Post-Market Surveillance',
        desc: 'Deploy the clinical decision support system into hospital electronic health records with real-time algorithmic telemetry, continuous drift monitoring, and mandatory clinical incident logging.',
        checkpoints: [
          'Real-time automated telemetry monitoring for covariate shift and performance decay',
          'Mandatory clinician override logging and diagnostic discrepancy reporting',
          'Annual multi-center equity audits and retrained model checkpoint validation'
        ],
        tools: 'Tools: Evidently AI, MLflow Algorithmic Drift Watchdog, FDA SaMD Post-Market Protocol'
      }
    ];

    const workflowNodes = document.querySelectorAll('.workflow-node');
    const stepBadge = document.getElementById('workflow-step-badge');
    const stepTitle = document.getElementById('workflow-step-title');
    const stepDesc = document.getElementById('workflow-step-desc');
    const stepCheckpointsList = document.getElementById('workflow-step-checkpoints');
    const stepTools = document.getElementById('workflow-step-tools');

    function renderWorkflowStep(index) {
      const data = workflowStepsData[index];
      if (!data) return;

      workflowNodes.forEach((node, i) => {
        node.classList.toggle('active', i === index);
        node.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      if (stepBadge) stepBadge.textContent = data.stepNum;
      if (stepTitle) stepTitle.textContent = data.title;
      if (stepDesc) stepDesc.textContent = data.desc;

      if (stepCheckpointsList) {
        stepCheckpointsList.innerHTML = '';
        data.checkpoints.forEach((cp) => {
          const li = document.createElement('li');
          li.style.display = 'flex';
          li.style.alignItems = 'flex-start';
          li.style.gap = '0.65rem';
          li.style.marginBottom = '0.5rem';
          li.style.fontSize = '0.92rem';
          li.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--color-emerald); margin-top:0.25rem;"></i> <span>${cp}</span>`;
          stepCheckpointsList.appendChild(li);
        });
      }

      if (stepTools) stepTools.textContent = data.tools;
    }

    workflowNodes.forEach((node, index) => {
      node.addEventListener('click', () => {
        renderWorkflowStep(index);
      });
    });

    renderWorkflowStep(0);

    /* --------------------------------------------------------------------------
       7. Global Challenges Comparison Matrix Filter
       -------------------------------------------------------------------------- */
    const matrixTabs = document.querySelectorAll('.matrix-tab-btn');
    const matrixRows = document.querySelectorAll('.matrix-row');

    if (matrixTabs.length > 0) {
      matrixTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          matrixTabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');

          const category = tab.getAttribute('data-category');

          matrixRows.forEach((row) => {
            if (category === 'all' || row.getAttribute('data-category') === category) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });
        });
      });
    }

    /* --------------------------------------------------------------------------
       8. Hero Canvas Medical Neural Particle Mesh
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const parent = canvas.parentElement;
      let width = (canvas.width = (parent && parent.offsetWidth) ? parent.offsetWidth : window.innerWidth);
      let height = (canvas.height = (parent && parent.offsetHeight) ? parent.offsetHeight : 600);

      const particles = [];
      const particleCount = Math.max(20, Math.min(45, Math.floor(width / 24)));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2.2 + 1.2,
          color: i % 3 === 0 ? 'rgba(6, 182, 212, ' : (i % 3 === 1 ? 'rgba(139, 92, 246, ' : 'rgba(59, 130, 246, ')
        });
      }

      function animateCanvas() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.22;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          }
        }

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '0.75)';
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color + '0.5)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        requestAnimationFrame(animateCanvas);
      }

      animateCanvas();

      window.addEventListener('resize', () => {
        if (canvas && canvas.parentElement) {
          width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
          height = canvas.height = canvas.parentElement.offsetHeight || 600;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
