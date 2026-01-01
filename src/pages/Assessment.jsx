import React, { useState } from "react";
import "../swot.css";

import {
  StrengthResponses,
  WeaknessResponses,
  OpportunityResponses,
  ThreatResponses,
} from "../ResponseBank";

// -------------------- QUESTIONS DATA --------------------
const QUESTIONS = [
  {
    id: "name",
    type: "text",
    question: "What is your name?"
  },
  // Q1 -> Strength (Primary)
  {
    id: "q1",
    swot: "S",
    impact: "primary",
    question: "Q1. Your Consistency Meter",
    options: [
      "The Machine: I study every single day without fail, hitting all my targets.",
      "The Weekend Warrior: I have 3-4 good days, but I waste 2-3 days feeling unmotivated.",
      "The Burst Worker: I study 14 hours one day, then burnout and do nothing for 2 days.",
      "The Procrastinator: I plan every night, but barely execute 20% of it the next day."
    ],
    weights: [10, 6, 4, 0]
  },
  // Q2 -> Strength (Secondary)
  {
    id: "q2",
    swot: "S",
    impact: "secondary",
    question: "Q2. Your \"Deep Work\" Reality",
    options: [
      "Deep Focus: 6+ hours of pure, phone-free study (excluding lectures).",
      "Standard Grind: 4-6 hours of self-study, but I take frequent breaks.",
      "Passive Consumption: I spend most of my time watching lectures/One-shots; barely 2 hours of solving.",
      "Distracted: I sit for 10 hours, but effective study is hardly 2 hours due to phone/daydreaming."
    ],
    weights: [10, 7, 3, 0]
  },
  // Q3 -> Weakness (Primary)
  {
    id: "q3",
    swot: "W",
    impact: "primary",
    question: "Q3. Your Syllabus Status:",
    options: [
      "On Track: 80%+ Syllabus done with proper problem solving.",
      "Manageable Debt: 50-80% done, but revision is pending.",
      "Panic Mode: Less than 50% done. I have huge backlogs in Class 11/12.",
      "Fresh Start: I am basically starting from zero right now."
    ],
    weights: [10, 6, 2, 2]
  },
  // Q4 -> Weakness (Secondary)
  {
    id: "q4",
    swot: "W",
    impact: "secondary",
    question: "Q4. How is your Physics (Honestly)?",
    options: [
      "Strong: I can solve JEE Mains PYQs accurately under timed practice now. [Perfect ROI]",
      "Average: I understand concepts but get stuck on tricky questions; I am giving it high priority. [Good ROI]",
      "Weak: I struggle with basics; I am ignoring them to focus on Chemistry/Math. [Bad Strategy]",
      "Comfort Trap: Physics is my strongest subject, yet I still spend 50%+ of my time watching videos on Physics because I like it. [ROI Disaster - Triggers Warning]"
    ],
    weights: [10, 7, 3, 0]
  },
  // Q5 (Standard)
  {
    id: "q5",
    question: "Q5. How is your Chemistry(Honestly)?",
    options: [
      "Strong: NCERT is on my tips; I score high consistently. [Perfect ROI]",
      "Volatile: I memorize it, but forget it in 3 days; I spend time re-reading notes constantly. [Needs \"Recall\" Advice]",
      "Weak: I hate Chemistry; I barely touch this subject. [Critical Failure Point]",
      "Average: I am good at any one part(OC/OC/P), and bad at one. [Balance is lacking]"
    ],
    weights: [10, 6, 2, 4]
  },
  // Q6 (Standard)
  {
    id: "q6",
    question: "Q6. How is your Mathematics(Honestly)?",
    options: [
      "Killer: I love Math; I love solving complex problems in a given time. [High Asset]",
      "Survivor: I only target specific high-weightage chapters (Vector/3D) to clear cutoff. [Smart Strategy]",
      "Phobia: I am terrified of Math; I haven't solved a question in weeks. [Avoidance]",
      "The Ego Lifter: I am weak, but I waste hours trying to solve impossible problems just to prove I can. [Time Sink]"
    ],
    weights: [10, 7, 2, 3]
  },
  // Q7 (Standard)
  {
    id: "q7",
    question: "Q7. How is your Recall Strength in an exam setting?",
    options: [
      "Crystal Clear: I recall every formula while solving questions. [High Score]",
      "Blurry: I recognize the concept when I see the solution, but can't recall it during the question. [Illusion of Competence]",
      "Leaky Bucket: I study a chapter, but 1 week later it feels like I never studied it. [Needs Spaced Repetition]",
      "Blank Out: I panic in tests and forget even the basics I knew well. [Anxiety Issue]"
    ],
    weights: [10, 7, 4, 0]
  },
  // Q8 (Standard)
  {
    id: "q8",
    question: "Q8. Go and solve JEE Mains PYQs of any chapter of Maths for an hour. Then choose an option that matches closely:",
    options: [
      "I solve 20+ MCQs per hour with high accuracy.",
      "I solve 10-15 MCQs per hour.",
      "I take 10 minutes per question (mostly staring at it).",
      "I don’t like solving questions at all."
    ],
    weights: [10, 7, 3, 0]
  },
  // Q9 (Standard)
  {
    id: "q9",
    question: "Q9. Tell us about your Attention span:",
    options: [
      "Deep Diver: I can sit for 3 hours straight without touching my phone.",
      "The Hopper: I study for 45 mins, then need a 15 min break.",
      "Reels Brain: My attention breaks every 10-15 minutes; I check notifications constantly.",
      "Daydreamer: I stare at the book, but my mind is thinking about college/life/backlog."
    ],
    weights: [10, 7, 3, 0]
  },
  // Q10 (Standard)
  {
    id: "q10",
    question: "Q10. The \"Error Pattern\" (Why do you generally lose marks?)",
    options: [
      "Conceptual: I honestly didn't know the theory/logic. [Knowledge Gap]",
      "Silly/Calculation: I knew it, but made a silly mistake or read the question wrong. [Focus Gap]",
      "Ego/Time: I got stuck on one hard question and wasted 10 minutes, ruining the paper. [Strategy Gap]",
      "Fear/Skipping: I skipped easy questions because the chapter \"looked\" scary. [Confidence Gap]"
    ],
    weights: [0, 0, 0, 0]
  },
  // Q12 (Standard)
  {
    id: "q12",
    question: "Q12. This is a special question. You need to be utmost sincere while answering this. How is your mindset currently:",
    options: [
      "Warrior: \"I will crack JEE, no matter what. I just need the plan.\"",
      "Hopeful: \"I think I can get a good IIT/NIT, but I am sometimes uncertain.\"",
      "Doubter: \"I am trying, but deep down I feel I started too late and it’s close to impossible.\"",
      "Lost: \"I have given up. I am just pretending to study for my parents.\""
    ],
    weights: [10, 7, 4, 0]
  },
  // Q11 (Standard)
  {
    id: "q11",
    question: "Q11. Reflect on your inner self. Which among these is your \"Single Biggest Barrier\" (The Root Cause)",
    options: [
      "The Collector: I have TBs of lectures/PDFs, but I don't solve questions. [Action Paralysis]",
      "The Fear: I am scared of getting questions wrong, so I keep re-reading theory. [Perfectionism]",
      "The Dopamine Addict: Phone, Social Media, and YouTube Shorts are destroying my day. [Distraction]",
      "The Mountain: My backlog is so huge I don't know where to start, so I don't start at all. [Overwhelm]"
    ],
    weights: [0, 0, 0, 0]
  },
  // Q13 -> Opportunity (Primary)
  {
    id: "q13",
    swot: "O",
    impact: "primary",
    question: "Q13. Tell us about your Energy Levels:",
    options: [
      "High Voltage: I feel energetic all day; I exercise/walk specifically to stay fit. [Sustainable]",
      "Afternoon Crash: I start well, but after 2 PM I feel sleepy and lethargic. [Diet/Sleep Issue]",
      "Zombie Mode: I study long hours but feel exhausted and \"foggy\" the whole time. [Burnout Warning]",
      "Night Owl: I stay awake till 4 AM, but wake up tired and waste the morning. [Circadian Rhythm Issue]"
    ],
    weights: [10, 6, 3, 4]
  },
  // Q14 -> Opportunity (Secondary)
  {
    id: "q14",
    swot: "O",
    impact: "secondary",
    question: "Q14. How is your health recently?",
    options: [
      "I am fit and take good care of my body [Good]",
      "I fall ill frequently (cold, headaches) [Bad - Cognitive Decline]",
      "I have major diseases and treatments going on currently [Crash Imminent]",
      "My body is physically not fit, but I have started taking care  [Aware bull unhealthy]"
    ],
    weights: [10, 4, 0, 6]
  },
  // Q15 -> Threat (Primary)
  {
    id: "q15",
    swot: "T",
    impact: "primary",
    question: "Q15. How is your Study Environment",
    options: [
      "The Bunker: Private room, silence, zero distractions. [Ideal]",
      "The Library: I go out to study, which helps, but travel wastes time. [Good]",
      "The Living Room: I study in a noisy area; people keep disturbing me. [Focus Killer]",
      "The Chaos: Toxic environment/arguments at home make it hard to concentrate. [Emotional Drain]"
    ],
    weights: [10, 7, 4, 0]
  },
  // Q16 -> Threat (Secondary)
  {
    id: "q16",
    swot: "T",
    impact: "secondary",
    question: "Q16. How exactly are your parents involved in your JEE preparation?",
    options: [
      "The Rock: They are supportive, don't stress much about marks, and ensure I eat/sleep well. [Asset]",
      "The Pressure Cooker: They compare me to Sharma ji ka beta and scold me for low marks. [Stress Trigger]",
      "The Silent: They don't really know what I'm doing; I'm on my own. [Neutral]",
      "The Manager: They micromanage my schedule (\"Why aren't you studying?\"), which annoys me. [Friction]"
    ],
    weights: [10, 4, 6, 3]
  },
  // Q17
  {
    id: "q17",
    question: "Q17. The Countdown (Time Horizon)",
    options: [
      "The Final Lap: My target exam is in less than a month. [High Urgency - Mistakes are fatal]",
      "The Mid-Game: I have 2 to 6 months left. [Medium Urgency]",
      "The Marathon: I have 6 months to 1 Year left. [Low Urgency - High potential for course correction]",
      "I have more than a year left now. [No Urgency]"
    ],
    weights: [0.5, 1.0, 1.5, 2.0]
  },
  // Q18
  {
    id: "q18",
    question: "Q18. How much on an average do you score in a JEE Mains mock test?",
    options: [
      "The High Flyer: I consistently score 180+ in mocks (or I am confident I can solve 60%+ of the paper today). [High Baseline]",
      "The Mid-Range: I usually score between 100 - 170 (or I can solve roughly half the paper). [Average Baseline]",
      "The Struggler: I am stuck below 100 (or I struggle to solve even 10 questions correctly). [Critical Baseline]",
      "The Untested: I haven't taken a single mock yet, but I honestly feel unprepared and scared to face the paper. [Fear/Avoidance Indicator]"
    ],
    weights: [98, 93, 80, 68]
  }
];

export default function StudentSwotForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSWOT, setShowSWOT] = useState(false);
  const [finalSWOT, setFinalSWOT] = useState({ S: "", W: "", O: "", T: "" });
  
  // -- NEW STATES FOR MODAL --
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Progress (exclude name question)
  const TOTAL_QUESTIONS = 18;
  const currentQuestionIndex = Math.max(step - 1, 0); 
  const progressPercent = Math.min(
    Math.round((currentQuestionIndex / TOTAL_QUESTIONS) * 100),
    100
  );

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

  // --------------------------------------------------------
  // NEW: HANDLE REPORT SENDING
  // --------------------------------------------------------
  const handleSendReport = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSending(true);

    // Re-calculate stats to send to backend
    // (We reuse the logic from the rendering part below)
    const momentumQs = ["q1", "q2", "q8", "q9", "q12"];
    let RJS = 0;
    momentumQs.forEach((qid) => {
      const q = QUESTIONS.find((x) => x.id === qid);
      const ansIndex = Number(answers[qid]);
      RJS += q.weights[ansIndex] || 0;
    });
    const SJS = 30 + RJS; // Score

    // Prepare payload
    const payload = {
      email: email,
      name: answers["name"] || "Future IITian",
      score: SJS.toFixed(1),
      swot: {
        strengths: finalSWOT.S,
        weaknesses: finalSWOT.W,
        opportunities: finalSWOT.O,
        threats: finalSWOT.T
      },
      // You can expand this recommendation logic later
      recommendations: "Focus on your flagged weaknesses. Use the Opportunity areas to gain extra marks. Avoid the threats listed in your analysis."
    };

    try {
      // NOTE: Ensure your backend is running on port 3000 to avoid conflict with Vite (5000)
      // Use the environment variable, or fallback to localhost for safety
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const response = await fetch(`${API_URL}/send-dynamic-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("Report sent successfully to " + email);
        setShowEmailModal(false); // Close modal
      } else {
        alert("Failed to send report: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server. Make sure backend is running on port 3000.");
    } finally {
      setIsSending(false);
    }
  };


  // -------------------- SWOT PAGE + PERCENTILES --------------------
  if (showSWOT) {
    // -------------------- SCORING ENGINE --------------------
    const momentumQs = ["q1", "q2", "q8", "q9", "q12"];
    let RJS = 0;
    momentumQs.forEach((qid) => {
      const q = QUESTIONS.find((x) => x.id === qid);
      const ansIndex = Number(answers[qid]);
      RJS += q.weights[ansIndex] || 0;
    });
    const SJS = 30 + RJS;

    const q18 = QUESTIONS.find((q) => q.id === "q18");
    const PBase = q18.weights[Number(answers["q18"])] || 0;
    const q17 = QUESTIONS.find((q) => q.id === "q17");
    const T = q17.weights[Number(answers["q17"])] || 1.0;
    const PExp = PBase + ((SJS - 50) / 30) * 1.5 + (T - 1.0) * 0.5;
    const PTarget = 90.0 + (T / 2.0) * 5.0 + ((80 - SJS) / 80) * 4.0;
    let PPot = Math.max(PExp, PTarget);
    if (PPot > 99.7) PPot = 99.7; 

    return (
      <div className="swot-container">
        <h2 style={{ marginBottom: "25px" }}>Your Performance Summary</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "35px" }}>
          {/* Score Cards */}
          <div style={{
            background: "#edf0ff", padding: "18px", borderRadius: "12px",
            border: "2px solid #6a11cb", fontSize: "18px", fontWeight: "600"
          }}>
            JEEsociety Score : <span style={{ color: "#6a11cb" }}>{SJS.toFixed(1)}</span>
          </div>
          <div style={{
            background: "#e7fff2", padding: "18px", borderRadius: "12px",
            border: "2px solid #1db954", fontSize: "18px", fontWeight: "600"
          }}>
            Projected Percentile : <span style={{ color: "#1db954" }}>{PExp.toFixed(2)}%</span>
          </div>
          <div style={{
            background: "#fff5db", padding: "18px", borderRadius: "12px",
            border: "2px solid #ff9900", fontSize: "18px", fontWeight: "600"
          }}>
            Potential Percentile : <span style={{ color: "#ff7a00" }}>{PPot.toFixed(2)}%</span>
          </div>
        </div>

        {/* SWOT Boxes with Classes for CSS */}
        <h2>Your SWOT</h2>
        <div className="swot-box strength"><b>Strength:</b> {finalSWOT.S}</div>
        <div className="swot-box weakness"><b>Weakness:</b> {finalSWOT.W}</div>
        <div className="swot-box opportunity"><b>Opportunity:</b> {finalSWOT.O}</div>
        <div className="swot-box threat"><b>Threat:</b> {finalSWOT.T}</div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
          
          {/* DOWNLOAD BUTTON TRIGGERS MODAL */}
          <button
            onClick={() => setShowEmailModal(true)}
            style={{
              padding: "12px 24px", borderRadius: "12px",
              background: "linear-gradient(90deg, #4b6bff, #7b2fff)",
              color: "white", fontSize: "16px", border: "none",
              cursor: "pointer", transition: "0.2s ease",
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

          {/* SAMPLE REPORT BUTTON (Updated) */}
          <button
            onClick={() => window.open("/sample-report.pdf", "_blank")}
            style={{
              padding: "12px 24px", borderRadius: "12px",
              background: "#1e90ff", color: "white", fontSize: "16px",
              border: "none", cursor: "pointer", transition: "0.2s ease",
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
            View Sample Report
          </button>
        </div>

        {/* Report Content Details */}
        <details style={{ marginTop: "20px" }}>
          <summary style={{ fontWeight: "bold", fontSize: "17px" }}>
            What will your report contain?
          </summary>
          <ul style={{ paddingLeft: "20px", lineHeight: "1.8", color: "#555" }}>
              <li><strong>Trajectory Insight:</strong> Visual graph of your predicted vs. potential growth.</li>
              <li><strong>Detailed SWOT Snapshot:</strong> Deep dive into your Strengths, Weaknesses, Opportunities, and Threats.</li>
              <li><strong>Health & Environment Audit:</strong> Analysis of your physical stamina and study space.</li>
              <li><strong>Key Barriers:</strong> Identifying the specific root causes holding you back.</li>
              <li><strong>Personalized Strategy:</strong> A tailored roadmap and recommendations to improve your score.</li>
            </ul>
        </details>

        {/* ---------------- EMAIL MODAL ---------------- */}
        {showEmailModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white", padding: "30px", borderRadius: "16px",
              width: "90%", maxWidth: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              textAlign: "center", animation: "slideUp 0.4s ease"
            }}>
              <h3 style={{ fontSize: "22px", marginBottom: "15px", color: "#333" }}>
                Receive Your Full Report
              </h3>
              <p style={{ color: "#666", marginBottom: "20px", fontSize: "15px" }}>
                Enter your email address to get the detailed PDF report sent directly to your inbox.
              </p>
              
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%", padding: "12px", borderRadius: "8px",
                  border: "1px solid #ddd", fontSize: "16px", marginBottom: "20px",
                  boxSizing: "border-box", outlineColor: "#4b6bff"
                }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => setShowEmailModal(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px", border: "none",
                    background: "#f0f0f0", color: "#555", fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendReport}
                  disabled={isSending}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "8px", border: "none",
                    background: isSending ? "#ccc" : "linear-gradient(90deg, #4b6bff, #7b2fff)",
                    color: "white", fontWeight: "600", cursor: isSending ? "not-allowed" : "pointer"
                  }}
                >
                  {isSending ? "Sending..." : "Send Report"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // -------------------- QUESTION PAGE --------------------
  const q = QUESTIONS[step];

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", padding: "20px 12px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{
          background: "#fff", padding: "28px", borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#c62828" />
                <path d="M5 13v4c0 1.66 3.58 3 7 3s7-1.34 7-3v-4" fill="#c62828" opacity="0.85" />
              </svg>
              <div className="brand">JEE<span className="brand-light">society</span></div>
            </div>
            <div style={{ fontSize: "14px", color: "#999" }}>{progressPercent}% Complete</div>
          </div>

          {/* Progress Header */}
          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#777", marginBottom: "8px" }}>
              <span>Question {Math.min(currentQuestionIndex + 1, TOTAL_QUESTIONS)} of {TOTAL_QUESTIONS}</span>
              <span>{progressPercent}%</span>
            </div>
            <div style={{ height: "6px", background: "#eee", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPercent}%`, background: "#c62828", transition: "width 0.4s ease" }} />
            </div>
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>{q.question}</h2>

          {/* INPUTS */}
          {q.type === "text" ? (
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                border: "1px solid #ccc", fontSize: "16px", boxSizing: "border-box"
              }}
              placeholder="Type your answer..."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {q.options.map((opt, idx) => {
                const isSelected = answers[q.id] == idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleChange(idx)}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "18px 20px", borderRadius: "14px", cursor: "pointer",
                      border: isSelected ? "2px solid #c62828" : "1px solid #e0e0e0",
                      background: isSelected ? "#c62828" : "#fff",
                      color: isSelected ? "white" : "#000",
                      transition: "all 0.25s ease"
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8eaea"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "#fff"; }}
                  >
                    <div style={{
                      minWidth: "24px", minHeight: "24px", width: "24px", height: "24px",
                      flexShrink: 0, borderRadius: "50%",
                      border: `2px solid ${isSelected ? "white" : "#bbb"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "900", fontSize: "14px", fontFamily: "Arial", lineHeight: "1"
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div style={{ fontSize: "16px", lineHeight: "1.45" }}>{opt}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BUTTONS */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "35px", gap: "16px" }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "#fff", border: "1px solid #ddd", cursor: "pointer", fontSize: "15px" }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={step === QUESTIONS.length - 1 ? submit : next}
              disabled={answers[q.id] === undefined}
              style={{
                flex: 1, padding: "14px", borderRadius: "12px", background: "#c62828",
                color: "white", border: "none", cursor: "pointer", fontSize: "15px",
                opacity: answers[q.id] === undefined ? 0.5 : 1
              }}
            >
              {step === QUESTIONS.length - 1 ? "Submit" : "Next →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}