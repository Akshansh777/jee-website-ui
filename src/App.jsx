import React, { useState } from "react";
import "./swot.css";

import {
  StrengthResponses,
  WeaknessResponses,
  OpportunityResponses,
  ThreatResponses,
} from "./ResponseBank";

const QUESTIONS = [
  {
    id: "name",
    type: "text",
    question: "What is your name?"
  },

  // Q1
  {
    id: "q1",
    question: "Q1. Your Consistency Meter",
    options: [
      "A. The Machine: I study every single day without fail, hitting all my targets.",
      "B. The Weekend Warrior: I have 3-4 good days, but I waste 2-3 days feeling unmotivated.",
      "C. The Burst Worker: I study 14 hours one day, then burnout and do nothing for 2 days.",
      "D. The Procrastinator: I plan every night, but barely execute 20% of it the next day."
    ],
    weights: [10, 6, 4, 0]
  },

  // Q2
  {
    id: "q2",
    question: "Q2. Your \"Deep Work\" Reality",
    options: [
      "A. Deep Focus: 6+ hours of pure, phone-free study (excluding lectures).",
      "B. Standard Grind: 4-6 hours of self-study, but I take frequent breaks.",
      "C. Passive Consumption: I spend most of my time watching lectures/One-shots; barely 2 hours of solving.",
      "D. Distracted: I sit for 10 hours, but effective study is hardly 2 hours due to phone/daydreaming."
    ],
    weights: [10, 7, 3, 0]
  },

  // Q3
  {
    id: "q3",
    question: "Q3. Your Syllabus Status:",
    options: [
      "A. On Track: 80%+ Syllabus done with proper problem solving.",
      "B. Manageable Debt: 50-80% done, but revision is pending.",
      "C. Panic Mode: Less than 50% done. I have huge backlogs in Class 11/12.",
      "D. Fresh Start: I am basically starting from zero right now."
    ],
    weights: [10, 6, 2, 2]
  },

  // Q4
  {
    id: "q4",
    question: "Q4. How is your Physics (Honestly)?",
    options: [
      "A. Strong: I can solve JEE Mains PYQs accurately under timed practice now. [Perfect ROI]",
      "B. Average: I understand concepts but get stuck on tricky questions; I am giving it high priority. [Good ROI]",
      "C. Weak: I struggle with basics; I am ignoring them to focus on Chemistry/Math. [Bad Strategy]",
      "D. Comfort Trap: Physics is my strongest subject, yet I still spend 50%+ of my time watching videos on Physics because I like it. [ROI Disaster - Triggers Warning]"
    ],
    weights: [10, 7, 3, 0]
  },

  // Q5
  {
    id: "q5",
    question: "Q5. How is your Chemistry(Honestly)?",
    options: [
      "A. Strong: NCERT is on my tips; I score high consistently. [Perfect ROI]",
      "B. Volatile: I memorize it, but forget it in 3 days; I spend time re-reading notes constantly. [Needs \"Recall\" Advice]",
      "C. Weak: I hate Chemistry; I barely touch this subject. [Critical Failure Point]",
      "D. Average: I am good at any one part(OC/OC/P), and bad at one. [Balance is lacking]"
    ],
    weights: [10, 6, 2, 4]
  },

  // Q6
  {
    id: "q6",
    question: "Q6. How is your Mathematics(Honestly)?",
    options: [
      "A. Killer: I love Math; I love solving complex problems in a given time. [High Asset]",
      "B. Survivor: I only target specific high-weightage chapters (Vector/3D) to clear cutoff. [Smart Strategy]",
      "C. Phobia: I am terrified of Math; I haven't solved a question in weeks. [Avoidance]",
      "D. The Ego Lifter: I am weak, but I waste hours trying to solve impossible problems just to prove I can. [Time Sink]"
    ],
    weights: [10, 7, 2, 3]
  },

  // Q7
  {
    id: "q7",
    question: "Q7. How is your Recall Strength in an exam setting?",
    options: [
      "A. Crystal Clear: I recall every formula while solving questions. [High Score]",
      "B. Blurry: I recognize the concept when I see the solution, but can't recall it during the question. [Illusion of Competence]",
      "C. Leaky Bucket: I study a chapter, but 1 week later it feels like I never studied it. [Needs Spaced Repetition]",
      "D. Blank Out: I panic in tests and forget even the basics I knew well. [Anxiety Issue]"
    ],
    weights: [10, 7, 4, 0]
  },

  // Q8
  {
    id: "q8",
    question: "Q8. Go and solve JEE Mains PYQs of any chapter of Maths for an hour. Then choose an option that matches closely:",
    options: [
      "A. I solve 20+ MCQs per hour with high accuracy.",
      "B. I solve 10-15 MCQs per hour.",
      "C. I take 10 minutes per question (mostly staring at it).",
      "D. I don’t like solving questions at all."
    ],
    weights: [10, 7, 3, 0]
  },

  // Q9
  {
    id: "q9",
    question: "Q9. Tell us about your Attention span:",
    options: [
      "A. Deep Diver: I can sit for 3 hours straight without touching my phone.",
      "B. The Hopper: I study for 45 mins, then need a 15 min break.",
      "C. Reels Brain: My attention breaks every 10-15 minutes; I check notifications constantly.",
      "D. Daydreamer: I stare at the book, but my mind is thinking about college/life/backlog."
    ],
    weights: [10, 7, 3, 0]
  },

  // Q10 (no weights — used for text)
  {
    id: "q10",
    question: "Q10. The \"Error Pattern\" (Why do you generally lose marks?)",
    options: [
      "A. Conceptual: I honestly didn't know the theory/logic. [Knowledge Gap]",
      "B. Silly/Calculation: I knew it, but made a silly mistake or read the question wrong. [Focus Gap]",
      "C. Ego/Time: I got stuck on one hard question and wasted 10 minutes, ruining the paper. [Strategy Gap]",
      "D. Fear/Skipping: I skipped easy questions because the chapter \"looked\" scary. [Confidence Gap]"
    ],
    weights: [0, 0, 0, 0]
  },

  // Q12
  {
    id: "q12",
    question: "Q12. This is a special question. You need to be utmost sincere while answering this. How is your mindset currently:",
    options: [
      "A. Warrior: \"I will crack JEE, no matter what. I just need the plan.\"",
      "B. Hopeful: \"I think I can get a good IIT/NIT, but I am sometimes uncertain.\"",
      "C. Doubter: \"I am trying, but deep down I feel I started too late and it’s close to impossible.\"",
      "D. Lost: \"I have given up. I am just pretending to study for my parents.\""
    ],
    weights: [10, 7, 4, 0]
  },

  // Q11
  {
    id: "q11",
    question: "Q11. Reflect on your inner self. Which among these is your \"Single Biggest Barrier\" (The Root Cause)",
    options: [
      "A. The Collector: I have TBs of lectures/PDFs, but I don't solve questions. [Action Paralysis]",
      "B. The Fear: I am scared of getting questions wrong, so I keep re-reading theory. [Perfectionism]",
      "C. The Dopamine Addict: Phone, Social Media, and YouTube Shorts are destroying my day. [Distraction]",
      "D. The Mountain: My backlog is so huge I don't know where to start, so I don't start at all. [Overwhelm]"
    ],
    weights: [0, 0, 0, 0]
  },

  // Q13
  {
    id: "q13",
    question: "Q13. Tell us about your Energy Levels:",
    options: [
      "A. High Voltage: I feel energetic all day; I exercise/walk specifically to stay fit. [Sustainable]",
      "B. Afternoon Crash: I start well, but after 2 PM I feel sleepy and lethargic. [Diet/Sleep Issue]",
      "C. Zombie Mode: I study long hours but feel exhausted and \"foggy\" the whole time. [Burnout Warning]",
      "D. Night Owl: I stay awake till 4 AM, but wake up tired and waste the morning. [Circadian Rhythm Issue]"
    ],
    weights: [10, 6, 3, 4]
  },

  // Q14
  {
    id: "q14",
    question: "Q14. How is your health recently?",
    options: [
      "A. I am fit and take good care of my body [Good]",
      "B. I fall ill frequently (cold, headaches) [Bad - Cognitive Decline]",
      "C. I have major diseases and treatments going on currently [Crash Imminent]",
      "D. My body is physically not fit, but I have started taking care  [Aware bull unhealthy]"
    ],
    weights: [10, 4, 0, 6]
  },

  // Q15
  {
    id: "q15",
    question: "Q15. How is your Study Environment",
    options: [
      "A. The Bunker: Private room, silence, zero distractions. [Ideal]",
      "B. The Library: I go out to study, which helps, but travel wastes time. [Good]",
      "C. The Living Room: I study in a noisy area; people keep disturbing me. [Focus Killer]",
      "D. The Chaos: Toxic environment/arguments at home make it hard to concentrate. [Emotional Drain]"
    ],
    weights: [10, 7, 4, 0]
  },

  // Q16
  {
    id: "q16",
    question: "Q16. How exactly are your parents involved in your JEE preparation?",
    options: [
      "A. The Rock: They are supportive, don't stress much about marks, and ensure I eat/sleep well. [Asset]",
      "B. The Pressure Cooker: They compare me to Sharma ji ka beta and scold me for low marks. [Stress Trigger]",
      "C. The Silent: They don't really know what I'm doing; I'm on my own. [Neutral]",
      "D. The Manager: They micromanage my schedule (\"Why aren't you studying?\"), which annoys me. [Friction]"
    ],
    weights: [10, 4, 6, 3]
  },

  // Q17
  {
    id: "q17",
    question: "Q17. The Countdown (Time Horizon)",
    options: [
      "A. The Final Lap: My target exam is in less than a month. [High Urgency - Mistakes are fatal]",
      "B. The Mid-Game: I have 2 to 6 months left. [Medium Urgency]",
      "C. The Marathon: I have 6 months to 1 Year left. [Low Urgency - High potential for course correction]",
      "D. I have more than a year left now. [No Urgency]"
    ],
    weights: [0.5, 1.0, 1.5, 2.0]
  },

  // Q18
  {
    id: "q18",
    question: "Q18. How much on an average do you score in a JEE Mains mock test?",
    options: [
      "A. The High Flyer: I consistently score 180+ in mocks (or I am confident I can solve 60%+ of the paper today). [High Baseline]",
      "B. The Mid-Range: I usually score between 100 - 170 (or I can solve roughly half the paper). [Average Baseline]",
      "C. The Struggler: I am stuck below 100 (or I struggle to solve even 10 questions correctly). [Critical Baseline]",
      "D. The Untested: I haven't taken a single mock yet, but I honestly feel unprepared and scared to face the paper. [Fear/Avoidance Indicator]"
    ],
    weights: [98, 93, 80, 68]
  }
];


export default function StudentSwotForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSWOT, setShowSWOT] = useState(false);
  const [finalSWOT, setFinalSWOT] = useState({ S: "", W: "", O: "", T: "" });

  const handleChange = (value) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value });
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  const calculateSWOT = () => {
    const getIndex = (primary, secondary) => {
      const primaryIndex = Number(primary || 0);
      const secondaryIndex = Number(secondary || 0);
      const noise = Math.floor(Math.random() * 5);
      let raw = (primaryIndex * 7 + secondaryIndex * 3) % 40;
      return (raw + noise) % 40;
    };

    const primary = {}, secondary = {};

    QUESTIONS.forEach((q) => {
      if (!q.swot) return;
      if (q.impact === "primary") primary[q.swot] = answers[q.id];
      if (q.impact === "secondary") secondary[q.swot] = answers[q.id];
    });

    setFinalSWOT({
      S: StrengthResponses[getIndex(primary["S"], secondary["S"])],
      W: WeaknessResponses[getIndex(primary["W"], secondary["W"])],
      O: OpportunityResponses[getIndex(primary["O"], secondary["O"])],
      T: ThreatResponses[getIndex(primary["T"], secondary["T"])],
    });

    setShowSWOT(true);
  };

  const submit = () => calculateSWOT();

 
 // -------------------- SWOT PAGE + PERCENTILES --------------------
if (showSWOT) {
  
  // -------------------- SCORING ENGINE --------------------

  // 1. JEEsociety Score (S_JS)
  const momentumQs = ["q1", "q2", "q8", "q9", "q12"];
  let RJS = 0;

  momentumQs.forEach((qid) => {
    const q = QUESTIONS.find((x) => x.id === qid);
    const ansIndex = Number(answers[qid]);
    RJS += q.weights[ansIndex] || 0;
  });

  const SJS = 30 + RJS; // final momentum score

  // 2. Baseline Percentile (P_base) from Q18
  const q18 = QUESTIONS.find((q) => q.id === "q18");
  const PBase = q18.weights[Number(answers["q18"])] || 0;

  // 3. Time Factor T (from Q17)
  const q17 = QUESTIONS.find((q) => q.id === "q17");
  const T = q17.weights[Number(answers["q17"])] || 1.0;

  // 4. Projected Percentile (P_Exp)
  const PExp =
    PBase +
    ((SJS - 50) / 30) * 1.5 +
    (T - 1.0) * 0.5;

  // 5. Potential Target Score
  const PTarget =
    90.0 +
    (T / 2.0) * 5.0 +
    ((80 - SJS) / 80) * 4.0;

  // 6. Potential Percentile (P_Pot)
  let PPot = Math.max(PExp, PTarget);
  if (PPot > 99.7) PPot = 99.7; // marketing constraint


  // -------------------- RESULT PAGE UI --------------------
  return (
    <div className="swot-container">

      <h2 style={{ marginBottom: "25px" }}>Your Performance Summary</h2>

      {/* ----------- THREE RESULT CARDS ----------- */}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "35px" }}>
        
        {/* JEEsociety Score */}
        <div style={{
          background: "#edf0ff",
          padding: "18px",
          borderRadius: "12px",
          border: "2px solid #6a11cb",
          fontSize: "18px",
          fontWeight: "600"
        }}>
          JEEsociety Score : <span style={{ color: "#6a11cb" }}>{SJS.toFixed(1)}</span>
        </div>

        {/* Projected Percentile */}
        <div style={{
          background: "#e7fff2",
          padding: "18px",
          borderRadius: "12px",
          border: "2px solid #1db954",
          fontSize: "18px",
          fontWeight: "600"
        }}>
          Projected Percentile : <span style={{ color: "#1db954" }}>{PExp.toFixed(2)}%</span>
        </div>

        {/* Potential Percentile */}
        <div style={{
          background: "#fff5db",
          padding: "18px",
          borderRadius: "12px",
          border: "2px solid #ff9900",
          fontSize: "18px",
          fontWeight: "600"
        }}>
          Potential Percentile : <span style={{ color: "#ff7a00" }}>{PPot.toFixed(2)}%</span>
        </div>

      </div>


      {/* ---------------- SWOT ---------------- */}
      <h2>Your SWOT</h2>

      <div className="swot-box"><b>Strength:</b> {finalSWOT.S}</div>
      <div className="swot-box"><b>Weakness:</b> {finalSWOT.W}</div>
      <div className="swot-box"><b>Opportunity:</b> {finalSWOT.O}</div>
      <div className="swot-box"><b>Threat:</b> {finalSWOT.T}</div>

      {/* ---- Buttons ---- */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => alert("Download Coming Soon")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "linear-gradient(90deg, #4b6bff, #7b2fff)",
            color: "white",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            transition: "0.2s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            >
            Download Full Report
        </button>

{/* Sample Report Button */}
        <button
          onClick={() => alert("Sample Report Coming Soon")}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "#1e90ff",
            color: "white",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            transition: "0.2s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)", }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.25)";
          }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          View Sample Report
        </button>
      </div>


      {/* ----------- REPORT CONTENT DROPDOWN (unchanged) ----------- */}
      <details style={{ marginTop: "20px" }}>
        <summary style={{ fontWeight: "bold", fontSize: "17px" }}>
          What will your report contain?
        </summary>
        <ul style={{ marginTop: "10px", lineHeight: "1.7" }}>
          <li>Your Single Biggest Barrier</li>
          <li>Health and Energy Profiler</li>
          <li>The JEEsociety 40-Day Surgical Roadmap</li>
          <li>Error Pattern Profiler</li>
          <li>REF Study Analyst</li>
        </ul>
      </details>

    </div>
  );
}



  // -------------------- QUESTION PAGE --------------------
  const q = QUESTIONS[step];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
          {q.question}
        </h2>

        {/* TEXT INPUT */}
        {q.type === "text" ? (
          <input
            type="text"
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            placeholder="Type your answer..."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {q.options.map((opt, idx) => (
              <label
                key={idx}
                onClick={() => handleChange(idx.toString())}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  background: answers[q.id] == idx ? "#dcd6ff" : "#f3f3f3",
                  cursor: "pointer",
                  border: answers[q.id] == idx ? "2px solid #6a11cb" : "1px solid #bbb",
                  transition: "0.2s",
                }}
              >
                <input
                  type="radio"
                  checked={answers[q.id] == idx}
                  readOnly
                />
                {opt}
              </label>
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "25px" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#aaa",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          )}

          {step === QUESTIONS.length - 1 ? (
            <button
              onClick={submit}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#6a11cb",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!answers[q.id] && answers[q.id] !== 0}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#6a11cb",
                color: "white",
                border: "none",
                cursor: "pointer",
                opacity: !answers[q.id] && answers[q.id] !== 0 ? 0.5 : 1,
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
