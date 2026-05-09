const generatePDF = require("./generateReportPDF.cjs");
const fs = require("fs");

// simulate what backend sends
const sampleData = {
  name: "Sreyash",
  jee_society_score: 62,
  expected_percentile: 84.2,
  attempt_type: "2026",

  swot: {
    strengths: "Consistent, resilient",
    weaknesses: "Chemistry, recall",
    opportunities: "High scoring chapters",
    threats: "Fear, procrastination"
  },

  manifestKeys: {
    // earlier sections
    q4: "Q4_D",
    q5: "Q5_C",
    q6: "Q6_D",

    q7: "Q7_D",
    q8: "Q8_C",
    q9: "Q9_C",
    q10: "Q10_D",
    q11: "Q11_B",
    q12: "Q12_C",

    // health page
    q13: "Q13_D",
    q14: "Q14_B",
    q15: "Q15_D",
    q16: "Q16_B",

    // ✅ EXECUTION PLAN (FULL 7 KEYS)
    q17: "Q17_C",
    q18: "Q18_D",
    q19: "Q19_A",
    q20: "Q20_B",
    q21: "Q21_C",
    q22: "Q22_A",
    q23: "Q23_B"
  }
};

(async () => {
  const pdf = await generatePDF(sampleData);
  fs.writeFileSync("test-report.pdf", pdf);
  console.log("PDF created → test-report.pdf");
})();