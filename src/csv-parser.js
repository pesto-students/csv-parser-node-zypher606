const fs = require("fs");
const { Transform } = require("stream");

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

function csvToJsonStream(inStream, delimitter = ',') {
    const outputstream = new Transform(); 

    let remainder = '';
    let lineNumber = 0;
    inStream.on('data', (buf) => {
        const lines = (remainder + buf).split(/\r?\n/g);
        remainder = lines.pop();
        for (const line of lines) {
            let op = '';
            if (lineNumber !== 0) {
                const items = line.split(delimitter);
                op = JSON.stringify(items);
            } else {
                op = '[';
            }
            lineNumber += 1;
            outputstream.push(op);
        }
    });
    inStream.on('close', () => {
        const items = remainder.split(delimitter);
        op = JSON.stringify(items);
        outputstream.push(op + ']');
    });

    return outputstream;
}

function csvToJsonStreamWithHeader(inStream, delimitter = ',') {
    const outputstream = new Transform(); // new empty stream.Readable

    let remainder = '';
    let lineNumber = 0;
    let headers;
    inStream.on('data', (buf) => {
        const lines = (remainder + buf).split(/\r?\n/g);
        remainder = lines.pop();
        for (const line of lines) {
            let op = '';
            if (lineNumber === 0) {
                op = '[';
                headers = line.split(delimitter);
            } else {
                const items = line.split(delimitter);
                const obj = {}
                items.map((item, index) => obj[headers[index]] = item);
                op = JSON.stringify(obj);
            }
            lineNumber += 1;
            outputstream.push(op);
        }
    });
    inStream.on('close', () => {
        const items = remainder.split(delimitter);
        const obj = {}
        items.map((item, index) => obj[headers[index]] = item);
        op = JSON.stringify(obj);
        outputstream.push(op + ']');
    });

    return outputstream;
}


module.exports.csvToJsonSync = (filepath, withHeaders = false, headerToUppercase = false, delimiter = ',') => {
    const content = fs.readFileSync(filepath);
    return JSON.stringify(csvToJson(content.toString(), withHeaders, headerToUppercase, delimiter));
}

module.exports.csvToJsonStreamAsync = (filepath, withHeaders = false, headerToUppercase = false, delimiter = ',') => {
    const stream = fs.createReadStream(filepath);
    if (!withHeaders) {
        return csvToJsonStream(stream, delimiter);
    }
    return csvToJsonStreamWithHeader(stream, delimiter);
}

module.exports.jsonToCsvSync = (filepath, delimiter = ',') => {
    const content = fs.readFileSync(filepath);
    return jsonToCsv(content.toString(), delimiter);
}

