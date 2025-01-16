const path = require('node:path');
const fs = require('node:fs/promises');

async function createBundle() {
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
    await fs.appendFile(bundle, data + '\n');
  }
}

createBundle();
