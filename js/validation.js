/**
 * Principles of Cryptography Virtual Lab - Validation Utilities
 */

const Validation = {
  /**
   * Validates if a string contains only letters A-Z (case insensitive)
   */
  isAlphabetic(str) {
    if (!str || typeof str !== 'string') return false;
    return /^[a-zA-Z\s]+$/.test(str);
  },

  /**
   * Validates if a string is a valid hex string of expected length
   */
  isValidHex(hexStr, expectedLength = null) {
    if (!hexStr || typeof hexStr !== 'string') return false;
    const clean = hexStr.replace(/[^0-9A-Fa-f]/g, '');
    if (clean.length === 0) return false;
    if (expectedLength && clean.length !== expectedLength) return false;
    return /^[0-9A-Fa-f]+$/.test(clean);
  },

  /**
   * Validates numeric range [min, max]
   */
  isInRange(val, min, max) {
    if (val === null || val === undefined || val === '') return false;
    const num = Number(val);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Displays an inline alert message inside a container
   */
  showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <svg class="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="alert-content">
          <div class="alert-title">Input Validation Error</div>
          <div>${message}</div>
        </div>
      </div>
    `;
    container.style.display = 'block';
  },

  /**
   * Clears the alert message container
   */
  clearError(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    container.style.display = 'none';
  }
};

if (typeof window !== 'undefined') {
  window.Validation = Validation;
}
