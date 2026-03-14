/**
 * JEE SOCIETY AI — FINAL MODEL SPEC (PRODUCTION - UPDATED FOR 27/28)
 * Implements strict time-weighted scoring logic for JEE 2027 and JEE 2028.
 */

// --- 1. HELPERS & NORMALIZATION ---

function normalize(answerIndex) {
  const idx = Number(answerIndex);
  if (isNaN(idx)) return 0;
  const map = [1.0, 0.66, 0.33, 0.0];
  return map[idx] !== undefined ? map[idx] : 0;
}

function getEpsilon(responses) {
  const keys = Object.keys(responses).sort();
  let str = "";
  keys.forEach(k => str += responses[k]);
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; 
  }
  
  const seed = Math.abs(hash) % 1000 / 1000; 
  return 0.12 + (seed * (0.47 - 0.12)); 
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// --- 2. MAIN COMPUTE FUNCTION ---

export function computeScores(responses) {
  
  // A. INPUTS & INDICES
  const getQ = (qid) => normalize(responses[qid]);

  const EI = 0.35 * getQ("q1") + 0.35 * getQ("q8") + 0.15 * getQ("q2") + 0.15 * getQ("q9");
  const avgPCM = (getQ("q4") + getQ("q5") + getQ("q6")) / 3;
  const CI = 0.4 * getQ("q3") + 0.2 * avgPCM;
  const REI = 0.6 * getQ("q7") + 0.4 * getQ("q10");
  const SI = (getQ("q11") + getQ("q13") + getQ("q14") + getQ("q15") + getQ("q16")) / 5;

  // B. BASELINE PERCENTILE (P_base)
  const pBaseMap = [98.2, 93.4, 82.6, 63.8];
  const q18Idx = Number(responses["q18"] || 3);
  const P_base = pBaseMap[q18Idx] !== undefined ? pBaseMap[q18Idx] : 63.8;

  // C. JEE SOCIETY SCORE (JSS)
  let JSS = 100 * (0.30 * EI + 0.25 * CI + 0.20 * REI + 0.15 * (P_base / 100) + 0.10 * SI);
  JSS = clamp(JSS, 0, 100);

  // D. TIME PATH SPLIT (Q17: 0 -> JEE 2027, 1 -> JEE 2028)
  const q17Idx = Number(responses["q17"] || 0);
  const attemptType = q17Idx === 0 ? "2027" : "2028";
  
  const epsilon = getEpsilon(responses);
  
  let P_expected = 0;
  let Expected_Range = [0, 0];
  let P_potential = 0;
  let Potential_Range = [0, 0];

  if (attemptType === "2027") {
    // === CASE A: JEE 2027 (~10 Months Left) ===
    // Syllabus (CI) and Errors (REI) hold significant weight now.
    
    // 5. Expected
    const F_27 = 0.40*EI + 0.35*CI + 0.15*REI + 0.10*SI;
    const DeltaE_27 = 14 * F_27; // Moderate growth multiplier
    
    if (P_base < 95) {
      P_expected = Math.min(95.5, P_base + DeltaE_27) + epsilon;
    } else {
      P_expected = Math.min(98.8, P_base + 0.6 * DeltaE_27) + epsilon;
    }
    
    Expected_Range = [P_expected - 2.0, P_expected + 2.0];

    // 6. Potential
    const G_27 = 0.50*EI + 0.35*CI + 0.15*REI;
    const P_raw_27 = 98.2 + 1.4*G_27 + 0.04*(P_base - 70);
    P_potential = clamp(P_raw_27 + epsilon, 97.5, 99.6);
    
    Potential_Range = [P_potential - 1.4, P_potential + 1.4];

  } else {
    // === CASE B: JEE 2028 (~22 Months Left) ===
    // Syllabus (CI) matters less since they just started. Daily habits (EI) and Stability (SI) dominate.
    
    // 7. Expected
    const F_28 = 0.50*EI + 0.15*CI + 0.15*REI + 0.20*SI; 
    const DeltaE_28 = 22 * F_28; // Massive time runway allows for huge potential growth
    
    P_expected = Math.min(97.8, P_base + DeltaE_28) + epsilon;
    Expected_Range = [P_expected - 2.8, P_expected + 2.8]; // Wider range because 2 years is unpredictable

    // 8. Potential
    // If they fix habits now, they can practically hit the ceiling.
    const G_28 = 0.60*EI + 0.10*CI + 0.15*REI + 0.15*SI;
    const P_raw_28 = 98.5 + 1.4*G_28 + 0.02*(P_base - 50);
    P_potential = clamp(P_raw_28 + epsilon, 98.8, 99.9); // Cap raised to 99.9
    
    Potential_Range = [P_potential - 1.0, P_potential + 1.0];
  }

  // 9. GLOBAL SAFETY CONSTRAINTS
  const format = (n) => Number(n.toFixed(2));
  
  if (P_expected > P_potential) {
    console.warn("Adjusting P_expected to match P_potential");
    P_expected = P_potential - 0.1;
  }

  // MANIFEST KEY MAPPING
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
    manifestKeys
  };
}