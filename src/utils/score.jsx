/**
 * JEE SOCIETY AI — FINAL MODEL SPEC (PRODUCTION)
 * * Implements strict scoring logic for 2026/2027 attempts.
 */

// --- 1. HELPERS & NORMALIZATION ---

// Standard mapping: Option A=1.0, B=0.66, C=0.33, D=0.0
// We use this to normalize Q1-Q16 to [0,1]
function normalize(answerIndex) {
  const idx = Number(answerIndex);
  if (isNaN(idx)) return 0;
  const map = [1.0, 0.66, 0.33, 0.0];
  return map[idx] !== undefined ? map[idx] : 0;
}

// Deterministic Pseudo-Random Noise (Anti-Decoding)
// Returns epsilon in [0.12, 0.47]
function getEpsilon(responses) {
  // Simple hash of values to create a constant seed per user
  const keys = Object.keys(responses).sort();
  let str = "";
  keys.forEach(k => str += responses[k]);
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Scale to [0, 1] then to [0.12, 0.47]
  const seed = Math.abs(hash) % 1000 / 1000; 
  return 0.12 + (seed * (0.47 - 0.12)); 
}

// Clamp helper
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// --- 2. MAIN COMPUTE FUNCTION ---

export function computeScores(responses) {
  
  // A. INPUTS & INDICES
  // ------------------------------------
  // Helper to get normalized value for a Question ID
  const getQ = (qid) => normalize(responses[qid]);

  // Execution Index (EI)
  // EI = 0.35·Q1 + 0.35·Q8 + 0.15·Q2 + 0.15·Q9
  const EI = 
    0.35 * getQ("q1") + 
    0.35 * getQ("q8") + 
    0.15 * getQ("q2") + 
    0.15 * getQ("q9");

  // Coverage Index (CI)
  // CI = 0.4·Q3 + 0.2·avg(Q4,Q5,Q6)
  const avgPCM = (getQ("q4") + getQ("q5") + getQ("q6")) / 3;
  const CI = 0.4 * getQ("q3") + 0.2 * avgPCM;

  // Retention & Error Index (REI)
  // REI = 0.6·Q7 + 0.4·Q10
  const REI = 0.6 * getQ("q7") + 0.4 * getQ("q10");

  // Stability Index (SI)
  // SI = avg(Q11, Q13, Q14, Q15, Q16)
  const SI = (
    getQ("q11") + getQ("q13") + getQ("q14") + getQ("q15") + getQ("q16")
  ) / 5;


  // B. BASELINE PERCENTILE (P_base)
  // ------------------------------------
  // Q18 Mapping: 0->98.2, 1->93.4, 2->82.6, 3->63.8
  const pBaseMap = [98.2, 93.4, 82.6, 63.8];
  const q18Idx = Number(responses["q18"] || 3);
  const P_base = pBaseMap[q18Idx] !== undefined ? pBaseMap[q18Idx] : 63.8;


  // C. JEE SOCIETY SCORE (JSS)
  // ------------------------------------
  // JSS = 100 * (0.30*EI + 0.25*CI + 0.20*REI + 0.15*(P_base/100) + 0.10*SI)
  let JSS = 100 * (
    0.30 * EI +
    0.25 * CI +
    0.20 * REI +
    0.15 * (P_base / 100) +
    0.10 * SI
  );
  JSS = clamp(JSS, 0, 100);


  // D. TIME PATH SPLIT (Q17)
  // ------------------------------------
  // Q17: 0 -> April 2026, 1 -> JEE 2027
  const q17Idx = Number(responses["q17"] || 0);
  const attemptType = q17Idx === 0 ? "2026" : "2027";
  
  const epsilon = getEpsilon(responses);
  
  let P_expected = 0;
  let Expected_Range = [0, 0];
  let P_potential = 0;
  let Potential_Range = [0, 0];

  if (attemptType === "2026") {
    // === CASE A: APRIL 2026 ===
    
    // 5. Expected
    const F_26 = 0.35*EI + 0.35*CI + 0.20*REI + 0.10*SI;
    const DeltaE_26 = Math.min(6.5, 8 * F_26);
    P_expected = Math.min(98.6, P_base + DeltaE_26) + epsilon;
    
    Expected_Range = [P_expected - 1.8, P_expected + 1.8];

    // 6. Potential
    const G_26 = 0.45*EI + 0.35*CI + 0.20*REI;
    const P_raw_26 = 95 + 4.2*G_26 + 0.06*(P_base - 60);
    P_potential = clamp(P_raw_26 + epsilon, 95.0, 99.3);
    
    Potential_Range = [P_potential - 1.5, P_potential + 1.5];

  } else {
    // === CASE B: JEE 2027 ===

    // 7. Expected
    const F_27 = 0.40*EI + 0.35*CI + 0.15*REI + 0.10*SI;
    const DeltaE_27 = 14 * F_27;
    
    if (P_base < 95) {
      P_expected = Math.min(94.6, P_base + DeltaE_27) + epsilon;
    } else {
      P_expected = Math.min(98.8, P_base + 0.6 * DeltaE_27) + epsilon;
    }
    
    Expected_Range = [P_expected - 2.2, P_expected + 2.2];

    // 8. Potential
    const G_27 = 0.50*EI + 0.35*CI + 0.15*REI;
    const P_raw_27 = 98.2 + 1.4*G_27 + 0.04*(P_base - 70);
    P_potential = clamp(P_raw_27 + epsilon, 98.1, 99.6);
    
    Potential_Range = [P_potential - 1.4, P_potential + 1.4];
  }

  // 9. GLOBAL SAFETY CONSTRAINTS
  // Ensure ranges don't exceed 99.9 or drop below 0
  
  // Format Output Helper
  const format = (n) => Number(n.toFixed(2));
  
  // Safety check: Expected <= Potential
  if (P_expected > P_potential) {
    console.warn("Adjusting P_expected to match P_potential");
    P_expected = P_potential - 0.1;
  }

  // -------------------------------
  // MANIFEST KEY MAPPING (NEW)
  // -------------------------------
  function mapAnswersToManifest(responses) {
    const out = {};
    Object.keys(responses).forEach(k => {
      if (k.startsWith("q")) {
        const qNum = k.substring(1);
        const idx = Number(responses[k]);
        const letter = ["A","B","C","D"][idx] || "D";
        out[k] = `Q${qNum}_${letter}`;
      }
    });
    return out;
  }

  const manifestKeys = mapAnswersToManifest(responses);


  return {
  jee_society_score: format(JSS),
  expected_percentile: format(P_expected),
  expected_percentile_range: [
    format(clamp(Expected_Range[0], 0, 99.9)),
    format(clamp(Expected_Range[1], 0, 99.9))
  ],
  potential_percentile: format(P_potential),
  potential_percentile_range: [
    format(clamp(Potential_Range[0], 0, 99.9)),
    format(clamp(Potential_Range[1], 0, 99.9))
  ],
  attempt_type: attemptType,

  // THIS is what connects the psychology engine
  manifestKeys
};
