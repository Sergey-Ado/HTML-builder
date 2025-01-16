const path = require('node:path');
const fs = require('node:fs/promises');

async function copyDir() {
  const oldDir = path.join(__dirname, 'files');
  const newDir = path.join(__dirname, 'files-copy');

  try {
    await fs.access(newDir);
  } catch {
    await fs.mkdir(newDir);
  }

  const oldFiles = await fs.readdir(oldDir);
  oldFiles.forEach(async (fileName) => {
    const oldFile = path.join(oldDir, fileName);
    const newFile = path.join(newDir, fileName);
    try {
      await fs.access(newFile);
    } catch {
      await fs.copyFile(oldFile, newFile);
    }
  });

  const newFiles = await fs.readdir(newDir);
  newFiles.forEach(async (fileName) => {
    const oldFile = path.join(oldDir, fileName);
    const newFile = path.join(newDir, fileName);
    try {
      await fs.access(oldFile);
    } catch {
      await fs.rm(newFile);
    }
  });
}

copyDir();
