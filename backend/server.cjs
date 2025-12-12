const express = require("express");
const cors = require("cors");

const generatePDF = require("./generateReportPDF.cjs");
const sendReport = require("./sendEmail.cjs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-dynamic-report", async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const pdf = await generatePDF(req.body);

    const emailResult = await sendReport(req.body.email, pdf);

    console.log("📧 Email sent!", emailResult);

    res.json({ success: true, message: "Dynamic report sent!", emailResult });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
