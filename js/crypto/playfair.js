/**
 * Playfair Cipher Implementation & Educational Matrix Visualization
 * Uses standard 5x5 key matrix with I/J combined.
 * Convention:
 * - Duplicate letters in digraph broken by 'X' (or 'Q' if letter is 'X')
 * - Odd-length texts padded with 'X' (or 'Z' if last letter is 'X')
 * - Same row: Shift right (+1) for encrypt, shift left (-1) for decrypt
 * - Same col: Shift down (+1) for encrypt, shift up (-1) for decrypt
 * - Rectangle: Swap columns
 */

const PlayfairCipher = {
  /**
   * Generates a 5x5 matrix from a keyword
   * @param {string} keyword 
   * @returns {Object} { matrix: Array[5][5], keyString: string, posMap: Object }
   */
  generateMatrix(keyword) {
    const cleaned = (keyword || 'KEYWORD')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .replace(/J/g, 'I');

    const seen = new Set();
    const sequence = [];

    // Add unique keyword letters
    for (const char of cleaned) {
      if (!seen.has(char)) {
        seen.add(char);
        sequence.push(char);
      }
    }

    // Add remaining alphabet letters (except J)
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (const char of alphabet) {
      if (!seen.has(char)) {
        seen.add(char);
        sequence.push(char);
      }
    }

    const matrix = [];
    const posMap = {};

    for (let r = 0; r < 5; r++) {
      const row = [];
      for (let c = 0; c < 5; c++) {
        const char = sequence[r * 5 + c];
        row.push(char);
        posMap[char] = { row: r, col: c };
      }
      matrix.push(row);
    }

    // J maps to same coordinates as I
    posMap['J'] = posMap['I'];

    return { matrix, keyString: sequence.join(''), posMap };
  },

  /**
   * Formats plaintext into standard digraphs
   * @param {string} text 
   * @returns {Array<string>} Digraphs array
   */
  preparePlaintextDigraphs(text) {
    const cleaned = text
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .replace(/J/g, 'I');

    const digraphs = [];
    let i = 0;

    while (i < cleaned.length) {
      const first = cleaned[i];
      if (i + 1 >= cleaned.length) {
        // Odd trailing character -> pad with 'X' (or 'Z' if char is X)
        const pad = (first === 'X') ? 'Z' : 'X';
        digraphs.push(first + pad);
        i += 1;
      } else {
        const second = cleaned[i + 1];
        if (first === second) {
          // Repeated character in same digraph -> insert 'X'
          const filler = (first === 'X') ? 'Q' : 'X';
          digraphs.push(first + filler);
          i += 1;
        } else {
          digraphs.push(first + second);
          i += 2;
        }
      }
    }

    return digraphs;
  },

  /**
   * Prepares ciphertext into digraphs (ciphertext must have even length)
   * @param {string} text 
   * @returns {Array<string>}
   */
  prepareCiphertextDigraphs(text) {
    const cleaned = text
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .replace(/J/g, 'I');

    const digraphs = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      if (i + 1 < cleaned.length) {
        digraphs.push(cleaned[i] + cleaned[i + 1]);
      } else {
        digraphs.push(cleaned[i] + 'X');
      }
    }
    return digraphs;
  },

  /**
   * Encrypts plaintext using Playfair
   * @param {string} text 
   * @param {string} keyword 
   * @returns {Object}
   */
  encrypt(text, keyword) {
    const { matrix, posMap } = this.generateMatrix(keyword);
    const digraphs = this.preparePlaintextDigraphs(text);
    const steps = [];
    let result = '';

    for (let idx = 0; idx < digraphs.length; idx++) {
      const [c1, c2] = digraphs[idx].split('');
      const p1 = posMap[c1];
      const p2 = posMap[c2];

      let out1, out2, rule;

      // Rule 1: Same Row -> Shift Right (+1 mod 5)
      if (p1.row === p2.row) {
        rule = 'Same Row (Shift Right)';
        out1 = matrix[p1.row][(p1.col + 1) % 5];
        out2 = matrix[p2.row][(p2.col + 1) % 5];
      }
      // Rule 2: Same Column -> Shift Down (+1 mod 5)
      else if (p1.col === p2.col) {
        rule = 'Same Column (Shift Down)';
        out1 = matrix[(p1.row + 1) % 5][p1.col];
        out2 = matrix[(p2.row + 1) % 5][p2.col];
      }
      // Rule 3: Rectangle -> Swap Columns
      else {
        rule = 'Rectangle (Swap Columns)';
        out1 = matrix[p1.row][p2.col];
        out2 = matrix[p2.row][p1.col];
      }

      const outDigraph = out1 + out2;
      result += outDigraph;

      steps.push({
        step: idx + 1,
        inPair: [c1, c2],
        p1,
        p2,
        rule,
        outPair: [out1, out2],
        outDigraph
      });
    }

    return { result, steps, matrix, digraphs };
  },

  /**
   * Decrypts ciphertext using Playfair
   * @param {string} text 
   * @param {string} keyword 
   * @returns {Object}
   */
  decrypt(text, keyword) {
    const { matrix, posMap } = this.generateMatrix(keyword);
    const digraphs = this.prepareCiphertextDigraphs(text);
    const steps = [];
    let result = '';

    for (let idx = 0; idx < digraphs.length; idx++) {
      const [c1, c2] = digraphs[idx].split('');
      const p1 = posMap[c1];
      const p2 = posMap[c2];

      let out1, out2, rule;

      // Rule 1: Same Row -> Shift Left (-1 mod 5 = +4 mod 5)
      if (p1.row === p2.row) {
        rule = 'Same Row (Shift Left)';
        out1 = matrix[p1.row][(p1.col + 4) % 5];
        out2 = matrix[p2.row][(p2.col + 4) % 5];
      }
      // Rule 2: Same Column -> Shift Up (-1 mod 5 = +4 mod 5)
      else if (p1.col === p2.col) {
        rule = 'Same Column (Shift Up)';
        out1 = matrix[(p1.row + 4) % 5][p1.col];
        out2 = matrix[(p2.row + 4) % 5][p2.col];
      }
      // Rule 3: Rectangle -> Swap Columns
      else {
        rule = 'Rectangle (Swap Columns)';
        out1 = matrix[p1.row][p2.col];
        out2 = matrix[p2.row][p1.col];
      }

      const outDigraph = out1 + out2;
      result += outDigraph;

      steps.push({
        step: idx + 1,
        inPair: [c1, c2],
        p1,
        p2,
        rule,
        outPair: [out1, out2],
        outDigraph
      });
    }

    return { result, steps, matrix, digraphs };
  }
};

if (typeof window !== 'undefined') {
  window.PlayfairCipher = PlayfairCipher;
}
