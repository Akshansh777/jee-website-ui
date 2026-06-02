const express = require("express");
const cors = require("cors");

const generatePDF = require("./generateReportPDF.cjs");
const sendReport = require("./sendEmail.cjs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-dynamic-report", async (req, res) => {
  try {
    console.log("Incoming data request for:", req.body.name);

    if (!req.body.email) {
      return res.status(400).json({ success: false, error: "Email is required." });
    }

    // 1. Generate the PDF buffer
    const pdf = await generatePDF(req.body);

    // 2. Send the Email
    const emailResult = await sendReport(req.body.email, pdf);

    console.log("📧 Email sent to:", req.body.email);

    res.json({ success: true, message: "Dynamic report sent!", emailResult });

  } catch (err) {
    console.error("ERROR in PDF Pipeline:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Google Cloud Run requires listening on process.env.PORT and binding to "0.0.0.0"
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});