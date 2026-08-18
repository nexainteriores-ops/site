import sharp from 'sharp';
import path from 'path';

async function optimizeHero() {
  const images = ['hero.webp', 'hero-mobile.webp'];
  for (const img of images) {
    const inputPath = path.join('./public/images', img);
    const outputPath = path.join('./public/images', img.replace('.webp', '-opt.webp'));
    
    await sharp(inputPath)
      .webp({ quality: 65, effort: 6 })
      .toFile(outputPath);
      
    console.log(`Optimized ${img} -> ${outputPath}`);
  }
}

optimizeHero().catch(console.error);
