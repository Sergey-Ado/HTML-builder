const path = require('node:path');
const fs = require('node:fs/promises');

async function buildPage() {
  const distDir = path.join(__dirname, 'project-dist');

  await rmDir(distDir);
  await fs.mkdir(distDir);

  copyAssets(distDir);

  await createStyleFile(distDir);

  await createHtmlFile(distDir);
}

function copyAssets(distDir) {
  const oldAssets = path.join(__dirname, 'assets');
  const newAssets = path.join(distDir, 'assets');
  copyDir(oldAssets, newAssets);
}

async function createStyleFile(distDir) {
  const styleDir = path.join(__dirname, 'styles');
  const newStyleFile = path.join(distDir, 'style.css');
  const styleFiles = (await fs.readdir(styleDir)).filter(
    (file) => path.parse(file).ext === '.css',
  );

  for (const styleFile of styleFiles) {
    const oldStyleFile = path.join(styleDir, styleFile);
    const data = await fs.readFile(oldStyleFile, { encoding: 'utf-8' });
    await fs.appendFile(newStyleFile, data + '\n');
  }
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
  await fs.access(newDir).catch(() => fs.mkdir(newDir));

  const objects = await fs.readdir(oldDir, { withFileTypes: true });
  for (const object of objects) {
    const oldName = path.join(oldDir, object.name);
    const newName = path.join(newDir, object.name);

    if (object.isFile()) {
      await fs.access(newName).catch(() => {
        fs.copyFile(oldName, newName);
      });
    } else {
      await copyDir(oldName, newName);
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

buildPage();
