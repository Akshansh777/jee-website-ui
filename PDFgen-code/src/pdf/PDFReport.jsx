import React, { useState } from "react";

const defaultMapping = {
  Name: "Rahul Sharma",
  consistent: "Sometimes (4/10)",
  Productive: "Moderate (5/10)",
  "Exact current state": "Revision stage, many topics partially done",
  "How is your maths? How much time do you give?": "Weak conceptual clarity; 2 hours/day",
  "How is your physics? How much time do you give?": "Average; 1.5 hours/day",
  "How is your chemistry? How much time do you give?": "Good theory but weak inorganic; 1 hour/day",
  "How is your recall strength?": "Moderate - forget details after 2 days",
  "How is your efficiency? Number of JEE Mains PYQs you do in an hour?": "8-10 questions/hr",
  "How much can you focus in one go?": "45 minutes",
  "What is your biggest reason for questions mistake?": "Rushing and reading errors",
  "How confident you are about competence to do anything?": "6/10",
  "Question on addicted to collect resources but no POA": "Yes, collects many PDFs",
  "Question on Fear of question solving": "Some fear, avoids difficult questions",
  "Question on Phone addiction": "High",
  "Question on Baklog paralysis": "Yes, backlog of revisions",
  "How energetic you are generally during studies?": "Low-moderate",
  "How is your current health conditions?": "Sleep deprived",
  "How is your study environment?": "Crowded; noisy",
  "How exactly does your parents respond to your JEE preparation?": "Supportive but not structured"
};

export default function GeminiChat() {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawJsonLine, setRawJsonLine] = useState(null);

  function buildPrompt(mapping) {
    const lines = [
      "You are JEEsociety Study Analyst. Based on the user inputs below, produce a thorough report with all sections specified.",
      "Inputs:"
    ];

    for (const k of Object.keys(mapping)) {
      lines.push(`${k}: ${mapping[k]}`);
    }

    lines.push("\nNow produce the report exactly as described below (use clear headings):");
    lines.push(`
Executive summary:
- Project their score based on their current inputs. Figure out what they are doing wrong in terms of consistency, productivity and current state and summarise that in a line or two.

Improved projection:
- Project their score based on their improved efforts. Tell them the report analyses them and gives them some actionable advices to work on. If they follow them consistently, they can achieve their dream projected percentile. 

PCM time allocation:
- Understand the time devoted individually to Physics, Chemistry, Maths; list what they are doing right and what should be done for better ROI.

REF study analyst:
- Recall Strength: How much this person is able to recall in exams and how can this person improve it.
- Efficiency: How many questions can this person do in an hour and how can he improve.
- Focus potential: How many hours can this person sit with full focus? And how can he improve it.

Error pattern profiler:
- An analysis of the error types observed during the diagnostic test and descriptive answers: Conceptual Error, Calculation Error, Reading Comprehension Error. and then a JS advice to overcome it.

Mindset:
- A short paragraph about mindset readiness; produce a percentage 0-100 for a speedometer.

Barriers:
- Summarise the different barriers this student is having and then tell them “Your single biggest Barrier: addicted to collect resources but no POA/Fear of question solving/Phone addiction/Baklog paralysis” and then 1 practical JEEsociety tip to overcome it.

Health & Energy:
- How is that student’s health and how urgently they need to focus on it. And then how energetic they are generally everyday and how they can improve it by adding physical acitivites/sleep/clean food.

Study Environment & Parents:
- Based on inputs gathered about the support by parents, distractions, and home environment and give reasonable advice for it.

JEEsociety 40-Day Surgical Roadmap:
- List the most important chapters this student needs to complete in PCM each, which are low-effort, high-weightage chapters and ask the student to follow them rigorously.

Conclusion:
- List all the points given in the report carefully in a well arranged manner with stating the 3 important problems to solve and the list of 7 most important advice by JEEsociety to follow. These advices are sum total of all the advices given above.

Formatting & output:
- Keep each section clearly headed.
- Avoid long unnecessary filler; be actionable.
`);

    return lines.join("\n");
  }

  async function sendPrompt() {
    setLoading(true);
    setReply("");
    setRawJsonLine(null);
    try {
      const prompt = buildPrompt(defaultMapping);

      const resp = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await resp.json();
      const text = data.reply || data.text || JSON.stringify(data);

      const lines = text.trim().split(/\r?\n/);
      let lastJson = null;
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith("{") && line.endsWith("}")) {
          try {
            lastJson = JSON.parse(line);
            lines.splice(i, 1);
            break;
          } catch (e) {
            // continue
          }
        }
      }

      setReply(lines.join("\n"));
      if (lastJson) setRawJsonLine(lastJson);
    } catch (err) {
      setReply("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={sendPrompt} disabled={loading}>
          {loading ? "Analyzing..." : "Get JEEsociety Report"}
        </button>
      </div>

      <div style={{ whiteSpace: "pre-wrap", marginTop: 12, maxWidth: 900 }}>
        {reply || "No report yet. Click the button to generate report using the provided mapping."}
      </div>

      {rawJsonLine && (
        <div style={{ marginTop: 18 }}>
          <strong>Parsed tokens (for frontend rendering):</strong>
          <pre>{JSON.stringify(rawJsonLine, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}