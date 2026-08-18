import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function optimizeDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (file.endsWith('.webp')) {
      const metadata = await sharp(fullPath).metadata();
      const oldSize = stat.size;
      
      const buffer = await sharp(fullPath)
        .webp({ quality: 65, effort: 6 })
        .toBuffer();
        
      const newSize = buffer.length;
      if (newSize < oldSize) {
        fs.writeFileSync(fullPath, buffer);
        console.log(`Optimized ${fullPath}: ${(oldSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB`);
      } else {
        console.log(`Skipped ${fullPath}: already optimal`);
      }
    }
  }
}

optimizeDirectory('./public/images').catch(console.error);
