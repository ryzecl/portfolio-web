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
      <stop offset="0%" stop-color="#6D83FF" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#4058E8" stop-opacity="0.02" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161922" stroke-width="1" />
      <circle cx="40" cy="40" r="1" fill="#242834" />
    </pattern>
  </defs>

  <rect width="1600" height="1000" fill="url(#bgGradient)" />
  <rect width="1600" height="1000" fill="url(#grid)" opacity="0.85" />

  <rect x="40" y="40" width="1520" height="920" rx="20" fill="none" stroke="#1D212B" stroke-width="1.5" />

  <g stroke="#6D83FF" stroke-width="2" opacity="0.65">
    <path d="M 55 65 L 75 65 M 65 55 L 65 75" />
    <path d="M 1525 65 L 1545 65 M 1535 55 L 1535 75" />
    <path d="M 55 935 L 75 935 M 65 925 L 65 945" />
    <path d="M 1525 935 L 1545 935 M 1535 925 L 1535 945" />
  </g>

  <g font-family="monospace, monospace" font-size="14" fill="#8E95A5" letter-spacing="2">
    <text x="100" y="72">FERRY NOER HENDRIAWAN</text>
    <text x="800" y="72" text-anchor="middle" fill="#6D83FF">SYS.REF // 16:10 ARCHIVE</text>
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

  <text x="800" y="212" font-family="monospace, monospace" font-size="13" fill="#6D83FF" text-anchor="middle" letter-spacing="1">
    repository/projects/overview.tsx
  </text>

  <g transform="translate(800, 420)">
    <rect x="-50" y="-50" width="100" height="100" rx="20" fill="#171B24" stroke="#2E3442" stroke-width="1.5" />
    <path d="M -22 -14 L 0 -26 L 22 -14 L 0 -2 Z" fill="none" stroke="#6D83FF" stroke-width="2.5" stroke-linejoin="round" />
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
    <circle cx="755" cy="923" r="4" fill="#6D83FF" />
    <text x="770" y="928" fill="#8E95A5">FERRY PORTFOLIO ARTIFACT</text>
    <text x="1500" y="928" text-anchor="end">ferryhendriawan.my.id</text>
  </g>
</svg>
`;

  // Compress project placeholder with palette quantization
  const projectPngBuffer = await sharp(Buffer.from(svgProject))
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toBuffer();
  fs.writeFileSync(path.join(imagesDir, 'project-placeholder.png'), projectPngBuffer);
  fs.writeFileSync(path.join(imagesDir, 'project-placeholder.svg'), svgProject.trim());
  console.log('Generated project-placeholder.png (size:', projectPngBuffer.length, 'bytes)');

  // 2. Generate and compress og-image.png (1200x630 - ultra-lightweight ~35-50KB for WhatsApp)
  const ferryImgPath = path.join(imagesDir, 'ferry.png');
  let ferryBase64 = '';
  if (fs.existsSync(ferryImgPath)) {
    const resizedFerry = await sharp(ferryImgPath)
      .resize(320, 320, { fit: 'cover' })
      .png({ quality: 85, palette: true })
      .toBuffer();
    ferryBase64 = `data:image/png;base64,${resizedFerry.toString('base64')}`;
  }

  const svgOg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08090C" />
      <stop offset="60%" stop-color="#0E1117" />
      <stop offset="100%" stop-color="#08090C" />
    </linearGradient>
    <pattern id="ogGrid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#161922" stroke-width="1" />
    </pattern>
    <clipPath id="avatarClip">
      <circle cx="950" cy="315" r="140" />
    </clipPath>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />
  <rect width="1200" height="630" fill="url(#ogGrid)" opacity="0.75" />

  <rect x="25" y="25" width="1150" height="580" rx="16" fill="none" stroke="#252A36" stroke-width="1.5" />

  <g stroke="#6D83FF" stroke-width="2" opacity="0.7">
    <path d="M 40 50 L 55 50 M 50 40 L 50 55" />
    <path d="M 1145 50 L 1160 50 M 1150 40 L 1150 55" />
    <path d="M 40 590 L 55 590 M 50 580 L 50 595" />
    <path d="M 1145 590 L 1160 590 M 1150 580 L 1150 595" />
  </g>

  <!-- Left Content Area -->
  <g font-family="monospace, monospace" font-size="14" letter-spacing="2">
    <text x="80" y="130" fill="#6D83FF">INFORMATION SYSTEMS · SOFTWARE DEVELOPER</text>
  </g>

  <text x="80" y="205" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#F4F5F7" letter-spacing="-1">
    Ferry Noer Hendriawan
  </text>

  <text x="80" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#A1A6B0">
    Information Systems student building clean, scalable digital products.
  </text>
  <text x="80" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#A1A6B0">
    Practical experience in Next.js, Laravel, REST APIs, and database design.
  </text>

  <g transform="translate(80, 385)" font-family="monospace, monospace" font-size="14">
    <rect x="0" y="0" width="105" height="38" rx="8" fill="#141720" stroke="#2A2F3D" stroke-width="1" />
    <text x="52" y="24" fill="#E2E5EB" text-anchor="middle">Next.js</text>

    <rect x="120" y="0" width="125" height="38" rx="8" fill="#141720" stroke="#2A2F3D" stroke-width="1" />
    <text x="182" y="24" fill="#E2E5EB" text-anchor="middle">TypeScript</text>

    <rect x="260" y="0" width="105" height="38" rx="8" fill="#141720" stroke="#2A2F3D" stroke-width="1" />
    <text x="312" y="24" fill="#E2E5EB" text-anchor="middle">Laravel</text>

    <rect x="380" y="0" width="115" height="38" rx="8" fill="#141720" stroke="#2A2F3D" stroke-width="1" />
    <text x="437" y="24" fill="#E2E5EB" text-anchor="middle">REST API</text>
  </g>

  <g font-family="monospace, monospace" font-size="15" fill="#6D83FF">
    <circle cx="88" cy="515" r="4" fill="#10B981" />
    <text x="105" y="520" fill="#A1A6B0">Open to internship opportunities</text>
    <text x="80" y="555" fill="#6D83FF" font-weight="700">https://ferryhendriawan.my.id</text>
  </g>

  <!-- Right Side: Ferry Profile Photo with Glowing Ring -->
  <circle cx="950" cy="315" r="148" fill="#171A23" stroke="#6D83FF" stroke-width="2.5" stroke-opacity="0.8" />
  ${
    ferryBase64
      ? `<image href="${ferryBase64}" x="810" y="175" width="280" height="280" clip-path="url(#avatarClip)" />`
      : `<circle cx="950" cy="315" r="140" fill="#202430" />
         <text x="950" y="325" font-family="monospace" font-size="32" fill="#6D83FF" text-anchor="middle">FNH.</text>`
  }
</svg>
`;

  // Compress OG image specifically with palette quantization
  const ogPngBuffer = await sharp(Buffer.from(svgOg))
    .png({ quality: 85, compressionLevel: 9, palette: true })
    .toBuffer();

  const ogDestination = path.join(imagesDir, 'og-image.png');
  fs.writeFileSync(ogDestination, ogPngBuffer);
  console.log('Generated and compressed public/images/og-image.png (size:', ogPngBuffer.length, 'bytes)');

  // Also copy to app/opengraph-image.png and app/twitter-image.png for Next.js App Router convention
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), ogPngBuffer);
  fs.writeFileSync(path.join(appDir, 'twitter-image.png'), ogPngBuffer);
  console.log('Created app/opengraph-image.png & app/twitter-image.png');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
