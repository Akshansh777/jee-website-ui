const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const solutionManifest = require("../PDFgen-code/Project/data/solutionManifest.json");

// ---------- helpers ----------
function imgToBase64(imgPath) {
  const img = fs.readFileSync(imgPath);
  return `data:image/png;base64,${img.toString("base64")}`;
}
function loadImageSafe(mainPath, fallbackPath) {
  try {
    return imgToBase64(mainPath);
  } catch (err) {
    console.warn("Image not found, using fallback:", mainPath);
    return imgToBase64(fallbackPath);
  }
}

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

// ---------- main ----------
async function generatePDF(data) {

  const attemptType = data.attempt_type || "2026";

  const coverImg = imgToBase64(path.resolve(__dirname, "assets/cover.png"));
  const founderImg = imgToBase64(path.resolve(__dirname, "assets/founder.png"));
  const parentsImg = imgToBase64(path.resolve(__dirname, "assets/parents_note.png"));

  const mindsetImg = imgToBase64(path.resolve(__dirname, "assets/mindset.png"));
  const calculatorImg = imgToBase64(path.resolve(__dirname, "assets/calculator.png"));
  const refBgImg = imgToBase64(
  path.resolve(__dirname, "assets/ref.png")
);


 function safeImg(name) {
  const p = path.resolve(__dirname, `assets/${name}`);
  if (!fs.existsSync(p)) {
    console.log("❌ Missing image:", name);
    return "";
  }
  return imgToBase64(p);

  function safeImg(filename) {
  const p = path.resolve(__dirname, `assets/${filename}`);
  if (!fs.existsSync(p)) {
    console.log("❌ Missing image:", filename);
    return null;
  }
  return imgToBase64(p);
}
function loadImageSafe(mainPath, fallbackPath) {
  try {
    return imgToBase64(mainPath);
  } catch (err) {
    return imgToBase64(fallbackPath);
  }
}

}
const physicsImg = loadImageSafe(
  path.resolve(__dirname, `assets/physics_${attemptType}.png`),
  path.resolve(__dirname, "assets/physics_2026.png")
);

const chemistryImg = loadImageSafe(
  path.resolve(__dirname, `assets/chemistry_${attemptType}.png`),
  path.resolve(__dirname, "assets/chemistry_2026.png")
);

const mathsImg = loadImageSafe(
  path.resolve(__dirname, `assets/maths_${attemptType}.png`),
  path.resolve(__dirname, "assets/maths_2026.png")
);




  const conclusionBgImg = imgToBase64(
  path.resolve(__dirname, "assets/conclusion.png")
);

  const executionBgImg = imgToBase64(
  path.resolve(__dirname, "assets/execution.png")
);
  // ✅ FIX: define health background image
  const healthEnvBgImg = imgToBase64(
  path.resolve(__dirname, "assets/health_env.png")
);


  const uglyMindset = distortMindset(data.jee_society_score || 60);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  const html = `
<!DOCTYPE html>
<html>
<head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Nunito:wght@400;700&display=swap');

body { margin:0; padding:0; background:white; font-family:Nunito,sans-serif; }

.page {
  page-break-after: always;
  padding: 0;              /* IMPORTANT */
  position: relative;
  height: 1120px;          /* force A4 height */
  overflow: hidden;        /* prevent spill */
}


.page:last-child {
  page-break-after: auto;
}


img { width:100%; display:block; }

/* COVER */
.cover-page { font-family:Lato; position:relative; }

.cover-info {
  position:absolute;
  bottom:110px;
  left:70px;
  width:380px;
  background:#4a0402;
  color:#FFF1CD;
  padding:18px 22px;
  border-radius:12px;
}

/* FOUNDER */
.founder-page {
  position: relative;
  height: 1120px;
  overflow: hidden;
}

.founder-bg-img {
  width: 100%;
  height: auto;
}

.founder-score-box {
  position:absolute;
  top:70px;
  left:55px;
  width:650px;
  background:#D6D9DD;
  color:#4a0402;
  padding:22px 28px;
  border-radius:12px;
  font-size:18px;
  line-height:1.7;
  z-index:5;
}

/* PCM */
.pcm-header {
  background:#4a0402;
  color:#EAA702;
  text-align:center;
  padding:20px 0;
  font-size:26px;
  font-weight:800;
  margin-bottom:25px;
}

.strategy-box {
  background:#f2f2f2;
  border-radius:10px;
  padding:18px;
  margin-bottom:18px;
  break-inside:avoid;
}

.strategy-number {
  width:55px;
  height:55px;
  background:#4a0402;
  color:#EAA702;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:24px;
  font-weight:800;
  margin:0 auto 10px;
}

.strategy-title {
  text-align:center;
  font-weight:800;
  margin-bottom:8px;
}

/* REF PAGE */
.ref-page {
  position: relative;
  padding: 0;
  height: 1120px; /* A4 */
  overflow: hidden;
}

/* background png */
.ref-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* top grey box text */
.ref-box1 {
  position: absolute;
  top: 310px;
  left: 80px;
  width: 620px;
  padding: 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #4a0402;
  z-index: 5;
}

/* bottom grey box text */
.ref-bottom-text {
  position: absolute;

  /* adjust these to match your grey box location */
  top: 780px;      /* pushes it into grey box */
  left: 75px;

  width: 350px;    /* keeps lines short */
  max-width: 350px;

  font-size: 15px;
  line-height: 1.6;
  color: #4a0402;

  z-index: 10;

  text-align: left;
  word-wrap: break-word;
}


.ref-bottom-text p {
  margin: 0 0 14px 0;   /* space between paragraphs */
}




/* HEALTH PAGE */
.health-page { position: relative; padding:0; }

.health-bg {
  width:100%;
  height:100%;
  object-fit:cover;
}

.health-title {
  position: absolute;
  top: 90px;
  left: 80px;
  width: 600px;

  background: #E5E9EF;
  border: 2px solid #4a0402;
  border-radius: 6px;

  padding: 16px 20px;

  font-size: 22px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.5px;
}


.health-box {
  position: absolute;
  left: 80px;
  width: 600px;

  background: #E5E9EF;          /* solid grey */
  border: 2px solid #4a0402;
  border-radius: 6px;

  padding: 22px 24px;          /* more inner space */
  min-height: 90px;            /* makes boxes taller */

  font-size: 16px;
  line-height: 1.6;
  color: #4a0402;
}


.box1 { top: 170px; }
.box2 { top: 300px; }
.box3 { top: 430px; }
.box4 { top: 560px; }

.execution-page {
  position: relative;
  padding: 0;
}

.execution-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* execution title bar */
.execution-title {
  position: absolute;
  top: 120px;
  left: 80px;
  width: 600px;

  background: #4a0402;
  color: #EAA702;

  padding: 14px;
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 2px;
}
.execution-box li {
  margin-bottom: 14px;   /* controls spacing between points */
  line-height: 1.6;
}
/* execution grey box */
.execution-box {
  position: absolute;
  top: 240px;
  left: 80px;
  width: 600px;

  background: #C6C6C6;
  border-radius: 14px;

  padding: 30px 35px;

  font-size: 18px;
  line-height: 1.7;
  color: #4a0402;
  font-weight: 600;
}
.conclusion-page {
  position: relative;
  padding: 0;
  height: 1120px; /* A4 */
  overflow: hidden;
}

/* background image */
.conclusion-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* text layer */
.conclusion-content {
  position: absolute;
  top: 560px;   /* push below title bar in PNG */
  left: 80px;
  right: 80px;
  z-index: 5;
  font-family: 'Nunito', sans-serif;
  color: #4a0402;
}

/* each block */
.conclusion-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.conclusion-item .num {
  font-size: 28px;
  font-weight: 800;
}

.conclusion-item h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.conclusion-item p {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.6;
}


/* title */
.conclusion-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
}

/* text */
.conclusion-text {
  font-size: 15px;
  line-height: 1.5;
}


</style>
</head>

<body>

<!-- PAGE 1 COVER -->
<div class="page cover-page">
  <img src="${coverImg}">
  <div class="cover-info">
    <strong>Name:</strong> ${data.name}<br>
    <strong>JEE Society Score:</strong> ${data.jee_society_score}<br>
    <strong>Expected Percentile:</strong> ${data.expected_percentile}
  </div>
</div>

<!-- PAGE 2 FOUNDER -->
<div class="page founder-page">
  <img src="${founderImg}" class="founder-bg-img">
  <div class="founder-score-box">
    <strong>JEE Society Score (Readiness Index):</strong> ${data.jee_society_score}/100<br><br>
    <strong>Current Projected Percentile:</strong>
    ${data.expected_percentile_range?.[0] || "N/A"} - ${data.expected_percentile_range?.[1] || "N/A"}<br><br>
    <strong>Projected Percentile (If Key Corrections Are Made):</strong>
    ${data.potential_percentile_range?.[0] || "N/A"} - ${data.potential_percentile_range?.[1] || "N/A"}
  </div>
</div>

<!-- PAGE 3 PCM -->


<div class="page">
  <div class="pcm-header">PCM STRATEGY ANALYZER</div>
  <div class="strategy-box"><div class="strategy-number">1</div><div class="strategy-title">PHYSICS STRATEGY</div>${get("q4", data)?.mentor_note || ""}</div>
  <div class="strategy-box"><div class="strategy-number">2</div><div class="strategy-title">CHEMISTRY STRATEGY</div>${get("q5", data)?.mentor_note || ""}</div>
  <div class="strategy-box"><div class="strategy-number">3</div><div class="strategy-title">MATHS STRATEGY</div>${get("q6", data)?.mentor_note || ""}</div>
</div>

<!-- PAGE: REF ANALYSIS -->


<div class="page ref-page">
  <img src="${refBgImg}" class="ref-bg"/>

  <!-- R.E.F ANALYSIS TEXT (top grey box) -->
  <div class="ref-text ref-box1">
    ${joinMentorNotes(["q7","q8","q10"], data)}
  </div>

  <!-- BIGGEST BARRIER & MINDSET (bottom grey box) -->
<div class="ref-bottom-text">
  <p>
    ${(get("q11", data)?.mentor_note?.split(". ") || []).slice(0,1).join(". ")}
  </p>
  <p>
    ${(get("q11", data)?.mentor_note?.split(". ") || []).slice(1).join(". ")}
  </p>
</div>
</div>



<!-- PAGE: Health Energy Environment -->
<div class="page health-page">

  <!-- background image -->
  <img src="${healthEnvBgImg}" class="health-bg"/>

  <!-- HEADING -->
  <div class="health-title">
    Health • Energy • Environment
  </div>

  <!-- BOX 1 -->
  <div class="health-box box1">
    ${get("q13", data)?.mentor_note || ""}
  </div>

  <!-- BOX 2 -->
  <div class="health-box box2">
    ${get("q14", data)?.mentor_note || ""}
  </div>

  <!-- BOX 3 -->
  <div class="health-box box3">
    ${get("q15", data)?.mentor_note || ""}
  </div>

  <!-- BOX 4 -->
  <div class="health-box box4">
    ${get("q16", data)?.mentor_note || ""}
  </div>


</div>


<!-- SUBJECT PAGES -->
${physicsImg ? `<div class="page"><img src="${physicsImg}"></div>` : ""}
${chemistryImg ? `<div class="page"><img src="${chemistryImg}"></div>` : ""}
${mathsImg ? `<div class="page"><img src="${mathsImg}"></div>` : ""}
${parentsImg ? `<div class="page"><img src="${parentsImg}"></div>` : ""}



// <!-- MINDSET 
<div class="page">
<h2>Mindset Readiness</h2>
<p>${uglyMindset}/100</p>
<div style="background:#EAA702;height:16px;width:${uglyMindset}%"></div>
</div>
-->

<!-- PAGE: EXECUTION PLAN -->
<div class="page execution-page">

  <!-- background image -->
  <img src="${executionBgImg}" class="execution-bg"/>

  <!-- title -->
  <div class="execution-title">
    EXECUTION PLAN
  </div>

  <!-- grey content box -->
  <div class="execution-box">
    <ol>
      ${collectActions(["q7","q8","q10","q11","q12","q13","q14"], data)
        .map(a => `<li>${a}</li>`).join("")}
    </ol>
  </div>

</div>



<!-- PAGE Conclusion -->
<!-- PAGE Conclusion -->
<div class="page conclusion-page">

  <!-- background image -->
  <img src="${conclusionBgImg}" class="conclusion-bg"/>

  <!-- content -->
  <div class="conclusion-content">

    <div class="conclusion-item">
      
      <div class="conclusion-text">
       
        <div class="conclusion-body">
          ${get("q17", data)?.mentor_note || ""}
        </div>
      </div>
    </div>

    <div class="conclusion-item">
    
      <div class="conclusion-text">
        
        <div class="conclusion-body">
          ${get("q18", data)?.mentor_note || ""}
        </div>
      </div>
    </div>

  </div>
</div>




</body>
</html>
`;

  await page.setContent(html, { waitUntil: "load" });
  const pdf = await page.pdf({ format:"A4", printBackground:true });
  await browser.close();
  return pdf;
}

module.exports = generatePDF;
