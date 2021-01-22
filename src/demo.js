const path = require("path");
const { csvToJsonSync, jsonToCsvSync } = require("./csv-parser");

const filepathCsv = path.join(__dirname, '../data', 'data.csv');
const filepathJson = path.join(__dirname, '../data', 'data.json');

console.log(csvToJsonSync(filepathCsv, true))
console.log(jsonToCsvSync(filepathJson))