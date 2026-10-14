/**
 * Digital Signature Standard (DSS / DSA) & Modern ECDSA Simulation Engine
 * Features:
 * 1. Historical DSA (FIPS PUB 186-4) Educational Engine:
 *    - Domain parameters: p, q (where q | p-1), generator g
 *    - Key generation: Private key x, Public key y = g^x mod p
 *    - Signature generation: r = (g^k mod p) mod q, s = k^-1 * (H(m) + x*r) mod q
 *    - Signature verification: w = s^-1 mod q, u1 = (H*w) mod q, u2 = (r*w) mod q, v = ((g^u1 * y^u2) mod p) mod q
 *    - Rejection of modified/tampered messages!
 * 2. Modern ECDSA Web Crypto API:
 *    - P-256 curve with SHA-256 signing and verification
 */

const DigitalSignature = {
  // Modular exponentiation for BigInt
  modPow(base, exp, mod) {
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);
    let res = 1n;
    while (exp > 0n) {
      if (exp % 2n === 1n) res = (res * base) % mod;
      base = (base * base) % mod;
      exp /= 2n;
    }
    return res;
  },

  // Modular multiplicative inverse
  modInverse(a, m) {
    a = BigInt(a);
    m = BigInt(m);
    let [m0, y, x] = [m, 0n, 1n];
    if (m === 1n) return 0n;

    while (a > 1n) {
      if (m0 === 0n) return null;
      const q = a / m0;
      let t = m0;
      m0 = a % m0;
      a = t;
      t = y;
      y = x - q * y;
      x = t;
    }
    return x < 0n ? x + m : x;
  },

  // Simple pedagogical hash function mapping string to BigInt mod q
  simpleHash(msg, q) {
    let hash = 0n;
    for (let i = 0; i < msg.length; i++) {
      hash = (hash * 31n + BigInt(msg.charCodeAt(i))) % BigInt(q);
    }
    // Ensure non-zero hash
    if (hash === 0n) hash = 1n;
    return hash;
  },

  // =========================================================================
  // 1. HISTORICAL DSA EDUCATIONAL ENGINE
  // =========================================================================

  // Pre-validated classroom parameter sets: [p, q, g] where (p-1) % q === 0 and g^q mod p === 1
  EDUCATIONAL_PARAMS: [
    { name: 'Standard Classroom (p=79, q=13, g=2)', p: 79n, q: 13n, g: 2n },
    { name: 'Intermediate (p=283, q=47, g=60)', p: 283n, q: 47n, g: 60n },
    { name: 'Academic FIPS (p=1019, q=509, g=4)', p: 1019n, q: 509n, g: 4n }
  ],

  /**
   * Generates DSA keypair from domain parameters
   */
  generateDSAKeys(pVal, qVal, gVal, xVal = null) {
    const p = BigInt(pVal);
    const q = BigInt(qVal);
    const g = BigInt(gVal);

    if ((p - 1n) % q !== 0n) {
      return { success: false, error: 'Invalid parameters: q must strictly divide (p - 1).' };
    }
    if (this.modPow(g, q, p) !== 1n) {
      return { success: false, error: 'Invalid generator: g^q mod p must equal 1.' };
    }

    // Select or validate private key x: 0 < x < q
    let x = xVal ? BigInt(xVal) : null;
    if (x) {
      if (x <= 0n || x >= q) {
        return { success: false, error: `Private key x must satisfy 0 < x < q (0 < x < ${q}).` };
      }
    } else {
      // Pick middle prime-like secret
      x = q / 2n + 1n;
      if (x >= q) x = q - 2n;
    }

    // Compute public key y = g^x mod p
    const y = this.modPow(g, x, p);

    return {
      success: true,
      p: p.toString(),
      q: q.toString(),
      g: g.toString(),
      x: x.toString(), // Private Key
      y: y.toString()  // Public Key
    };
  },

  /**
   * Signs a message using DSA algorithm
   */
  signDSA(message, pVal, qVal, gVal, xVal, kVal = null) {
    const p = BigInt(pVal);
    const q = BigInt(qVal);
    const g = BigInt(gVal);
    const x = BigInt(xVal);

    // Ephemeral random key k (0 < k < q)
    let k = kVal ? BigInt(kVal) : null;
    if (!k || k <= 0n || k >= q) {
      k = 3n; // Safe educational default
      while (k < q && this.modInverse(k, q) === null) k += 2n;
    }

    const kInv = this.modInverse(k, q);
    if (!kInv) {
      return { success: false, error: 'k has no modular inverse mod q. Choose a different k.' };
    }

    // r = (g^k mod p) mod q
    const r = this.modPow(g, k, p) % q;
    if (r === 0n) {
      return { success: false, error: 'r computed to 0. Ephemeral k must be regenerated.' };
    }

    // Message hash
    const Hm = this.simpleHash(message, q);

    // s = (k^-1 * (H(m) + x * r)) mod q
    const s = (kInv * (Hm + x * r)) % q;
    if (s === 0n) {
      return { success: false, error: 's computed to 0. Ephemeral k must be regenerated.' };
    }

    return {
      success: true,
      message,
      hash: Hm.toString(),
      k: k.toString(),
      kInv: kInv.toString(),
      r: r.toString(),
      s: s.toString(),
      signature: `(${r}, ${s})`,
      details: {
        formulaR: `r = (g^k mod p) mod q = (${g}^${k} mod ${p}) mod ${q} = ${r}`,
        formulaS: `s = k^-1 * (H(m) + x*r) mod q = ${kInv} * (${Hm} + ${x}*${r}) mod ${q} = ${s}`
      }
    };
  },

  /**
   * Verifies a DSA signature (r, s) against message and public key y
   */
  verifyDSA(message, rVal, sVal, pVal, qVal, gVal, yVal) {
    const p = BigInt(pVal);
    const q = BigInt(qVal);
    const g = BigInt(gVal);
    const y = BigInt(yVal);
    const r = BigInt(rVal);
    const s = BigInt(sVal);

    // Verification check: 0 < r < q and 0 < s < q
    if (r <= 0n || r >= q || s <= 0n || s >= q) {
      return {
        verified: false,
        reason: 'Signature values r and s are outside the valid range (0 < r, s < q).'
      };
    }

    // w = s^-1 mod q
    const w = this.modInverse(s, q);
    if (!w) {
      return { verified: false, reason: 's has no inverse mod q.' };
    }

    // Message digest
    const Hm = this.simpleHash(message, q);

    // u1 = (H(m) * w) mod q
    const u1 = (Hm * w) % q;

    // u2 = (r * w) mod q
    const u2 = (r * w) % q;

    // v = ((g^u1 * y^u2) mod p) mod q
    const term1 = this.modPow(g, u1, p);
    const term2 = this.modPow(y, u2, p);
    const v = ((term1 * term2) % p) % q;

    const verified = (v === r);

    return {
      verified,
      message,
      hash: Hm.toString(),
      w: w.toString(),
      u1: u1.toString(),
      u2: u2.toString(),
      v: v.toString(),
      r: r.toString(),
      details: {
        calcW: `w = s^-1 mod q = ${w}`,
        calcU1: `u1 = (H(m) * w) mod q = (${Hm} * ${w}) mod ${q} = ${u1}`,
        calcU2: `u2 = (r * w) mod q = (${r} * ${w}) mod ${q} = ${u2}`,
        calcV: `v = ((g^u1 * y^u2) mod p) mod q = ((${term1} * ${term2}) mod ${p}) mod ${q} = ${v}`,
        comparison: `Check: v (${v}) === r (${r}) -> ${verified ? 'MATCH (SIGNATURE VALID)' : 'MISMATCH (TAMPER DETECTED / INVALID SIGNATURE)'}`
      }
    };
  },

  // =========================================================================
  // 2. MODERN ECDSA (Web Crypto API P-256 with SHA-256)
  // =========================================================================

  /**
   * Generates ECDSA keypair using P-256 curve
   */
  async generateModernKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );

    const spki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const toB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));

    return {
      keyPair,
      publicKeyPem: `-----BEGIN PUBLIC KEY-----\n${toB64(spki).match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`
    };
  },

  /**
   * Signs a message using modern ECDSA
   */
  async signModern(message, privateKey) {
    const enc = new TextEncoder();
    const data = enc.encode(message);

    const sigBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      privateKey,
      data
    );

    const sigBytes = new Uint8Array(sigBuffer);
    const sigHex = Array.from(sigBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      sigHex: sigHex.toUpperCase(),
      sigBuffer,
      byteLength: sigBytes.length
    };
  },

  /**
   * Verifies an ECDSA signature
   */
  async verifyModern(message, sigHex, publicKey) {
    try {
      const enc = new TextEncoder();
      const data = enc.encode(message);

      const cleanHex = sigHex.replace(/[^0-9A-Fa-f]/g, '');
      const bytes = new Uint8Array(cleanHex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
      }

      const isValid = await crypto.subtle.verify(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        publicKey,
        bytes,
        data
      );

      return { success: true, isValid };
    } catch (e) {
      return { success: false, isValid: false, error: e.message };
    }
  }
};

if (typeof window !== 'undefined') {
  window.DigitalSignature = DigitalSignature;
}
