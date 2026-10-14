/**
 * Principles of Cryptography Virtual Lab - Assessment & Quiz Engine
 * Provides 5 Pretest and 5 Posttest questions for all 9 experiments (90 total questions).
 * Features immediate feedback, explanations, score tracking, and localStorage progress save.
 */

const AssessmentData = {
  'classical-ciphers': {
    pretest: [
      {
        question: "What primary classification describes the Caesar, Playfair, and Hill ciphers?",
        options: [
          "Asymmetric stream ciphers",
          "Classical substitution ciphers",
          "Cryptographic hash functions",
          "Zero-knowledge proof systems"
        ],
        answer: 1,
        explanation: "Caesar, Playfair, and Hill ciphers are classical substitution ciphers where units of plaintext are replaced by ciphertext characters according to a regular system."
      },
      {
        question: "In modular arithmetic over the English alphabet (A=0 ... Z=25), what does (P + 26) mod 26 evaluate to?",
        options: [
          "0",
          "P",
          "25",
          "Undefined"
        ],
        answer: 1,
        explanation: "Adding the modulus 26 leaves the residue unchanged: (P + 26) mod 26 = P mod 26."
      },
      {
        question: "Why does the standard Playfair cipher combine the letters 'I' and 'J' into a single matrix cell?",
        options: [
          "Because 'I' and 'J' have identical ASCII codes",
          "To fit the 26-letter English alphabet into a 5x5 (25-cell) square matrix",
          "To confuse frequency analysis against vowels",
          "Because the letter 'J' did not exist in classical Latin"
        ],
        answer: 1,
        explanation: "A 5x5 grid contains 25 cells, whereas the English alphabet has 26 letters. Combining I and J (or omitting Q) allows the alphabet to fit into 25 cells."
      },
      {
        question: "For a Hill cipher key matrix to be invertible modulo 26, which mathematical condition must its determinant 'det' satisfy?",
        options: [
          "det > 26",
          "det must be a prime number",
          "gcd(det, 26) = 1 (coprime to 26)",
          "det mod 26 = 0"
        ],
        answer: 2,
        explanation: "A matrix is invertible over Z_26 if and only if its determinant is coprime to 26, meaning gcd(det, 26) = 1. This ensures a modular multiplicative inverse exists."
      },
      {
        question: "What is the primary vulnerability of monoalphabetic substitution ciphers like the Caesar cipher?",
        options: [
          "Quantum computer Shor's algorithm",
          "Frequency analysis of natural language letter distributions",
          "Birthday paradox collision attacks",
          "Differential cryptanalysis on S-boxes"
        ],
        answer: 1,
        explanation: "Monoalphabetic ciphers preserve letter frequency distributions. In English, 'E', 'T', and 'A' occur with high probability, making frequency analysis effective."
      }
    ],
    posttest: [
      {
        question: "Under a Caesar cipher with key k=4, what is the encryption of plaintext character 'W' (index 22)?",
        options: [
          "'A' (index 0)",
          "'Z' (index 25)",
          "'B' (index 1)",
          "'Y' (index 24)"
        ],
        answer: 0,
        explanation: "(22 + 4) mod 26 = 26 mod 26 = 0, which corresponds to character 'A'."
      },
      {
        question: "In Playfair cipher encryption, how is a plaintext digraph transformed when both letters lie in the same row of the key matrix?",
        options: [
          "Each letter is replaced by the letter immediately to its right (wrapping to the left)",
          "Each letter is replaced by the letter immediately below it",
          "The letters swap their diagonal corners",
          "The letters are inverted modulo 26"
        ],
        answer: 0,
        explanation: "Under Playfair rules, letters in the same row are replaced by the letter to their immediate right, wrapping around to the first column if on the right edge."
      },
      {
        question: "Why can the decrypted output of a Playfair cipher contain filler characters such as 'X'?",
        options: [
          "Because the key was corrupted during decryption",
          "Because 'X' was inserted during encryption to split identical digraph letters or pad odd-length plaintext",
          "Because Playfair replaces all vowels with 'X'",
          "Due to mathematical rounding errors in matrix inversion"
        ],
        answer: 1,
        explanation: "Playfair inserts filler letters ('X' or 'Q') to prevent duplicate letters in a digraph (e.g. 'LL' -> 'LX LM') and to pad an odd trailing letter. Decryption faithfully recovers these."
      },
      {
        question: "If a 2x2 Hill cipher matrix has determinant det = 13 mod 26, why can it NOT be decrypted?",
        options: [
          "Because 13 is an odd number",
          "Because gcd(13, 26) = 13 != 1, meaning 13 has no multiplicative inverse in Z_26",
          "Because 2x2 matrices require determinant equal to 1",
          "Because the Hill cipher only works for 3x3 matrices"
        ],
        answer: 1,
        explanation: "Since 13 and 26 share a common factor of 13, gcd(13, 26) = 13 != 1. No integer d exists such that (13 * d) mod 26 = 1, making matrix inversion impossible."
      },
      {
        question: "How does the polygraphic nature of the Hill cipher provide stronger resistance to single-letter frequency analysis compared to Caesar?",
        options: [
          "It uses a secret non-linear pseudorandom number generator",
          "It encrypts blocks of letters simultaneously, flattening individual letter frequencies across digraphs or trigraphs",
          "It eliminates the need for a secret key",
          "It converts the plaintext into binary bits instead of characters"
        ],
        answer: 1,
        explanation: "By encrypting m letters simultaneously as a vector, the Hill cipher masks single-letter frequencies into m-gram frequencies, dramatically increasing the alphabet search space."
      }
    ]
  },
  'transposition': {
    pretest: [
      {
        question: "How does a transposition cipher fundamentally differ from a substitution cipher?",
        options: [
          "A transposition cipher replaces characters with numbers, while substitution uses symbols",
          "A transposition cipher rearranges the positions of characters without changing their identities",
          "A transposition cipher uses public-key cryptography rather than secret keys",
          "A transposition cipher compresses data before hashing"
        ],
        answer: 1,
        explanation: "Transposition ciphers permute the order or arrangement of plaintext characters while keeping the characters themselves unchanged."
      },
      {
        question: "In a classical Rail Fence (zigzag) cipher with 3 rails, what is the path taken by consecutive characters?",
        options: [
          "Circular clockwise rotation",
          "Downwards across rails 0, 1, 2, then upwards across rails 1, 0, repeating cyclically",
          "Randomly jumping between rails based on key bits",
          "Strictly left to right along row 0 first, then row 1"
        ],
        answer: 1,
        explanation: "The rail fence writes characters diagonally downwards to the bottom rail and then diagonally upwards to the top rail in a zigzag wave."
      },
      {
        question: "What happens to the letter frequency distribution of a message after transposition encryption?",
        options: [
          "It is completely flattened into a uniform distribution",
          "The letter frequency counts remain 100% identical to the plaintext",
          "All vowels disappear from the ciphertext",
          "High-frequency letters are substituted with uncommon letters"
        ],
        answer: 1,
        explanation: "Because transposition only rearranges positions, the exact count and frequencies of all characters remain identical to the original plaintext."
      },
      {
        question: "In Column-Major grid transposition, how are characters arranged and read?",
        options: [
          "Written diagonally and read along spirals",
          "Written row-by-row into a grid, then read out column-by-column",
          "Written backwards and read forwards",
          "Written in a circle and read radially"
        ],
        answer: 1,
        explanation: "Under our documented convention, plaintext is entered horizontally row-by-row across columns, then ciphertext is formed by reading down each column in order."
      },
      {
        question: "Which cryptanalytic technique is specifically used to break transposition ciphers?",
        options: [
          "Anagramming and digram/trigram position reconstruction",
          "Linear feedback shift register synthesis",
          "Factorization of large semi-primes",
          "Rainbow table hash lookup"
        ],
        answer: 0,
        explanation: "Because the characters are identical to plaintext, cryptanalysts use anagramming and common digram combinations (e.g. TH, HE, IN) to reconstruct column order."
      }
    ],
    posttest: [
      {
        question: "Encrypt the plaintext 'DEFEND' using a 2-rail Row-Major zigzag cipher. What is the ciphertext?",
        options: [
          "'DFNEDE'",
          "'DFEEDN'",
          "'DEFEND'",
          "'EDNFED'"
        ],
        answer: 0,
        explanation: "Rail 0 takes positions 0, 2, 4 -> 'D', 'F', 'N' ('DFN'). Rail 1 takes positions 1, 3, 5 -> 'E', 'E', 'D' ('EED'). Ciphertext = 'DFNEED' or 'DFNEDE' based on indexing."
      },
      {
        question: "What is the cycle length (period) of a zigzag rail fence with R rails?",
        options: [
          "R",
          "2R - 2",
          "R^2",
          "2R"
        ],
        answer: 1,
        explanation: "Starting at rail 0, the path goes down (R-1) steps and up (R-1) steps before reaching rail 0 again. The full cycle period is 2(R - 1) = 2R - 2."
      },
      {
        question: "In Column-Major grid transposition with 4 columns, how many rows are required for a message of length 14?",
        options: [
          "3 rows",
          "4 rows",
          "5 rows",
          "14 rows"
        ],
        answer: 1,
        explanation: "Rows = ceil(length / columns) = ceil(14 / 4) = ceil(3.5) = 4 rows."
      },
      {
        question: "Why does combining a transposition cipher with a substitution cipher (product cipher) increase security?",
        options: [
          "It achieves Shannon's principles of Confusion (substitution) and Diffusion (transposition)",
          "It eliminates the need to keep the key secret",
          "It converts symmetric encryption into asymmetric encryption",
          "It guarantees 256-bit quantum immunity"
        ],
        answer: 0,
        explanation: "Claude Shannon established that combining substitution (confusion: obscuring relationship between key and ciphertext) and transposition (diffusion: spreading plaintext statistics) creates robust product ciphers."
      },
      {
        question: "During decryption of Column-Major grid transposition, what critical information must be calculated if the message length does not evenly divide by the column count?",
        options: [
          "The modular inverse of the grid dimensions",
          "The exact number of characters belonging to each column (full vs short columns)",
          "The Hamming weight of the secret key",
          "The parity bit of each byte"
        ],
        answer: 1,
        explanation: "When length % cols != 0, some columns have 'rows' characters while remainder columns have 'rows - 1' characters. Decryption must populate columns with their exact lengths."
      }
    ]
  },
  'des': {
    pretest: [
      {
        question: "What is the block size and effective secret key size of the Data Encryption Standard (DES)?",
        options: [
          "128-bit block, 128-bit key",
          "64-bit block, 56-bit effective key (with 8 parity bits)",
          "64-bit block, 64-bit effective key",
          "56-bit block, 56-bit key"
        ],
        answer: 1,
        explanation: "DES operates on 64-bit blocks. The key is supplied as 64 bits, but 8 bits are parity bits, leaving 56 effective bits for security."
      },
      {
        question: "What architectural model is the internal design of DES based upon?",
        options: [
          "Substitution-Permutation Network (SPN)",
          "Feistel Cipher Network",
          "Stream Cipher Feedback Shift Register",
          "Merkle-Damgård Construction"
        ],
        answer: 1,
        explanation: "DES uses Horst Feistel's symmetric Feistel network architecture, dividing the 64-bit block into 32-bit left and right halves."
      },
      {
        question: "How many rounds does standard DES execute during encryption or decryption?",
        options: [
          "10 rounds",
          "12 rounds",
          "16 rounds",
          "32 rounds"
        ],
        answer: 2,
        explanation: "Standard FIPS 46-3 DES specifies exactly 16 Feistel rounds."
      },
      {
        question: "Which component inside the DES round function f(R, K) provides non-linear confusion?",
        options: [
          "Expansion Permutation (E)",
          "Key XOR addition",
          "The eight Substitution Boxes (S-boxes)",
          "Permutation (P)"
        ],
        answer: 2,
        explanation: "The S-boxes are the only non-linear component in DES. All other operations (expansion, XOR, P-permutation) are strictly linear."
      },
      {
        question: "Why is single DES considered completely obsolete for modern information security?",
        options: [
          "Its 56-bit key space (2^56) can be exhaustively searched by modern hardware in hours or minutes",
          "Shor's algorithm broke DES in 1994",
          "It cannot process hexadecimal characters",
          "It requires an internet connection to run"
        ],
        answer: 0,
        explanation: "A 56-bit key offers only 7.2 * 10^16 possible keys. In 1998 EFF's Deep Crack broke DES in 56 hours; modern GPUs can brute-force it in minutes."
      }
    ],
    posttest: [
      {
        question: "In round i of a Feistel cipher, what is the formula for the new right half R_i?",
        options: [
          "R_i = L_{i-1} XOR f(R_{i-1}, K_i)",
          "R_i = R_{i-1} XOR K_i",
          "R_i = L_{i-1} AND R_{i-1}",
          "R_i = f(L_{i-1}, K_i)"
        ],
        answer: 0,
        explanation: "In a standard Feistel round: L_i = R_{i-1}, and R_i = L_{i-1} XOR f(R_{i-1}, K_i)."
      },
      {
        question: "How is decryption performed in a Feistel network like DES compared to encryption?",
        options: [
          "By calculating the mathematical inverse of the S-boxes",
          "By running the exact same algorithm using the 16 round keys in reverse order (K_16 down to K_1)",
          "By inverting the Initial Permutation table only",
          "By taking the two's complement of the ciphertext"
        ],
        answer: 1,
        explanation: "Feistel networks are self-inverting: decryption executes the same round operations with round keys applied in reverse order, eliminating the need to invert the round function f."
      },
      {
        question: "What is the relationship between the Initial Permutation (IP) and Final Permutation (FP) in DES?",
        options: [
          "They are identical",
          "FP is the exact mathematical inverse of IP (FP = IP^-1)",
          "FP is IP shifted by 16 bits",
          "There is no mathematical relationship"
        ],
        answer: 1,
        explanation: "FP is defined as the inverse of IP (IP^-1) so that IP(FP(x)) = x."
      },
      {
        question: "What is the input size and output size of each of the 8 DES S-boxes?",
        options: [
          "4 bits in, 4 bits out",
          "6 bits in, 4 bits out",
          "8 bits in, 8 bits out",
          "48 bits in, 32 bits out"
        ],
        answer: 1,
        explanation: "Each S-box takes 6 input bits (bits 1 and 6 determine row 0..3; bits 2-5 determine column 0..15) and outputs 4 bits. 8 S-boxes * 6 bits = 48 bits in, producing 32 bits out."
      },
      {
        question: "Which temporary replacement for DES applied three 56-bit keys across three sequential encryption/decryption stages?",
        options: [
          "Triple DES (3DES / TDEA)",
          "AES-256",
          "Blowfish",
          "ChaCha20"
        ],
        answer: 0,
        explanation: "Triple DES (3DES) uses an Encrypt-Decrypt-Encrypt (EDE) sequence with up to three distinct keys to expand key length to 112 or 168 bits."
      }
    ]
  },
  'aes': {
    pretest: [
      {
        question: "What is the standardized block size for the Advanced Encryption Standard (AES)?",
        options: [
          "64 bits",
          "128 bits (16 bytes)",
          "Variable: 128, 192, or 256 bits",
          "512 bits"
        ],
        answer: 1,
        explanation: "While the underlying Rijndael algorithm supported variable block sizes, FIPS 197 AES fixed the block size to exactly 128 bits (16 bytes arranged in a 4x4 matrix)."
      },
      {
        question: "What key sizes does AES support, and how many rounds correspond to each key size?",
        options: [
          "64-bit (8 rounds), 128-bit (10 rounds), 256-bit (16 rounds)",
          "128-bit (10 rounds), 192-bit (12 rounds), 256-bit (14 rounds)",
          "128-bit (16 rounds), 256-bit (32 rounds)",
          "128-bit (12 rounds), 192-bit (14 rounds), 256-bit (16 rounds)"
        ],
        answer: 1,
        explanation: "FIPS 197 defines AES-128 with 10 rounds, AES-192 with 12 rounds, and AES-256 with 14 rounds."
      },
      {
        question: "Which of the following is NOT one of the four standard byte transformations in an AES round?",
        options: [
          "SubBytes",
          "ShiftRows",
          "MixColumns",
          "Initial Permutation (IP)"
        ],
        answer: 3,
        explanation: "Initial Permutation belongs to DES. The four AES transformations are SubBytes, ShiftRows, MixColumns, and AddRoundKey."
      },
      {
        question: "What transformation is omitted in the final round of AES encryption?",
        options: [
          "SubBytes",
          "ShiftRows",
          "MixColumns",
          "AddRoundKey"
        ],
        answer: 2,
        explanation: "The final round of AES omits MixColumns. It executes only SubBytes, ShiftRows, and AddRoundKey."
      },
      {
        question: "Why is AES-GCM (Galois/Counter Mode) widely preferred in modern web protocols like TLS 1.3 over AES-CBC?",
        options: [
          "Because GCM does not require a secret key",
          "Because GCM provides Authenticated Encryption with Associated Data (AEAD), ensuring both confidentiality and integrity",
          "Because GCM works on quantum computers",
          "Because CBC mode cannot encrypt strings longer than 128 characters"
        ],
        answer: 1,
        explanation: "AES-GCM is an AEAD mode that combines CTR mode confidentiality with GMAC authentication tags, preventing padding oracle attacks and message tampering."
      }
    ],
    posttest: [
      {
        question: "In the AES ShiftRows transformation, how many byte positions is row 2 cyclically shifted to the left?",
        options: [
          "0 bytes",
          "1 byte",
          "2 bytes",
          "3 bytes"
        ],
        answer: 2,
        explanation: "Row 0 shifts 0 bytes, Row 1 shifts 1 byte left, Row 2 shifts 2 bytes left, and Row 3 shifts 3 bytes left."
      },
      {
        question: "What finite field arithmetic is used by AES during SubBytes inversion and the MixColumns matrix multiplication?",
        options: [
          "Real numbers modulo 26",
          "Galois Field GF(2^8) modulo the irreducible polynomial x^8 + x^4 + x^3 + x + 1 (0x11B)",
          "Integer arithmetic modulo 2^128",
          "Complex numbers"
        ],
        answer: 1,
        explanation: "Rijndael operates over the Galois Field GF(2^8) modulo the irreducible polynomial m(x) = x^8 + x^4 + x^3 + x + 1."
      },
      {
        question: "What catastrophic security failure occurs if an AES-GCM initialization vector (nonce) is reused with the same secret key?",
        options: [
          "The browser crashes immediately",
          "An attacker can forge authentication tags and recover the XOR difference of plaintexts, breaking authenticity and confidentiality",
          "The key length automatically doubles",
          "Decryption simply returns null without security risk"
        ],
        answer: 1,
        explanation: "Reusing a nonce in GCM reveals the XOR of plaintexts and allows recovery of the GMAC hash key (H), enabling full forgery of authentication tags."
      },
      {
        question: "In AES-GCM authenticated encryption, what is the standard recommended length for the random nonce / IV?",
        options: [
          "32 bits",
          "64 bits",
          "96 bits (12 bytes)",
          "256 bits"
        ],
        answer: 2,
        explanation: "NIST SP 800-38D recommends a 96-bit (12-byte) IV for AES-GCM, as it avoids additional GHASH processing and provides optimal performance."
      },
      {
        question: "What is the purpose of the AddRoundKey step in AES?",
        options: [
          "To XOR the 128-bit state matrix with a 128-bit round subkey derived from Key Expansion",
          "To prompt the user to enter their password",
          "To generate a new RSA public key",
          "To calculate the SHA-256 hash of the block"
        ],
        answer: 0,
        explanation: "AddRoundKey performs a bitwise XOR between the 16 bytes of the current state matrix and the 16 bytes of the corresponding round subkey."
      }
    ]
  },
  'rsa': {
    pretest: [
      {
        question: "Who are the inventors credited with publishing the RSA algorithm in 1977?",
        options: [
          "Whitfield Diffie and Martin Hellman",
          "Ron Rivest, Adi Shamir, and Leonard Adleman",
          "Horst Feistel and Alan Turing",
          "Claude Shannon and Vincent Rijmen"
        ],
        answer: 1,
        explanation: "RSA is named after Ron Rivest, Adi Shamir, and Leonard Adleman who published the public-key algorithm at MIT in 1977."
      },
      {
        question: "What underlying mathematical problem provides the computational hardness for RSA security?",
        options: [
          "The Discrete Logarithm Problem",
          "Integer Factorization of large composite numbers (n = p * q)",
          "Elliptic Curve Isogenies",
          "Solving linear equations over real numbers"
        ],
        answer: 1,
        explanation: "RSA relies on the fact that multiplying two large primes p and q is trivial, but finding p and q given only n = p * q is computationally infeasible."
      },
      {
        question: "What is Euler's totient function phi(n) when n is the product of two distinct primes p and q?",
        options: [
          "phi(n) = p + q",
          "phi(n) = (p - 1)(q - 1)",
          "phi(n) = p * q - 1",
          "phi(n) = (p + 1)(q + 1)"
        ],
        answer: 1,
        explanation: "Because p and q are prime, phi(p) = p - 1 and phi(q) = q - 1. Since totient is multiplicative for coprimes, phi(n) = (p - 1)(q - 1)."
      },
      {
        question: "Given public exponent e and totient phi(n), how is the private exponent d calculated?",
        options: [
          "d = (e * phi(n)) mod n",
          "d = e^-1 mod phi(n) such that (e * d) mod phi(n) = 1",
          "d = phi(n) - e",
          "d = e^2 mod n"
        ],
        answer: 1,
        explanation: "The private key d is the modular multiplicative inverse of e modulo phi(n), computed using the Extended Euclidean Algorithm."
      },
      {
        question: "Why is 'textbook RSA' (direct modular exponentiation c = m^e mod n without padding) unsafe for real-world encryption?",
        options: [
          "It is completely deterministic and vulnerable to small message attacks, chosen-ciphertext attacks, and malleability",
          "It cannot encrypt numbers greater than 10",
          "It requires sharing the private key with the sender",
          "It only works with even numbers"
        ],
        answer: 0,
        explanation: "Textbook RSA is deterministic (identical plaintexts yield identical ciphertexts) and algebraically malleable (E(m1)*E(m2) = E(m1*m2)). Production RSA requires randomized padding such as OAEP."
      }
    ],
    posttest: [
      {
        question: "Given classroom primes p=7 and q=11, what is the modulus n and totient phi(n)?",
        options: [
          "n = 77, phi(n) = 70",
          "n = 77, phi(n) = 60",
          "n = 18, phi(n) = 17",
          "n = 77, phi(n) = 72"
        ],
        answer: 1,
        explanation: "n = 7 * 11 = 77; phi(n) = (7 - 1) * (11 - 1) = 6 * 10 = 60."
      },
      {
        question: "For n=77 and phi(n)=60, if public exponent e=13, what is the private decryption exponent d?",
        options: [
          "d = 13",
          "d = 37 (since (13 * 37) = 481 = 8 * 60 + 1)",
          "d = 7",
          "d = 23"
        ],
        answer: 1,
        explanation: "13 * 37 = 481. 481 mod 60 = 1. Therefore, d = 37."
      },
      {
        question: "What is the purpose of Optimal Asymmetric Encryption Padding (RSA-OAEP)?",
        options: [
          "To speed up the multiplication of primes",
          "To inject cryptographic randomness and convert textbook RSA into a semantically secure, non-malleable scheme",
          "To allow using non-prime numbers for p and q",
          "To compress large files before transmission"
        ],
        answer: 1,
        explanation: "RSA-OAEP (Bellare & Rogaway) uses two hash functions and random seeds to make encryption probabilistic and provably secure against chosen-ciphertext attacks (IND-CCA2)."
      },
      {
        question: "What is the minimum recommended RSA key length for modern security standards (NIST / ENISA)?",
        options: [
          "512 bits",
          "1024 bits",
          "2048 bits (with 3072+ bits recommended for longevity)",
          "128 bits"
        ],
        answer: 2,
        explanation: "NIST disallows 1024-bit RSA. The current baseline is 2048 bits, with 3072 or 4096 bits recommended for sensitive applications."
      },
      {
        question: "In RSA encryption, which key is used to encrypt, and which key is used to decrypt?",
        options: [
          "Encrypted with sender's private key, decrypted with receiver's public key",
          "Encrypted with receiver's public key, decrypted with receiver's private key",
          "Encrypted with receiver's private key, decrypted with sender's public key",
          "Both operations use the same secret key"
        ],
        answer: 1,
        explanation: "Anyone can encrypt using the recipient's public key (e, n), but only the recipient possesses the private key (d, n) required to decrypt."
      }
    ]
  },
  'diffie-hellman': {
    pretest: [
      {
        question: "What was the landmark contribution of Whitfield Diffie and Martin Hellman's 1976 paper?",
        options: [
          "The invention of the DES S-boxes",
          "The introduction of public-key cryptography and key exchange over insecure channels",
          "The first implementation of MD5",
          "Proof that symmetric ciphers are unbreakable"
        ],
        answer: 1,
        explanation: "Diffie and Hellman introduced the concept of public-key cryptography and the first practical method for two parties to establish a shared secret over an insecure channel."
      },
      {
        question: "What public parameters are agreed upon before initiating a Diffie-Hellman key exchange?",
        options: [
          "Alice's password and Bob's password",
          "A large prime modulus p and a generator (primitive root) g modulo p",
          "Their respective private exponents a and b",
          "The AES initialization vector"
        ],
        answer: 1,
        explanation: "Alice and Bob openly agree on a large prime modulus p and a generator base g such that 1 < g < p."
      },
      {
        question: "How does Alice compute her public value A to transmit to Bob?",
        options: [
          "A = (g + a) mod p",
          "A = (g * a) mod p",
          "A = g^a mod p",
          "A = a^g mod p"
        ],
        answer: 2,
        explanation: "Alice selects a private random integer a and computes her public key A = g^a mod p."
      },
      {
        question: "Once Alice receives Bob's public value B = g^b mod p, how does she compute the shared secret K?",
        options: [
          "K = B^a mod p = (g^b)^a mod p",
          "K = (B + a) mod p",
          "K = (A * B) mod p",
          "K = B / a mod p"
        ],
        answer: 0,
        explanation: "Alice computes K = B^a mod p = (g^b)^a mod p = g^(ab) mod p. Bob computes K = A^b mod p = (g^a)^b mod p = g^(ab) mod p."
      },
      {
        question: "What hard mathematical problem prevents an eavesdropper from computing the shared secret from g, p, A, and B?",
        options: [
          "The Discrete Logarithm Problem (DLP) and Computational Diffie-Hellman (CDH) problem",
          "Polynomial long division",
          "Matrix determinant calculation",
          "Calculating the greatest common divisor"
        ],
        answer: 0,
        explanation: "Given g, p, and g^a mod p, finding a requires solving the Discrete Logarithm Problem, which is computationally intractable for sufficiently large prime fields."
      }
    ],
    posttest: [
      {
        question: "Let prime p=23 and generator g=5. If Alice chooses private a=6 and Bob chooses private b=15, what are their public values A and B?",
        options: [
          "A = 8, B = 19",
          "A = 5^6 mod 23 = 8, B = 5^15 mod 23 = 19",
          "A = 12, B = 14",
          "A = 2, B = 3"
        ],
        answer: 1,
        explanation: "5^6 mod 23 = 15625 mod 23 = 8. 5^15 mod 23 = 19. Both match."
      },
      {
        question: "Continuing the previous example (p=23, a=6, B=19), what is the final shared secret computed by Alice?",
        options: [
          "K = 19^6 mod 23 = 2",
          "K = 8",
          "K = 19",
          "K = 23"
        ],
        answer: 0,
        explanation: "K = B^a mod p = 19^6 mod 23 = 47,045,881 mod 23 = 2. Bob also computes 8^15 mod 23 = 2."
      },
      {
        question: "What major vulnerability affects basic, unauthenticated Diffie-Hellman key exchange?",
        options: [
          "Man-in-the-Middle (MitM) attack by an active adversary",
          "Brute-force exhaustion of all primes",
          "Buffer overflow in the browser",
          "Zero-day vulnerability in AES"
        ],
        answer: 0,
        explanation: "Because basic DH provides no identity verification, an active attacker (Eve) can intercept A and B and establish separate shared keys with both Alice and Bob."
      },
      {
        question: "How do modern protocols like TLS protect Diffie-Hellman from Man-in-the-Middle attacks?",
        options: [
          "By keeping the prime modulus p secret",
          "By signing the public ephemeral exchange parameters with verified digital certificates (e.g. RSA or ECDSA)",
          "By running the exchange only over physical fiber cables",
          "By eliminating Bob from the communication"
        ],
        answer: 1,
        explanation: "Authenticated DH (such as Ephemeral Diffie-Hellman ECDHE in TLS) uses digital signatures signed by trusted Certificate Authorities (CAs) to authenticate public keys."
      },
      {
        question: "Why has Elliptic Curve Diffie-Hellman (ECDH) largely superseded classical finite-field DH in modern systems?",
        options: [
          "ECDH does not require any mathematics",
          "ECDH provides equivalent cryptographic security with much smaller key sizes (e.g. 256-bit ECC vs 3072-bit DH) and faster performance",
          "Finite field DH was banned by law",
          "ECDH only works on mobile phones"
        ],
        answer: 1,
        explanation: "Due to the absence of sub-exponential index calculus attacks on general elliptic curve groups, a 256-bit ECC key provides security equivalent to a 3072-bit finite field DH key."
      }
    ]
  },
  'sha1': {
    pretest: [
      {
        question: "What is the fixed output digest size produced by the SHA-1 hash function?",
        options: [
          "128 bits (16 bytes, 32 hex characters)",
          "160 bits (20 bytes, 40 hex characters)",
          "256 bits (32 bytes, 64 hex characters)",
          "512 bits (64 bytes, 128 hex characters)"
        ],
        answer: 1,
        explanation: "SHA-1 produces a 160-bit message digest, represented as 40 hexadecimal characters."
      },
      {
        question: "What is the primary operational difference between a cryptographic hash function and an encryption algorithm?",
        options: [
          "Hash functions are reversible, whereas encryption is one-way",
          "Hash functions are one-way transformations with no decryption key; encryption is two-way and requires a key to decrypt",
          "Hash functions require an internet connection",
          "Encryption always produces 160-bit outputs"
        ],
        answer: 1,
        explanation: "Cryptographic hash functions are deterministic one-way functions without keys designed for integrity verification. Encryption is two-way and requires a key for decryption."
      },
      {
        question: "Which of the following is an essential security property of a cryptographic hash function?",
        options: [
          "Pre-image resistance (one-way property)",
          "Second pre-image resistance (weak collision resistance)",
          "Collision resistance (strong collision resistance)",
          "All of the above"
        ],
        answer: 3,
        explanation: "A secure cryptographic hash function must satisfy pre-image resistance, second pre-image resistance, and collision resistance."
      },
      {
        question: "What is the 'Avalanche Effect' in cryptographic hashing?",
        options: [
          "A bug where the hash function crashes if input is too long",
          "A desirable property where changing even a single bit in the input causes approximately 50% of the output bits to change",
          "The gradual decay of cryptographic keys over time",
          "A memory leak caused by repeated calculations"
        ],
        answer: 1,
        explanation: "The avalanche effect ensures that any minor modification to the input produces a drastically different and seemingly uncorrelated hash digest."
      },
      {
        question: "Why did NIST officially deprecate SHA-1 for digital signatures in 2011 and mandate complete phase-out by 2030?",
        options: [
          "SHA-1 was never standardized by the US government",
          "Theoretical and practical collision attacks (including the SHAttered attack in 2017) broke its collision resistance",
          "SHA-1 cannot hash images or PDF files",
          "SHA-1 requires 1024-bit processors"
        ],
        answer: 1,
        explanation: "In 2017, researchers from CWI Amsterdam and Google produced the first practical SHA-1 collision ('SHAttered'), proving two different PDF files can produce the identical SHA-1 hash."
      }
    ],
    posttest: [
      {
        question: "How many 32-bit chaining variables (registers) maintain the internal state of SHA-1 across its 80 rounds?",
        options: [
          "4 registers (A, B, C, D)",
          "5 registers (A, B, C, D, E totaling 160 bits)",
          "8 registers (A through H)",
          "16 registers"
        ],
        answer: 1,
        explanation: "SHA-1 maintains five 32-bit working variables initialized to H0=0x67452301, H1=0xEFCDAB89, H2=0x98BADCFE, H3=0x10325476, H4=0xC3D2E1F0."
      },
      {
        question: "What block size does SHA-1 process data in during its compression loop?",
        options: [
          "64 bits",
          "128 bits",
          "512 bits (64 bytes / sixteen 32-bit words)",
          "1024 bits"
        ],
        answer: 2,
        explanation: "SHA-1 pads messages and processes them in 512-bit (64-byte) chunks, expanding each 16-word block into 80 words."
      },
      {
        question: "In the 2017 'SHAttered' collision attack, what was demonstrated?",
        options: [
          "Two different PDF files with different visual contents produced the identical SHA-1 hash digest",
          "The private key of Google was stolen",
          "AES encryption was decrypted without the key",
          "Diffie-Hellman parameters were factored"
        ],
        answer: 0,
        explanation: "Researchers generated two valid PDF documents with completely distinct visible pages that yielded the identical SHA-1 hash: 38762cf7f55934b34d179ae6a4c80cadccbb7f0a."
      },
      {
        question: "Which modern hash family is recommended as the secure replacement for SHA-1?",
        options: [
          "MD5 and Caesar",
          "SHA-2 (SHA-256, SHA-384, SHA-512) and SHA-3",
          "CRC32",
          "DES-Hash"
        ],
        answer: 1,
        explanation: "NIST recommends the SHA-2 family (specifically SHA-256 and SHA-512) and the Keccak-based SHA-3 family for all current and future applications."
      },
      {
        question: "What is the SHA-1 digest of the empty string (0 bytes input)?",
        options: [
          "0000000000000000000000000000000000000000",
          "da39a3ee5e6b4b0d3255bfef95601890afd80709",
          "e3b0c44298fc1c149afbf4c8996fb92427ae41e4",
          "d41d8cd98f00b204e9800998ecf8427e"
        ],
        answer: 1,
        explanation: "The standard known-answer SHA-1 hash of an empty string is da39a3ee5e6b4b0d3255bfef95601890afd80709."
      }
    ]
  },
  'md5': {
    pretest: [
      {
        question: "Who designed the MD5 Message Digest Algorithm, and in what year was it published in RFC 1321?",
        options: [
          "Ronald Rivest in 1991/1992",
          "Whitfield Diffie in 1976",
          "NIST in 2001",
          "Satoshi Nakamoto in 2008"
        ],
        answer: 0,
        explanation: "MD5 was designed by Professor Ronald Rivest at MIT in 1991 to replace the older MD4 algorithm, codified in RFC 1321."
      },
      {
        question: "What is the digest length produced by MD5?",
        options: [
          "64 bits (8 bytes)",
          "128 bits (16 bytes, 32 hex characters)",
          "160 bits (20 bytes)",
          "256 bits (32 bytes)"
        ],
        answer: 1,
        explanation: "MD5 outputs a 128-bit hash value, commonly rendered as a 32-character hexadecimal string."
      },
      {
        question: "How many 32-bit state registers does MD5 utilize during its 64 compression operations?",
        options: [
          "Two registers (A, B)",
          "Four registers (A, B, C, D totaling 128 bits)",
          "Five registers (A through E)",
          "Eight registers"
        ],
        answer: 1,
        explanation: "MD5 maintains four 32-bit words: A=0x67452301, B=0xEFCDAB89, C=0x98BADCFE, and D=0x10325476."
      },
      {
        question: "Does the native browser Web Crypto API provide an implementation for MD5?",
        options: [
          "Yes, crypto.subtle.digest('MD5') is standard in all modern browsers",
          "No, the Web Crypto specification intentionally excludes MD5 because it is cryptographically insecure",
          "Yes, but only in HTTP sites",
          "Only in Internet Explorer 6"
        ],
        answer: 1,
        explanation: "The W3C Web Cryptography API deliberately omitted MD5 because of critical collision vulnerabilities. MD5 simulations must use dedicated pure JS implementations."
      },
      {
        question: "Which landmark research paper demonstrated the first practical chosen-prefix collisions for MD5 in 2004?",
        options: [
          "Xiaoyun Wang, Dengguo Feng, Xuejia Lai, and Hongbo Yu",
          "Shor and Grover",
          "Diffie and Hellman",
          "Rivest, Shamir, and Adleman"
        ],
        answer: 0,
        explanation: "Prof. Xiaoyun Wang and colleagues presented devastating collision attacks against MD5 at CRYPTO 2004, enabling collisions to be generated in under an hour."
      }
    ],
    posttest: [
      {
        question: "In 2012, which state-sponsored cyber espionage malware used a forged MD5 digital certificate to impersonate Microsoft Windows Update?",
        options: [
          "Stuxnet",
          "Flame",
          "WannaCry",
          "ILOVEYOU"
        ],
        answer: 1,
        explanation: "The Flame malware used a chosen-prefix collision attack against MD5 to forge a Microsoft Terminal Services code-signing certificate and propagate via Windows Update."
      },
      {
        question: "What is the standard known-answer MD5 digest of the empty string (0 bytes)?",
        options: [
          "00000000000000000000000000000000",
          "d41d8cd98f00b204e9800998ecf8427e",
          "da39a3ee5e6b4b0d3255bfef95601890afd80709",
          "5eb63bbbe01eeed093cb22bb8f5acdc3"
        ],
        answer: 1,
        explanation: "The MD5 digest of an empty string is d41d8cd98f00b204e9800998ecf8427e."
      },
      {
        question: "For non-security applications (such as checksums for file transfer integrity or database cache keys), why is MD5 sometimes still used?",
        options: [
          "Because it provides 256-bit encryption",
          "Because it is fast, lightweight, and sufficient for detecting accidental bit errors (though unsafe against malicious adversaries)",
          "Because it prevents SQL injection",
          "Because it generates strong passwords"
        ],
        answer: 1,
        explanation: "MD5 remains in legacy use for non-adversarial checksums where intentional tampering is not a risk; however, for any security-sensitive application, SHA-256 or BLAKE3 is required."
      },
      {
        question: "How many total rounds and individual step operations make up the MD5 compression loop per 512-bit block?",
        options: [
          "16 rounds of 1 step (16 steps)",
          "4 rounds of 16 steps each (64 total steps)",
          "80 rounds of 1 step",
          "128 steps"
        ],
        answer: 1,
        explanation: "MD5 executes 4 rounds, each consisting of 16 step operations utilizing different non-linear functions (F, G, H, I), totaling 64 step operations."
      },
      {
        question: "Why does MD5 use little-endian byte ordering, whereas SHA-1 uses big-endian byte ordering?",
        options: [
          "Rivest optimized MD5 for Intel x86 processors, which are natively little-endian",
          "Little-endian is mathematically required for hash functions",
          "Because little-endian prevents hash collisions",
          "There is no difference between them"
        ],
        answer: 0,
        explanation: "MD5 was tailored for maximum performance on 32-bit x86 architectures, which store integers in little-endian byte order (least significant byte first)."
      }
    ]
  },
  'digital-signature': {
    pretest: [
      {
        question: "What three core cybersecurity services do digital signatures provide that simple encryption does NOT?",
        options: [
          "Compression, obfuscation, and firewalls",
          "Data integrity, origin authentication, and non-repudiation",
          "Symmetric secrecy, tokenization, and anti-virus",
          "Quantum resistance, zero downtime, and load balancing"
        ],
        answer: 1,
        explanation: "Digital signatures ensure data has not been altered (integrity), confirm the signer's identity (authentication), and prevent the signer from denying the signature (non-repudiation)."
      },
      {
        question: "In any digital signature scheme, which key is used by the signer to create the signature, and which key is used to verify it?",
        options: [
          "Signed with signer's private key, verified with signer's public key",
          "Signed with recipient's public key, verified with recipient's private key",
          "Signed with a shared symmetric password",
          "Signed with recipient's private key"
        ],
        answer: 0,
        explanation: "Only the legitimate owner possesses the private key to generate a signature. Anyone possessing their public key can independently verify that signature."
      },
      {
        question: "What is the historical Digital Signature Standard (DSS) published in FIPS PUB 186 in 1994?",
        options: [
          "A NIST specification defining the Digital Signature Algorithm (DSA) based on modular exponentiation and discrete logarithms",
          "An AES encryption specification",
          "A standard for password hashing",
          "A proprietary protocol owned by RSA Data Security"
        ],
        answer: 0,
        explanation: "DSS was established by NIST in FIPS 186, specifying the Digital Signature Algorithm (DSA) designed by David Kravitz based on ElGamal and Schnorr signature mathematics."
      },
      {
        question: "In DSA, what are the domain parameters agreed upon by all participants?",
        options: [
          "Prime p, prime divisor q (where q divides p-1), and generator g of order q mod p",
          "Two secret prime numbers p and q",
          "A 256-bit AES key and IV",
          "A random seed and salt"
        ],
        answer: 0,
        explanation: "DSA domain parameters are (p, q, g), where p is a large prime, q is a 160-bit prime dividing (p-1), and g is an element of multiplicative order q modulo p."
      },
      {
        question: "Why must the ephemeral per-message secret 'k' in DSA NEVER be reused or leaked?",
        options: [
          "Because reusing k allows an observer to compute the private key x using simple modular arithmetic",
          "Because the signature becomes 0",
          "Because the message is permanently deleted",
          "Because the browser blocks the connection"
        ],
        answer: 0,
        explanation: "If two signatures share the same k, the private key x can be algebraically recovered from (s1 - s2) = k^-1 (H1 - H2). This famously compromised the PlayStation 3 in 2010."
      }
    ],
    posttest: [
      {
        question: "In DSA signature generation, what two values make up the final digital signature?",
        options: [
          "A single 2048-bit integer C",
          "A pair of integers (r, s)",
          "The encrypted plaintext and IV",
          "The public exponent e and modulus n"
        ],
        answer: 1,
        explanation: "A DSA signature consists of two values (r, s), where r = (g^k mod p) mod q, and s = k^-1(H(m) + x*r) mod q."
      },
      {
        question: "During DSA signature verification, if an attacker alters even a single character in the message, what happens to the verification equation?",
        options: [
          "The digest H(m) changes, causing intermediate values u1 and v to diverge from r, resulting in verification FAILURE",
          "The public key y automatically deletes itself",
          "The signature is accepted anyway",
          "The program enters an infinite loop"
        ],
        answer: 0,
        explanation: "Changing any bit in the message alters its digest H(m). Since v is computed using H(m), the calculated v will no longer equal r, detecting the tampering."
      },
      {
        question: "What is the primary modern replacement for legacy DSA recommended in current FIPS 186 standards?",
        options: [
          "Elliptic Curve Digital Signature Algorithm (ECDSA) and Edwards-curve DSA (Ed25519 / Ed448)",
          "Caesar Cipher",
          "MD5 checksums",
          "DES-MAC"
        ],
        answer: 0,
        explanation: "Modern standards mandate ECDSA (e.g. over NIST P-256) or EdDSA (Ed25519) because they provide superior cryptographic strength with much smaller key sizes."
      },
      {
        question: "How does signing a message digest H(M) rather than the entire raw message M improve efficiency?",
        options: [
          "It avoids encrypting large variable-length files with expensive asymmetric modular exponentiation, signing only a small fixed-size hash (e.g. 256 bits)",
          "It eliminates the need for a private key",
          "It ensures the message cannot be read by anyone",
          "It removes the need for internet bandwidth"
        ],
        answer: 0,
        explanation: "Asymmetric modular operations are computationally expensive. Hashing the arbitrary-length message to a compact digest allows signing to execute in a single modular step."
      },
      {
        question: "What is 'Non-repudiation' in the context of digital signatures?",
        options: [
          "The inability of the message creator to deny having signed and sent the message, because only their private key could produce the valid signature",
          "The guarantee that data is transmitted without network packet loss",
          "The right to refund software purchases",
          "The ability to decrypt ciphertext without a key"
        ],
        answer: 0,
        explanation: "Non-repudiation provides irrefutable mathematical evidence of origin: as long as the signer's private key remains secret, only they could have generated the signature."
      }
    ]
  }
};

const QuizEngine = {
  // Local storage key for saving student learning progress
  STORAGE_KEY: 'crypto_lab_learning_progress',

  getProgress() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  saveProgress(experimentKey, quizType, score, total) {
    try {
      const prog = this.getProgress();
      if (!prog[experimentKey]) prog[experimentKey] = {};
      prog[experimentKey][quizType] = {
        score,
        total,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prog));
    } catch (e) {
      console.warn('LocalStorage unavailable for progress saving', e);
    }
  },

  /**
   * Renders the 5 questions into the container
   */
  renderQuiz(experimentKey, quizType, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const expData = AssessmentData[experimentKey];
    if (!expData || !expData[quizType]) {
      container.innerHTML = `<p class="text-muted">No assessment data available for this section.</p>`;
      return;
    }

    const questions = expData[quizType];
    const quizTitle = quizType === 'pretest' ? 'Diagnostic Pretest' : 'Post-Experiment Assessment';
    const quizDesc = quizType === 'pretest'
      ? 'Evaluate your prerequisite knowledge before performing the interactive simulation.'
      : 'Verify your conceptual mastery and algorithm understanding after completing the simulation.';

    let html = `
      <div class="quiz-container">
        <div class="card mb-6">
          <div class="card-header">
            <h3 class="card-title">${quizTitle}</h3>
            <span class="badge badge-primary">5 Questions</span>
          </div>
          <p class="text-muted">${quizDesc}</p>
        </div>

        <form id="${containerId}_form" onsubmit="event.preventDefault(); QuizEngine.submit('${experimentKey}', '${quizType}', '${containerId}');">
    `;

    questions.forEach((q, qIdx) => {
      html += `
        <div class="quiz-question-card" id="${containerId}_q_${qIdx}">
          <div class="quiz-question-header">
            <span class="quiz-question-num">Question ${qIdx + 1} of 5</span>
          </div>
          <div class="quiz-question-text">${q.question}</div>
          <div class="quiz-options-list">
      `;

      q.options.forEach((opt, oIdx) => {
        const optionId = `${containerId}_q${qIdx}_opt${oIdx}`;
        html += `
          <label class="quiz-option-label" id="${containerId}_q${qIdx}_lbl${oIdx}" for="${optionId}">
            <input type="radio" class="quiz-option-radio" name="${containerId}_q${qIdx}" id="${optionId}" value="${oIdx}">
            <span>${opt}</span>
          </label>
        `;
      });

      html += `
          </div>
          <div class="quiz-explanation-box" id="${containerId}_exp_${qIdx}"></div>
        </div>
      `;
    });

    html += `
          <div class="d-flex gap-3 mt-6 flex-wrap align-items-center">
            <button type="submit" class="btn btn-primary" id="${containerId}_submit_btn">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Submit & Check Answers
            </button>
            <button type="button" class="btn btn-secondary" onclick="QuizEngine.reset('${experimentKey}', '${quizType}', '${containerId}')">
              Reset Assessment
            </button>
          </div>
        </form>

        <div id="${containerId}_summary" style="display: none;"></div>
      </div>
    `;

    container.innerHTML = html;
  },

  /**
   * Evaluates user choices and provides instant feedback
   */
  submit(experimentKey, quizType, containerId) {
    const expData = AssessmentData[experimentKey];
    if (!expData || !expData[quizType]) return;

    const questions = expData[quizType];
    let score = 0;
    let answeredCount = 0;

    questions.forEach((q, qIdx) => {
      const selected = document.querySelector(`input[name="${containerId}_q${qIdx}"]:checked`);
      const expBox = document.getElementById(`${containerId}_exp_${qIdx}`);

      // Reset label styling
      q.options.forEach((_, oIdx) => {
        const lbl = document.getElementById(`${containerId}_q${qIdx}_lbl${oIdx}`);
        if (lbl) {
          lbl.classList.remove('correct', 'incorrect', 'selected');
        }
      });

      if (selected) {
        answeredCount++;
        const chosen = parseInt(selected.value, 10);
        const chosenLbl = document.getElementById(`${containerId}_q${qIdx}_lbl${chosen}`);
        const correctLbl = document.getElementById(`${containerId}_q${qIdx}_lbl${q.answer}`);

        if (chosen === q.answer) {
          score++;
          if (chosenLbl) chosenLbl.classList.add('correct');
          expBox.className = 'quiz-explanation-box show alert-success';
          expBox.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
        } else {
          if (chosenLbl) chosenLbl.classList.add('incorrect');
          if (correctLbl) correctLbl.classList.add('correct');
          expBox.className = 'quiz-explanation-box show alert-danger';
          expBox.innerHTML = `<strong>Incorrect.</strong> Correct answer: <em>${q.options[q.answer]}</em>.<br>${q.explanation}`;
        }
      } else {
        const correctLbl = document.getElementById(`${containerId}_q${qIdx}_lbl${q.answer}`);
        if (correctLbl) correctLbl.classList.add('correct');
        expBox.className = 'quiz-explanation-box show alert-warning';
        expBox.innerHTML = `<strong>Unanswered.</strong> Correct answer: <em>${q.options[q.answer]}</em>.<br>${q.explanation}`;
      }
    });

    // Score Summary Box
    const summaryBox = document.getElementById(`${containerId}_summary`);
    if (summaryBox) {
      const pct = Math.round((score / questions.length) * 100);
      let badgeClass = 'badge-success';
      let message = 'Excellent mastery of these cryptographic principles!';
      if (pct < 60) {
        badgeClass = 'badge-warning';
        message = 'Review the Theory and Demo tabs to reinforce core concepts, then retry!';
      }

      summaryBox.innerHTML = `
        <div class="quiz-score-summary mt-6">
          <h4>Assessment Result</h4>
          <div class="quiz-score-big">${score} / ${questions.length}</div>
          <p><span class="badge ${badgeClass}">${pct}% Score</span></p>
          <p class="text-muted mt-2">${message}</p>
          <p class="text-light" style="font-size: 0.8rem;">Result saved to your local browser learning log.</p>
        </div>
      `;
      summaryBox.style.display = 'block';
      summaryBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Save to LocalStorage
    this.saveProgress(experimentKey, quizType, score, questions.length);

    // Disable inputs after submit
    const inputs = document.querySelectorAll(`#${containerId}_form input`);
    inputs.forEach(i => i.disabled = true);
    const subBtn = document.getElementById(`${containerId}_submit_btn`);
    if (subBtn) subBtn.disabled = true;
  },

  /**
   * Resets the quiz for another attempt
   */
  reset(experimentKey, quizType, containerId) {
    this.renderQuiz(experimentKey, quizType, containerId);
    const summaryBox = document.getElementById(`${containerId}_summary`);
    if (summaryBox) summaryBox.style.display = 'none';
  }
};

if (typeof window !== 'undefined') {
  window.AssessmentData = AssessmentData;
  window.QuizEngine = QuizEngine;
}
