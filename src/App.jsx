import React, { useState } from "react";
import "./swot.css";

import {
  StrengthResponses,
  WeaknessResponses,
  OpportunityResponses,
  ThreatResponses,
} from "./ResponseBank";

// import { GoogleGenerativeAI } from "@google/genai";

// ---- Gemini API Client ----
// const genAI = new GoogleGenerativeAI(
//   import.meta.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY
// );

// ---- Questions ----
const QUESTIONS = [
  { id: "name", type: "text", question: "What is your name?" },

  { id: "q1", question: "How confident do you feel in academics?", options: ["Very High", "High", "Moderate", "Low"], swot: "S", impact: "primary" },
  { id: "q2", question: "How do you handle new concepts?", options: ["Very Well", "Well", "Okay", "Struggle"], swot: "S", impact: "secondary" },

  { id: "q3", question: "What is your biggest academic difficulty?", options: ["Time mgmt", "Focus", "Consistency", "Motivation"], swot: "W", impact: "primary" },
  { id: "q4", question: "How often do you feel stuck?", options: ["Never", "Rarely", "Sometimes", "Often"], swot: "W", impact: "secondary" },

  { id: "q5", question: "How open are you to new opportunities?", options: ["Very Open", "Open", "Somewhat", "Not Much"], swot: "O", impact: "primary" },
  { id: "q6", question: "How proactive are you in exploring new activities?", options: ["Very", "Good", "Average", "Low"], swot: "O", impact: "secondary" },

  { id: "q7", question: "How often do distractions affect you?", options: ["Never", "Rarely", "Sometimes", "Often"], swot: "T", impact: "primary" },
  { id: "q8", question: "How stressful is your study environment?", options: ["Not at all", "Little", "Moderate", "High"], swot: "T", impact: "secondary" },

  { id: "q9", question: "How do you evaluate your teamwork skills?", options: ["Excellent", "Good", "Average", "Weak"] },
  { id: "q10", question: "How disciplined is your routine?", options: ["Strong", "Good", "Okay", "Weak"] },
];

export default function StudentSwotForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSWOT, setShowSWOT] = useState(false);
  const [finalSWOT, setFinalSWOT] = useState({ S: "", W: "", O: "", T: "" });

  // ---- Handle Answer Change ----
  const handleChange = (value) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value });
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  // ---- SWOT Calculation ----
  const calculateSWOT = () => {
    const getIndex = (primary, secondary) => {
      const primaryIndex = Number(primary || 0);
      const secondaryIndex = Number(secondary || 0);
      const noise = Math.floor(Math.random() * 5); // random offset
      let raw = (primaryIndex * 7 + secondaryIndex * 3) % 40;
      return (raw + noise) % 40;
    };

    const primary = {};
    const secondary = {};

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

  // ---- Gemini AI Report Generator ----
  async function sendToAI() {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
You are an expert academic evaluator.

Generate a detailed student personality and performance SWOT report in clean Markdown format that can be converted to a PDF.

Requirements:
- Student name at top
- Use #, ## headings
- SWOT table
- Bullet points
- Motivational tone
- No HTML, only Markdown

Student Name: ${answers["name"]}

Answers:
${JSON.stringify(answers, null, 2)}

Return ONLY the final Markdown output.
`;

      console.log("🔵 Prompt Sent to Gemini:\n", prompt);

      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      console.log("🔵 AI Markdown Report:\n", aiText);

      localStorage.setItem("student_ai_report", aiText);
      return aiText;
    } catch (err) {
      console.error("❌ Gemini Error:", err);
    }
  }

  // ---- Submit ----
  const submit = () => {
    calculateSWOT();
    localStorage.setItem("student_swot_answers", JSON.stringify(answers));
    sendToAI(); // call Gemini AI
  };

  // -----------------------------------
  // ---------- UI RENDERING ----------
  // -----------------------------------

  if (showSWOT) {
    return (
      <div className="swot-container">
        <h2>Your SWOT</h2>

        <div className="swot-box"><b>Strength:</b> {finalSWOT.S}</div>
        <div className="swot-box"><b>Weakness:</b> {finalSWOT.W}</div>
        <div className="swot-box"><b>Opportunity:</b> {finalSWOT.O}</div>
        <div className="swot-box"><b>Threat:</b> {finalSWOT.T}</div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="typeform-wrapper">
      <div className="typeform-card">
        <h3>{q.question}</h3>

        {/* Text input for Name */}
        {q.type === "text" ? (
          <input
            type="text"
            className="text-input"
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        ) : (
          <select
            className="dropdown"
            value={answers[q.id] !== undefined ? answers[q.id] : ""}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="">Select an option</option>
            {q.options.map((opt, idx) => (
              <option value={idx} key={idx}>{opt}</option>
            ))}
          </select>
        )}

        <br />

        {step === QUESTIONS.length - 1 ? (
          <button className="btn" onClick={submit}>Submit</button>
        ) : (
          <button className="btn" onClick={next} disabled={!answers[q.id]}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
