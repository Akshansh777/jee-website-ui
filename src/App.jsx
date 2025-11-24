import React, { useState } from "react";
import "./swot.css";

import {
  StrengthResponses,
  WeaknessResponses,
  OpportunityResponses,
  ThreatResponses,
} from "./ResponseBank";

const QUESTIONS = [
  { id: "name", type: "text", question: "What is your name?" },

  // 10 MCQ questions
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

  const handleChange = (value) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value });
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    }
  };

  const calculateSWOT = () => {
    const getIndex = (primary, secondary) => {
      const primaryIndex = Number(primary || 0);
      const secondaryIndex = Number(secondary || 0);

      const noise = Math.floor(Math.random() * 5);

      let raw = (primaryIndex * 7 + secondaryIndex * 3) % 40;
      return (raw + noise) % 40;
    };

    // Group primary and secondary answers
    const primary = {}, secondary = {};

    QUESTIONS.forEach((q) => {
      if (!q.swot) return;
      if (q.impact === "primary")
        primary[q.swot] = answers[q.id];
      if (q.impact === "secondary")
        secondary[q.swot] = answers[q.id];
    });

    const Sidx = getIndex(primary["S"], secondary["S"]);
    const Widx = getIndex(primary["W"], secondary["W"]);
    const Oidx = getIndex(primary["O"], secondary["O"]);
    const Tidx = getIndex(primary["T"], secondary["T"]);

    setFinalSWOT({
      S: StrengthResponses[Sidx],
      W: WeaknessResponses[Widx],
      O: OpportunityResponses[Oidx],
      T: ThreatResponses[Tidx],
    });

    setShowSWOT(true);
  };

  const submit = () => {
    calculateSWOT();
  };

  /** ---------- UI ---------- **/

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

        {/* Text input for name */}
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
            onChange={(e) => handleChange((e.target.value))}
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
          <button className="btn" onClick={next} disabled={answers[q.id] === undefined || answers[q.id] === ""}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
