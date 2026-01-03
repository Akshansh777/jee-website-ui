// minimal Express proxy — do NOT commit your .env with secrets
const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();

// ---------------- STATIC PRINT SERVER (IMPORTANT) ----------------
// This makes /public/print.html actually open in browser
const PUBLIC_PATH = path.join(__dirname, "../public");
app.use("/public", express.static(PUBLIC_PATH));
console.log("Serving static files from:", PUBLIC_PATH);

// ---------------- PDF ROUTES ----------------
const registerPdfRoutes = require("./pdfRoutes");

// IMPORTANT: this URL must match what we just exposed
registerPdfRoutes(app, { printPageUrl: "http://localhost:3001/public/print.html" });

app.use(express.json({
  limit: "10mb"
}));

app.use((req, res, next) => {
  console.log("🔥 GLOBAL LOGGER HIT");
  console.log("Headers:", req.headers["content-type"]);
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    console.log("📩 RAW BODY:", body.slice(0, 200));
  });
  next();
});


app.use(express.json());

// ---------------- GEMINI API ----------------
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt || "";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const reply = response?.text || JSON.stringify(response);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SERVER BOOT ----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server listening ${PORT}`));
