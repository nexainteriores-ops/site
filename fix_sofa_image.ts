import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  'public/images/sofas/s6.webp',
  'public/images/sofas/s6_v3.webp'
];

async function fixImages() {
  for (const imgPath of images) {
    const fullPath = path.resolve(imgPath);
    const tempPath = fullPath + '.new.webp';
    if (fs.existsSync(fullPath)) {
      try {
        console.log(`Flipping ${imgPath}...`);
        // Using toFile to a new name to avoid locking issues
        await sharp(fullPath).flip().toFile(tempPath);
        
        // Check if the new file exists and has content before deletion
        const stats = await fs.promises.stat(tempPath);
        if (stats.size > 0) {
          await fs.promises.unlink(fullPath);
          await fs.promises.rename(tempPath, fullPath);
          console.log(`Successfully fixed ${imgPath}`);
        } else {
          throw new Error(`Generated file ${tempPath} is empty`);
        }
      } catch (err) {
        console.error(`Error processing ${imgPath}:`, err);
        if (fs.existsSync(tempPath)) await fs.promises.unlink(tempPath);
      }
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  }
}

fixImages().catch(console.error);
