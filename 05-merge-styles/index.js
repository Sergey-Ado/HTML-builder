import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function createStyleFile() {
  const bundle = path.join(__dirname, 'project-dist', 'bundle.css');

  await fs.access(bundle).then(
    () => fs.rm(bundle),
    () => {},
  );

  const stylesDir = path.join(__dirname, 'styles');
  const objects = await fs.readdir(stylesDir, { withFileTypes: true });
  const files = objects
    .filter((object) => object.isFile())
    .map((file) => file.name)
    .filter((filename) => path.parse(filename).ext === '.css');

  for (let file of files) {
    const data = await fs.readFile(path.join(stylesDir, file), {
      encoding: 'utf-8',
    });
    await fs.appendFile(bundle, data + os.EOL);
  }
}

createStyleFile();
