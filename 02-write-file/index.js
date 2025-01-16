const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const process = require('node:process');

const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Input text');

rl.prompt();

rl.on('line', (line) => {
  if (line == 'exit') rl.close();
  stream.write(line + '\n');
  rl.prompt();
});

rl.on('close', () => {
  console.log('Good bye!');
  process.exit(0);
});

process.on('SIGINT', () => {
  rl.close();
});
