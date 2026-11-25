const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const appDir = path.join(__dirname, '..', 'app');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 1. Generate project-placeholder.png (1600x1000 - 16:10 ratio)
  const svgProject = `
<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08090C" />
      <stop offset="50%" stop-color="#0E1117" />
      <stop offset="100%" stop-color="#08090C" />
    </linearGradient>
    <linearGradient id="cardGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.02" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161922" stroke-width="1" />
      <circle cx="40" cy="40" r="1" fill="#242834" />
    </pattern>
  </defs>

  <rect width="1600" height="1000" fill="url(#bgGradient)" />
  <rect width="1600" height="1000" fill="url(#grid)" opacity="0.85" />

  <rect x="40" y="40" width="1520" height="920" rx="20" fill="none" stroke="#1D212B" stroke-width="1.5" />

  <g stroke="#2563EB" stroke-width="2" opacity="0.65">
    <path d="M 55 65 L 75 65 M 65 55 L 65 75" />
    <path d="M 1525 65 L 1545 65 M 1535 55 L 1535 75" />
    <path d="M 55 935 L 75 935 M 65 925 L 65 945" />
    <path d="M 1525 935 L 1545 935 M 1535 925 L 1535 945" />
  </g>

  <g font-family="monospace, monospace" font-size="14" fill="#8E95A5" letter-spacing="2">
    <text x="100" y="72">FERRY NOER HENDRIAWAN</text>
    <text x="800" y="72" text-anchor="middle" fill="#2563EB">SYS.REF // 16:10 ARCHIVE</text>
    <text x="1500" y="72" text-anchor="end">PROJECT ARTIFACT</text>
  </g>

  <rect x="280" y="180" width="1040" height="640" rx="18" fill="#101319" stroke="#262B36" stroke-width="1.5" />
  <rect x="280" y="180" width="1040" height="640" rx="18" fill="url(#cardGlow)" />

  <rect x="280" y="180" width="1040" height="54" rx="18" fill="#151821" />
  <rect x="280" y="214" width="1040" height="20" fill="#151821" />
  <line x1="280" y1="234" x2="1320" y2="234" stroke="#262B36" stroke-width="1.5" />

  <circle cx="316" cy="207" r="5" fill="#323745" />
  <circle cx="336" cy="207" r="5" fill="#323745" />
  <circle cx="356" cy="207" r="5" fill="#323745" />

  <text x="800" y="212" font-family="monospace, monospace" font-size="13" fill="#2563EB" text-anchor="middle" letter-spacing="1">
    repository/projects/overview.tsx
  </text>

  <g transform="translate(800, 420)">
    <rect x="-50" y="-50" width="100" height="100" rx="20" fill="#171B24" stroke="#2E3442" stroke-width="1.5" />
    <path d="M -22 -14 L 0 -26 L 22 -14 L 0 -2 Z" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round" />
    <path d="M -22 0 L 0 12 L 22 0" fill="none" stroke="#8E95A5" stroke-width="2" stroke-linejoin="round" />
    <path d="M -22 14 L 0 26 L 22 14" fill="none" stroke="#525866" stroke-width="2" stroke-linejoin="round" />
  </g>

  <text x="800" y="535" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="700" fill="#F4F5F7" text-anchor="middle" letter-spacing="-0.5">
    Project Documentation &amp; Architecture
  </text>
  <text x="800" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#8E95A5" text-anchor="middle">
    Interface screenshots and production workflow details
  </text>

  <g transform="translate(800, 640)" text-anchor="middle" font-family="monospace, monospace" font-size="13">
    <rect x="-245" y="-18" width="150" height="36" rx="8" fill="#171B24" stroke="#282E3B" stroke-width="1" />
    <text x="-170" y="5" fill="#A1A7B5">NEXT.JS / TS</text>

    <rect x="-80" y="-18" width="160" height="36" rx="8" fill="#171B24" stroke="#282E3B" stroke-width="1" />
    <text x="0" y="5" fill="#A1A7B5">LARAVEL / API</text>

    <rect x="95" y="-18" width="150" height="36" rx="8" fill="#171B24" stroke="#282E3B" stroke-width="1" />
    <text x="170" y="5" fill="#A1A7B5">FULL-STACK</text>
  </g>

  <g font-family="monospace, monospace" font-size="13" fill="#656C7A">
    <text x="100" y="928">RATIO: 16:10</text>
    <circle cx="755" cy="923" r="4" fill="#2563EB" />
    <text x="770" y="928" fill="#8E95A5">FERRY PORTFOLIO ARTIFACT</text>
    <text x="1500" y="928" text-anchor="end">ferryhendriawan.my.id</text>
  </g>
</svg>
`;

  const projectPngBuffer = await sharp(Buffer.from(svgProject))
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toBuffer();
  fs.writeFileSync(path.join(imagesDir, 'project-placeholder.png'), projectPngBuffer);
  fs.writeFileSync(path.join(imagesDir, 'project-placeholder.svg'), svgProject.trim());
  console.log('Generated project-placeholder.png (size:', projectPngBuffer.length, 'bytes)');

  // 2. Generate and compress clean, simple, elegant, professional OG Image (1200x630)
  const width = 1200;
  const height = 630;
  const photoW = 340;
  const photoH = 430;
  const photoRx = 18;
  const photoX = 780;
  const photoY = 100;

  const photoPath = path.join(imagesDir, 'about-photo.jpeg');
  const maskSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="0" y="0" width="${photoW}" height="${photoH}" rx="${photoRx}" ry="${photoRx}" fill="#ffffff" />
    </svg>
  `);

  const borderSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="0.75" y="0.75" width="${photoW - 1.5}" height="${photoH - 1.5}" rx="${photoRx}" fill="none" stroke="#292D35" stroke-width="1.5" />
    </svg>
  `);

  const processedPhoto = await sharp(photoPath)
    .resize(photoW, photoH, { fit: 'cover', position: 'north' })
    .composite([
      { input: maskSvg, blend: 'dest-in' },
      { input: borderSvg, blend: 'over' },
    ])
    .png()
    .toBuffer();

  const svgOg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#08090B" />

  <!-- Subtle outer editorial frame -->
  <rect x="36" y="36" width="1128" height="558" rx="20" fill="#0D0F13" stroke="#1E222B" stroke-width="1" />

  <!-- Top Brand Anchor -->
  <g transform="translate(84, 92)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="22" font-weight="800" fill="#F4F5F7" letter-spacing="-0.5">
      FNH<tspan fill="#6D83FF">.</tspan>
    </text>
    <line x1="64" y1="-16" x2="64" y2="3" stroke="#292D35" stroke-width="1" />
    <text x="80" y="-1" font-family="'JetBrains Mono', Consolas, monospace" font-size="14" font-weight="500" fill="#A1A6B0">
      ferryhendriawan.my.id
    </text>
  </g>

  <!-- Left Main Content -->
  <g transform="translate(84, 218)">
    <text x="0" y="0" font-family="'JetBrains Mono', Consolas, monospace" font-size="14" font-weight="600" fill="#6D83FF" letter-spacing="1.2">
      FULL-STACK DEVELOPER
    </text>

    <text x="0" y="64" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="50" font-weight="800" fill="#F4F5F7" letter-spacing="-1.4">
      Ferry Noer
    </text>
    <text x="0" y="120" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="50" font-weight="800" fill="#F4F5F7" letter-spacing="-1.4">
      Hendriawan
    </text>

    <g font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="18" fill="#A1A6B0">
      <text x="0" y="176">Building clean, scalable web applications and</text>
      <text x="0" y="206">thoughtful digital systems from Indonesia.</text>
    </g>
  </g>

  <!-- Subtle Bottom Editorial Footer -->
  <g transform="translate(84, 534)">
    <line x1="0" y1="-28" x2="632" y2="-28" stroke="#1E222B" stroke-width="1" />
    <text x="0" y="0" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" fill="#7D8492" letter-spacing="0.5">
      NEXT.JS · TYPESCRIPT · LARAVEL · SYSTEM ARCHITECTURE
    </text>
  </g>
</svg>
`;

  const basePng = await sharp(Buffer.from(svgOg)).png().toBuffer();

  const finalOgImage = await sharp(basePng)
    .composite([
      {
        input: processedPhoto,
        top: photoY,
        left: photoX,
      },
    ])
    .png({ quality: 92, compressionLevel: 9 })
    .toBuffer();

  const ogDestination = path.join(imagesDir, 'og-image.png');
  fs.writeFileSync(ogDestination, finalOgImage);
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), finalOgImage);
  fs.writeFileSync(path.join(appDir, 'twitter-image.png'), finalOgImage);

  console.log('Generated clean public/images/og-image.png (size:', finalOgImage.length, 'bytes /', (finalOgImage.length / 1024).toFixed(1), 'KB)');
  console.log('Synchronized app/opengraph-image.png & app/twitter-image.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
