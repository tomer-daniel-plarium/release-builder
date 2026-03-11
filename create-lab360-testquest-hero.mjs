/**
 * Build Lab360 × TestQuest hero: option 4.svg as background + same text as official heroes.
 * Fonts, sizes, placement match create-lab360-hero.mjs (Roboto, 24/48/20px, dept/title/tag/border).
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

const W = 1200;
const H = 540;
const B = '#5A8DE3';

const svgPath = process.argv[2] || path.join(process.env.USERPROFILE, 'Downloads', 'Plarium Logos', 'FINAL LOGOS(15', '10', 'option 4.svg');
const outPath = path.join(root, 'public', 'email-images', 'hero-lab360-testquest.png');

if (!fs.existsSync(svgPath)) {
  console.error('SVG not found:', svgPath);
  process.exit(1);
}

// Background: option 4.svg resized to hero size
const bgPng = await sharp(svgPath)
  .resize(W, H, { fit: 'cover' })
  .png()
  .toBuffer();

// Same text layers as create-lab360-hero.mjs (official heroes)
const deptSvg = `<svg width="${W}" height="50" xmlns="http://www.w3.org/2000/svg">
  <text x="${W/2}" y="35" text-anchor="middle" font-family="Roboto,Arial,Helvetica,sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="${B}">DATA APPLICATIONS  &#xB7;  MIDCORE DISTRICT, MTG</text>
</svg>`;

const titleSvg = `<svg width="${W}" height="60" xmlns="http://www.w3.org/2000/svg">
  <text x="${W/2}" y="45" text-anchor="middle" font-family="Roboto,Arial,Helvetica,sans-serif" font-size="48" font-weight="800" letter-spacing="4" fill="#ffffff">Lab360 × TestQuest</text>
</svg>`;

const tagSvg = `<svg width="${W}" height="40" xmlns="http://www.w3.org/2000/svg">
  <text x="${W/2}" y="25" text-anchor="middle" font-family="Roboto,Arial,Helvetica,sans-serif" font-size="20" letter-spacing="8" fill="${B}">RELEASE NOTES</text>
</svg>`;

const borderSvg = `<svg width="${W}" height="4" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="4" fill="${B}"/>
</svg>`;

const deptPng = await sharp(Buffer.from(deptSvg)).png().toBuffer();
const titlePng = await sharp(Buffer.from(titleSvg)).png().toBuffer();
const tagPng = await sharp(Buffer.from(tagSvg)).png().toBuffer();
const borderPng = await sharp(Buffer.from(borderSvg)).png().toBuffer();

// Same vertical layout as hero-lab360: dept top, title mid, tag below, border bottom
const deptY = 30;
const titleY = 220;
const tagY = 290;

await sharp(bgPng)
  .composite([
    { input: deptPng, left: 0, top: deptY },
    { input: titlePng, left: 0, top: titleY },
    { input: tagPng, left: 0, top: tagY },
    { input: borderPng, left: 0, top: H - 4 },
  ])
  .png()
  .toFile(outPath);

console.log('Created', outPath, '(option 4 bg + official text style)');
