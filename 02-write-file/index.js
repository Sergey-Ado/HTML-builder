import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import readline from 'node:readline';
import process from 'node:process';
import os from 'node:os';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Input text');

rl.prompt();

rl.on('line', (line) => {
  if (line == 'exit') rl.close();
  stream.write(line + os.EOL);
  rl.prompt();
});

rl.on('close', () => {
  console.log('Good bye!');
  process.exit(0);
});

process.on('SIGINT', () => {
  rl.close();
});
