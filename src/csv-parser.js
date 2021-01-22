const fs = require("fs");

function csvToJson(data, withHeaders = false, headerToUppercase = false, delimiter = ',') {
    let rows = data.split('\r\n').map(item => item.split(delimiter));
    let headers = rows[0];

    if (headerToUppercase && withHeaders) {
        headers = headers.map(head => head.toString().toUpperCase());
    }
    
    return rows
        .filter((_, index) => index !== 0)
        .map((row, rowIndex) => {
            if (!withHeaders) return row;

            const json = {};
            row.map((col, colIndex) => json[headers[colIndex]] = col);
            return json;
        });
}

function jsonToCsv(data, delimiter = ',') {
    data = JSON.parse(data);

    const headers = Object.keys(data[0]).join(delimiter);
    
    const rows = data.map(item => Object.values(item).join(delimiter));
    
    return [headers, ...rows].join('\r\n');
}

module.exports.csvToJsonSync = (filepath, withHeaders = false, headerToUppercase = false, delimiter = ',') => {
    const content = fs.readFileSync(filepath);
    return JSON.stringify(csvToJson(content.toString(), withHeaders, headerToUppercase, delimiter));
}

module.exports.jsonToCsvSync = (filepath, delimiter = ',') => {
    const content = fs.readFileSync(filepath);
    return jsonToCsv(content.toString(), delimiter);
}

