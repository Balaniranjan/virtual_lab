/**
 * Diffie-Hellman Key Exchange Interactive Engine
 * Simulates Alice and Bob generating a shared symmetric secret over an untrusted channel.
 * Also includes an educational Man-In-The-Middle (Eve Interception) simulation mode.
 */

const DiffieHellman = {
  // Modular exponentiation using BigInt: base^exp mod mod
  modPow(base, exp, mod) {
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);

    let res = 1n;
    while (exp > 0n) {
      if (exp % 2n === 1n) {
        res = (res * base) % mod;
      }
      base = (base * base) % mod;
      exp /= 2n;
    }
    return res;
  },

  /**
   * Performs standard Diffie-Hellman calculations
   * @param {number|string|bigint} pVal - Prime modulus
   * @param {number|string|bigint} gVal - Generator / Base
   * @param {number|string|bigint} aVal - Alice private exponent
   * @param {number|string|bigint} bVal - Bob private exponent
   */
  calculateStandard(pVal, gVal, aVal, bVal) {
    const p = BigInt(pVal);
    const g = BigInt(gVal);
    const a = BigInt(aVal);
    const b = BigInt(bVal);

    if (p <= 2n) {
      return { success: false, error: 'Prime modulus p must be greater than 2.' };
    }
    if (g <= 1n || g >= p) {
      return { success: false, error: 'Generator g must satisfy 1 < g < p.' };
    }
    if (a < 1n || a >= p) {
      return { success: false, error: "Alice's private key a must satisfy 1 <= a < p." };
    }
    if (b < 1n || b >= p) {
      return { success: false, error: "Bob's private key b must satisfy 1 <= b < p." };
    }

    // Alice calculates public key A = g^a mod p
    const A = this.modPow(g, a, p);

    // Bob calculates public key B = g^b mod p
    const B = this.modPow(g, b, p);

    // After exchange:
    // Alice receives B, calculates K_Alice = B^a mod p
    const kAlice = this.modPow(B, a, p);

    // Bob receives A, calculates K_Bob = A^b mod p
    const kBob = this.modPow(A, b, p);

    const keysMatch = kAlice === kBob;

    return {
      success: true,
      p: p.toString(),
      g: g.toString(),
      a: a.toString(),
      b: b.toString(),
      A: A.toString(),
      B: B.toString(),
      kAlice: kAlice.toString(),
      kBob: kBob.toString(),
      sharedSecret: kAlice.toString(),
      keysMatch,
      formulaAlice: `K_A = B^a mod p = (${B}^${a}) mod ${p} = ${kAlice}`,
      formulaBob: `K_B = A^b mod p = (${A}^${b}) mod ${p} = ${kBob}`
    };
  },

  /**
   * Man-In-The-Middle (MitM) Attack Simulation
   * Eve intercepts communications and establishes separate keys with Alice and Bob.
   */
  calculateMitM(pVal, gVal, aVal, bVal, eVal = 7n) {
    const baseCalc = this.calculateStandard(pVal, gVal, aVal, bVal);
    if (!baseCalc.success) return baseCalc;

    const p = BigInt(pVal);
    const g = BigInt(gVal);
    const a = BigInt(aVal);
    const b = BigInt(bVal);
    const e = BigInt(eVal); // Eve's private exponent

    const A = this.modPow(g, a, p);
    const B = this.modPow(g, b, p);
    // Eve's injected public value
    const E = this.modPow(g, e, p);

    // Eve sends E to Bob (pretending to be Alice)
    // Eve sends E to Alice (pretending to be Bob)

    // Alice computes shared secret with Eve: E^a mod p
    const kAliceEve = this.modPow(E, a, p);
    // Eve computes shared secret with Alice: A^e mod p
    const kEveAlice = this.modPow(A, e, p);

    // Bob computes shared secret with Eve: E^b mod p
    const kBobEve = this.modPow(E, b, p);
    // Eve computes shared secret with Bob: B^e mod p
    const kEveBob = this.modPow(B, e, p);

    return {
      ...baseCalc,
      evePrivate: e.toString(),
      evePublic: E.toString(),
      kAliceEve: kAliceEve.toString(),
      kEveAlice: kEveAlice.toString(),
      kBobEve: kBobEve.toString(),
      kEveBob: kEveBob.toString(),
      mitmCompromised: true,
      explanation: 'Eve successfully established two independent shared keys. Alice and Bob cannot detect Eve without authentication certificates or digital signatures!'
    };
  }
};

if (typeof window !== 'undefined') {
  window.DiffieHellman = DiffieHellman;
}
