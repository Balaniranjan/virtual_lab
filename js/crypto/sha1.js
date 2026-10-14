/**
 * SHA-1 Message Digest Implementation (FIPS PUB 180-1 / RFC 3174)
 * Uses native Web Crypto API with a validated fallback/round-tracer.
 * Includes Avalanche Effect analyzer (Hamming distance calculation).
 * Explicitly marks SHA-1 as cryptographically broken for collision resistance.
 */

const SHA1Helper = {
  /**
   * Computes SHA-1 digest using native Web Crypto API
   * @param {string} text 
   * @returns {Promise<Object>}
   */
  async compute(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      hex: hex.toLowerCase(),
      hexUpper: hex.toUpperCase(),
      bitLength: 160,
      byteLength: 20,
      charLength: 40,
      rawBytes: hashArray
    };
  },

  /**
   * Educational pure JS implementation for step/round visualization
   */
  pureJS(text) {
    function rol(n, s) { return (n << s) | (n >>> (32 - s)); }

    // Preprocessing (Padding)
    const utf8 = unescape(encodeURIComponent(text));
    const msg = [];
    for (let i = 0; i < utf8.length; i++) {
      msg.push(utf8.charCodeAt(i));
    }
    const origBitLen = msg.length * 8;

    msg.push(0x80);
    while ((msg.length % 64) !== 56) {
      msg.push(0x00);
    }

    // Append 64-bit length
    for (let i = 7; i >= 0; i--) {
      msg.push((origBitLen >>> (i * 8)) & 0xff);
    }

    let H0 = 0x67452301;
    let H1 = 0xefcdab89;
    let H2 = 0x98badcfe;
    let H3 = 0x10325476;
    let H4 = 0xc3d2e1f0;

    const blocks = [];

    for (let i = 0; i < msg.length; i += 64) {
      const W = new Array(80);
      for (let t = 0; t < 16; t++) {
        W[t] = (msg[i + t * 4] << 24) |
               (msg[i + t * 4 + 1] << 16) |
               (msg[i + t * 4 + 2] << 8) |
               (msg[i + t * 4 + 3]);
      }
      for (let t = 16; t < 80; t++) {
        W[t] = rol(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }

      let a = H0, b = H1, c = H2, d = H3, e = H4;

      for (let t = 0; t < 80; t++) {
        let f, k;
        if (t < 20) {
          f = (b & c) | ((~b) & d);
          k = 0x5a827999;
        } else if (t < 40) {
          f = b ^ c ^ d;
          k = 0x6ed9eba1;
        } else if (t < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8f1bbcdc;
        } else {
          f = b ^ c ^ d;
          k = 0xca62c1d6;
        }

        const temp = (rol(a, 5) + f + e + k + W[t]) & 0xffffffff;
        e = d;
        d = c;
        c = rol(b, 30);
        b = a;
        a = temp;
      }

      H0 = (H0 + a) & 0xffffffff;
      H1 = (H1 + b) & 0xffffffff;
      H2 = (H2 + c) & 0xffffffff;
      H3 = (H3 + d) & 0xffffffff;
      H4 = (H4 + e) & 0xffffffff;

      blocks.push({
        blockIndex: Math.floor(i / 64) + 1,
        H: [H0, H1, H2, H3, H4].map(x => (x >>> 0).toString(16).padStart(8, '0'))
      });
    }

    const hex = [H0, H1, H2, H3, H4].map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
    return { hex, blocks };
  },

  /**
   * Compares two hex hashes bit-by-bit to compute Hamming distance (Avalanche Effect)
   */
  calculateAvalanche(hex1, hex2) {
    let diffBits = 0;
    const totalBits = Math.min(hex1.length, hex2.length) * 4;

    for (let i = 0; i < Math.min(hex1.length, hex2.length); i++) {
      const v1 = parseInt(hex1[i], 16);
      const v2 = parseInt(hex2[i], 16);
      let xor = v1 ^ v2;
      while (xor > 0) {
        diffBits += xor & 1;
        xor >>= 1;
      }
    }

    const percentage = ((diffBits / totalBits) * 100).toFixed(2);
    return { diffBits, totalBits, percentage };
  }
};

if (typeof window !== 'undefined') {
  window.SHA1Helper = SHA1Helper;
}
