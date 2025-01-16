const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.pipe(process.stdout);
