import React, { useState, useEffect } from "react";
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

// --- HELPER COMPONENT: CIRCULAR SCORE ---
const CircularScore = ({ value, max = 100, color, title, rangeText }) => {
  const radius = 70;
  const strokeWidth = 12;
  const size = 180;
  const center = size / 2;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <div style={{ width: "180px", height: "180px", position: "relative" }}>
        <svg width="180" height="180" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius} stroke="#eee" strokeWidth={strokeWidth} fill="none" />
          <circle
            cx={center} cy={center} r={radius} 
            stroke={color} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
          <text x={center} y={center - 15} textAnchor="middle" fontSize="28" fontWeight="900" fill={color} style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}>{title}</text>
          <text x={center} y={center + 20} textAnchor="middle" fontSize="18" fontWeight="700" fill="#444">{rangeText}</text>
        </svg>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
//  NEW CHECKOUT PAGE COMPONENT
// -------------------------------------------------------------
const CheckoutPage = ({ userData, onBack, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: "",
    phone: "",
    coupon: ""
  });
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logic: 199 Base, 99 Discounted
  const BASE_PRICE = 199;
  const DISCOUNT_PRICE = 99;
  const currentPrice = discountApplied ? DISCOUNT_PRICE : BASE_PRICE;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-Capitalize Coupon
    if (name === "coupon") {
        const code = value.toUpperCase();
        setFormData({ ...formData, coupon: code });
        // Auto-Check Coupon Logic
        if (code === "EARLYBIRD") setDiscountApplied(true);
        else setDiscountApplied(false);
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handlePayment = async () => {
    // ✅ 1. Empty Check
    if (!formData.name || !formData.email || !formData.phone) {
        alert("Please fill all details to proceed.");
        return;
    }

    // ✅ 2. Email Validation (@ check)
    if (!formData.email.includes("@")) {
        alert("Please enter a valid Email Address.");
        return;
    }

    // ✅ 3. Phone Validation (Exact 10 digits)
    if (formData.phone.length !== 10 || isNaN(formData.phone)) {
        alert("Please enter a valid 10-digit Mobile Number.");
        return;
    }

    setLoading(true);

    try {
        // 1. Create Order
        const backendUrl = "https://backend-final-510329279046.asia-south1.run.app";
        const response = await fetch(`${backendUrl}/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ coupon: formData.coupon })
        });
        const data = await response.json();

        if (!data.success) {
            alert("Order Creation Failed: " + data.error);
            setLoading(false);
            return;
        }

        // 2. Open Razorpay
        const options = {
            key: "rzp_test_S6RnINvdYeZppP", // Test Key
            amount: data.order.amount,
            currency: "INR",
            name: "JEE Society",
            description: "Detailed Analysis Report",
            order_id: data.order.id,
            handler: async function (response) {
                // 3. Verify & Send
                const verifyReq = await fetch(`${backendUrl}/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        userData: {
                            ...formData, // Name, Email, Phone
                            answers: userData.answers,
                            score: userData.score
                        }
                    })
                });
                const verifyData = await verifyReq.json();
                if (verifyData.success) {
                    onPaymentSuccess(formData.email);
                } else {
                    alert("Payment Verified Failed.");
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            theme: { color: "#c62828" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
            setLoading(false);
        });

    } catch (e) {
        console.error(e);
        alert("Connection Error. Please try again.");
        setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", padding: "20px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "900px", background: "white", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            
            {/* --- HEADER --- */}
<div style={{ padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "12px" }}>
    {/* ✅ UPDATED: Use Real Logo */}
    <img src="/JEEsociety_logo.png" alt="Logo" style={{ height: "40px", width: "40px", objectFit: "contain" }} />
    <div style={{ 
    fontSize: "24px", 
    fontWeight: "800", 
    color: "#333", 
    fontFamily: "'Montserrat', sans-serif", // ✅ Applied Font here
    letterSpacing: "-0.5px" 
}}>
    JEE<span style={{ color: "#c62828" }}>society</span>
</div>
</div>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {/* --- LEFT: FORM --- */}
                <div style={{ flex: 1, padding: "40px", minWidth: "300px" }}>
                    <h2 style={{ marginTop: 0, marginBottom: "10px", fontSize: "24px" }}>Final Step</h2>
                    <p style={{ color: "#666", marginBottom: "30px" }}>Enter your details to receive the report.</p>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#444" }}>Full Name</label>
                        <input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outlineColor: "#c62828" }}
                            placeholder="Enter Name"
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#444" }}>Email Address</label>
                        <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleChange}
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outlineColor: "#c62828" }}
                            placeholder="Enter Email"
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "#444" }}>Phone Number</label>
                        <input 
                            name="phone" 
                            type="tel"
                            value={formData.phone} 
                            onChange={handleChange}
                            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px", outlineColor: "#c62828" }}
                            placeholder="Enter Phone Number"
                        />
                    </div>
                    
                    <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#777", cursor: "pointer", marginTop: "10px", fontSize: "14px" }}>
                        ← Go Back
                    </button>
                </div>

                {/* --- RIGHT: SUMMARY & PAY --- */}
                <div style={{ flex: 1, background: "#fcfcfc", padding: "40px", borderLeft: "1px solid #eee", minWidth: "300px" }}>
                    <h3 style={{ marginTop: 0, fontSize: "18px", color: "#333" }}>Order Summary</h3>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0", color: "#555" }}>
                        <span>JEE Detailed Analysis Report</span>
                        <span>₹{BASE_PRICE}</span>
                    </div>

                    {/* COUPON BOX */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <input 
                            name="coupon"
                            value={formData.coupon}
                            onChange={handleChange}
                            placeholder="Coupon Code"
                            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}
                        />
                    </div>
                    
                    {discountApplied && (
                         <div style={{ padding: "10px", background: "#e8f5e9", color: "#2e7d32", borderRadius: "6px", fontSize: "13px", marginBottom: "20px" }}>
                            ✅ Coupon "EARLYBIRD" Applied! (₹100 Off)
                        </div>
                    )}

                    <div style={{ borderTop: "1px solid #ddd", paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                        <span style={{ fontWeight: "700", fontSize: "18px" }}>Total</span>
                        <div style={{ textAlign: "right" }}>
                            {discountApplied && <span style={{ textDecoration: "line-through", color: "#999", marginRight: "10px", fontSize: "14px" }}>₹{BASE_PRICE}</span>}
                            <span style={{ fontSize: "28px", fontWeight: "800", color: "#c62828" }}>₹{currentPrice}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment}
                        disabled={loading}
                        style={{ 
                            width: "100%", padding: "16px", borderRadius: "10px", border: "none",
                            background: loading ? "#ccc" : "#c62828", color: "white", fontSize: "18px", fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(198, 40, 40, 0.3)"
                        }}
                    >
                        {loading ? "Processing..." : `Pay ₹${currentPrice}`}
                    </button>

                    <div style={{ textAlign: "center", marginTop: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", color: "#777", fontSize: "12px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Secured by Razorpay
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};


// -------------------------------------------------------------
//  MAIN COMPONENT (ASSESSMENT)
// -------------------------------------------------------------
export default function StudentSwotForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSWOT, setShowSWOT] = useState(false);
  const [finalSWOT, setFinalSWOT] = useState({ S: "", W: "", O: "", T: "" });
  
  // -- NEW STATE FOR CHECKOUT --
  const [showCheckout, setShowCheckout] = useState(false);

  // Progress 
  const TOTAL_QUESTIONS = 18;
  const currentQuestionIndex = Math.max(step - 1, 0); 
  const progressPercent = Math.min(Math.round((currentQuestionIndex / TOTAL_QUESTIONS) * 100), 100);

  const handleChange = (value) => {
    setAnswers({ ...answers, [QUESTIONS[step].id]: value });
  };

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  const calculateSWOT = () => {
    const sIndex = Number(answers["q1"] || 0);
    const wIndex = Number(answers["q3"] || 0);
    const oIndex = Number(answers["q13"] || 0);
    const tIndex = Number(answers["q15"] || 0);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getResponse = (lib, idx) => (lib && lib[idx] ? lib[idx] : (lib ? lib[0] : ["Data missing"]));

    setFinalSWOT({
      S: pick(getResponse(StrengthResponses, sIndex)),
      W: pick(getResponse(WeaknessResponses, wIndex)),
      O: pick(getResponse(OpportunityResponses, oIndex)),
      T: pick(getResponse(ThreatResponses, tIndex)),
    });

    setShowSWOT(true);
  };

  const submit = () => calculateSWOT();


  // ---------------- RENDER: CHECKOUT PAGE ----------------
  if (showCheckout) {
    const scores = computeScores(answers);
    const userData = {
        name: answers["name"],
        answers: answers,
        score: scores.jee_society_score
    };

    return (
        <CheckoutPage 
            userData={userData} 
            onBack={() => setShowCheckout(false)} 
            onPaymentSuccess={(email) => {
                alert(`✅ Payment Successful!\nReport sent to ${email}`);
                setShowCheckout(false);
                // Optional: Redirect to Home
                // navigate("/"); 
            }}
        />
    );
  }

  // ---------------- RENDER: RESULTS PAGE ----------------
  if (showSWOT) {
    const scores = computeScores(answers);
    const { jee_society_score, expected_percentile_range, potential_percentile_range } = scores;

    return (
      <div className="swot-container">
        <h2 style={{ marginBottom: "25px" }}>Your Performance Summary</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "35px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px", marginTop: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <CircularScore value={jee_society_score} color="#6a11cb" title="JSS" rangeText={jee_society_score} />
            </div>
            <div style={{ display: "flex", gap: "60px", justifyContent: "center" }}>
              <CircularScore value={scores.expected_percentile} color="#1db954" title="EP" rangeText={`${expected_percentile_range[0]} - ${expected_percentile_range[1]}%`} />
              <CircularScore value={scores.potential_percentile} color="#ff7a00" title="PP" rangeText={`${potential_percentile_range[0]} - ${potential_percentile_range[1]}%`} />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
             <div style={{ 
              background: "#f8f9fa", padding: "20px", borderRadius: "12px", 
              borderLeft: "5px solid #6a11cb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ margin: "0 0 5px 0", color: "#6a11cb", fontSize: "18px" }}>JSS (JEE Society Score)</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                This is your <b>Holistic Preparation Index</b>. Unlike a mock test that only checks knowledge, JSS accounts for your Consistency, Focus, Revision Quality, and Syllabus Coverage. A low JSS means your "System" is broken, even if your "Knowledge" is good.
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

        <h2>Your Strength & Weakness</h2>
        <div className="swot-box strength"><b>Strength:</b> {finalSWOT.S}</div>
        <div className="swot-box weakness"><b>Weakness:</b> {finalSWOT.W}</div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
          
          {/* ✅ UPDATED BUTTON: NOW OPENS CHECKOUT PAGE */}
          <button
            onClick={() => setShowCheckout(true)}
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
        {/* --- YOUTUBE BUTTON (Placed Below Report Buttons) --- */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <a 
            href="https://www.youtube.com/@SreyashBhaiyaIITB" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 28px", 
                borderRadius: "50px", // Pill shape
                background: "#FF0000", // Official YouTube Red
                color: "white", 
                fontSize: "16px", 
                fontWeight: "700",
                border: "none", 
                cursor: "pointer", 
                boxShadow: "0 4px 15px rgba(255, 0, 0, 0.3)", // Red glow
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 0, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 0, 0, 0.3)";
              }}
            >
              {/* YouTube Vector Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              The JEEsociety YouTube
            </button>
          </a>
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

  // ---------------- RENDER: QUESTION PAGE ----------------
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
