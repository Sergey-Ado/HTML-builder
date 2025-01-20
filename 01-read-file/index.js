import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.pipe(process.stdout);
