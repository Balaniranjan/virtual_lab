/**
 * Rail Fence Cipher Implementation: Row-Major (Zigzag) & Column-Major (Grid)
 * Both algorithms feature comprehensive visualization grids and step-by-step reconstructions.
 */

const RailFenceCipher = {
  // ==========================================
  // 1. ROW-MAJOR: Classic Zigzag Rail Fence
  // ==========================================
  
  /**
   * Encrypts plaintext using classic zigzag rail fence
   * @param {string} text 
   * @param {number} rails (>= 2)
   * @returns {Object}
   */
  encryptRowMajor(text, rails) {
    rails = Math.max(2, parseInt(rails, 10) || 3);
    const len = text.length;
    if (len === 0) return { result: '', grid: [], rails };

    // Initialize 2D grid [rails][len]
    const grid = Array.from({ length: rails }, () => Array(len).fill(null));

    let row = 0;
    let down = true;

    // Plot zigzag pattern
    for (let col = 0; col < len; col++) {
      grid[row][col] = text[col];

      if (row === 0) down = true;
      else if (row === rails - 1) down = false;

      row += down ? 1 : -1;
    }

    // Read row-by-row
    let result = '';
    const rowStrings = [];
    for (let r = 0; r < rails; r++) {
      let rStr = '';
      for (let c = 0; c < len; c++) {
        if (grid[r][c] !== null) {
          result += grid[r][c];
          rStr += grid[r][c];
        }
      }
      rowStrings.push(rStr);
    }

    return {
      result,
      grid,
      rails,
      len,
      rowStrings,
      convention: 'Zigzag down-and-up across rails, reading row-by-row from rail 0 to rail N-1.'
    };
  },

  /**
   * Decrypts ciphertext using classic zigzag rail fence
   * @param {string} text 
   * @param {number} rails 
   * @returns {Object}
   */
  decryptRowMajor(text, rails) {
    rails = Math.max(2, parseInt(rails, 10) || 3);
    const len = text.length;
    if (len === 0) return { result: '', grid: [], rails };

    // Mark marker positions in zigzag
    const markerGrid = Array.from({ length: rails }, () => Array(len).fill(false));
    let row = 0;
    let down = true;

    for (let col = 0; col < len; col++) {
      markerGrid[row][col] = true;
      if (row === 0) down = true;
      else if (row === rails - 1) down = false;
      row += down ? 1 : -1;
    }

    // Fill marked positions row-by-row with ciphertext
    const grid = Array.from({ length: rails }, () => Array(len).fill(null));
    let charIdx = 0;

    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < len; c++) {
        if (markerGrid[r][c] && charIdx < len) {
          grid[r][c] = text[charIdx++];
        }
      }
    }

    // Read zigzag pattern to recover original plaintext
    let result = '';
    row = 0;
    down = true;

    for (let col = 0; col < len; col++) {
      if (grid[row][col] !== null) {
        result += grid[row][col];
      }
      if (row === 0) down = true;
      else if (row === rails - 1) down = false;
      row += down ? 1 : -1;
    }

    return {
      result,
      grid,
      rails,
      len,
      convention: 'Reconstruct zigzag markers, fill row-wise from ciphertext, read along wave.'
    };
  },

  // ==========================================
  // 2. COLUMN-MAJOR: Rectangular Grid Transposition
  // ==========================================

  /**
   * Encrypts plaintext using Column-Major Grid Transposition
   * Convention:
   * 1. Plaintext written horizontally into a grid of 'cols' columns (row-by-row)
   * 2. Ciphertext read vertically down column 0, then column 1, ... column C-1
   * @param {string} text 
   * @param {number} cols - Number of columns (rails)
   * @returns {Object}
   */
  encryptColumnMajor(text, cols) {
    cols = Math.max(2, parseInt(cols, 10) || 3);
    const len = text.length;
    if (len === 0) return { result: '', grid: [], cols, rows: 0 };

    const rows = Math.ceil(len / cols);
    const grid = [];

    // Fill grid row-by-row
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const rowArr = [];
      for (let c = 0; c < cols; c++) {
        if (idx < len) {
          rowArr.push(text[idx++]);
        } else {
          rowArr.push(null); // empty or padding
        }
      }
      grid.push(rowArr);
    }

    // Read column-by-column
    let result = '';
    const colStrings = [];
    for (let c = 0; c < cols; c++) {
      let colStr = '';
      for (let r = 0; r < rows; r++) {
        if (grid[r][c] !== null) {
          result += grid[r][c];
          colStr += grid[r][c];
        }
      }
      colStrings.push(colStr);
    }

    return {
      result,
      grid,
      cols,
      rows,
      len,
      colStrings,
      convention: 'Written row-wise into a C-column grid; read out column-by-column.'
    };
  },

  /**
   * Decrypts ciphertext using Column-Major Grid Transposition
   * @param {string} text 
   * @param {number} cols 
   * @returns {Object}
   */
  decryptColumnMajor(text, cols) {
    cols = Math.max(2, parseInt(cols, 10) || 3);
    const len = text.length;
    if (len === 0) return { result: '', grid: [], cols, rows: 0 };

    const rows = Math.ceil(len / cols);
    const fullCols = len % cols; // columns with 'rows' characters; others have 'rows - 1'

    // Determine character count in each column
    const colLengths = [];
    for (let c = 0; c < cols; c++) {
      if (fullCols === 0) {
        colLengths.push(rows);
      } else {
        colLengths.push(c < fullCols ? rows : rows - 1);
      }
    }

    // Populate grid column-by-column from ciphertext
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    let charIdx = 0;

    for (let c = 0; c < cols; c++) {
      const colLen = colLengths[c];
      for (let r = 0; r < colLen; r++) {
        if (charIdx < len) {
          grid[r][c] = text[charIdx++];
        }
      }
    }

    // Read row-by-row to reconstruct plaintext
    let result = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] !== null) {
          result += grid[r][c];
        }
      }
    }

    return {
      result,
      grid,
      cols,
      rows,
      len,
      convention: 'Filled column-wise based on column lengths; read out row-wise.'
    };
  }
};

if (typeof window !== 'undefined') {
  window.RailFenceCipher = RailFenceCipher;
}
