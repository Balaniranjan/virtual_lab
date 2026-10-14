/**
 * RSA Public-Key Cryptography Implementation
 * Features two distinct modules:
 * 1. Educational Arithmetic Demo: Small classroom primes (p, q), totient, extended Euclidean d,
 *    and square-and-multiply modular exponentiation.
 * 2. Modern Practical RSA: Web Crypto API RSA-OAEP with 2048-bit keypair, SHA-256, and SPKI/PKCS8 export.
 */

const RSAHelper = {
  // Primality test for small numbers
  isPrime(num) {
    num = Number(num);
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  },

  gcdBigInt(a, b) {
    while (b !== 0n) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  },

  // Extended Euclidean Algorithm for BigInt modular inverse
  modInverseBigInt(a, m) {
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

  // Modular exponentiation (base^exp mod mod) with square-and-multiply step trace
  modPowWithSteps(base, exp, mod) {
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);

    let result = 1n;
    const steps = [];
    const binExp = exp.toString(2);

    for (let i = 0; i < binExp.length; i++) {
      const bit = binExp[i];
      const prevResult = result;
      // Square
      result = (result * result) % mod;
      let action = `Square: (${prevResult}^2) mod ${mod} = ${result}`;

      // Multiply if bit is 1
      if (bit === '1') {
        const afterSq = result;
        result = (result * base) % mod;
        action += `, Multiply: (${afterSq} * ${base}) mod ${mod} = ${result}`;
      }

      steps.push({
        step: i + 1,
        bit,
        action,
        currentValue: result.toString()
      });
    }

    return { result: result.toString(), steps };
  },

  /**
   * Generates mathematical parameters for small educational RSA
   */
  generateEducationalKeys(pVal, qVal, eVal = null) {
    const p = BigInt(pVal);
    const q = BigInt(qVal);

    if (!this.isPrime(p) || !this.isPrime(q)) {
      return { success: false, error: 'Both p and q must be prime numbers!' };
    }
    if (p === q) {
      return { success: false, error: 'Primes p and q must be distinct!' };
    }

    const n = p * q;
    const phi = (p - 1n) * (q - 1n);

    // If eVal is provided, validate it; otherwise pick a standard valid e
    let e = eVal ? BigInt(eVal) : null;
    if (e) {
      if (e <= 1n || e >= phi) {
        return { success: false, error: `Public exponent e must be between 1 and phi(n)=${phi}` };
      }
      if (this.gcdBigInt(e, phi) !== 1n) {
        return { success: false, error: `e=${e} and phi(n)=${phi} must be coprime! gcd(${e}, ${phi}) = ${this.gcdBigInt(e, phi)}` };
      }
    } else {
      // Find smallest standard e
      const candidates = [65537n, 17n, 7n, 5n, 3n];
      for (const cand of candidates) {
        if (cand < phi && this.gcdBigInt(cand, phi) === 1n) {
          e = cand;
          break;
        }
      }
      if (!e) {
        for (let i = 3n; i < phi; i += 2n) {
          if (this.gcdBigInt(i, phi) === 1n) {
            e = i;
            break;
          }
        }
      }
    }

    const d = this.modInverseBigInt(e, phi);
    if (!d) {
      return { success: false, error: 'Failed to compute modular inverse for private key d.' };
    }

    return {
      success: true,
      p: p.toString(),
      q: q.toString(),
      n: n.toString(),
      phi: phi.toString(),
      e: e.toString(),
      d: d.toString()
    };
  },

  /**
   * Educational encryption: C = M^e mod n
   */
  encryptNumber(m, e, n) {
    const M = BigInt(m);
    const N = BigInt(n);
    if (M >= N) {
      return { success: false, error: `Message M (${M}) must be strictly less than modulus n (${N})!` };
    }
    const { result, steps } = this.modPowWithSteps(M, e, N);
    return { success: true, ciphertext: result, steps };
  },

  /**
   * Educational decryption: M = C^d mod n
   */
  decryptNumber(c, d, n) {
    const C = BigInt(c);
    const N = BigInt(n);
    const { result, steps } = this.modPowWithSteps(C, d, N);
    return { success: true, plaintext: result, steps };
  },

  // =========================================================================
  // 2. MODERN WEB CRYPTO API (RSA-OAEP 2048-bit with SHA-256)
  // =========================================================================

  /**
   * Generates a 2048-bit RSA-OAEP keypair
   */
  async generatePracticalKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export SPKI and PKCS8
    const spki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const pkcs8 = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    const toB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));

    return {
      keyPair,
      publicKeyPem: `-----BEGIN PUBLIC KEY-----\n${toB64(spki).match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`,
      privateKeyPem: `-----BEGIN PRIVATE KEY-----\n${toB64(pkcs8).match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----`
    };
  },

  /**
   * Encrypts plaintext using RSA-OAEP
   */
  async encryptPractical(plaintext, publicKey) {
    const enc = new TextEncoder();
    const data = enc.encode(plaintext);
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      data
    );

    const bytes = new Uint8Array(cipherBuffer);
    const b64 = btoa(String.fromCharCode(...bytes));
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    return { base64: b64, hex, length: bytes.length };
  },

  /**
   * Decrypts ciphertext using RSA-OAEP
   */
  async decryptPractical(cipherBase64, privateKey) {
    try {
      const bin = atob(cipherBase64.trim());
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }

      const decrypted = await crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privateKey,
        bytes
      );

      const dec = new TextDecoder();
      return { success: true, plaintext: dec.decode(decrypted) };
    } catch (e) {
      return { success: false, error: 'Decryption failed! Ciphertext is corrupted or wrong key was used.' };
    }
  }
};

if (typeof window !== 'undefined') {
  window.RSAHelper = RSAHelper;
}
