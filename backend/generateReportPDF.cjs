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

function generateReportId(data) {
  const namePart = (data.name || "USR").slice(0, 3).toUpperCase();
  const timePart = Date.now().toString().slice(-6);
  return `JS-${namePart}-${timePart}`;
}

function distortMindset(raw) {
  const base = Math.floor(raw * 0.7);
  const noise = Math.floor(Math.random() * 14) - 8;
  return Math.max(18, Math.min(base + noise, 68));
}

// ---------- main ----------
async function generatePDF(data) {

  const attemptType = data.target_attempt && data.target_attempt.includes("2027") ? "2027" : "2026";

 const coverNewImg = imgToBase64(
  path.resolve(__dirname, "assets/cover_new.png")
);
  const founderImg = imgToBase64(path.resolve(__dirname, "assets/founder.png"));
  

  const mappingImg = loadImageSafe(
  path.resolve(__dirname, "assets/mapping.png"),
  path.resolve(__dirname, "assets/mapping.png")
);

const refMindsetImg = loadImageSafe(
  path.resolve(__dirname, "assets/ref-mindset.png"),
  path.resolve(__dirname, "assets/ref-mindset.png")
);
 
  const calculatorImg = imgToBase64(path.resolve(__dirname, "assets/calculator.png"));
  const refBgImg = imgToBase64(
  path.resolve(__dirname, "assets/ref.png")
);

const subjectScoreBg = loadImageSafe(
  path.resolve(__dirname, "assets/subject-wise-score.png"),
  path.resolve(__dirname, "assets/subject-wise-score.png")
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




const conclusionNewBg = imgToBase64(
  path.resolve(__dirname, "assets/conclusion_new.png")
);

const execBgImg = imgToBase64(
  path.resolve(__dirname, "assets/execution_plan.png")
);

const noteParentsBg = imgToBase64(
  path.resolve(__dirname, "assets/note-parents.png")
);

const roadmapBg = imgToBase64(
  path.resolve(__dirname, "assets/roadmap.png")
);


const template1Img = loadImageSafe(
  path.resolve(__dirname, "assets/templates/template1.png"),
  path.resolve(__dirname, "assets/templates/template1.png") // fallback same for now
);

const template2Img = loadImageSafe(
  path.resolve(__dirname, "assets/templates/template2.png"),
  path.resolve(__dirname, "assets/templates/template2.png")
);


  // ✅ FIX: define health background image
  const healthEnvBgImg = imgToBase64(
  path.resolve(__dirname, "assets/health_env_new.png")
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
.full-page-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

img { width:100%; display:block; }

/* COVER */
.cover-text {
  position: absolute;
  font-size: 20px;
  color: #222;
  font-weight: 500;
}

/* ALIGN INSIDE BOX */

.name   { top: 66%; left: 24%; }
.target { top: 69%; left: 24%; }

.exp    { top: 72%; left: 46%; }
.pot    { top: 76%; left: 46%; }

.score  { top: 80%; left: 42%; }

.report {
  top: 86%;
  left: 30%;
  font-size: 14px;
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
.subject-page {
  position: relative;
  height: 1120px;
}

.subject-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.subject-box {
  position: absolute;
  font-size: 14.5px;
  line-height: 1.7;
  max-width: 38ch;
  overflow: hidden;
}

.physics-box {
  top: 380px;
  left: 110px;
}

.chemistry-box {
  top: 380px;
  left: 500px;
  max-width: 42ch;
}

.maths-box {
  top: 820px;
  left: 110px;
  max-width: 40ch;
}
.subject-box {
  max-width: 38ch;
}

.subject-container {
  position: relative;
  left: -55px;   /* 👈 shift everything left */
}

/* REF PAGE */
/* ===== REF PAGE ===== */

.ref-page {
  position: relative;
  height: 1120px;
}

/* background image */
.ref-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== TOP BOX ===== */
.ref-text {
  position: absolute;

  top: 250px;        /* 🔥 move UP (was ~360) */
  left: 50px;

  width: 640px;      /* slightly wider → better fill */
  height: 260px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 20px 30px;

  font-size: 15px;
  line-height: 1.8;
  color: #4b1e1e;
}

/* ===== BOTTOM BOX ===== */
.ref-bottom-text {
  position: absolute;

  top: 750px;        /* 🔥 move UP (was ~780+) */
  left: 85px;

  width: 600px;
  height: 240px;     /* slightly tighter → removes emptiness */

  display: flex;
  flex-direction: column;
  justify-content: center;

  padding: 20px 30px;

  font-size: 19px;
  line-height: 1.8;
  color: #4b1e1e;
}



/* HEALTH PAGE */
.health-page {
  position: relative;
  height: 1120px;
  font-family: 'DM Sans', sans-serif;
}

.health-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.health-container {
  position: absolute;
  top: 160px;
  left: 90px;
  right: 90px;
}

.health-item {
  position: absolute;

  width: 620px;        /* slightly tighter so it fits curves */
  left: 5px;         /* ← move LEFT (was ~180) */

  font-size: 16px;
  line-height: 1.6;
  color: #5c1a1a;

  display: flex;
  align-items: center;

  height: 110px;       /* slightly tighter fit */
}

.health-item:nth-of-type(1) { top: 20px; }
.health-item:nth-of-type(2) { top: 230px; }
.health-item:nth-of-type(3) { top: 450px; }
.health-item:nth-of-type(4) { top: 650px; }

/* EXECUTION PAGE */
./* EXECUTION PAGE */
.exec-page {
  position: relative;
  width: 100%;
  height: 100%;
}

/* BACKGROUND */
.exec-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TEXT ITEMS */
.exec-item {
  position: absolute;
  width: 420px;        /* reduced width so it sits inside layout and aligns with numbers */
  left: 140px;         /* moved left to align with numbering on the background */

  font-size: 18px;
  line-height: 1.6;
  color: #4a0402;
  padding: 10px 14px;  /* add padding for better visual spacing */
  box-sizing: border-box;
  border-radius: 6px;
}

.exec-item.item1 { top: 300px; }
.exec-item.item2 { top: 360px; }
.exec-item.item3 { top: 420px; }
.exec-item.item4 { top: 480px; }
.exec-item.item5 { top: 540px; }
.exec-item.item6 { top: 600px; }
.exec-item.item7 { top: 660px; }

.exec-item {
  max-height: 60px;
  overflow: hidden;
}

.exec-item {
  background: rgba(255,0,0,0.2);
}


.conclusion-new-page {
  position: relative;
  width: 100%;
  height: 100%;
}

.conclusion-new-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TEXT BOX */
.conclusion-text {
  position: absolute;
  top: 390px;
  left: 140px;

  width: 520px;          /* ↓ reduced width */

  font-size: 25px !important;       /* ↑ bigger text */
  line-height: 1.8;      /* ↑ better readability */

  color: #5c1a1a;
}

.conclusion-text p {
  margin-bottom: 27px;   /* controls gap between lines */
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

/* template */
.full-page-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
</head>

<body>

<!-- PAGE: COVER NEW -->
<div class="page cover-new-page">
  <img src="${coverNewImg}" class="cover-new-bg"/>

  <div class="cover-text name">${data.name || ""}</div>
  <div class="cover-text target">${data.attempt_type || ""}</div>
  <div class="cover-text exp">${data.expected_percentile || ""}</div>
  <div class="cover-text pot">${data.expected_percentile || ""}</div>
  <div class="cover-text score">${data.jee_society_score || ""}</div>
  <div class="cover-text report">${generateReportId(data)}</div>

</div>

<!-- PAGE 2 FOUNDER -->
<div class="page founder-page">
  <img src="${founderImg}" class="founder-bg-img">
  <div class="founder-score-box">
    <strong>JEE Society Score (Readiness Index):</strong> ${data.jee_society_score}/100<br><br>
    
    <strong>Current Projected Percentile:</strong>
    ${Array.isArray(data.expected_percentile) ? data.expected_percentile[0] : "N/A"} - 
    ${Array.isArray(data.expected_percentile) ? data.expected_percentile[1] : "N/A"}%<br><br>
    
    <strong>Projected Percentile (If Key Corrections Are Made):</strong>
    ${Array.isArray(data.potential_percentile) ? data.potential_percentile[0] : "N/A"} - 
    ${Array.isArray(data.potential_percentile) ? data.potential_percentile[1] : "N/A"}%
  </div>
</div>

<!-- PAGE: SUBJECT SCORE -->

<div class="page subject-page">

  <img src="${subjectScoreBg}" class="subject-bg"/>

  <div class="subject-container">   <!-- ADD THIS -->

    <div class="subject-box physics-box">
      ${get("q4", data)?.mentor_note || ""}
    </div>

    <div class="subject-box chemistry-box">
      ${get("q5", data)?.mentor_note || ""}
    </div>

    <div class="subject-box maths-box">
      ${get("q6", data)?.mentor_note || ""}
    </div>

  </div>  <!-- END -->

</div>

${mappingImg ? `<div class="page">
  <img src="${mappingImg}" class="full-page-img"/>
</div>` : ""}
<!-- PAGE: REF ANALYSIS -->

<div class="page ref-page">
  <img src="${refMindsetImg}" class="ref-bg"/>

  <!-- R.E.F ANALYSIS TEXT (top grey box) -->
  <div class="ref-text ref-box1">
    ${joinMentorNotes(["q7","q8","q10"], data)}
  </div>

  <!-- BIGGEST BARRIER & MINDSET (bottom grey box) -->
  <div class="ref-bottom-text">
  <p>
    ${(get("q11", data)?.mentor_note?.split(". ") || []).slice(0,2).join(". ")}
  </p>
  <p>
    ${(get("q11", data)?.mentor_note?.split(". ") || []).slice(2).join(". ")}
  </p>
</div>

</div>

<!-- PAGE: Health Energy Environment -->
<div class="page health-page">

  <!-- background image -->
  <img src="${healthEnvBgImg}" class="health-bg"/>

  <!-- CONTENT WRAPPER -->
  <div class="health-container">

    <!-- ITEMS -->
    <div class="health-item">
      ${get("q13", data)?.mentor_note || ""}
    </div>

    <div class="health-item">
      ${get("q14", data)?.mentor_note || ""}
    </div>

    <div class="health-item">
      ${get("q15", data)?.mentor_note || ""}
    </div>

    <div class="health-item">
      ${get("q16", data)?.mentor_note || ""}
    </div>

  </div>
</div>


</div>


<!-- SUBJECT PAGES -->
${physicsImg ? `<div class="page"><img src="${physicsImg}"></div>` : ""}
${chemistryImg ? `<div class="page"><img src="${chemistryImg}"></div>` : ""}
${mathsImg ? `<div class="page"><img src="${mathsImg}"></div>` : ""}




<!-- PAGE: EXECUTION PLAN -->
<div class="page exec-page">
  <img src="${execBgImg}" class="exec-bg"/>

  <div class="exec-item item1">${get("q17", data)?.mentor_note || "TEST 1"}</div>
  <div class="exec-item item2">${get("q18", data)?.mentor_note || "TEST 2"}</div>
  <div class="exec-item item3">${get("q19", data)?.mentor_note || "TEST 3"}</div>
  <div class="exec-item item4">${get("q20", data)?.mentor_note || "TEST 4"}</div>
  <div class="exec-item item5">${get("q21", data)?.mentor_note || "TEST 5"}</div>
  <div class="exec-item item6">${get("q22", data)?.mentor_note || "TEST 6"}</div>
  <div class="exec-item item7">${get("q23", data)?.mentor_note || "TEST 7"}</div>
</div>

<!-- PAGE: NOTE TO PARENTS -->
<div class="page note-parents-page">
  <img src="${noteParentsBg}" class="note-parents-bg"/>
</div>

<!-- PAGE: ROADMAP -->
<div class="page roadmap-page">
  <img src="${roadmapBg}" class="roadmap-bg"/>
</div>

<!-- PAGE Conclusion -->
<!-- PAGE: CONCLUSION NEW -->
<div class="page conclusion-new-page">
  <img src="${conclusionNewBg}" class="conclusion-new-bg"/>

  <!-- TEXT OVERLAY -->
 <div class="conclusion-text">
  <p>${get("q17", data)?.mentor_note || ""}</p>
  <p>${get("q18", data)?.mentor_note || ""}</p>
</div>
</div>



<!-- PRINTABLE TEMPLATES (LAST PAGES) -->

${template1Img ? `<div class="page">
  <img src="${template1Img}" class="full-page-img"/>
</div>` : ""}

${template2Img ? `<div class="page">
  <img src="${template2Img}" class="full-page-img"/>
</div>` : ""}



</body>
</html>
`;

  await page.setContent(html, { waitUntil: "load" });
  const pdf = await page.pdf({ format:"A4", printBackground:true });
  await browser.close();
  return pdf;
}

module.exports = generatePDF;
