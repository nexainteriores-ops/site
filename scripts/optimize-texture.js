import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
  const input = './public/images/textura.png';
  const output = './public/images/textura.webp';
  
  const metadata = await sharp(input).metadata();
  console.log(`Original size: ${metadata.width}x${metadata.height}`);
  
  await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(output);
    
  const stats = fs.statSync(output);
  console.log(`Optimized texture saved to ${output}. Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

optimize().catch(console.error);
