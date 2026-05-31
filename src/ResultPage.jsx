import React, { useState } from "react";

function ResultPage({ userAnswers = {}, score = 60, calculatedPercentiles = {} }) {
  // --- STATE MANAGEMENT ---
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    target_attempt: "2028" // Default selection
  });

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendReport = async () => {
    // 1. Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in Name, Email, and Phone Number.");
      return;
    }

    setLoading(true);

    // 2. Build the exact Payload expected by the PDF Generator
    const reportPayload = {
      name: formData.name,
      email: formData.email,
      target_attempt: formData.target_attempt,
      jee_society_score: score,
      
      // Map these from your actual frontend calculation logic
      expected_percentile: calculatedPercentiles.expected || [65.16, 68.76], 
      potential_percentile: calculatedPercentiles.potential || [95.49, 98.49],

      // 3. The Dynamic Text (AI/Mentor lines). 
      // NOTE: Replace these placeholder strings with actual data from userAnswers or AI response
      dynamicText: {
        q4: userAnswers.physicsNote || "Physics: You are falling into the 'PhD Trap'. Force yourself to face Chemistry/Math.",
        q5: userAnswers.chemistryNote || "Chemistry: Good theory but weak inorganic. Start doing PYQs.",
        q6: userAnswers.mathsNote || "Maths: Weak conceptual clarity. Try scribbling and making mistakes.",
        q7: userAnswers.recall || "Recall: You forget details after 2 days. Use active recall.",
        q8: userAnswers.efficiency || "Efficiency: 8-10 questions/hr is too slow.",
        q10: userAnswers.focus || "Focus: Blanking out is an emotional issue. Normalise the pressure.",
        q11: userAnswers.barrier || "Barrier: You are scared of getting low marks, so you don't take tests.",
        q13: userAnswers.health || "Health: Sleep deprived. Need 7 hours of sleep.",
        q14: userAnswers.energy || "Energy: Low-moderate. Need 20 mins physical activity.",
        q15: userAnswers.environment || "Environment: Crowded and noisy.",
        q16: userAnswers.parents || "Parents: Supportive but not structured.",
        q17: "Step 1: Cap Physics time to 1.5 hours daily.",
        q18: "Step 2: Start a live error log tonight.",
        q19: "Step 3: Run one 3-hour mock test this Sunday.",
        q20: "Step 4: Do 30 mins of inorganic active recall daily.",
        q21: "Step 5: Clean your study desk—no phones allowed.",
        q22: "Step 6: Clear backlogs by Friday.",
        q23: "Step 7: Sleep by 11:30 PM strictly."
      }
    };

    try {
      // 4. Hit the Backend API
      const response = await fetch("http://localhost:3000/send-dynamic-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportPayload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Success! The Detailed Report has been sent to ${formData.email}.`);
        setShowModal(false); // Close modal
      } else {
        alert("Server Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- STYLES ---
  const modalOverlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
  const modalContentStyle = { backgroundColor: "white", padding: "25px", borderRadius: "12px", width: "90%", maxWidth: "400px", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "relative" };
  const inputStyle = { width: "100%", padding: "10px", margin: "8px 0", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" };
  const buttonStyle = { width: "100%", padding: "12px", backgroundColor: "#0d6efd", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "15px", fontSize: "16px" };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>JEE Readiness Result</h1>

      <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
        <h2>Your Scores</h2>
        <p><strong>Overall JEE Score:</strong> {score}/100</p>
        <p style={{ color: "#666" }}>Unlock the Detailed Report to see your Chapter-wise Analysis.</p>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <a href="/" style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", borderRadius: "8px", textDecoration: "none" }}>Go Back</a>
        
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", backgroundColor: "#198754", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          Download Detailed Report
        </button>
      </div>

      {/* --- EMAIL MODAL --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>Get Your Report</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>Enter details to receive the PDF via Email.</p>
            
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={inputStyle} />
            <input name="email" placeholder="Email Address" type="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            <input name="phone" placeholder="Phone Number" type="tel" value={formData.phone} onChange={handleChange} style={inputStyle} />
            
            {/* Target Year Selector */}
            <select name="target_attempt" value={formData.target_attempt} onChange={handleChange} style={inputStyle}>
              <option value="2027">JEE 2027 Aspirant</option>
              <option value="2028">JEE 2028 Aspirant</option>
            </select>

            <button onClick={handleSendReport} disabled={loading} style={{ ...buttonStyle, backgroundColor: loading ? "#ccc" : "#0d6efd" }}>
              {loading ? "Generating & Sending..." : "Send My Report"}
            </button>

            <button onClick={() => setShowModal(false)} style={{ marginTop: "10px", background: "none", border: "none", color: "#666", cursor: "pointer", width: "100%", textDecoration: "underline" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPage;