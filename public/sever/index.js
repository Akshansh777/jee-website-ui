// minimal Express proxy — do NOT commit your .env with secrets
const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(express.json());

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server listening ${PORT}`));