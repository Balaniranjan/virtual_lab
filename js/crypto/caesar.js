/**
 * Caesar Cipher Implementation & Educational Visualization Helper
 * Mathematical foundation: C = (P + k) mod 26
 * Decryption: P = (C - k + 26) mod 26
 */

const CaesarCipher = {
  /**
   * Encrypts plaintext using Caesar shift
   * @param {string} text - Input plaintext
   * @param {number} shift - Numeric shift key (0-25)
   * @returns {Object} { result: string, steps: Array }
   */
  encrypt(text, shift) {
    const k = ((Number(shift) % 26) + 26) % 26;
    let result = '';
    const steps = [];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const code = ch.charCodeAt(0);

      // Uppercase letters A-Z (65-90)
      if (code >= 65 && code <= 90) {
        const p = code - 65;
        const c = (p + k) % 26;
        const encChar = String.fromCharCode(c + 65);
        result += encChar;
        steps.push({
          index: i,
          char: ch,
          pVal: p,
          formula: `(${p} + ${k}) mod 26 = ${c}`,
          cVal: c,
          outChar: encChar,
          isLetter: true
        });
      }
      // Lowercase letters a-z (97-122)
      else if (code >= 97 && code <= 122) {
        const p = code - 97;
        const c = (p + k) % 26;
        const encChar = String.fromCharCode(c + 97);
        result += encChar;
        steps.push({
          index: i,
          char: ch,
          pVal: p,
          formula: `(${p} + ${k}) mod 26 = ${c}`,
          cVal: c,
          outChar: encChar,
          isLetter: true
        });
      }
      // Non-alphabetic characters are preserved
      else {
        result += ch;
        steps.push({
          index: i,
          char: ch,
          pVal: null,
          formula: 'Preserved (non-alphabetic)',
          cVal: null,
          outChar: ch,
          isLetter: false
        });
      }
    }

    return { result, steps, shift: k };
  },

  /**
   * Decrypts ciphertext using Caesar shift
   * @param {string} text - Input ciphertext
   * @param {number} shift - Numeric shift key (0-25)
   * @returns {Object} { result: string, steps: Array }
   */
  decrypt(text, shift) {
    const k = ((Number(shift) % 26) + 26) % 26;
    let result = '';
    const steps = [];

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const code = ch.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        const c = code - 65;
        const p = (c - k + 26) % 26;
        const decChar = String.fromCharCode(p + 65);
        result += decChar;
        steps.push({
          index: i,
          char: ch,
          cVal: c,
          formula: `(${c} - ${k} + 26) mod 26 = ${p}`,
          pVal: p,
          outChar: decChar,
          isLetter: true
        });
      } else if (code >= 97 && code <= 122) {
        const c = code - 97;
        const p = (c - k + 26) % 26;
        const decChar = String.fromCharCode(p + 97);
        result += decChar;
        steps.push({
          index: i,
          char: ch,
          cVal: c,
          formula: `(${c} - ${k} + 26) mod 26 = ${p}`,
          pVal: p,
          outChar: decChar,
          isLetter: true
        });
      } else {
        result += ch;
        steps.push({
          index: i,
          char: ch,
          cVal: null,
          formula: 'Preserved (non-alphabetic)',
          pVal: null,
          outChar: ch,
          isLetter: false
        });
      }
    }

    return { result, steps, shift: k };
  },

  /**
   * Generates the 26-letter shifted alphabet mapping for visualization
   * @param {number} shift 
   * @returns {Array} [{ plain: 'A', cipher: 'D' }, ...]
   */
  getAlphabetMapping(shift) {
    const k = ((Number(shift) % 26) + 26) % 26;
    const mapping = [];
    for (let i = 0; i < 26; i++) {
      const plain = String.fromCharCode(65 + i);
      const cipher = String.fromCharCode(65 + ((i + k) % 26));
      mapping.push({ index: i, plain, cipher });
    }
    return mapping;
  }
};

// Export to window
if (typeof window !== 'undefined') {
  window.CaesarCipher = CaesarCipher;
}
