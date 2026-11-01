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

  // 2. Generate and compress high-impact OG Image (1200x630)
  // Perfectly matched with the portfolio's clean technical theme & Ferry's portrait
  const width = 1200;
  const height = 630;
  const photoW = 380;
  const photoH = 430;
  const photoRx = 20;

  const photoPath = path.join(imagesDir, 'linkedin-photo.png');
  const photoMaskSvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="0" y="0" width="${photoW}" height="${photoH}" rx="${photoRx}" ry="${photoRx}" fill="#ffffff" />
    </svg>
  `);

  const borderOverlaySvg = Buffer.from(`
    <svg width="${photoW}" height="${photoH}">
      <rect x="1" y="1" width="${photoW - 2}" height="${photoH - 2}" rx="${photoRx}" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
    </svg>
  `);

  const processedPhoto = await sharp(photoPath)
    .resize(photoW, photoH, { fit: 'cover', position: sharp.strategy.attention })
    .composite([
      { input: photoMaskSvg, blend: 'dest-in' },
      { input: borderOverlaySvg, blend: 'over' },
    ])
    .png()
    .toBuffer();

  const svgOg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F8FAFC" />
    </linearGradient>

    <pattern id="techDots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#09090B" opacity="0.10" />
    </pattern>

    <filter id="photoShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#2563EB" flood-opacity="0.10" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#09090B" flood-opacity="0.06" />
    </filter>
  </defs>

  <!-- 1. Background Fill & Pattern -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#techDots)" />

  <!-- 2. Outer Technical Border Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="16" fill="none" stroke="#E4E4E7" stroke-width="1.5" />

  <!-- Corner Crosshairs (+) in Electric Blue -->
  <g stroke="#2563EB" stroke-width="2" opacity="0.9">
    <!-- Top-Left -->
    <line x1="32" y1="42" x2="52" y2="42" />
    <line x1="42" y1="32" x2="42" y2="52" />

    <!-- Top-Right -->
    <line x1="1148" y1="42" x2="1168" y2="42" />
    <line x1="1158" y1="32" x2="1158" y2="52" />

    <!-- Bottom-Left -->
    <line x1="32" y1="588" x2="52" y2="588" />
    <line x1="42" y1="578" x2="42" y2="598" />

    <!-- Bottom-Right -->
    <line x1="1148" y1="588" x2="1168" y2="588" />
    <line x1="1158" y1="578" x2="1158" y2="598" />
  </g>

  <!-- 3. Top Header Bar -->
  <g font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif">
    <text x="68" y="70" font-size="22" font-weight="800" fill="#09090B" letter-spacing="-0.5">FNH<tspan fill="#2563EB">.</tspan></text>
  </g>
  <line x1="134" y1="52" x2="134" y2="74" stroke="#E4E4E7" stroke-width="1.5" />
  <text x="148" y="69" font-family="'JetBrains Mono', Consolas, monospace" font-size="14" font-weight="600" fill="#71717A">ferryhendriawan.my.id</text>

  <!-- Status Pill at Top Right -->
  <g transform="translate(810, 48)">
    <rect x="0" y="0" width="320" height="34" rx="17" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <circle cx="18" cy="17" r="4.5" fill="#10B981" />
    <circle cx="18" cy="17" r="8" fill="#10B981" opacity="0.25" />
    <text x="34" y="22" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#3F3F46">
      Open to internship opportunities
    </text>
  </g>

  <!-- 4. Left Hero Content Column -->
  <!-- Technical Eyebrow Pill -->
  <g transform="translate(68, 116)">
    <rect x="0" y="0" width="395" height="30" rx="6" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1" />
    <text x="14" y="20" font-family="'JetBrains Mono', Consolas, monospace" font-size="12" font-weight="700" fill="#2563EB" letter-spacing="1">
      // INFORMATION SYSTEMS · SOFTWARE DEVELOPER
    </text>
  </g>

  <!-- Main Name Display Headline -->
  <text x="68" y="205" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="46" font-weight="800" fill="#09090B" letter-spacing="-1.2">
    Ferry Noer Hendriawan
  </text>

  <!-- Professional Sub-headline -->
  <text x="68" y="246" font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="20" font-weight="600" fill="#2563EB" letter-spacing="-0.3">
    Full-Stack Web Developer &amp; Systems Builder
  </text>

  <!-- Description / Pitch -->
  <g font-family="'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif" font-size="16" fill="#52525B">
    <text x="68" y="286">Building clean, scalable web applications and practical digital solutions</text>
    <text x="68" y="312">with modern component architecture and robust backend API design.</text>
  </g>

  <!-- Tech Stack Chips -->
  <g transform="translate(68, 350)" font-family="'JetBrains Mono', Consolas, monospace" font-size="13" font-weight="600">
    <!-- Next.js -->
    <rect x="0" y="0" width="94" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="47" y="22" fill="#18181B" text-anchor="middle">Next.js</text>

    <!-- TypeScript -->
    <rect x="106" y="0" width="118" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="165" y="22" fill="#18181B" text-anchor="middle">TypeScript</text>

    <!-- Laravel -->
    <rect x="236" y="0" width="96" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="284" y="22" fill="#18181B" text-anchor="middle">Laravel</text>

    <!-- Tailwind -->
    <rect x="344" y="0" width="128" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="408" y="22" fill="#18181B" text-anchor="middle">Tailwind CSS</text>

    <!-- REST API -->
    <rect x="484" y="0" width="102" height="34" rx="8" fill="#F4F4F5" stroke="#E4E4E7" stroke-width="1" />
    <text x="535" y="22" fill="#18181B" text-anchor="middle">REST API</text>
  </g>

  <!-- Bottom Academic & Agency Banner -->
  <g transform="translate(68, 432)">
    <rect x="0" y="0" width="620" height="92" rx="14" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.2" />

    <!-- Education Column -->
    <g transform="translate(24, 28)">
      <text x="0" y="0" font-family="'JetBrains Mono', Consolas, monospace" font-size="11" font-weight="700" fill="#2563EB" letter-spacing="1">
        EDUCATION
      </text>
      <text x="0" y="22" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="15" font-weight="700" fill="#09090B">
        Horizon University Indonesia
      </text>
      <text x="0" y="42" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="#64748B">
        Information Systems (S1) · GPA 3.96
      </text>
    </g>

    <!-- Divider -->
    <line x1="340" y1="18" x2="340" y2="74" stroke="#E2E8F0" stroke-width="1.2" />

    <!-- Agency / Role Column -->
    <g transform="translate(364, 28)">
      <text x="0" y="0" font-family="'JetBrains Mono', Consolas, monospace" font-size="11" font-weight="700" fill="#2563EB" letter-spacing="1">
        FOUNDER &amp; BUILDER
      </text>
      <text x="0" y="22" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="15" font-weight="700" fill="#09090B">
        JDNirwana
      </text>
      <text x="0" y="42" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="13" font-weight="500" fill="#64748B">
        Software Development Agency
      </text>
    </g>
  </g>

  <!-- Footer Meta Line -->
  <g transform="translate(68, 568)" font-family="'JetBrains Mono', Consolas, monospace" font-size="12" fill="#94A3B8">
    <text x="0" y="0">PORTFOLIO EDITION // 2026</text>
    <circle cx="210" cy="-4" r="2.5" fill="#CBD5E1" />
    <text x="225" y="0">BASED IN INDONESIA</text>
    <circle cx="390" cy="-4" r="2.5" fill="#CBD5E1" />
    <text x="405" y="0">GITHUB @ryzecl</text>
  </g>

  <!-- 5. Right Column: Corner Brackets around Photo Card -->
  <g stroke="#2563EB" stroke-width="2.5" fill="none" stroke-linecap="round">
    <!-- Top-Left -->
    <path d="M 736 138 L 736 122 Q 736 114 744 114 L 760 114" />
    <!-- Top-Right -->
    <path d="M 1120 114 L 1136 114 Q 1144 114 1144 122 L 1144 138" />
    <!-- Bottom-Left -->
    <path d="M 736 532 L 736 548 Q 736 556 744 556 L 760 556" />
    <!-- Bottom-Right -->
    <path d="M 1120 556 L 1136 556 Q 1144 556 1144 548 L 1144 532" />
  </g>
</svg>
`;

  const overlayBadgeW = 280;
  const overlayBadgeH = 46;
  const badgeSvg = Buffer.from(`
    <svg width="${overlayBadgeW}" height="${overlayBadgeH}">
      <rect x="0" y="0" width="${overlayBadgeW}" height="${overlayBadgeH}" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
      <circle cx="22" cy="23" r="5" fill="#2563EB" />
      <text x="36" y="28" font-family="'Plus Jakarta Sans', 'Segoe UI', sans-serif" font-size="14" font-weight="700" fill="#09090B">
        Ferry N. Hendriawan
      </text>
      <text x="195" y="28" font-family="'JetBrains Mono', Consolas, monospace" font-size="12" font-weight="600" fill="#2563EB">
        [DEV]
      </text>
    </svg>
  `);

  const basePng = await sharp(Buffer.from(svgOg)).png().toBuffer();

  const finalOgImage = await sharp(basePng)
    .composite([
      {
        input: processedPhoto,
        top: 120,
        left: 750,
      },
      {
        input: badgeSvg,
        top: 520,
        left: 800,
      },
    ])
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toBuffer();

  const ogDestination = path.join(imagesDir, 'og-image.png');
  fs.writeFileSync(ogDestination, finalOgImage);
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), finalOgImage);
  fs.writeFileSync(path.join(appDir, 'twitter-image.png'), finalOgImage);

  console.log('Generated public/images/og-image.png (size:', finalOgImage.length, 'bytes /', (finalOgImage.length / 1024).toFixed(1), 'KB)');
  console.log('Synchronized app/opengraph-image.png & app/twitter-image.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
