const path = require('node:path');
const fs = require('node:fs/promises');
const os = require('node:os');

async function buildPage() {
  const distDir = path.join(__dirname, 'project-dist');

  await rmDir(distDir);
  await fs.mkdir(distDir);

  const oldAssets = path.join(__dirname, 'assets');
  const newAssets = path.join(distDir, 'assets');
  await copyDir(oldAssets, newAssets);

  await createStyleFile(distDir);

  await createHtmlFile(distDir);
}

async function createHtmlFile(distDir) {
  let template = await fs.readFile(path.join(__dirname, 'template.html'), {
    encoding: 'utf-8',
  });
  const components = template
    .match(/{{[a-z]+}}/gi)
    .map((temp) => temp.replace(/[{}]/g, ''));

  const componentsDir = path.join(__dirname, 'components');
  for (const file of components) {
    const filename = path.join(componentsDir, `${file}.html`);
    const component = await fs.readFile(filename, { encoding: 'utf-8' });
    template = template.replaceAll(`{{${file}}}`, component);
  }

  await fs.writeFile(path.join(distDir, 'index.html'), template);
}

async function copyDir(oldDir, newDir) {
  await fs.mkdir(newDir, { recursive: true });

  const oldObjects = await fs.readdir(oldDir, { withFileTypes: true });
  for (const object of oldObjects) {
    const oldName = path.join(oldDir, object.name);
    const newName = path.join(newDir, object.name);

    if (object.isFile()) {
      await fs.copyFile(oldName, newName);
    } else {
      await copyDir(oldName, newName);
    }
  }

  const newObjects = await fs.readdir(newDir, { withFileTypes: true });
  for (const object of newObjects) {
    const oldName = path.join(oldDir, object.name);
    const newName = path.join(newDir, object.name);
    try {
      await fs.access(oldName);
    } catch {
      if (object.isFile()) {
        await fs.rm(newName);
      } else {
        await rmDir(newName);
      }
    }
  }
}

async function rmDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    return;
  }

  const objects = await fs.readdir(dir, { withFileTypes: true });

  for (const object of objects) {
    const objectName = path.join(dir, object.name);
    if (object.isFile()) {
      await fs.rm(objectName);
    } else {
      await rmDir(objectName);
    }
  }

  await fs.rmdir(dir);
}

async function createStyleFile() {
  const bundle = path.join(__dirname, 'project-dist', 'style.css');

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

buildPage();
