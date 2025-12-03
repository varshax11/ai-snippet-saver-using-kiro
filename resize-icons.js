const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function resizeIcon(inputPath, outputPath, size) {
  const image = await loadImage(inputPath);
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(image, 0, 0, size, size);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created ${outputPath} (${size}x${size})`);
}

async function main() {
  try {
    await resizeIcon('icon.png', 'icon16.png', 16);
    await resizeIcon('icon.png', 'icon48.png', 48);
    await resizeIcon('icon.png', 'icon128.png', 128);
    console.log('All icons created successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
