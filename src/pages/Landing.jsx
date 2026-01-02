import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg sketch">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg sketch">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg sketch">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" className="icon-svg sketch">
    {/* Cup */}
    <path d="M7 4h10v3c0 4-3 7-5 7s-5-3-5-7V4z" />

    {/* Handles */}
    <path d="M7 5H4v2c0 3 2 5 5 5" />
    <path d="M17 5h3v2c0 3-2 5-5 5" />

    {/* Stem */}
    <path d="M12 14v3" />

    {/* Base */}
    <path d="M9 20h6" />
    <path d="M8 17h8" />
  </svg>
);



export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing-header">
        <div className="brand">JEEsociety</div>
        <a
          className="youtube-link"
          href="https://www.youtube.com/@SreyashBhaiyaIITB"
          target="_blank"
          rel="noreferrer"
          style={{
    padding: "6px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#c62828",
    fontWeight: "500",
    transition: "0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#fdeaea";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
  }}
>
  YouTube
</a>
      </header>

      {/* Hero */}
      <section className="hero">
        <h1
  style={{
    fontSize: "clamp(42px, 6vw, 72px)",
    fontWeight: "700",
    lineHeight: "1.1",
    marginBottom: "14px",
  }}
>
          Is JEE Still <span>Possible?</span>
        </h1>
        <p>
          Take your 5-minute readiness check and get a personalized roadmap
        </p>

        <button className="hero-btn" onClick={() => navigate("/assessment")}>
          Start Your Assessment →
        </button>
        
      </section>
<div style={{ textAlign: "center", marginTop: "-10px", marginBottom: "30px" }}>
  <p style={{ 
    fontSize: "16px", 
    color: "#666",
    marginTop: "-41px",
    marginBottom: "10px"
  }}>
    ⏱ Takes only 5 minutes
  </p>
</div>
      {/* Features */}
      <section className="features">
  {[
    { Icon: ClockIcon, title: "5-Minute Check", desc: "Quick yet comprehensive assessment" },
    { Icon: TargetIcon, title: "Personalized Score", desc: "Get your JEEsociety Score" },
    { Icon: CheckIcon, title: "SWOT Analysis", desc: "Know your strengths & weaknesses" },
    { Icon: TrophyIcon, title: "Action Plan", desc: "3-step strategy to improve" }
  ].map(({ Icon, title, desc }) => (
    <div className="feature-card" key={title}>
      <div className="icon-wrapper">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  ))}
</section>

{/* Divider */}
<div className="section-divider" />

<section className="trust-section">
  <p className="trust-label">TRUSTED BY JEE ASPIRANTS</p>

  <div className="trust-stats">
    <div> 
      <h2>1000+</h2>
      <span>Assessments Taken</span>
    </div>

    <div className="trust-v-divider" />

    <div>
      <h2>4.9/5</h2>
      <span>Student Rating</span>
    </div>
  </div>
</section>

{/* Divider */}
<div className="section-divider" />


      {/* CTA */}
      <section className="cta">
        <h2>Ready to know where you stand?</h2>
        <p>Get your personalized JEEsociety assessment report with IIT/NIT probability, SWOT analysis, and actionable strategies.

</p>
        <button onClick={() => navigate("/assessment")}>
          𝐓𝐚𝐤𝐞 𝐭𝐡𝐞 𝟓-𝐌𝐢𝐧𝐮𝐭𝐞 𝐂𝐡𝐞𝐜𝐤 →
        </button>
      </section>
      <footer className="landing-footer">
  <p>
    <span className="brand">JEEsociety</span> | Empowering Aspirants
  </p>

  <p className="quote">"𝐈 𝐚𝐦 𝐭𝐡𝐞 𝐁𝐞𝐬𝐭 "</p>

  <p className="footer-link">
    <a
      href="https://www.youtube.com/@SreyashBhaiyaIITB"
      target="_blank"
      rel="noopener noreferrer"
    >
      YouTube
    </a>
  </p>
</footer>
    </div>
  );
}

