import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function runEnrollmentAndMarketplaceTests() {
  console.log('🔵 RUNNING SUITE: Smooth WhatsApp Enrollment Journey & Marketplace UI');

  let passCount = 0;
  let totalCount = 0;

  function test(name, fn) {
    totalCount++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passCount++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      throw err;
    }
  }

  // 1. CourseEnrollModal component verification
  test('CourseEnrollModal.jsx provides smooth WhatsApp enrollment without abrupt errors', () => {
    const modalPath = path.join(rootDir, 'src', 'components', 'common', 'CourseEnrollModal.jsx');
    assert(fs.existsSync(modalPath), 'CourseEnrollModal.jsx must exist');
    const code = fs.readFileSync(modalPath, 'utf8');

    assert(code.includes('https://wa.me/919834671940'), 'Modal must target CodeLift official WhatsApp number');
    assert(code.includes('window.open(waUrl, \'_blank\''), 'Modal must open WhatsApp in new window');
    assert(code.includes('preferredBatch') || code.includes('batchPref'), 'Modal must capture batch preference');
    assert(code.includes('onPortalEnroll'), 'Modal must support direct student portal enrollment option');
  });

  // 2. CourseDetail.jsx integration
  test('CourseDetail.jsx triggers CourseEnrollModal on hero CTA and sticky mobile bar', () => {
    const detailPath = path.join(rootDir, 'src', 'pages', 'CourseDetail.jsx');
    const code = fs.readFileSync(detailPath, 'utf8');

    assert(code.includes('CourseEnrollModal'), 'CourseDetail must import CourseEnrollModal');
    assert(code.includes('setShowEnrollModal(true)'), 'handleEnrollClick must open CourseEnrollModal');
    assert(!code.includes("toast.error('Please log in or register to enroll.');"), 'CourseDetail must not abruptly block unauthenticated visitors');
    assert(code.includes('cd-sticky-enroll-btn'), 'CourseDetail must retain sticky mobile enroll bar');
  });

  // 3. CourseCatalog.jsx top-notch search bar & enrollment
  test('CourseCatalog.jsx implements top-notch search bar, quick chips, and WhatsApp enrollment', () => {
    const catalogPath = path.join(rootDir, 'src', 'pages', 'CourseCatalog.jsx');
    const code = fs.readFileSync(catalogPath, 'utf8');

    assert(code.includes('cl-marketplace-search-box'), 'Catalog must feature cl-marketplace-search-box');
    assert(code.includes('cl-marketplace-quick-chips'), 'Catalog must feature quick filter chips');
    assert(code.includes('cl-segmented-pills'), 'Catalog must feature segmented cohort/elective pills');
    assert(code.includes('CourseEnrollModal'), 'Catalog must import CourseEnrollModal');
    assert(code.includes('setSelectedCourseForEnroll'), 'Catalog must trigger enrollment modal on cards');
  });

  // 4. Navbar theme adaptability
  test('index.css cl-navbar uses theme variables without hardcoded white override', () => {
    const cssPath = path.join(rootDir, 'src', 'index.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    assert(!css.includes('background-color: rgba(255, 255, 255, 0.95) !important;'), 'index.css must not hardcode white cl-navbar !important');
    assert(css.includes('var(--card-bg, #ffffff) 88%'), 'index.css cl-navbar must derive background from var(--card-bg)');
    assert(css.includes('data-bs-theme="dark"] .cl-navbar'), 'index.css must provide dark theme cl-navbar rule');
  });

  // 5. Home.jsx quick enrollment
  test('Home.jsx includes quick WhatsApp enrollment CTA and CourseEnrollModal', () => {
    const homePath = path.join(rootDir, 'src', 'pages', 'Home.jsx');
    const code = fs.readFileSync(homePath, 'utf8');

    assert(code.includes('CourseEnrollModal'), 'Home.jsx must import CourseEnrollModal');
    assert(code.includes('setSelectedCourseForEnroll(c)'), 'Home.jsx cohort cards must support direct WhatsApp enrollment');
  });

  console.log(`✨ All ${passCount}/${totalCount} Enrollment Journey & Marketplace UI tests PASSED!`);
  return { passedCount: passCount, totalCount };
}

if (process.argv[1] && process.argv[1].endsWith('enrollment-journey-and-marketplace.test.js')) {
  runEnrollmentAndMarketplaceTests();
}
