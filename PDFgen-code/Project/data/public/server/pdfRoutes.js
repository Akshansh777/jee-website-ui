/**
 * FINAL pdfRoutes.js
 * - Loads Manifest
 * - Maps Answers (0->A)
 * - Injects Data (Race Condition Fix)
 * - Sends Email via Resend (Buffer Fix)
 */

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
  console.log("✅ Manifest Loaded:", Object.keys(solutionManifest).length, "entries");
} catch (e) {
  console.error("❌ Manifest Error:", e.message);
}

// Helper: Map "0" -> "Q1_A"
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
      if (key && solutionManifest[key]) {
        solutionSnippets[key] = solutionManifest[key];
      }
    });

    const fullPayload = {
      ...incoming,
      solutionSnippets 
    };

    try {
      // 3. LAUNCH BROWSER
      const browser = await puppeteer.launch({ 
        headless: "new", 
        executablePath: "/usr/bin/google-chrome-stable",
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] 
      });

      const page = await browser.newPage();

      // 4. INJECT DATA (CRITICAL FIX)
      await page.evaluateOnNewDocument((data) => {
        window.REPORT_JSON = data;
      }, fullPayload);

      // 5. GENERATE PDF
      const target = "http://localhost:8080/public/print.html";
      await page.goto(target, { waitUntil: "networkidle0", timeout: 60000 });
      
      const pdfRaw = await page.pdf({
        format: "A4", printBackground: true,
        margin: { top: "10mm", bottom: "10mm", left: "0mm", right: "0mm" }
      });

      await browser.close();
      const finalBuffer = Buffer.from(pdfRaw);

      // 6. SEND EMAIL
      console.log(`📧 Sending to ${userEmail}...`);
      const { error } = await resend.emails.send({
        from: "JEE Society <support@jeesociety.in>",
        to: [userEmail],
        subject: "Your JEE Society Analysis Report",
        html: "<p>Your detailed analysis report is attached.</p>",
        attachments: [{ filename: "JEE_Report.pdf", content: finalBuffer }]
      });

      if (error) {
        console.error("Email Error:", error);
        // Return success so user still gets the download link
        return res.json({ success: true, emailStatus: "failed", pdfBase64: finalBuffer.toString("base64") });
      }

      console.log("✅ Success!");
      return res.json({ success: true, emailStatus: "sent", pdfBase64: finalBuffer.toString("base64") });

    } catch (err) {
      console.error("💥 Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
};