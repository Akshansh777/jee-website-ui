import { useState } from "react";

function App() {
  const mcqs = [
    "MCQ 1: What is your study schedule like?",
    "MCQ 2: How consistently do you study?",
    "MCQ 3: Do you solve PYQs daily?",
    "MCQ 4: How strong are your fundamentals?",
    "MCQ 5: Do you revise weekly?",
    "MCQ 6: How well do you manage time?",
    "MCQ 7: Are you confident in PCM equally?",
    "MCQ 8: How many hours do you study?",
    "MCQ 9: How do you analyze mistakes?",
    "MCQ 10: Do you follow a test series?",
  ];

  const descriptive = [
    "Describe your weak areas.",
    "Describe your strong areas.",
    "What distracts you the most?",
    "How do you revise?",
    "What is your study strategy for the next 30 days?"
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>JEE Mentorship Assessment</h1>

      <h2>10 MCQ Questions</h2>
      {mcqs.map((q, i) => (
        <div key={i} style={{ margin: "15px 0" }}>
          <p>{q}</p>
          <select style={{ padding: "8px", width: "200px" }}>
            <option>Select option</option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
            <option>Option 4</option>
          </select>
        </div>
      ))}

      <h2 style={{ marginTop: "40px" }}>5 Descriptive Questions</h2>
      {descriptive.map((q, i) => (
        <div key={i} style={{ margin: "15px 0" }}>
          <p>{q}</p>
          <textarea
            style={{
              width: "100%",
              height: "80px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px"
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
