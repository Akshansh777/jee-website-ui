import React, { useState } from "react";

function ResultPage({ userAnswers = {}, score = 0 }) {
  // --- STATE MANAGEMENT ---
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coupon: ""
  });

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Logic: If typing in 'coupon', force UPPERCASE immediately
      [name]: name === "coupon" ? value.toUpperCase() : value
    }));
  };

  const startPayment = async () => {
    // 1. Validation
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in Name, Email, and Phone Number.");
      return;
    }

    setLoading(true);

    try {
      // 2. Create Order (Call Your Backend)
      const response = await fetch("https://backend-final-510329279046.asia-south1.run.app/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon: formData.coupon })
      });

      const data = await response.json();
      if (!data.success) {
        alert("Server Error: " + data.error);
        setLoading(false);
        return;
      }

      // 3. Open Razorpay
      const options = {
        key: "rzp_test_S6RnINvdYeZppP", // Your Test Key
        amount: data.order.amount,
        currency: "INR",
        name: "JEE Society",
        description: "Detailed Analysis Report",
        // image: "/JEEsociety_logo.png", // Uncomment if you want logo in popup
        order_id: data.order.id,
        handler: async function (response) {
          // 4. Payment Success -> Verify & Send PDF
          // Show a "Processing" state here if you want
          
          const verifyReq = await fetch("https://backend-final-510329279046.asia-south1.run.app/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userData: {
                ...formData,
                answers: userAnswers,
                score: score
              }
            })
          });

          const verifyData = await verifyReq.json();
          if (verifyData.success) {
            alert(`✅ Payment Successful!\n\nThe Detailed Report has been sent to ${formData.email}.`);
            setShowModal(false); // Close modal
          } else {
            alert("Verification Failed! Contact Support.");
          }
          setLoading(false);
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#0d6efd"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // --- STYLES (Inline for simplicity) ---
  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
  };
  
  const modalContentStyle = {
    backgroundColor: "white", padding: "25px", borderRadius: "12px", width: "90%", maxWidth: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)", position: "relative"
  };

  const inputStyle = {
    width: "100%", padding: "10px", margin: "8px 0", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%", padding: "12px", backgroundColor: "#0d6efd", color: "white", border: "none", borderRadius: "6px",
    cursor: "pointer", fontWeight: "bold", marginTop: "15px", fontSize: "16px"
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
      <h1>JEE Readiness Result</h1>

      <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
        <h2>Your Scores</h2>
        <p><strong>Overall JEE Score:</strong> {score}/100</p>
        <p style={{ color: "#666" }}>Unlock the Detailed Report to see your Chapter-wise Analysis.</p>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {/* GO BACK BUTTON */}
        <a href="/" style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", borderRadius: "8px", textDecoration: "none" }}>
          Go Back
        </a>

        {/* ✅ DOWNLOAD REPORT BUTTON */}
        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: "10px 20px", backgroundColor: "#198754", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
        >
          Download Detailed Report
        </button>
      </div>

      {/* --- PAYMENT MODAL --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>Get Your Report</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>Enter details to receive the PDF via Email.</p>
            
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={inputStyle} />
            <input name="email" placeholder="Email Address" type="email" value={formData.email} onChange={handleChange} style={inputStyle} />
            <input name="phone" placeholder="Phone Number" type="tel" value={formData.phone} onChange={handleChange} style={inputStyle} />
            
            <div style={{ position: "relative", marginTop: "10px" }}>
              <input 
                name="coupon" 
                placeholder="Coupon Code (Optional)" 
                value={formData.coupon} 
                onChange={handleChange} 
                style={{ ...inputStyle, textTransform: "uppercase", fontWeight: "bold", letterSpacing: "1px" }} 
              />
              <span style={{ fontSize: "11px", color: "#888", display: "block", marginTop: "-5px" }}>
                Try "EARLYBIRD" for ₹100 Off!
              </span>
            </div>

            <button onClick={startPayment} disabled={loading} style={{ ...buttonStyle, backgroundColor: loading ? "#ccc" : "#0d6efd" }}>
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>

            <button 
              onClick={() => setShowModal(false)} 
              style={{ marginTop: "10px", background: "none", border: "none", color: "#666", cursor: "pointer", width: "100%", textDecoration: "underline" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
