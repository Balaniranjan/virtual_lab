/**
 * Advanced Encryption Standard (AES) - FIPS PUB 197 & Web Crypto API Implementation
 * Features two distinct modules:
 * 1. Practical Modern Encryption: Web Crypto API AES-GCM (128/256-bit) with random 96-bit nonce & auth tag
 * 2. Educational Round Engine: Pure JS Rijndael state matrix (SubBytes, ShiftRows, MixColumns, AddRoundKey)
 */

const AESHelper = {
  // S-Box lookup table for Rijndael SubBytes
  S_BOX: [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
  ],

  // Galois Field GF(2^8) multiplication by 2 (xtime)
  gMul2(b) {
    return ((b << 1) ^ (((b >> 7) & 1) * 0x11b)) & 0xff;
  },

  gMul3(b) {
    return this.gMul2(b) ^ b;
  },

  // =========================================================================
  // 1. PRACTICAL WEB CRYPTO API (AES-GCM Authenticated Encryption)
  // =========================================================================

  /**
   * Generates a new random AES-GCM CryptoKey
   * @param {number} keyLength - 128 or 256
   */
  async generateKey(keyLength = 256) {
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: keyLength },
      true,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Exports CryptoKey as hex string
   */
  async exportKeyHex(cryptoKey) {
    const raw = await crypto.subtle.exportKey('raw', cryptoKey);
    return Array.from(new Uint8Array(raw))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  },

  /**
   * Imports raw hex string as AES-GCM CryptoKey
   */
  async importKeyHex(hexKey) {
    hexKey = hexKey.replace(/[^0-9A-Fa-f]/g, '');
    const bytes = new Uint8Array(hexKey.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hexKey.substr(i * 2, 2), 16);
    }
    return await crypto.subtle.importKey(
      'raw',
      bytes,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Encrypts text using AES-GCM with fresh 96-bit IV
   */
  async encryptGCM(plaintext, cryptoKey) {
    const enc = new TextEncoder();
    const data = enc.encode(plaintext);
    // 96-bit (12-byte) random nonce / IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    const fullCipherBytes = new Uint8Array(ciphertextBuffer);
    // In Web Crypto AES-GCM, the 16-byte authentication tag is appended at the end
    const tagLength = 16;
    const cipherBytes = fullCipherBytes.slice(0, fullCipherBytes.length - tagLength);
    const tagBytes = fullCipherBytes.slice(fullCipherBytes.length - tagLength);

    const toHex = arr => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    return {
      ivHex: toHex(iv),
      cipherHex: toHex(cipherBytes),
      tagHex: toHex(tagBytes),
      combinedHex: toHex(iv) + toHex(fullCipherBytes),
      fullCipherBytes
    };
  },

  /**
   * Decrypts AES-GCM with authentication verification
   */
  async decryptGCM(cipherHex, ivHex, tagHex, cryptoKey) {
    try {
      const fromHex = str => {
        str = str.replace(/[^0-9A-Fa-f]/g, '');
        const arr = new Uint8Array(str.length / 2);
        for (let i = 0; i < arr.length; i++) {
          arr[i] = parseInt(str.substr(i * 2, 2), 16);
        }
        return arr;
      };

      const iv = fromHex(ivHex);
      const cipher = fromHex(cipherHex);
      const tag = fromHex(tagHex);

      // Reassemble ciphertext + tag for Web Crypto
      const full = new Uint8Array(cipher.length + tag.length);
      full.set(cipher);
      full.set(tag, cipher.length);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        full
      );

      const dec = new TextDecoder();
      return {
        success: true,
        plaintext: dec.decode(decryptedBuffer)
      };
    } catch (err) {
      return {
        success: false,
        error: 'Authentication failed! Either the ciphertext, key, nonce, or authentication tag has been altered.'
      };
    }
  },

  // =========================================================================
  // 2. EDUCATIONAL ROUND TRANSFORMATIONS (4x4 Matrix Visualizer)
  // =========================================================================

  /**
   * Converts 16-character string or 32-character hex into 4x4 column-major state matrix
   */
  createStateMatrix(input, isHex = false) {
    const bytes = [];
    if (isHex) {
      const cleanHex = input.replace(/[^0-9A-Fa-f]/g, '').padEnd(32, '0').slice(0, 32);
      for (let i = 0; i < 32; i += 2) {
        bytes.push(parseInt(cleanHex.substr(i, 2), 16));
      }
    } else {
      const cleanText = input.padEnd(16, ' ').slice(0, 16);
      for (let i = 0; i < 16; i++) {
        bytes.push(cleanText.charCodeAt(i));
      }
    }

    // 4x4 matrix, column-major standard
    const state = [];
    for (let r = 0; r < 4; r++) {
      state[r] = [];
      for (let c = 0; c < 4; c++) {
        state[r][c] = bytes[c * 4 + r];
      }
    }
    return state;
  },

  /**
   * SubBytes: Substitute each byte using Rijndael S-Box
   */
  subBytes(state) {
    const newState = [];
    for (let r = 0; r < 4; r++) {
      newState[r] = [];
      for (let c = 0; c < 4; c++) {
        newState[r][c] = this.S_BOX[state[r][c]];
      }
    }
    return newState;
  },

  /**
   * ShiftRows: Row 0 shifted 0, Row 1 shifted 1 left, Row 2 shifted 2 left, Row 3 shifted 3 left
   */
  shiftRows(state) {
    const newState = [];
    for (let r = 0; r < 4; r++) {
      newState[r] = [];
      for (let c = 0; c < 4; c++) {
        newState[r][c] = state[r][(c + r) % 4];
      }
    }
    return newState;
  },

  /**
   * MixColumns: Matrix multiplication over GF(2^8)
   */
  mixColumns(state) {
    const newState = [[], [], [], []];
    for (let c = 0; c < 4; c++) {
      const s0 = state[0][c], s1 = state[1][c], s2 = state[2][c], s3 = state[3][c];
      newState[0][c] = this.gMul2(s0) ^ this.gMul3(s1) ^ s2 ^ s3;
      newState[1][c] = s0 ^ this.gMul2(s1) ^ this.gMul3(s2) ^ s3;
      newState[2][c] = s0 ^ s1 ^ this.gMul2(s2) ^ this.gMul3(s3);
      newState[3][c] = this.gMul3(s0) ^ s1 ^ s2 ^ this.gMul2(s3);
    }
    return newState;
  },

  /**
   * AddRoundKey: XOR state with round key matrix
   */
  addRoundKey(state, keyMatrix) {
    const newState = [];
    for (let r = 0; r < 4; r++) {
      newState[r] = [];
      for (let c = 0; c < 4; c++) {
        newState[r][c] = state[r][c] ^ keyMatrix[r][c];
      }
    }
    return newState;
  },

  /**
   * Formats state matrix as 2D hex array for display
   */
  formatStateHex(state) {
    return state.map(row => row.map(b => b.toString(16).padStart(2, '0').toUpperCase()));
  }
};

if (typeof window !== 'undefined') {
  window.AESHelper = AESHelper;
}
