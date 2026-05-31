const fs = require("fs");
const path = require("path");
const generatePDF = require("./generateReportPDF.cjs");

async function runTest() {
  console.log("Starting PDF generation test...");
  
  const mockData = {
    // --- 1. USER PROFILE ---
    name: "Rahul Sharma",
    target_attempt: "2027", // Change to "2027" to test the logic switch
    expected_percentile: [65.16, 68.76],
    potential_percentile: [95.49, 98.49],
    jee_society_score: 45,

    // --- 2. DYNAMIC TEXT CONTENT (The Keys) ---
    dynamicText: {
      // PAGE 3: SUBJECT ANALYSIS
      q4: "Physics: You are falling into the 'PhD Trap'. You love Physics, so you keep studying it because it feels good. You need to force yourself to face Chemistry/Math.",
      q5: "Chemistry: Good theory but weak inorganic. Stop reading chapters and start doing PYQs.",
      q6: "Maths: Weak conceptual clarity. You give 2 hours/day but spend it staring at solutions. Try scribbling and making mistakes.",

      // PAGE 6: R.E.F. ANALYSIS (q7, q8, q10 get joined together)
      q7: "Recall: You forget details after 2 days. You need active recall, not passive re-reading.",
      q8: "Efficiency: 8-10 questions/hr is too slow. You are aiming for perfection on every step.",
      q10: "Focus: Blanking out is an emotional issue, not an intellectual one. Your brain goes into 'Fight or Flight'. Normalise the pressure.",
      
      // PAGE 6: BIGGEST BARRIER
      q11: "Barrier: You are addicted to collecting resources but have no POA. Stop downloading PDFs and start solving the ones you have.",

      // PAGE 7: HEALTH, ENERGY, ENVIRONMENT (q13-q16 joined together)
      q13: "Health: Sleep deprived. Your brain cannot form long-term memories without 7 hours of sleep.",
      q14: "Energy: Low-moderate. You need 20 mins of physical activity to fix your dopamine baseline.",
      q15: "Environment: Crowded and noisy. Find a corner, use earplugs, and protect your space.",
      q16: "Parents: Supportive but not structured. Share this report with them to build a routine.",

      // PAGE 8: EXECUTION PLAN (Steps 1 to 7)
      q17: "Step 1: Cap Physics time to 1.5 hours daily. (This also prints on the Conclusion page).",
      q18: "Step 2: Start a live error log tonight.",
      q19: "Step 3: Run one 3-hour mock test this Sunday.",
      q20: "Step 4: Do 30 mins of inorganic active recall daily.",
      q21: "Step 5: Clean your study desk—no phones allowed.",
      q22: "Step 6: Clear the GOC backlog by Friday.",
      q23: "Step 7: Sleep by 11:30 PM strictly."
    }
  };

  try {
    const pdfBuffer = await generatePDF(mockData);
    const outputPath = path.join(__dirname, "test-output.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`✅ PDF generated! Check ${outputPath}`);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
  }
}

runTest();