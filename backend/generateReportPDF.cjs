const puppeteer = require("puppeteer");

async function generatePDF(data) {

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

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
  </style>
</head>

<body>
  <h1>JEEsociety Report</h1>

  <div class="section">
    <strong>Name:</strong> ${data.name}<br/>
    <strong>Score:</strong> ${data.score}
  </div>

  <div class="section">
    <h2>SWOT Analysis</h2>
    <div class="box">
      <p><strong>Strengths:</strong> ${data.swot.strengths}</p>
      <p><strong>Weaknesses:</strong> ${data.swot.weaknesses}</p>
      <p><strong>Opportunities:</strong> ${data.swot.opportunities}</p>
      <p><strong>Threats:</strong> ${data.swot.threats}</p>
    </div>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <p>${data.recommendations}</p>
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
