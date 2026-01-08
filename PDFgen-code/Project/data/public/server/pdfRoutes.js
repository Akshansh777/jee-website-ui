const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// 1. LOAD MANIFEST
const manifestPath = path.join(__dirname, "Project/data/solutionManifest.json");
let solutionManifest = {};
try {
  solutionManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  console.log("✅ Manifest Loaded");
} catch (e) { console.error("❌ Manifest Error:", e.message); }

function mapAnswerToKey(qId, val) {
  const map = { "0": "A", "1": "B", "2": "C", "3": "D" };
  const letter = map[String(val)];
  if (!letter) return null;
  return `${qId.toUpperCase().replace("Q", "Q")}_${letter}`;
}

module.exports = function registerPdfRoutes(app, options = {}) {
  app.use(require("express").json({ limit: "50mb" }));

  app.post("/send-dynamic-report", async (req, res) => {
    console.log("🔥 Report Request Received");
    const incoming = req.body;
    const userEmail = incoming.email || "akshanshmishra5@gmail.com";
    const answers = incoming.answers || {};

    // 2. PREPARE DATA
    const solutionSnippets = {};
    Object.keys(answers).forEach(qId => {
      const key = mapAnswerToKey(qId, answers[qId]);
      if (key && solutionManifest[key]) solutionSnippets[key] = solutionManifest[key];
    });

    const fullPayload = { ...incoming, solutionSnippets };

    try {
      const browser = await puppeteer.launch({ 
        headless: "new", 
        executablePath: "/usr/bin/google-chrome-stable",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] 
      });

      const page = await browser.newPage();

      // ---> 3. CRITICAL FIX: INJECT DATA EARLY <---
      await page.evaluateOnNewDocument((data) => {
        window.REPORT_JSON = data;
      }, fullPayload);

      // 4. GENERATE PDF
      await page.goto("http://localhost:8080/public/print.html", { waitUntil: "networkidle0", timeout: 60000 });
      
      const pdfRaw = await page.pdf({
        format: "A4", printBackground: true,
        margin: { top: "10mm", bottom: "10mm", left: "0mm", right: "0mm" }
      });
      await browser.close();

      // 5. SEND EMAIL
      const finalBuffer = Buffer.from(pdfRaw);
      console.log(`📧 Sending to ${userEmail}...`);
      
      const { error } = await resend.emails.send({
        from: "JEE Society <support@jeesociety.in>",
        to: [userEmail],
        subject: "Your JEE Society Analysis Report",
        html: "<p>Your detailed analysis report is attached.</p>",
        attachments: [{ filename: "JEE_Report.pdf", content: finalBuffer }]
      });

      if (error) console.error("Email Error:", error);
      
      return res.json({ success: true, emailStatus: error ? "failed" : "sent", pdfBase64: finalBuffer.toString("base64") });

    } catch (err) {
      console.error("💥 Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
};
