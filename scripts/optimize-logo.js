import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
  const input = './public/logo.png';
  const output = './public/logo.webp';
  
  const metadata = await sharp(input).metadata();
  console.log(`Original size: ${metadata.width}x${metadata.height}`);
  
  await sharp(input)
    .webp({ quality: 80 })
    .toFile(output);
    
  const stats = fs.statSync(output);
  console.log(`Optimized logo saved to ${output}. Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

optimize().catch(console.error);
