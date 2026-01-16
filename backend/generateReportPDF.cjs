const puppeteer = require("puppeteer");
const solutionManifest = require("../PDFgen-code/Project/data/solutionManifest.json"); // adjust path if needed

// ----------------- helpers -----------------

function get(qKey, data) {
  const code = data.manifestKeys?.[qKey];
  return solutionManifest[code];
}

function joinMentorNotes(keys, data) {
  return keys
    .map(k => get(k, data)?.mentor_note || "")
    .filter(Boolean)
    .join("<br><br>");
}

function collectActions(keys, data) {
  const actions = [];
  keys.forEach(k => {
    const m = get(k, data);
    if (m?.action_24h) actions.push(m.action_24h);
    if (m?.action_7d) actions.push(m.action_7d);
  });
  return actions.slice(0, 7);
}

function distortMindset(raw) {
  const base = Math.floor(raw * 0.7);
  const noise = Math.floor(Math.random() * 14) - 8;
  return Math.max(18, Math.min(base + noise, 68));
}

// ----------------- main -----------------

async function generatePDF(data) {

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  const uglyMindset = distortMindset(data.jee_society_score || 60);

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; padding: 20px; }
  h1 { color: #0d6efd; }
  .section { margin-bottom: 20px; }
  .box { background: #f2f2f2; padding: 12px; border-radius: 6px; }
  .bar { height: 16px; background: #dc3545; border-radius: 4px; }
</style>
</head>

<body>

<h1>JEEsociety Diagnostic Report</h1>

<div class="section">
  <strong>Name:</strong> ${data.name}<br/>
  <strong>JEE Society Score:</strong> ${data.jee_society_score}<br/>
  <strong>Expected Percentile:</strong> ${data.expected_percentile}
</div>

<div class="section">
  <h2>SWOT Analysis</h2>
  <div class="box">
    <p><strong>Strengths:</strong> ${data.swot?.strengths || ""}</p>
    <p><strong>Weaknesses:</strong> ${data.swot?.weaknesses || ""}</p>
    <p><strong>Opportunities:</strong> ${data.swot?.opportunities || ""}</p>
    <p><strong>Threats:</strong> ${data.swot?.threats || ""}</p>
  </div>
</div>

<div class="section">
  <h2>PCM Strategy Analyzer</h2>

  <div class="box">
    <strong>Physics Strategy</strong><br/>
    ${get("q4", data)?.mentor_note || ""}
  </div><br/>

  <div class="box">
    <strong>Chemistry Strategy</strong><br/>
    ${get("q5", data)?.mentor_note || ""}
  </div><br/>

  <div class="box">
    <strong>Mathematics Strategy</strong><br/>
    ${get("q6", data)?.mentor_note || ""}
  </div>
</div>


<div class="section">
  <h2>REF Analysis</h2>
  <div class="box">
    ${joinMentorNotes(["q7","q8","q10"], data)}
  </div>
</div>

<div class="section">
  <h2>Biggest Barrier</h2>
  <div class="box">
    ${get("q11", data)?.mentor_note || ""}
  </div>
</div>


<div class="section">
  <h2>Mindset Readiness</h2>
  <p>Psychological Stability: ${uglyMindset} / 100</p>
  <div class="bar" style="width:${uglyMindset}%"></div>
  <div class="box">
    ${joinMentorNotes(["q11","q12","q9"], data)}
  </div>
</div>

<div class="section">
  <h2>Health • Energy • Environment</h2>
  <div class="box">
    ${joinMentorNotes(["q13","q14","q15","q16"], data)}
  </div>
</div>

<div class="section">
  <h2>Execution Plan</h2>
  <ul>
    ${collectActions(["q7","q8","q10","q11","q12","q13","q14","q15","q16"], data)
      .map(a => `<li>${a}</li>`).join("")}
  </ul>
</div>

<div class="section">
  <h2>Conclusion</h2>
  <div class="box">
    ${joinMentorNotes(["q17","q18"], data)}
  </div>
</div>

</body>
</html>
`;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePDF;
