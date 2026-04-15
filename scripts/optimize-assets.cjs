const sharp = require('sharp');
const https = require('https');
const fs = require('fs');
const path = require('path');

const HERO_URL = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000';
const HERO_PATH = path.join(__dirname, '../public/images/hero.webp');
const IMAGES_DIR = path.join(__dirname, '../public/images');

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function optimizeHero() {
  console.log('Downloading Hero image...');
  try {
    const buffer = await downloadImage(HERO_URL, HERO_PATH);
    console.log('Optimizing Hero image...');
    await sharp(buffer)
      .webp({ quality: 80, effort: 6 })
      .resize(1920, 1080, { fit: 'cover' })
      .toFile(HERO_PATH);
    console.log(`Hero image saved and optimized at ${HERO_PATH}`);
  } catch (err) {
    console.error('Error optimizing hero:', err);
  }
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpe?g|webp)$/i.test(file) && !file.includes('hero.webp')) {
      console.log(`Optimizing ${file}...`);
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(file);
      const outputName = file.replace(ext, '.webp');
      const outputPath = path.join(directory, outputName);

      try {
        const pipeline = sharp(buffer)
          .webp({ quality: 75, effort: 6 })
          .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true });

        await pipeline.toFile(outputPath + '.tmp');
        
        // Se o arquivo original não for .webp, deleta ele. 
        // Se for .webp, substitui.
        if (ext.toLowerCase() !== '.webp') {
          fs.unlinkSync(fullPath);
        }
        
        fs.renameSync(outputPath + '.tmp', outputPath);
        console.log(`Success: ${outputName}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  await optimizeHero();
  console.log('Scanning other images...');
  await processDirectory(IMAGES_DIR);
  console.log('Done!');
}

main();
