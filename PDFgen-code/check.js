const fs = require("fs");
const r = require("./resp.json");

console.log("hasBase64:", !!r.pdfBase64);
console.log("length:", r.pdfBase64 ? r.pdfBase64.length : 0);
console.log("error:", r.error || "no-error");

