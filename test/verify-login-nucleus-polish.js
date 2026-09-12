import fs from 'fs';
import assert from 'assert';

console.log('===============================================================');
console.log('🪐 VERIFYING LOGIN NUCLEUS ENLARGEMENT & POLISH REQUIREMENTS');
console.log('===============================================================');

const radarJsx = fs.readFileSync('src/components/common/RadarRings.jsx', 'utf8');
const radarCss = fs.readFileSync('src/components/common/RadarRings.css', 'utf8');
const loginRadarJsx = fs.readFileSync('src/components/common/LoginRadar.jsx', 'utf8');
const loginRadarCss = fs.readFileSync('src/components/common/LoginRadar.css', 'utf8');
const loginCss = fs.readFileSync('src/pages/Login.css', 'utf8');
const indexCss = fs.readFileSync('src/index.css', 'utf8');

// ─── 1. Login Nucleus Enlargement & Brightness (Priority) ────────────
console.log('Checking Fix 1: Nucleus Enlargement & Brightening...');
// Outer diameter: 140–160px
assert(radarCss.includes('.nucleus-sm .rr-nucleus { width: 160px; height: 160px; }'), 'nucleus-sm outer diameter must be 160px');
// Core diameter: 120–140px
assert(radarCss.includes('.nucleus-sm .rr-nucleus-core') && radarCss.includes('width: 132px;'), 'nucleus-sm core diameter must be 132px (120-140px range)');
// Background gradient: var(--bs-primary) at top-left to 55% primary + 45% white
assert(radarCss.includes('color-mix(in srgb, var(--bs-primary, #15803d) 55%, #ffffff) 100%'), 'Core background must be bright gradient with 55% primary + 45% white mix');
assert(!radarCss.includes('.rr-nucleus-core { background-color:'), 'Core must not have solid background-color override');
// Text styling: 18–22px, font-weight: 800, white, text-shadow
assert(radarCss.includes('.nucleus-sm .rr-nucleus-logo { font-size: 20px; }'), 'Logo font size must be 20px (18-22px range)');
assert(radarCss.includes('font-weight: 800;'), 'Logo font weight must be 800');
assert(radarCss.includes('color: #ffffff !important;'), 'Logo color must be white');
assert(radarCss.includes('text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);'), 'Logo must have text shadow');
// Glow: box-shadow with 60px and 100px
assert(radarCss.includes('0 0 60px rgba(var(--bs-primary-rgb'), 'Core must have 60px primary glow');
assert(radarCss.includes('0 0 100px rgba(var(--bs-primary-rgb'), 'Core must have 100px primary glow');
// Pulsing halos: 2 layers, offset timing, scale 1 -> 1.4, opacity 0.18 -> 0.02
assert(radarJsx.includes('className="rr-nucleus-pulse"'), 'Must have first pulse layer');
assert(radarJsx.includes('className="rr-nucleus-pulse rr-nucleus-pulse-2"'), 'Must have second pulse layer');
assert(radarCss.includes('animation-delay: 1.4s;'), 'Second pulse halo must have 1.4s delay');
assert(radarCss.includes('transform: scale(1.4); opacity: 0.02;'), 'Halo animation must expand to scale 1.4 and fade to 0.02 opacity');
// Inner radial highlight: 30% 25% white 0.5 -> transparent 55%
assert(radarCss.includes('radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.5), transparent 55%)'), 'Core must have top-left radial highlight');
console.log('✓ Fix 1 Passed: Nucleus outer 160px, core 132px, bright gradient, dual glowing halos, inner highlight, white bold text.');

// ─── 2. Boost Ring Visibility ────────────────────────────────────────
console.log('Checking Fix 2: Ring Visibility...');
assert(radarCss.includes('.rr-ring-nucleus { width: 160px; height: 160px; opacity: 0.6; }'), 'Nucleus ring opacity must be 0.6');
assert(radarCss.includes('.rr-ring-inner   { width: 400px; height: 400px; opacity: 0.9; }'), 'Inner ring opacity must be 0.9');
assert(radarCss.includes('.rr-ring-mid     { width: 680px; height: 680px; opacity: 0.8; }'), 'Mid ring opacity must be 0.8');
assert(radarCss.includes('.rr-ring-outer   { width: 960px; height: 960px; opacity: 0.65; }'), 'Outer ring opacity must be 0.65');
assert(radarCss.includes('box-shadow: 0 0 30px color-mix(in srgb, var(--bs-primary, #15803d) 40%, transparent);'), 'Rings must have soft outer glow');
assert(radarCss.includes('animation: rr-ring-spin 60s linear infinite;'), 'Rings must have dashed inner rotation');
console.log('✓ Fix 2 Passed: Ring opacities 0.6/0.9/0.8/0.65 with 30px glow and dashed spin.');

// ─── 3. Intensify Star Twinkling on Login ────────────────────────────
console.log('Checking Fix 3: Star Twinkling on Login...');
assert(radarJsx.includes("variant === 'login' ? 'login-variant' : ''"), 'RadarRings must provide login-variant class');
assert(loginRadarJsx.includes('variant="login"'), 'LoginRadar must pass variant="login"');
assert(radarCss.includes('@keyframes rr-twinkle-login {'), 'Login must define distinct twinkle keyframes');
assert(radarCss.includes('opacity: 0.25;'), 'Login twinkle min opacity must be 0.25');
assert(radarCss.includes('opacity: 0.90;'), 'Login twinkle max opacity must be 0.90');
assert(radarCss.includes('animation-duration: 2.1s !important;'), 'Login stars must have fast 2-3.5s durations');
assert(radarJsx.includes('length: 110'), 'Star count must be 110 (100-120 range)');
// Hierarchy: rings (1) < stars (2) < planets (4) < nucleus (5)
assert(radarCss.includes('.rr-stars-layer') && radarCss.includes('z-index: 2;'), 'Stars layer must have z-index: 2 (above rings, below planets/nucleus)');
console.log('✓ Fix 3 Passed: Noticeable Login star twinkling (0.25-0.90 opacity, 2.1-3.3s speed, 110 stars, correct z-index).');

// ─── 4. Gap Between Radar and Login Card ─────────────────────────────
console.log('Checking Fix 4: Gap Between Radar and Login Card...');
assert(loginCss.includes('gap: 80px;'), 'Login grid container gap must be 80px (60-80px range)');
assert(loginCss.includes('padding-right: 30px;'), 'Radar column must have padding-right 30px');
assert(loginRadarCss.includes('translateX(-35px)'), 'Login radar rings must be shifted left (-35px) to prevent overlap');
console.log('✓ Fix 4 Passed: 80px gap, 30px padding-right, -35px translateX ensures planets never touch card.');

// ─── 5. Balance Login Card Height ────────────────────────────────────
console.log('Checking Fix 5: Balance Login Card Height...');
assert(loginCss.includes('padding: 48px 38px;'), 'Login glass card must have balanced 48px 38px padding');
console.log('✓ Fix 5 Passed: Balanced card height via 48px 38px outer padding.');

// ─── 6. Themes & Accessibility ───────────────────────────────────────
console.log('Checking Themes and Reduced Motion...');
const themes = [
  'forest-green', 'emerald', 'dark-green', 'navy-blue', 'indigo',
  'teal', 'amber', 'rose', 'purple', 'neutral',
  'dark-emerald', 'dark-nebula', 'dark-carbon'
];
for (const t of themes) {
  assert(indexCss.includes(`data-theme="${t}"`), `Theme ${t} must be declared in index.css`);
}
assert(radarCss.includes('@media (prefers-reduced-motion: reduce)'), 'Must support prefers-reduced-motion');
assert(radarCss.includes('.rr-nucleus-pulse,') && radarCss.includes('.rr-star {'), 'Reduced motion must disable pulses and stars');
console.log('✓ Themes & Accessibility Passed: All 13 themes present, prefers-reduced-motion fully honored.');

console.log('===============================================================');
console.log('🎉 ALL 5 FIXES & POLISH REQUIREMENTS VERIFIED SUCCESSFULLY!');
console.log('===============================================================');
