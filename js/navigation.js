/**
 * Principles of Cryptography Virtual Lab - Navigation & Tab Management
 */

const Navigation = {
  init() {
    this.setupMobileMenu();
    this.setupExperimentTabs();
    this.setupSubExperimentTabs();
    this.setupBreadcrumbs();
  },

  /**
   * Mobile menu toggle handler
   */
  setupMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (toggleBtn && mainNav) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
        toggleBtn.innerHTML = isOpen
          ? `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
          : `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !toggleBtn.contains(e.target) && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.innerHTML = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        }
      });
    }
  },

  /**
   * Experiment tabs (Aim, Theory, Procedure, Pretest, Demo, Practice, Posttest, References)
   */
  setupExperimentTabs() {
    const tabButtons = document.querySelectorAll('.exp-tab-btn');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Check URL hash for initial tab
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['aim', 'theory', 'procedure', 'pretest', 'demo', 'practice', 'posttest', 'references'];
    if (hash && validTabs.includes(hash)) {
      this.switchTab(hash, false);
    }
  },

  /**
   * Switches the active experiment tab
   */
  switchTab(tabId, updateHash = true) {
    const tabButtons = document.querySelectorAll('.exp-tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    let found = false;
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        found = true;
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (found && updateHash) {
      history.replaceState(null, null, `#${tabId}`);
    }

    // Scroll slightly if user clicked tab far below
    const tabNav = document.querySelector('.experiment-tabs-nav');
    if (tabNav && window.scrollY > tabNav.offsetTop + 100) {
      tabNav.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Sub-experiment switcher (e.g. Caesar, Playfair, Hill)
   */
  setupSubExperimentTabs() {
    const subButtons = document.querySelectorAll('.sub-exp-btn');
    if (!subButtons.length) return;

    subButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSub = btn.getAttribute('data-sub');
        const container = btn.closest('.sub-exp-wrapper') || document;

        // Toggle buttons
        container.querySelectorAll('.sub-exp-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle sub panels
        container.querySelectorAll('.sub-exp-panel').forEach(panel => {
          if (panel.id === `sub-${targetSub}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  },

  /**
   * Breadcrumbs active state helper
   */
  setupBreadcrumbs() {
    // Current path highlighting on desktop main-nav
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath && (linkPath === currentPath || linkPath.endsWith(currentPath))) {
        link.classList.add('active');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
});

if (typeof window !== 'undefined') {
  window.Navigation = Navigation;
}
