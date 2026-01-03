/**
 * server/pdfRoutes.js
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

module.exports = function registerPdfRoutes(app, options = {}) {

    // FORCE JSON PARSER HERE
  app.use(require("express").json({ limit: "10mb" }));

  app.use((req, res, next) => {
    console.log(" PDF ROUTES LOGGER");
    console.log("URL:", req.originalUrl);
    console.log("Headers:", req.headers["content-type"]);
    console.log("BODY RAW:", JSON.stringify(req.body)?.slice(0,300));
    next();
  });

  const printPageUrl = options.printPageUrl || null;

  // ---------------- LOAD SOLUTION MANIFEST ----------------
  const manifestPath = path.join(__dirname, "../data/solutionManifest.json");

  let solutionManifest = {};

  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    solutionManifest = JSON.parse(raw);
    console.log(
      "Loaded solution manifest:",
      Object.keys(solutionManifest).length,
      "entries"
    );
  } catch (e) {
    console.warn(
      "Could not load solution manifest at",
      manifestPath,
      e.message
    );
  }

  // ---------------- VALIDATION ----------------
  function validateQuestionnaire(body = {}) {
    const errors = [];
    const expectedQuestions = Array.from({ length: 18 }, (_, i) => `q${i + 1}`);

    for (const q of expectedQuestions) {
      if (!(q in body)) {
        errors.push(`${q} is missing`);
        continue;
      }

      const val = String(body[q]).trim();
      if (!["0", "1", "2", "3"].includes(val)) {
        errors.push(`${q} has invalid value ${val}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ---------------- MAP RESPONSES ----------------
  function mapResponsesToKeys(formData = {}) {
    const optionMap = { "0": "A", "1": "B", "2": "C", "3": "D" };
    const result = [];

    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith("q")) {
        const qNum = key.replace("q", "");
        const letter = optionMap[value];
        if (letter) result.push(`Q${qNum}_${letter}`);
      }
    });

    return result;
  }

  // ---------------- /api/merge-snippets ----------------
  app.post("/api/merge-snippets", (req, res) => {
    try {
      const { student_name = null, ...answers } = req.body || {};

      const result = validateQuestionnaire(answers);
      if (!result.valid) {
        console.log("❌ Validation Failed:", result.errors);
        return res.status(400).json({
          ok: false,
          error: "Invalid questionnaire data",
          details: result.errors,
        });
      }

      const selectedKeys = mapResponsesToKeys(answers);
      console.log("Mapped Keys:", selectedKeys);

      const solutionSnippets = {};
      for (const k of selectedKeys) {
        solutionSnippets[k] =
          solutionManifest[k] || {
            title: k,
            question: "",
            option_label: "",
            one_line: "",
            mentor_note: "",
            action_24h: "",
            action_7d: "",
          };
      }

      const payload = {
        metadata: {
          report_id: "dev_" + Date.now(),
          generated_at: new Date().toISOString(),
          student_name,
        },
        solutionSnippets,
      };

      return res.json({ ok: true, payload });
    } catch (err) {
      console.error("merge-snippets error:", err);
      return res.status(500).json({ error: err.message });
    }
  });

  // ---------------- /generate-pdf ----------------
  app.post("/generate-pdf", async (req, res) => {
    console.log("🔥 /generate-pdf hit");

    try {
      const payload = req.body;
      console.log("📦 Payload keys:", Object.keys(payload || {}));

      if (!payload || Object.keys(payload).length === 0) {
        console.log("❌ Empty payload");
        return res.status(400).json({
          error:
            "Missing payload: POST body must contain the merged payload (metadata + solutionSnippets)",
        });
      }

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      const page = await browser.newPage();

      let target;

      if (printPageUrl) {
        target = printPageUrl;
      } else {
        target = "http://localhost:3001/public/print.html";
      }

      console.log("🧭 Trying to open print page:", target);

      console.log("⌛ Loading page...");
      await page.goto(target, {
        waitUntil: "networkidle0",
        timeout: 40000,
      });

      console.log("✅ Page loaded. Injecting payload...");
      await page.evaluate((d) => {
        window.REPORT_JSON = d;
        window.__PDF_READY = true;
      }, payload);

      console.log("🖨️ Generating PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "16mm",
          bottom: "16mm",
          left: "12mm",
          right: "12mm",
        },
      });

      await browser.close();
      console.log("✅ Browser closed");

      try {
        const outPath = path.join(process.cwd(), "final_test.pdf");
        fs.writeFileSync(outPath, pdfBuffer);
        console.log("💾 PDF saved locally:", outPath, "bytes:", pdfBuffer.length);
      } catch (e) {
        console.warn("⚠️ Could not auto-save PDF:", e.message);
      }

      return res.json({
        ok: true,
        pdfBase64: pdfBuffer.toString("base64"),
      });

    } catch (err) {
      console.error("💥 generate-pdf crashed:", err);
      return res
        .status(500)
        .json({ ok: false, error: err.message, stack: err.stack });
    }
  });

  console.log("PDF routes registered");
};
