import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

router.post("/generate-report", async (req, res) => {
  try {
    const { name, answers } = req.body;

    const prompt = `
      You are generating a structured student evaluation report.

    INPUT:
    - Student Name: {{name}}
    - Student Answers (JSON): {{answers}}

    TASK:
    Create a clean, well-formatted report in **exactly ONE** of the following formats (choose whichever produces the cleanest structure):  
    1. LATEX (preferred)  
    2. Markdown  
    3. HTML  

    REQUIREMENTS:
    - Include these sections:
    - Title (with student name)
    - Summary Overview
    - Strengths
    - Weaknesses
    - Opportunities
    - Threats
    - Personality Insight
    - Action Plan (specific steps)
    - Keep formatting professional and visually clean.
    - Use proper sectioning hierarchies.
    - Do NOT include explanations outside the output format.
    - The output must be directly compilable into a PDF safely.

    RETURN:
    Only the final report in the chosen format.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ latex: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).send("AI generation failed.");
  }
});

export default router;
