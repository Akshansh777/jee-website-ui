const PDFDocument = require("pdfkit");
const fs = require("fs");

function generatePDF(reportData, outputPath) {
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Title
    doc.fontSize(22).text(reportData.title, { align: "center" });
    doc.moveDown(2);

    // Sections
    (reportData.sections || []).forEach(section => {
        doc.fontSize(16).text(section.heading);
        doc.moveDown(0.5);
        doc.fontSize(12).text(section.body, { align: "left" });
        doc.moveDown(1.5);
    });

    doc.end();

    return new Promise(resolve => {
        stream.on("finish", () => resolve(outputPath));
    });
}

module.exports = generatePDF;
