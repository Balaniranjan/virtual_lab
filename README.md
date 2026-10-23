# Principles of Cryptography and Cyber Security Laboratory
**Interactive College-Level Virtual Laboratory for CSE (Cyber Security)**

> **Course:** Principles of Cryptography and Cyber Security Laboratory (R21USY708)  
> **Course Code:** R21USY708  
> **Department:** CSE(CYBER SECURITY)  
> **Institution:** SETHU INSTITUTE OF TECHNOLOGY  
> **Head of the Department:** Dr.K.Nagalakshmi  
> **Architecture:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+), and Web Cryptography API. Zero build tools or external frontend frameworks required.

---

## 1. Project Overview & Objective

The **Principles of Cryptography Virtual Lab** is a responsive, client-side educational simulation platform inspired by national university virtual laboratories (such as [Virtual Labs India](https://ai1-iiith.vlabs.ac.in/)). It provides comprehensive theoretical instruction and real-time interactive simulations across classical substitution and transposition ciphers, symmetric block ciphers, public-key mathematics, key exchange protocols, cryptographic hashing, and digital signature standards.

Each of the nine laboratory modules features an eight-stage instructional workflow:
1. **Aim:** Concise 2–4 sentence pedagogical objective.
2. **Theory:** Formal mathematical definitions, algorithm specifications, and diagrams.
3. **Procedure:** Step-by-step instructions for operating the simulation.
4. **Pretest:** Diagnostic multiple-choice assessment (5 questions with instant feedback).
5. **Demo:** Canonical textbook example with step-by-step intermediate calculations.
6. **Practice:** Fully interactive simulation accepting custom user inputs, keys, and parameters.
7. **Posttest:** Evaluative post-experiment quiz (5 questions with scoring and rationale).
8. **References:** Authentic academic citations, textbooks, and NIST/RFC standards.

---

## 2. Technology Stack & Zero-Dependency Design

To guarantee offline usability and cross-platform compatibility without framework lock-in or build pipelines:
- **Structure:** Semantic HTML5 (`header`, `nav`, `main`, `section`, `footer`).
- **Styling:** Custom CSS3 with CSS variables (`--primary-600`, `--cyan-600`, `--bg-page`, etc.), responsive flexbox/grid layouts, accessible focus outlines, and reduced-motion support.
- **Logic:** Native Vanilla JavaScript (ES6+ classes, modular architecture).
- **Modern Cryptography:** Native browser **Web Cryptography API** (`window.crypto.subtle`) for:
  - AES-GCM (128-bit & 256-bit authenticated encryption with dynamic 96-bit nonces and 128-bit GMAC tags).
  - RSA-OAEP (2048-bit keypair generation, SPKI/PKCS8 export, SHA-256 padding).
  - SHA-1 (160-bit message digest).
  - ECDSA (P-256 curve with SHA-256 signing and verification).
- **Educational Engines (Pure JS):** Hand-crafted, mathematically verified implementations for:
  - Caesar cipher (modular arithmetic mod 26).
  - Playfair cipher (5x5 key matrix, I/J combination, digraph rules).
  - Hill cipher (2x2 & 3x3 matrix multiplication, determinant calculation, and Extended Euclidean inverse mod 26).
  - Rail fence cipher (Row-Major zigzag wave and Column-Major rectangular grid transposition).
  - Data Encryption Standard (FIPS 46-3: 16 Feistel rounds, 8 S-boxes, IP/FP, subkey schedules).
  - Diffie-Hellman key exchange (modular exponentiation and Man-in-the-Middle simulation).
  - MD5 (RFC 1321 pure JS 64-step implementation, since Web Crypto intentionally excludes MD5).
  - Digital Signature Standard (historical DSA modular arithmetic equations `(p, q, g, x, y, k, r, s, v)`).

---

## 3. Directory Structure

```
cryptography-virtual-lab/
│
├── index.html                     # Academic landing page, hero, 9 experiment cards, workflow
├── introduction.html              # Fundamentals: CIA triad, symmetric vs asymmetric, hashes, signatures
├── objectives.html                # Measurable learning outcomes & Bloom's taxonomy matrix
├── experiments.html               # Experiment directory with category filters & progress tracking
├── resources.html                 # Core textbooks (Stallings, Menezes), NIST FIPS, and RFC standards
├── feedback.html                  # Student & faculty evaluation form with local storage
├── tests.html                     # Automated cryptographic test suite (NIST & RFC test vectors)
│
├── experiments/
│   ├── classical-ciphers.html     # Exp 01: Caesar, Playfair, and Hill Ciphers
│   ├── transposition.html         # Exp 02: Rail Fence Row-Major (Zigzag) & Column-Major (Grid)
│   ├── des.html                   # Exp 03: Data Encryption Standard (16 Feistel rounds)
│   ├── aes.html                   # Exp 04: Advanced Encryption Standard (AES-GCM & 4x4 State)
│   ├── rsa.html                   # Exp 05: RSA Public-Key Encryption (Arithmetic & RSA-OAEP 2048)
│   ├── diffie-hellman.html        # Exp 06: Diffie–Hellman Key Exchange & MitM Simulation
│   ├── sha1.html                  # Exp 07: SHA-1 Message Digest & Avalanche Analyzer
│   ├── md5.html                   # Exp 08: MD5 Message Digest (RFC 1321) & Collision Analysis
│   └── digital-signature.html     # Exp 09: Digital Signature Standard (DSA) & Modern ECDSA
│
├── css/
│   ├── style.css                  # Color tokens, typography, CSS custom properties, base reset
│   ├── layout.css                 # Site header, top banner, breadcrumbs, containers, footer
│   ├── components.css             # Buttons, cards, form inputs, badges, alerts, modals, toasts
│   ├── experiments.css            # Visualizers: matrices, zigzag rails, Feistel rounds, Alice-Bob diagrams
│   └── responsive.css             # Mobile drawer navigation, media queries, print styles
│
├── js/
│   ├── main.js                    # Global registry, instant search modal, clipboard utils, config tokens
│   ├── navigation.js              # 8-tab switcher, sub-experiment switcher, URL hash sync, mobile menu
│   ├── validation.js              # Input checks, numeric ranges, hex validators, alert notifications
│   ├── assessments.js             # 90 MCQs (Pretest & Posttest for all 9 exps), scoring, localStorage
│   └── crypto/
│       ├── caesar.js              # Caesar shift cipher and alphabet mapping strip
│       ├── playfair.js            # Playfair 5x5 matrix generator, digraph splitter, transformation rules
│       ├── hill.js                # Hill cipher 2x2 & 3x3 modular matrix multiplication & inverse
│       ├── rail-fence.js          # Rail Fence Row-Major zigzag & Column-Major grid transposition
│       ├── des.js                 # FIPS 46-3 DES: 16 Feistel rounds, S-boxes, IP/FP, key expansion
│       ├── aes.js                 # Web Crypto AES-GCM AEAD and educational 4x4 Rijndael state matrix
│       ├── rsa.js                 # Classroom RSA (primes, phi, square-and-multiply) & RSA-OAEP 2048
│       ├── diffie-hellman.js      # Diffie-Hellman Alice-Bob exchange and MitM interceptor
│       ├── sha1.js                # SHA-1 Web Crypto computation and avalanche Hamming distance
│       ├── md5.js                 # RFC 1321 pure JavaScript MD5 message digest engine
│       └── digital-signature.js   # DSA modular equations (r, s, v) and Web Crypto ECDSA (P-256)
│
└── README.md                      # Comprehensive documentation and execution guide
```

---

## 4. How to Run Locally

Because the project is built with standard HTML5, CSS3, and ES6 JavaScript, it does **not** require `npm install`, Node.js, Webpack, Vite, or any compilation step.

### Method A: Direct File Execution (Simplest)
1. Double-click `index.html` or open it directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. All navigation links and script imports use relative paths (`css/`, `js/`, `experiments/`), ensuring immediate out-of-the-box operation.

### Method B: Local Static HTTP Server
If preferred or if browser local file security (`file:///`) restricts certain Web Crypto features:

**Using Python (pre-installed on most systems):**
```bash
# Navigate to the workspace directory:
cd "c:\Users\Student\Desktop\virtual lab for cryptography"

# Start Python's built-in HTTP server:
python -m http.server 8000
```
Open your browser to: `http://localhost:8000/`

**Using Node / npx (optional):**
```bash
npx serve .
```

---

## 5. Summary of Experiments & Features

| Exp # | Title | Algorithms & Primitives | Key Features |
|---|---|---|---|
| **01** | Classical Ciphers | Caesar, Playfair, Hill | 0–25 shift slider, shifted alphabet strip, 5x5 matrix coordinate highlights, 2x2/3x3 matrix determinant & mod 26 inverse validation. |
| **02** | Transposition | Rail Fence (Row-Major & Column-Major) | Visual zigzag wave diagram, documented rectangular grid convention, column length remainder calculations for decryption. |
| **03** | DES Algorithm | Data Encryption Standard (FIPS 46-3) | 64-bit blocks, 56-bit effective key, 16 Feistel rounds inspection ($L_i, R_i, K_i, f$-output), NIST SP 800-20 known test vector. |
| **04** | AES Algorithm | Rijndael & AES-GCM (FIPS 197) | 4x4 byte state matrix (SubBytes, ShiftRows, MixColumns), modern Web Crypto AES-GCM (128/256-bit) with fresh 96-bit nonces and tamper detection. |
| **05** | RSA Encryption | Number Theory & RSA-OAEP | Prime generation ($p, q$), totient $\phi(n)$, modular inverse $d$, square-and-multiply trace, Web Crypto 2048-bit RSA-OAEP keypair & PEM export. |
| **06** | Diffie-Hellman | Key Exchange Protocol | Alice & Bob two-party diagram, public parameter transmission, shared secret agreement ($K_A = K_B$), and active Eve (MitM) simulation. |
| **07** | SHA-1 Digest | Secure Hash Algorithm (FIPS 180-4) | 160-bit (40 hex chars) digest calculation, bit-level Avalanche Effect analyzer (Hamming distance), SHAttered collision analysis. |
| **08** | MD5 Digest | RFC 1321 Hash Function | Pure JavaScript RFC 1321 64-step implementation, side-by-side avalanche comparison, explanation of Wang et al. (2004) and Flame malware (2012). |
| **09** | Digital Signatures | Digital Signature Standard (DSS) & ECDSA | Historical DSA $(p, q, g, x, y, k, r, s)$ equations, message modification tamper rejection ($v \ne r$), and modern Web Crypto ECDSA (P-256) signing. |

---

## 6. Assessment System & Progress Tracking

- **90 Authentic Questions:** 5 diagnostic pretest questions and 5 posttest evaluation questions for each of the 9 experiments.
- **Immediate Formative Feedback:** Selecting an answer immediately highlights correct (green) and incorrect (red) options, accompanied by academic explanations.
- **Local Progress Persistence:** Assessment scores, timestamps, and experiment completion badges are stored locally in the student's browser via `localStorage` (`crypto_lab_learning_progress`).
- **No Registration Required:** Students can access all simulations and track progress without creating an account or transmitting personal data.

---

## 7. Quality Assurance & Test Verification

Open `tests.html` in your browser to run the automated cryptographic test suite. It executes 12 comprehensive test suites asserting:
1. Caesar encryption and decryption with punctuation preservation.
2. Playfair digraph preparation with repeated-character splitting and padding.
3. Hill cipher determinant computation and rejection of non-coprime matrices modulo 26.
4. Rail Fence zigzag wave and rectangular grid round-trip reconstruction.
5. DES NIST SP 800-20 Known-Answer Test vector:
   - Key: `133457799BBCDFF1`
   - Plaintext: `0123456789ABCDEF`
   - Output: `85E813540F0AB405`
6. AES-GCM authenticated encryption and tamper detection on altered authentication tags.
7. RSA classroom modular arithmetic ($p=61, q=53, e=17, d=2753, m=65 \rightarrow c=2790 \rightarrow m=65$).
8. Diffie-Hellman parameter exchange agreement ($p=23, g=5, a=6, b=15 \rightarrow A=8, B=19 \rightarrow K=2$).
9. SHA-1 known-answer vectors for empty string and canonical test strings.
10. MD5 RFC 1321 test vectors for empty string and standard test messages.
11. Digital Signature Standard (DSA) signing and verification, and detection of modified payloads.

---

## 8. Educational & Security Disclaimers

> **IMPORTANT:**  
> This virtual laboratory is created strictly for college and university educational instruction.  
> - **Legacy Primitives:** Caesar, Playfair, Hill, Rail Fence, DES, MD5, SHA-1, and unpadded textbook RSA are historic algorithms taught for foundational conceptual understanding. They are cryptographically broken or obsolete and must **never** be deployed for protecting real-world sensitive data.  
> - **Production Security:** Real-world applications must utilize audited, standards-compliant cryptographic libraries (such as OpenSSL, Libsodium, or native Web Crypto) implementing authenticated encryption (AES-GCM, ChaCha20-Poly1305), secure hashing (SHA-256, SHA-3, BLAKE3), and modern asymmetric standards (RSA-OAEP 3072+, ECDSA over P-256, Ed25519).
