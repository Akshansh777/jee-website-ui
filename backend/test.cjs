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

    q4: "Q4_D",   // Comfort Trap
    q5: "Q5_C",   // Weak Chemistry
    q6: "Q6_D",   // Ego Lifter

    q7: "Q7_D",   // Blank Out
    q8: "Q8_C",   // Slow Solver
    q10: "Q10_D", // Fear Skipping
    q11: "Q11_B", // Fear
    q12: "Q12_C", // Doubter
    q9: "Q9_C",   // Reels Brain
    q13: "Q13_D", // Night Owl
    q14: "Q14_B", // Frequent Illness
    q15: "Q15_D", // Chaos
    q16: "Q16_B", // Pressure Cooker
    q17: "Q17_C", // Marathon
    q18: "Q18_D"  // High Risk
  }
};

(async () => {
  const pdf = await generatePDF(sampleData);
  fs.writeFileSync("test-report.pdf", pdf);
  console.log("PDF created → test-report.pdf");
})();
