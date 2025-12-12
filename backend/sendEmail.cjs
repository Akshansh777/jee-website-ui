require("dotenv").config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReport(toEmail, pdfBuffer) {
  return await resend.emails.send({
    from: "JEE Society <onboarding@resend.dev>",
    to: toEmail,
    subject: "Your JEEsociety Report",
    html: "<p>Your personalized report is attached.</p>",
    attachments: [
      {
        filename: "report.pdf",
        content: pdfBuffer.toString("base64"),
        encoding: "base64",
        type: "application/pdf"
      }
    ]
  });
}

module.exports = sendReport;
