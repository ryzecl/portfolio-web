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

  // 2. Generate and compress clean, professional, minimalist OG Image (1200x630)
  const width = 1200;
  const height = 630;
  const photoW = 380;
  const photoH = 430;
  const photoRx = 24;

  const photoPath = path.join(imagesDir, 'linkedin-photo.png');
  const maskSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="0" y="0" width="${photoW}" height="${photoH}" rx="${photoRx}" ry="${photoRx}" fill="#ffffff" />
    </svg>
  `);

  const borderSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="1" y="1" width="${photoW - 2}" height="${photoH - 2}" rx="${photoRx}" fill="none" stroke="#E4E4E7" stroke-width="1.5" />
    </svg>
  `);

  const processedPhoto = await sharp(photoPath)
    .resize(photoW, photoH, { fit: 'cover', position: 'center' })
    .composite([
      { input: maskSvg, blend: 'dest-in' },
      { input: borderSvg, blend: 'over' },
    ])
    .png()
    .toBuffer();

  const svgOg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="canvasBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#FBFBFD" />
    </linearGradient>

    <pattern id="cleanDots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#09090B" opacity="0.06" />
    </pattern>

    <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.06" />
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#000000" flood-opacity="0.04" />
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#canvasBg)" />
  <rect width="${width}" height="${height}" fill="url(#cleanDots)" />

  <rect x="32" y="32" width="1136" height="566" rx="20" fill="none" stroke="#E4E4E7" stroke-width="1" />

  <!-- Top Navigation / Brand Anchor -->
  <g transform="translate(80, 78)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="20" font-weight="800" fill="#09090B" letter-spacing="-0.5">
      FNH<tspan fill="#2563EB">.</tspan>
    </text>
    <line x1="62" y1="-14" x2="62" y2="2" stroke="#E4E4E7" stroke-width="1" />
    <text x="76" y="-1" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" font-weight="500" fill="#71717A">
      ferryhendriawan.my.id
    </text>

    <!-- Status pill -->
    <g transform="translate(730, -14)">
      <rect x="0" y="0" width="246" height="32" rx="16" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <circle cx="16" cy="16" r="4" fill="#10B981" />
      <text x="28" y="20.5" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="12" font-weight="600" fill="#3F3F46">
        Available for Opportunities
      </text>
    </g>
  </g>

  <!-- Left Main Content -->
  <g transform="translate(80, 160)">
    <text x="0" y="0" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" font-weight="700" fill="#2563EB" letter-spacing="1.5">
      PORTFOLIO // SOFTWARE DEVELOPER
    </text>

    <text x="0" y="60" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="52" font-weight="800" fill="#09090B" letter-spacing="-1.5">
      Ferry Noer Hendriawan
    </text>

    <text x="0" y="105" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="22" font-weight="600" fill="#3F3F46" letter-spacing="-0.3">
      Full-Stack Developer &amp; Information Systems
    </text>

    <g font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="16" fill="#71717A">
      <text x="0" y="152">Building clean, scalable web applications and robust digital systems</text>
      <text x="0" y="178">focused on practical architecture, high performance, and intuitive UX.</text>
    </g>

    <g transform="translate(0, 224)" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" font-weight="600">
      <rect x="0" y="0" width="92" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <text x="46" y="21.5" fill="#18181B" text-anchor="middle">Next.js</text>

      <rect x="104" y="0" width="116" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <text x="162" y="21.5" fill="#18181B" text-anchor="middle">TypeScript</text>

      <rect x="232" y="0" width="94" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <text x="279" y="21.5" fill="#18181B" text-anchor="middle">Laravel</text>

      <rect x="338" y="0" width="126" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <text x="401" y="21.5" fill="#18181B" text-anchor="middle">Tailwind CSS</text>

      <rect x="476" y="0" width="96" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
      <text x="524" y="21.5" fill="#18181B" text-anchor="middle">REST API</text>
    </g>

    <g transform="translate(0, 318)" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" fill="#71717A">
      <text x="0" y="0">HORIZON UNIVERSITY INDONESIA</text>
      <circle cx="254" cy="-4" r="2.5" fill="#CBD5E1" />
      <text x="268" y="0">CO-FOUNDER JDNIRWANA</text>
      <circle cx="468" cy="-4" r="2.5" fill="#CBD5E1" />
      <text x="482" y="0">INDONESIA</text>
    </g>
  </g>

  <rect x="740" y="100" width="${photoW}" height="${photoH}" rx="${photoRx}" fill="#FFFFFF" filter="url(#softShadow)" />
</svg>
`;

  const basePng = await sharp(Buffer.from(svgOg)).png().toBuffer();

  const finalOgImage = await sharp(basePng)
    .composite([
      {
        input: processedPhoto,
        top: 100,
        left: 740,
      },
    ])
    .png({ quality: 90, compressionLevel: 9, palette: true })
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
