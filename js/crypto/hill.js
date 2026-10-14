/**
 * Hill Cipher Implementation & Educational Modular Linear Algebra Engine
 * Supports 2x2 and 3x3 key matrices over Z_26 (Alphabet A=0..Z=25)
 * Requirements:
 * - Determinant calculation
 * - Modular multiplicative inverse in Z_26: gcd(det, 26) must be 1
 * - Adjugate matrix computation for matrix inversion
 * - Step-by-step vector matrix multiplication display
 */

const HillCipher = {
  /**
   * Computes Greatest Common Divisor
   */
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  },

  /**
   * Extended Euclidean Algorithm for modular multiplicative inverse modulo 26
   * @param {number} a 
   * @param {number} m (default 26)
   * @returns {number|null} inverse if exists, else null
   */
  modInverse(a, m = 26) {
    a = ((a % m) + m) % m;
    if (this.gcd(a, m) !== 1) return null;

    let [m0, y, x] = [m, 0, 1];
    while (a > 1) {
      const q = Math.floor(a / m0);
      let t = m0;
      m0 = a % m0;
      a = t;
      t = y;
      y = x - q * y;
      x = t;
    }
    return (x < 0) ? x + m : x;
  },

  /**
   * Determinant of 2x2 matrix
   */
  det2x2(m) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  },

  /**
   * Determinant of 3x3 matrix
   */
  det3x3(m) {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  },

  /**
   * Calculates matrix determinant
   */
  determinant(matrix) {
    const size = matrix.length;
    if (size === 2) return this.det2x2(matrix);
    if (size === 3) return this.det3x3(matrix);
    throw new Error('Unsupported matrix size. Only 2x2 and 3x3 are supported.');
  },

  /**
   * Computes the inverse matrix modulo 26
   */
  invertMatrix(matrix) {
    const size = matrix.length;
    const rawDet = this.determinant(matrix);
    const modDet = ((rawDet % 26) + 26) % 26;
    const invDet = this.modInverse(modDet, 26);

    if (invDet === null) {
      return {
        success: false,
        det: rawDet,
        modDet,
        error: `Matrix determinant (${modDet} mod 26) has gcd(${modDet}, 26) = ${this.gcd(modDet, 26)} != 1. Modular inverse does NOT exist in Z_26, so this key matrix cannot be used for decryption.`
      };
    }

    let invMatrix = [];

    if (size === 2) {
      // 2x2 inverse: invDet * [ [d, -b], [-c, a] ] mod 26
      const a = matrix[0][0], b = matrix[0][1];
      const c = matrix[1][0], d = matrix[1][1];

      invMatrix = [
        [((d * invDet) % 26 + 26) % 26, ((-b * invDet) % 26 + 26) % 26],
        [((-c * invDet) % 26 + 26) % 26, ((a * invDet) % 26 + 26) % 26]
      ];
    } else if (size === 3) {
      // 3x3 adjugate matrix
      const adj = [];
      for (let i = 0; i < 3; i++) {
        adj[i] = [];
        for (let j = 0; j < 3; j++) {
          // Submatrix by deleting row j and col i (transposed for adjugate)
          const sub = [];
          for (let r = 0; r < 3; r++) {
            if (r === j) continue;
            const subRow = [];
            for (let c = 0; c < 3; c++) {
              if (c === i) continue;
              subRow.push(matrix[r][c]);
            }
            sub.push(subRow);
          }
          const sign = ((i + j) % 2 === 0) ? 1 : -1;
          const cofactor = sign * this.det2x2(sub);
          adj[i][j] = ((cofactor * invDet) % 26 + 26) % 26;
        }
      }
      invMatrix = adj;
    }

    return {
      success: true,
      det: rawDet,
      modDet,
      invDet,
      invMatrix
    };
  },

  /**
   * Encrypts plaintext using Hill Cipher
   * @param {string} text 
   * @param {Array<Array<number>>} matrix 
   * @returns {Object}
   */
  encrypt(text, matrix) {
    const size = matrix.length;
    const rawDet = this.determinant(matrix);
    const modDet = ((rawDet % 26) + 26) % 26;
    const invDet = this.modInverse(modDet, 26);

    const isInvertible = invDet !== null;

    // Clean text: only A-Z
    let cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
    const remainder = cleaned.length % size;
    let padCount = 0;
    if (remainder !== 0) {
      padCount = size - remainder;
      cleaned += 'X'.repeat(padCount);
    }

    let result = '';
    const steps = [];

    for (let i = 0; i < cleaned.length; i += size) {
      const blockChars = cleaned.slice(i, i + size).split('');
      const pVector = blockChars.map(ch => ch.charCodeAt(0) - 65);
      const cVector = [];
      const calcs = [];

      for (let r = 0; r < size; r++) {
        let sum = 0;
        const terms = [];
        for (let c = 0; c < size; c++) {
          const prod = matrix[r][c] * pVector[c];
          sum += prod;
          terms.push(`(${matrix[r][c]} * ${pVector[c]})`);
        }
        const modVal = ((sum % 26) + 26) % 26;
        cVector.push(modVal);
        calcs.push({
          row: r,
          formula: `${terms.join(' + ')} = ${sum} = ${modVal} (mod 26)`,
          char: String.fromCharCode(modVal + 65)
        });
      }

      const outChars = cVector.map(v => String.fromCharCode(v + 65)).join('');
      result += outChars;

      steps.push({
        blockIndex: Math.floor(i / size) + 1,
        inChars: blockChars.join(''),
        pVector,
        cVector,
        calcs,
        outChars
      });
    }

    return {
      result,
      steps,
      cleaned,
      padCount,
      matrix,
      det: rawDet,
      modDet,
      isInvertible,
      invDet
    };
  },

  /**
   * Decrypts ciphertext using Hill Cipher
   * @param {string} text 
   * @param {Array<Array<number>>} matrix 
   * @returns {Object}
   */
  decrypt(text, matrix) {
    const invResult = this.invertMatrix(matrix);
    if (!invResult.success) {
      return {
        error: invResult.error,
        det: invResult.det,
        modDet: invResult.modDet
      };
    }

    const invMatrix = invResult.invMatrix;
    const size = matrix.length;

    let cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
    const remainder = cleaned.length % size;
    if (remainder !== 0) {
      cleaned += 'X'.repeat(size - remainder);
    }

    let result = '';
    const steps = [];

    for (let i = 0; i < cleaned.length; i += size) {
      const blockChars = cleaned.slice(i, i + size).split('');
      const cVector = blockChars.map(ch => ch.charCodeAt(0) - 65);
      const pVector = [];
      const calcs = [];

      for (let r = 0; r < size; r++) {
        let sum = 0;
        const terms = [];
        for (let c = 0; c < size; c++) {
          const prod = invMatrix[r][c] * cVector[c];
          sum += prod;
          terms.push(`(${invMatrix[r][c]} * ${cVector[c]})`);
        }
        const modVal = ((sum % 26) + 26) % 26;
        pVector.push(modVal);
        calcs.push({
          row: r,
          formula: `${terms.join(' + ')} = ${sum} = ${modVal} (mod 26)`,
          char: String.fromCharCode(modVal + 65)
        });
      }

      const outChars = pVector.map(v => String.fromCharCode(v + 65)).join('');
      result += outChars;

      steps.push({
        blockIndex: Math.floor(i / size) + 1,
        inChars: blockChars.join(''),
        cVector,
        pVector,
        calcs,
        outChars
      });
    }

    return {
      result,
      steps,
      matrix,
      invMatrix,
      det: invResult.det,
      modDet: invResult.modDet,
      invDet: invResult.invDet
    };
  }
};

if (typeof window !== 'undefined') {
  window.HillCipher = HillCipher;
}
