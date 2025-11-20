import { computeScores } from "../utils/score";
import React, { useState } from "react";
import './swot.css';
import {
  StrengthResponses,
  WeaknessResponses,
  OpportunityResponses,
  ThreatResponses
} from "./ResponseBank";

export default function SWOTForm() {
  const [formData, setFormData] = useState({
    name: "",
    q1: "", q2: "",
    q3: "", q4: "",
    q5: "", q6: "",
    q7: "", q8: "",
    q9: "", q10: "",
  });

  const [swot, setSwot] = useState(null);

  const optionScore = (val) => {
    // A = 5, B = 4, C = 3, D = 2, E = 1
    const map = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    return map[val] || 1;
  };

  const pickResponse = (primary, secondary, responses) => {
    let score = (primary * 0.7) + (secondary * 0.3);
    let baseIndex = Math.round((score / 5) * 40);

    let noise = Math.floor(Math.random() * 7) - 3; // -3 to +3
    let finalIndex = baseIndex + noise;

    if (finalIndex < 1) finalIndex = 1;
    if (finalIndex > 40) finalIndex = 40;

    return responses[finalIndex - 1];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const S_primary = optionScore(formData.q1);
    const S_secondary = optionScore(formData.q2);

    const W_primary = optionScore(formData.q3);
    const W_secondary = optionScore(formData.q4);

    const O_primary = optionScore(formData.q5);
    const O_secondary = optionScore(formData.q6);

    const T_primary = optionScore(formData.q7);
    const T_secondary = optionScore(formData.q8);

    const S = pickResponse(S_primary, S_secondary, StrengthResponses);
    const W = pickResponse(W_primary, W_secondary, WeaknessResponses);
    const O = pickResponse(O_primary, O_secondary, OpportunityResponses);
    const T = pickResponse(T_primary, T_secondary, ThreatResponses);

    setSwot({ S, W, O, T });
  };

  // --- Modified Options Dropdown ---
  const mcqOptions = (
    <>
      <option value="">Select an option</option>
      <option value="A">Always / Very Confident / Very Often</option>
      <option value="B">Often / Confident</option>
      <option value="C">Sometimes / Neutral</option>
      <option value="D">Rarely / Slightly</option>
      <option value="E">Never / Very Low</option>
    </>
  );


  return (
  <div className="swot-wrapper">

    <div className="swot-card">
      <h2 className="title">Student SWOT Analysis</h2>

      <form onSubmit={handleSubmit} className="swot-form">

        {/* Name */}
        <div className="form-group">
          <label className="label">Student Name:</label>
          <input
            type="text"
            required
            className="input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* MCQ Questions */}
        {[
          "How confidently do you handle new challenges?",
          "How consistent are you with completing tasks?",
          "How often do you struggle to stay focused?",
          "How comfortable are you managing deadlines?",
          "Are you open to learning new skills?",
          "How actively do you participate in growth activities?",
          "How often do distractions affect your studies?",
          "How often do you feel stressed due to competition?",
          "Do you prefer group study or individual study?",
          "How much time do you spend learning something new daily?"
        ].map((q, i) => (
          <div key={i} className="form-group">
            <label className="label">{`Q${i + 1}. ${q}`}</label>
            <select
              required
              className="select"
              value={formData[`q${i + 1}`]}
              onChange={(e) =>
                setFormData({ ...formData, [`q${i + 1}`]: e.target.value })
              }
            >
              {mcqOptions}
            </select>
          </div>
        ))}

        <button type="submit" className="submit-btn">
          Generate SWOT
        </button>
      </form>
    </div>

    {/* Output */}
    {swot && (
      <div className="output-card">
        <h3 className="output-title">SWOT for {formData.name}</h3>
        <p><strong>Strength:</strong> {swot.S}</p>
        <p><strong>Weakness:</strong> {swot.W}</p>
        <p><strong>Opportunity:</strong> {swot.O}</p>
        <p><strong>Threat:</strong> {swot.T}</p>
      </div>
    )}
  </div>
);

}
