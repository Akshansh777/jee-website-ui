import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../swot.css";
import { computeScores } from "../utils/score";

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
      "Strong: I can solve JEE Mains PYQs accurately under timed practice now. ",
      "Average: I understand concepts but get stuck on tricky questions; I am giving it high priority. ",
      "Weak: I struggle with basics; I am ignoring them to focus on Chemistry/Math. ",
      "Comfort Trap: Physics is my strongest subject, yet I still spend 50%+ of my time watching videos on Physics because I like it. "
    ],
    weights: [10, 7, 3, 0]
  },
  // Q5 (Standard)
  {
    id: "q5",
    question: "Q5. How is your Chemistry(Honestly)?",
    options: [
      "Strong: NCERT is on my tips; I score high consistently. ",
      "Volatile: I memorize it, but forget it in 3 days; I spend time re-reading notes constantly. ",
      "Weak: I hate Chemistry; I barely touch this subject. ",
      "Average: I am good at any one part(OC/OC/P), and bad at one. "
    ],
    weights: [10, 6, 2, 4]
  },
  // Q6 (Standard)
  {
    id: "q6",
    question: "Q6. How is your Mathematics(Honestly)?",
    options: [
      "Killer: I love Math; I love solving complex problems in a given time. ",
      "Survivor: I only target specific high-weightage chapters (Vector/3D) to clear cutoff. ",
      "Phobia: I am terrified of Math; I haven't solved a question in weeks. ",
      "The Ego Lifter: I am weak, but I waste hours trying to solve impossible problems just to prove I can. "
    ],
    weights: [10, 7, 2, 3]
  },
  // Q7 (Standard)
  {
    id: "q7",
    question: "Q7. How is your Recall Strength in an exam setting?",
    options: [
      "Crystal Clear: I recall every formula while solving questions. ",
      "Blurry: I recognize the concept when I see the solution, but can't recall it during the question. ",
      "Leaky Bucket: I study a chapter, but 1 week later it feels like I never studied it. ",
      "Blank Out: I panic in tests and forget even the basics I knew well. "
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
      "Conceptual: I honestly didn't know the theory/logic. ",
      "Silly/Calculation: I knew it, but made a silly mistake or read the question wrong. ",
      "Ego/Time: I got stuck on one hard question and wasted 10 minutes, ruining the paper. ",
      "Fear/Skipping: I skipped easy questions because the chapter \"looked\" scary. "
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
      "The Collector: I have TBs of lectures/PDFs, but I don't solve questions. ",
      "The Fear: I am scared of getting questions wrong, so I keep re-reading theory. ",
      "The Dopamine Addict: Phone, Social Media, and YouTube Shorts are destroying my day. ",
      "The Mountain: My backlog is so huge I don't know where to start, so I don't start at all. "
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
      "High Voltage: I feel energetic all day; I exercise/walk specifically to stay fit. ",
      "Afternoon Crash: I start well, but after 2 PM I feel sleepy and lethargic. ",
      "Zombie Mode: I study long hours but feel exhausted and \"foggy\" the whole time. ",
      "Night Owl: I stay awake till 4 AM, but wake up tired and waste the morning. "
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
      "I am fit and take good care of my body ",
      "I fall ill frequently (cold, headaches) ",
      "I have major diseases and treatments going on currently ",
      "My body is physically not fit, but I have started taking care  "
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
      "The Bunker: Private room, silence, zero distractions. ",
      "The Library: I go out to study, which helps, but travel wastes time. ",
      "The Living Room: I study in a noisy area; people keep disturbing me. ",
      "The Chaos: Toxic environment/arguments at home make it hard to concentrate. "
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
      "The Rock: They are supportive, don't stress much about marks, and ensure I eat/sleep well. ",
      "The Pressure Cooker: They compare me to Sharma ji ka beta and scold me for low marks. ",
      "The Silent: They don't really know what I'm doing; I'm on my own. ",
      "The Manager: They micromanage my schedule (\"Why aren't you studying?\"), which annoys me. "
    ],
    weights: [10, 4, 6, 3]
  },
  // Q17 UPDATED
  {
    id: "q17",
    question: "Q17. Which attempt are you targeting? (Time Horizon)",
    options: [
      "April Attempt 2026",
      "JEE 2027"
    ],
    weights: [0, 0] 
  },
  // Q18 UPDATED
  {
    id: "q18",
    question: "Q18. In a recent full-length JEE Main–level test, where do you realistically stand?",
    options: [
      "I consistently score 180+ in mocks (or I am confident I can solve 60%+ of the paper today).",
      "I usually score between 120 - 180 (or I can solve roughly half the paper).",
      "I am stuck between 50 - 100 (or I struggle to solve even 20 questions correctly).",
      "I generally can’t score more than 50 marks in JEE Mains Mock Tests."
    ],
    weights: [0, 0, 0, 0] 
  }
];

// --- HELPER COMPONENT: ---
const CircularScore = ({ value, max = 100, color, title, rangeText }) => {
  const radius = 70; // Increased size (was 50)
  const strokeWidth = 12; // Thicker border
  const size = 180; // SVG ViewBox size
  const center = size / 2;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ width: "180px", height: "180px", position: "relative" }}>
        <svg width="180" height="180" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Circle */}
          <circle 
            cx={center} cy={center} r={radius} 
            stroke="#eee" strokeWidth={strokeWidth} fill="none" 
          />
          
          {/* Progress Circle */}
          <circle
            cx={center} cy={center} r={radius} 
            stroke={color} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
          
          {/* Title (JSS/EP/PP) */}
          <text 
            x={center} y={center - 15} 
            textAnchor="middle" 
            fontSize="28" fontWeight="900" fill={color}
            style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}
          >
            {title}
          </text>
          
          {/* Range Text (The Numbers) - MUCH BIGGER NOW */}
          <text 
            x={center} y={center + 20} 
            textAnchor="middle" 
            fontSize="18" fontWeight="700" fill="#444"
          >
            {rangeText}
          </text>
        </svg>
      </div>
    </div>
  );
};
export default function StudentSwotForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSWOT, setShowSWOT] = useState(false);
  const [finalSWOT, setFinalSWOT] = useState({ S: "", W: "", O: "", T: "" });
  
  // -- MODAL STATES --
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

  // ✅ NEW CODE
  const calculateSWOT = () => {
    // 1. Get the Index (0-3) of the Primary Question for each Category
    // Strength (S) -> Q1 (Consistency)
    // Weakness (W) -> Q3 (Syllabus)
    // Opportunity (O) -> Q13 (Energy)
    // Threat (T) -> Q15 (Environment)

    const sIndex = Number(answers["q1"] || 0);
    const wIndex = Number(answers["q3"] || 0);
    const oIndex = Number(answers["q13"] || 0);
    const tIndex = Number(answers["q15"] || 0);

    // 2. Select a Random Line from that Specific Bucket
    // We use a simple randomizer to pick one of the 5 lines in that bucket
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // 3. Fallback logic (in case of missing data)
    const getResponse = (lib, idx) => {
      // Check if lib[idx] exists, otherwise fall back to bucket 0
      const bucket = lib && lib[idx] ? lib[idx] : (lib ? lib[0] : ["Data missing"]);
      return pick(bucket);
    };

    setFinalSWOT({
      S: getResponse(StrengthResponses, sIndex),
      W: getResponse(WeaknessResponses, wIndex),
      O: getResponse(OpportunityResponses, oIndex),
      T: getResponse(ThreatResponses, tIndex),
    });

    setShowSWOT(true);
  };

  const submit = () => calculateSWOT();

  // --------------------------------------------------------
  // HANDLE REPORT SENDING
  // --------------------------------------------------------
  const handleSendReport = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSending(true);

    // Calculate score using the new logic for the backend payload
    const result = computeScores(answers);

    // Prepare payload
    const payload = {
      email: email,
      name: answers["name"] || "Future IITian",
      answers: answers,
      score: result.jee_society_score, // Using new score
      // You can also pass the projected ranges if your backend supports them
      swot: {
        strengths: finalSWOT.S,
        weaknesses: finalSWOT.W,
        opportunities: finalSWOT.O,
        threats: finalSWOT.T
      },
      recommendations: "Focus on your flagged weaknesses. Use the Opportunity areas to gain extra marks."
    };

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/send-dynamic-report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert("Report sent successfully to " + email);
        setShowEmailModal(false);
      } else {
        alert("Failed to send report: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server.");
    } finally {
      setIsSending(false);
    }
  };


  // -------------------- SWOT PAGE + PERCENTILES --------------------
  if (showSWOT) {
    // USE THE NEW SCORING ENGINE
    const scores = computeScores(answers);
    const { 
      jee_society_score, 
      expected_percentile_range, 
      potential_percentile_range 
    } = scores;

    // Helper for ranges "92.5 - 94.2"
    const expRangeStr = `${expected_percentile_range[0]} - ${expected_percentile_range[1]}%`;
    const potRangeStr = `${potential_percentile_range[0]} - ${potential_percentile_range[1]}%`;

    return (
      <div className="swot-container">
        <h2 style={{ marginBottom: "25px" }}>Your Performance Summary</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "35px" }}>
          {/* --- TRIAD (PYRAMID) LAYOUT --- */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            marginBottom: "50px",
            marginTop: "20px"
          }}>
            
            {/* TOP: JSS (Center) */}
            <div style={{ marginBottom: "20px" }}>
              <CircularScore
                value={jee_society_score}
                color="#6a11cb"
                title="JSS"
                rangeText={jee_society_score}
              />
            </div>

            {/* BOTTOM: EP & PP (Side by Side) */}
            <div style={{ display: "flex", gap: "60px", justifyContent: "center" }}>
              <CircularScore
                value={scores.expected_percentile}
                color="#1db954"
                title="EP"
                rangeText={expRangeStr}
              />
              <CircularScore
                value={scores.potential_percentile}
                color="#ff7a00"
                title="PP"
                rangeText={potRangeStr}
              />
            </div>
          </div>

          {/* --- DETAILED DEFINITIONS (Making Page Long) --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
            
            {/* JSS Card */}
            <div style={{ 
              background: "#f8f9fa", padding: "20px", borderRadius: "12px", 
              borderLeft: "5px solid #6a11cb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#6a11cb", fontSize: "18px" }}>JSS (JEEsociety Score)</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                This is your <b>Holistic Preparation Index</b>. Unlike a mock test that only checks knowledge, JSS accounts for your Consistency, Focus, Revision Quality, and Syllabus Coverage. A low JSS means that you lack a good "system", even if your "Knowledge" is good.
              </p>
            </div>

            {/* EP Card */}
            <div style={{ 
              background: "#f0fff4", padding: "20px", borderRadius: "12px", 
              borderLeft: "5px solid #1db954", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#1db954", fontSize: "18px" }}>EP (Expected Percentile)</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                If you continue <b>exactly</b> as you are today—without changing your habits—this is where you will land. This is the "Truth Mirror". It factors in your current leaks (distractions, weak revision) to predict your realistic outcome.
              </p>
            </div>

            {/* PP Card */}
            <div style={{ 
              background: "#fff8e6", padding: "20px", borderRadius: "12px", 
              borderLeft: "5px solid #ff7a00", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#ff7a00", fontSize: "18px" }}>PP (Potential Percentile)</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                This is your <b>Ceiling</b>. It calculates what you are capable of if you fix your identified "Weakness" and "Threats" immediately. The gap between your EP and PP is your "Lost Potential".
              </p>
            </div>
          </div>
        </div>

        {/* SWOT Boxes */}
        <h2>Your Strength & Weakness</h2>
        <div className="swot-box strength"><b>Strength:</b> {finalSWOT.S}</div>
        <div className="swot-box weakness"><b>Weakness:</b> {finalSWOT.W}</div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
          
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
        <details style={{ 
          marginTop: "30px", 
          marginBottom: "30px",
          textAlign: "center",
          cursor: "pointer"
        }}>
          <summary style={{ 
            fontWeight: "bold", 
            fontSize: "18px", 
            marginBottom: "10px",
            outline: "none"
          }}>
            What will your report contain?
          </summary>

          <ul style={{ 
            display: "inline-block", 
            textAlign: "left", 
            maxWidth: "550px",
            paddingLeft: "20px",
            lineHeight: "1.8", 
            color: "#555" 
          }}>
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

        <div style={{ marginTop: "40px", textAlign: "center", paddingBottom: "20px" }}>
          <button
            onClick={() => navigate("/")} 
            style={{
              background: "transparent",
              border: "2px solid #e0e0e0",
              padding: "10px 25px",
              borderRadius: "50px",
              color: "#666",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#c62828";
              e.target.style.color = "#c62828";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.color = "#666";
            }}
          >
            ← Return Home / Take Again
          </button>
        </div>
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
