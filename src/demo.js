const path = require("path");
const { csvToJsonSync, jsonToCsvSync, csvToJsonStreamAsync } = require("./csv-parser");

const filepathCsv = path.join(__dirname, '../data', 'data.csv');
const filepathJson = path.join(__dirname, '../data', 'data.json');

console.log("====== CSV to JSON SYNC =====")
console.log(csvToJsonSync(filepathCsv, true))

console.log("\n\n\n====== JSON to CSV SYNC =====")
console.log(jsonToCsvSync(filepathJson))

console.log("\n\n\n====== CSV to JSON ASYNC STREAM =====")
csvToJsonStreamAsync(filepathCsv).pipe(process.stdout)