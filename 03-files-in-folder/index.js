import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, 'secret-folder');

async function showFileInfo(file) {
  const parseFileName = path.parse(file.name);
  const sizeFile = (await fs.stat(path.join(filePath, file.name))).size;
  console.log(
    `${parseFileName.name} - ${parseFileName.ext.slice(1)} - ${(
      sizeFile / 1024
    ).toFixed(3)} bytes`,
  );
}

async function filesInFolder() {
  const files = await fs
    .readdir(filePath, { withFileTypes: true })
    .then((objects) => objects.filter((object) => object.isFile()));
  await Promise.all(files.map((file) => showFileInfo(file)));
}

filesInFolder();
