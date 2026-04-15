import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

function getFiles(dir) {
  return fs.readdir(dir, { withFileTypes: true }).then((dirents) => {
    return Promise.all(
      dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      })
    );
  }).then((files) => Array.prototype.concat(...files));
}

async function optimize() {
  const allFiles = await getFiles(IMAGES_DIR);
  
  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      const parsed = path.parse(file);
      const dest = path.join(parsed.dir, `${parsed.name}.webp`);
      
      console.log(`Optimizing ${file} to WEBP...`);
      try {
        await sharp(file)
          .resize({ width: 1000, withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(dest);
          
        console.log(`Done. Removing old file ${file}...`);
        await fs.unlink(file);
      } catch (err) {
        console.error(`Failed on ${file}:`, err);
      }
    }
  }
}

optimize().then(() => console.log('All images optimized!')).catch(console.error);
