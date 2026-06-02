require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendReport(toEmail, pdfBuffer) {
  try {
    // 1. Convert the raw data to a standard Node.js Buffer
    const finalBuffer = Buffer.from(pdfBuffer);
    console.log(">>>>>>>> I AM RUNNING THE NEW CODE <<<<<<<<");
    
    // 2. Send the email with the buffer
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: "Your JEEsociety Report",
      html: "<p>Here is your personalized SWOT analysis report from JEEsociety.</p>",
      attachments: [
        {
          filename: "JEEsociety_Report.pdf",
          content: finalBuffer, 
        },
      ],
    });

    console.log("Resend API Response:", data);

    // 3. Prevent the "False Success" message if Resend fails
    if (data.error) {
      throw new Error(`Resend Error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
}

module.exports = sendReport;