const path = require('node:path');
const fs = require('node:fs/promises');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true })
  .then((objects) => objects.filter((object) => object.isFile()))
  .then((files) => Promise.all(files.map((file) => showFileInfo(file))));

async function showFileInfo(file) {
  const parseFileName = path.parse(file.name);
  const sizeFile = (await fs.stat(path.join(filePath, file.name))).size / 1000;
  console.log(
    `${parseFileName.name} - ${parseFileName.ext.slice(1)} - ${sizeFile}kb`,
  );
}
