const generatePDF = require("./generateReportPDF");

const reportContent = {
    title: "Personalized JEE Preparation Report",
    sections: [
        {
            heading: "Strengths",
            body: "Good clarity in Mechanics, consistent study habits."
        },
        {
            heading: "Weaknesses",
            body: "Backlogs in Chemistry, irregular mock-test attempts."
        },
        {
            heading: "Action Plan",
            body: "Day 1–3: Clear Electrostatics through one-shot + PYQs."
        }
    ]
};

generatePDF(reportContent, "./output.pdf")
    .then(path => console.log("PDF generated at:", path))
    .catch(err => console.error("Error:", err));
