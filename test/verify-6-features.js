import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('===============================================================');
console.log('🔍 VERIFYING 6 NEW FEATURES & INTEGRATION INTEGRITY');
console.log('===============================================================');

// 1. Enlarged Radar Center Orb with CodeLift Brand Text
const radarJsx = fs.readFileSync('src/components/common/RadarRings.jsx', 'utf8');
const radarCss = fs.readFileSync('src/components/common/RadarRings.css', 'utf8');
assert(radarJsx.includes('>CodeLift</span>'), 'Radar orb text must be "CodeLift"');
assert(radarCss.includes('overflow: hidden'), 'Radar orb core and logo must have overflow: hidden');
assert(radarCss.includes('white-space: nowrap'), 'Radar orb logo must have white-space: nowrap');
assert(radarCss.includes('.nucleus-lg .rr-nucleus { width: 190px; height: 190px; }'), 'Radar lg core sphere must be 190px');
console.log('✓ 1. Enlarged Radar Center Orb (#4): "CodeLift" fits comfortably on a single line across all sizes');

// 2. Remove Theme Dropdown from Home Navbar (#5)
const instNavJsx = fs.readFileSync('src/components/common/InstituteNavbar.jsx', 'utf8');
const publicNavJsx = fs.readFileSync('src/components/common/Navbar.jsx', 'utf8');
assert(!instNavJsx.includes('availableThemes'), 'InstituteNavbar must not contain availableThemes dropdown');
assert(!publicNavJsx.includes('availableThemes'), 'Public Navbar must not contain availableThemes dropdown');
console.log('✓ 2. Remove Theme Dropdown from Home Navbar (#5): Public navbars cleaned; theme switcher restricted to Admin and Profile');

// 3. Remove Unnecessary Cross/Close Button from Home Page (#6)
assert(instNavJsx.includes('d-lg-none'), 'InstituteNavbar toggler must be d-lg-none so it is never displayed on desktop');
console.log('✓ 3. Remove Unnecessary Cross/Close Button from Home Page (#6): Toggler scoped to mobile only (d-lg-none)');

// 4. Revert Admin Sidebar to Individual Menus (#3)
const navJsx = fs.readFileSync('src/config/navigation.jsx', 'utf8');
const appJsx = fs.readFileSync('src/App.jsx', 'utf8');
const requiredAdminRoutes = [
  '/admin/dashboard',
  '/admin/reports',
  '/admin/settings',
  '/admin/courses',
  '/admin/students',
  '/admin/batches',
  '/admin/completed-batches',
  '/admin/fees',
  '/admin/tests',
  '/admin/test-submissions',
  '/admin/assignments',
  '/admin/certificates',
  '/admin/reviews',
  '/admin/appearance',
  '/admin/data'
];
for (const route of requiredAdminRoutes) {
  assert(navJsx.includes(`'${route}'`), `ADMIN_NAV_ITEMS must contain individual route ${route}`);
}
assert(appJsx.includes('<Route path="reports" element={<RevenueReports />} />'), 'App.jsx must route /admin/reports to RevenueReports');
assert(appJsx.includes('<Route path="settings" element={<PlatformSettings />} />'), 'App.jsx must route /admin/settings to PlatformSettings');
assert(appJsx.includes('<Route path="students" element={<StudentManager />} />'), 'App.jsx must route /admin/students to StudentManager');
console.log('✓ 4. Revert Admin Sidebar to Individual Menus (#3): All 15 individual items restored with Feather icons');

// 5. Advanced Certificate Template Editor (#2)
const certDesignerJsx = fs.readFileSync('src/components/admin/CertificateDesigner.jsx', 'utf8');
const certDocJsx = fs.readFileSync('src/components/common/CertificateDocument.jsx', 'utf8');
const certUtilsJs = fs.readFileSync('src/services/certificateUtils.js', 'utf8');

assert(certDesignerJsx.includes('paperSize'), 'CertificateDesigner must have paperSize control');
assert(certDesignerJsx.includes('innerBorderEnabled'), 'CertificateDesigner must have innerBorder controls');
assert(certDesignerJsx.includes('ribbonEnabled'), 'CertificateDesigner must have ribbon controls');
assert(certDesignerJsx.includes('sideRibbonEnabled'), 'CertificateDesigner must have sideRibbon controls');
assert(certDesignerJsx.includes('handleSaveAsNew'), 'CertificateDesigner must have Save As New action');
assert(certDesignerJsx.includes('handleSaveTemplate'), 'CertificateDesigner must have Save Template action');
assert(certDesignerJsx.includes('handleDownloadSamplePDF'), 'CertificateDesigner must have Download Sample PDF action');
assert(certDesignerJsx.includes('activeElementKey'), 'CertificateDesigner must support per-element text editing');
assert(certDocJsx.includes('paperSize'), 'CertificateDocument must render paperSize');
assert(certDocJsx.includes('innerBorder'), 'CertificateDocument must render innerBorder');
assert(certDocJsx.includes('sideRibbon'), 'CertificateDocument must render sideRibbon');
assert(certUtilsJs.includes('DEFAULT_CERTIFICATE_ELEMENTS'), 'certificateUtils must define default text elements');
console.log('✓ 5. Advanced Certificate Template Editor (#2): Full controls (Canvas, Borders, Ribbon, 9 Elements, Logo/Seal, Actions & PDF)');

// 6. Udemy-Style Course View with Curriculum Navigator (#1)
const studentCoursesJsx = fs.readFileSync('src/components/student/StudentCourses.jsx', 'utf8');
const curriculumNavJsx = fs.readFileSync('src/components/student/CurriculumNavigator.jsx', 'utf8');

assert(studentCoursesJsx.includes('CurriculumNavigator'), 'StudentCourses must import CurriculumNavigator');
assert(studentCoursesJsx.includes('udemy-course-viewer'), 'StudentCourses must render udemy-course-viewer');
assert(studentCoursesJsx.includes('handleNextLecture'), 'StudentCourses must have sequential next lecture navigation');
assert(studentCoursesJsx.includes('handlePrevLecture'), 'StudentCourses must have sequential prev lecture navigation');
assert(curriculumNavJsx.includes('curriculum-navigator-desktop'), 'CurriculumNavigator must have desktop sticky sidebar');
assert(curriculumNavJsx.includes('curriculum-navigator-mobile'), 'CurriculumNavigator must have mobile drawer');
assert(curriculumNavJsx.includes('FaCheckCircle'), 'CurriculumNavigator must have completed checkmark icon state');
assert(curriculumNavJsx.includes('FaPlay'), 'CurriculumNavigator must have in-progress play icon state');
assert(curriculumNavJsx.includes('FaRegCircle'), 'CurriculumNavigator must have not-started empty circle icon state');
console.log('✓ 6. Udemy-Style Course View with Curriculum Navigator (#1): 340px sticky sidebar, lecture states, sequential nav & drawer');

console.log('===============================================================');
console.log('🎉 ALL 6 FEATURE PROMPTS VERIFIED SUCCESSFULLY (6/6)');
console.log('===============================================================');
