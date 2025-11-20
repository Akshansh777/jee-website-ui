import React from "react";

function ResultPage() {
  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <h1>JEE Readiness Result</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>Your Scores</h2>

        <p><strong>IIT Probability:</strong> 18–32%</p>
        <p><strong>NIT Probability:</strong> 40–55%</p>
        <p><strong>Overall JEE Score:</strong> 62/100</p>
      </div>

      <a href="/" 
         style={{
           display: "inline-block",
           marginTop: "30px",
           padding: "10px 20px",
           backgroundColor: "#28a745",
           color: "white",
           borderRadius: "8px",
           textDecoration: "none"
         }}>
        Go Back
      </a>
    </div>
  );
}

export default ResultPage;
