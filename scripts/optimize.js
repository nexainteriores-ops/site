import sharp from 'sharp';

async function optimizeImages() {
  console.log('Optimizing hero image for mobile...');
  await sharp('./public/images/hero.webp')
    .resize(800) // 800px width
    .webp({ quality: 75 })
    .toFile('./public/images/hero-mobile.webp');
  console.log('Mobile hero image generated!');
}

optimizeImages().catch(console.error);
