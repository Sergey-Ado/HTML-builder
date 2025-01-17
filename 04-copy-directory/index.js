const path = require('node:path');
const fs = require('node:fs/promises');

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
        await rmDiv(newName);
      }
    }
  }
}

async function rmDiv(dir) {
  const objects = await fs.readdir(dir, { withFileTypes: true });

  for (const object of objects) {
    const objectName = path.join(dir, object.name);
    if (object.isFile()) {
      await fs.rm(objectName);
    } else {
      await rmDiv(objectName);
    }
  }

  await fs.rmdir(dir);
}

const oldDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

copyDir(oldDir, newDir);
