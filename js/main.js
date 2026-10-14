/**
 * Principles of Cryptography Virtual Lab - Main Controller
 * Global configuration, experiment registry, instant search modal, clipboard utils, and toast notifications.
 */

const SiteConfig = {
  labName: "Principles of Cryptography Virtual Lab",
  subtitle: "Interactive Experiments in Classical and Modern Cryptography",
  institution: "[Department / College Name]",
  department: "Department of Computer Science and Engineering",
  course: "Principles of Cryptography (CSE 401 / CS 352)",
  semester: "[Semester / Academic Year]",
  coordinator: "[Faculty Coordinator Name]",
  contactEmail: "crypto.vlab@cse.institution.edu",
  version: "2.4.0 (Academic Edition)"
};

// Full Experiment Directory Registry
const ExperimentsDirectory = [
  {
    id: "exp-1",
    number: "Experiment 01",
    title: "Classical Cipher Techniques",
    slug: "classical-ciphers.html",
    category: "Classical Cryptography",
    description: "Study substitution mechanics through the Caesar shift cipher, Playfair 5x5 keyword matrix, and Hill linear algebra modular matrix multiplication.",
    algorithms: ["Caesar Cipher", "Playfair Cipher", "Hill Cipher"],
    keywords: ["caesar", "playfair", "hill", "substitution", "matrix", "modulo 26", "digraph", "determinant", "affine"]
  },
  {
    id: "exp-2",
    number: "Experiment 02",
    title: "Transposition Techniques",
    slug: "transposition.html",
    category: "Classical Cryptography",
    description: "Explore permutation-based ciphers comparing Row-Major zigzag wave propagation and Column-Major rectangular grid transposition.",
    algorithms: ["Rail Fence: Row-Major", "Rail Fence: Column-Major"],
    keywords: ["rail fence", "transposition", "zigzag", "column-major", "row-major", "permutation", "grid", "anagram"]
  },
  {
    id: "exp-3",
    number: "Experiment 03",
    title: "Data Encryption Standard (DES)",
    slug: "des.html",
    category: "Symmetric Encryption",
    description: "Deconstruct the 64-bit Feistel network, 16 round transformations, 48-bit subkey schedules, 8 non-linear S-boxes, and examine why 56-bit keys are obsolete.",
    algorithms: ["DES", "Feistel Network", "S-Boxes", "Key Schedule"],
    keywords: ["des", "feistel", "sbox", "expansion", "permutation", "56-bit", "round key", "legacy", "fips 46"]
  },
  {
    id: "exp-4",
    number: "Experiment 04",
    title: "Advanced Encryption Standard (AES)",
    slug: "aes.html",
    category: "Symmetric Encryption",
    description: "Analyze the 128-bit block state matrix, SubBytes, ShiftRows, MixColumns, AddRoundKey, and execute modern AES-GCM authenticated encryption.",
    algorithms: ["AES-128", "AES-192", "AES-256", "AES-GCM", "SubBytes", "MixColumns"],
    keywords: ["aes", "rijndael", "subbytes", "shiftrows", "mixcolumns", "addroundkey", "gcm", "nonce", "aead", "fips 197"]
  },
  {
    id: "exp-5",
    number: "Experiment 05",
    title: "RSA Public-Key Encryption",
    slug: "rsa.html",
    category: "Asymmetric Cryptography",
    description: "Demonstrate asymmetric public-key cryptography via prime generation, Euler's totient phi(n), modular inverse keys, and practical 2048-bit RSA-OAEP.",
    algorithms: ["Textbook RSA", "RSA-OAEP", "Modular Exponentiation", "Totient"],
    keywords: ["rsa", "public key", "private key", "primes", "totient", "modular exponentiation", "oaep", "factorization"]
  },
  {
    id: "exp-6",
    number: "Experiment 06",
    title: "Diffie–Hellman Key Exchange",
    slug: "diffie-hellman.html",
    category: "Asymmetric Cryptography",
    description: "Simulate two-party symmetric secret agreement between Alice and Bob over an insecure channel, and demonstrate Man-in-the-Middle eavesdropping.",
    algorithms: ["Diffie-Hellman", "Discrete Logarithm", "Alice & Bob Exchange", "MitM Simulation"],
    keywords: ["diffie-hellman", "key exchange", "alice", "bob", "eve", "mitm", "generator", "discrete log"]
  },
  {
    id: "exp-7",
    number: "Experiment 07",
    title: "SHA-1 Message Digest",
    slug: "sha1.html",
    category: "Hashing & Integrity",
    description: "Calculate 160-bit cryptographic digests, analyze the Avalanche Effect bit sensitivity, and investigate the historical SHAttered collision vulnerabilities.",
    algorithms: ["SHA-1", "Merkle-Damgård", "Avalanche Effect"],
    keywords: ["sha1", "hash", "digest", "160-bit", "avalanche", "collision", "shattered", "integrity"]
  },
  {
    id: "exp-8",
    number: "Experiment 08",
    title: "MD5 Message Digest",
    slug: "md5.html",
    category: "Hashing & Integrity",
    description: "Study RFC 1321 128-bit hashing across 64 compression steps, inspect bitwise non-linear functions, and observe why MD5 is unsafe for collision security.",
    algorithms: ["MD5", "RFC 1321", "Avalanche Comparison"],
    keywords: ["md5", "hash", "rfc 1321", "128-bit", "collision", "wang", "flame", "checksum"]
  },
  {
    id: "exp-9",
    number: "Experiment 09",
    title: "Digital Signature Standard (DSS / DSA)",
    slug: "digital-signature.html",
    category: "Digital Signatures",
    description: "Master historical DSS (DSA) signing and verification mathematics (p, q, g, r, s), test tamper detection, and compare with modern ECDSA.",
    algorithms: ["DSA", "Digital Signature Standard", "ECDSA", "Tamper Verification"],
    keywords: ["dss", "dsa", "digital signature", "fips 186", "ecdsa", "non-repudiation", "tamper", "verification"]
  }
];

const MainApp = {
  init() {
    this.renderSearchModal();
    this.setupKeyboardShortcuts();
    this.populateConfigPlaceholders();
  },

  /**
   * Replaces config placeholders in DOM if marked
   */
  populateConfigPlaceholders() {
    document.querySelectorAll('[data-config]').forEach(el => {
      const key = el.getAttribute('data-config');
      if (SiteConfig[key]) {
        el.textContent = SiteConfig[key];
      }
    });
  },

  /**
   * Injects the global search modal into the document
   */
  renderSearchModal() {
    const isExperimentPage = window.location.pathname.includes('/experiments/');
    const basePath = isExperimentPage ? '' : 'experiments/';

    const modalHtml = `
      <div class="modal-overlay" id="searchModal" role="dialog" aria-modal="true" aria-labelledby="searchModalTitle">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title" id="searchModalTitle">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display: inline; vertical-align: middle; margin-right: 6px;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Search Cryptography Experiments
            </h3>
            <button type="button" class="modal-close-btn" onclick="MainApp.closeSearchModal()" aria-label="Close search">✕</button>
          </div>
          <div class="modal-body" style="padding-bottom: var(--space-4);">
            <div class="form-group" style="margin-bottom: var(--space-3);">
              <input type="text" id="globalSearchInput" class="form-input" placeholder="Search by cipher, algorithm, category, or keyword (e.g. AES, Hill, Diffie)..." autocomplete="off">
            </div>
            <div id="searchResultsList" style="max-height: 380px; overflow-y: auto;">
              <!-- Dynamic results populated here -->
            </div>
          </div>
          <div class="modal-footer">
            <span class="text-light" style="font-size: 0.8rem; margin-right: auto;">Press <kbd>ESC</kbd> to close</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="MainApp.closeSearchModal()">Close</button>
          </div>
        </div>
      </div>
      <div id="toastNotification" class="toast" role="alert" aria-live="polite"></div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterSearchResults(e.target.value, basePath));
    }

    // Close on overlay click
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeSearchModal();
      });
    }
  },

  openSearchModal() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('globalSearchInput');
    if (modal && input) {
      modal.classList.add('open');
      input.value = '';
      const isExperimentPage = window.location.pathname.includes('/experiments/');
      const basePath = isExperimentPage ? '' : 'experiments/';
      this.filterSearchResults('', basePath);
      setTimeout(() => input.focus(), 50);
    }
  },

  closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) modal.classList.remove('open');
  },

  filterSearchResults(query, basePath) {
    const list = document.getElementById('searchResultsList');
    if (!list) return;

    query = query.trim().toLowerCase();
    const matches = ExperimentsDirectory.filter(exp => {
      if (!query) return true;
      return (
        exp.title.toLowerCase().includes(query) ||
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query) ||
        exp.algorithms.some(a => a.toLowerCase().includes(query)) ||
        exp.keywords.some(k => k.toLowerCase().includes(query))
      );
    });

    if (matches.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: var(--space-8); color: var(--text-light);">
          <p>No experiments matched "<strong>${query}</strong>".</p>
          <p style="font-size: 0.85rem;">Try searching for <em>Caesar, Rail Fence, DES, AES, RSA, Diffie, SHA-1, MD5,</em> or <em>Signature</em>.</p>
        </div>
      `;
      return;
    }

    let html = '';
    matches.forEach(exp => {
      const href = basePath + exp.slug;
      html += `
        <a href="${href}" class="card card-interactive" style="display: block; text-decoration: none; padding: var(--space-3) var(--space-4); margin-bottom: var(--space-2); border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: 700; color: var(--primary-700); font-size: 0.95rem;">${exp.title}</span>
            <span class="badge badge-primary">${exp.number}</span>
          </div>
          <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 6px;">${exp.description.slice(0, 110)}...</p>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${exp.algorithms.map(alg => `<span class="badge badge-neutral" style="font-size: 0.7rem;">${alg}</span>`).join('')}
          </div>
        </a>
      `;
    });

    list.innerHTML = html;
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Toggle search on '/' or Ctrl+K / Cmd+K
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
          (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === 'Escape') {
        this.closeSearchModal();
      }
    });
  },

  /**
   * Toast notification helper
   */
  showToast(message, duration = 3000) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.innerHTML = `
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },

  /**
   * Copies element content or raw text to system clipboard
   */
  copyToClipboard(textOrElementId) {
    let textToCopy = textOrElementId;
    const el = document.getElementById(textOrElementId);
    if (el) {
      textToCopy = el.value !== undefined ? el.value : el.innerText;
    }

    if (!textToCopy) {
      this.showToast('Nothing to copy!');
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => this.showToast('Copied to clipboard!'))
        .catch(() => this.fallbackCopy(textToCopy));
    } else {
      this.fallbackCopy(textToCopy);
    }
  },

  fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      this.showToast('Copied to clipboard!');
    } catch (e) {
      this.showToast('Unable to copy.');
    }
    document.body.removeChild(tempInput);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MainApp.init();
});

if (typeof window !== 'undefined') {
  window.SiteConfig = SiteConfig;
  window.ExperimentsDirectory = ExperimentsDirectory;
  window.MainApp = MainApp;
}
