const express = require("express");
const cors = require("cors");
const path = require("path");
const generatePDF = require("./generateReportPDF");

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint to generate PDF
app.post("/generate-pdf", async (req, res) => {
  try {
    const reportContent = req.body;
    const outputPath = path.join(__dirname, "../reports/output.pdf");

    await generatePDF(reportContent, outputPath);

    res.status(200).json({
      message: "PDF generated successfully",
      file: "/reports/output.pdf",
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

// Serve generated PDFs
app.use("/reports", express.static(path.join(__dirname, "../reports")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
