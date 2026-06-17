import sharp from 'sharp';

async function extractBg() {
  const input = './public/logo.png';
  const metadata = await sharp(input).metadata();
  
  // Extract a 20px wide slice from the far right edge of the logo
  await sharp(input)
    .extract({ left: metadata.width - 20, top: 0, width: 20, height: metadata.height })
    .toFile('./public/images/navbar-bg.png');
  
  console.log('navbar-bg.png generated!');
}

extractBg().catch(console.error);
