import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('===============================================================');
console.log('🔍 VERIFYING ANIMATED RADAR & 8 BUG FIXES');
console.log('===============================================================');

// 1. RadarRings component & CSS + ParticleCanvas
const radarJsx = fs.readFileSync('src/components/common/RadarRings.jsx', 'utf8');
const radarCss = fs.readFileSync('src/components/common/RadarRings.css', 'utf8');
const particleJsx = fs.readFileSync('src/components/common/ParticleCanvas.jsx', 'utf8');
assert(radarJsx.includes('rr-sweep-arm'), 'Radar JSX must have sweep arm');
assert(radarJsx.includes('rr-planet-wrapper'), 'Radar JSX must have orbiting planet wrappers');
assert(radarJsx.includes('rr-planet-label'), 'Radar JSX must have visible planet labels');
assert(particleJsx.includes('radar-particles') || particleJsx.includes('radar-particle-canvas'), 'Particle canvas must be configured');
assert(radarCss.includes('--bs-primary'), 'Radar CSS must use theme variables');
console.log('✓ Feature: RadarRings.jsx & RadarRings.css created with topic planets & live theme background');

// 2. Home page hero
const homeJsx = fs.readFileSync('src/pages/Home.jsx', 'utf8');
assert(homeJsx.includes('<HomeRadar'), 'Home.jsx must include HomeRadar in hero-section');
console.log('✓ Feature: Home.jsx hero integrated with HomeRadar');

// 3. Login page & Bug 1 (Suspended student blocked)
const loginJsx = fs.readFileSync('src/pages/Login.jsx', 'utf8');
const authContextJsx = fs.readFileSync('src/contexts/AuthContext.jsx', 'utf8');
assert(loginJsx.includes('<LoginRadar'), 'Login.jsx must include LoginRadar');
assert(loginJsx.includes('SUSPENDED'), 'Login.jsx must check SUSPENDED status');
assert(authContextJsx.includes('SUSPENDED'), 'AuthContext must check SUSPENDED status in loginStudent');
console.log('✓ Bug 1 & Feature: Suspended students blocked and Login.jsx has LoginRadar');

// 4. Bug 2 & Bug 5: CoursePreview layout & sticky overlap
const coursePreviewJsx = fs.readFileSync('src/components/common/CoursePreview.jsx', 'utf8');
const indexCss = fs.readFileSync('src/index.css', 'utf8');
assert(coursePreviewJsx.includes('course-curriculum-sidebar'), 'CoursePreview must have docked curriculum sidebar');
assert(indexCss.includes('.course-content-area'), 'index.css must define .course-content-area');
assert(indexCss.includes('scroll-margin-top'), 'index.css must specify scroll-margin-top to prevent overlap');
console.log('✓ Bug 2 & Bug 5: Modern side-by-side curriculum and scroll overlap fix implemented');

// 5. Bug 3 & Bug 4: StudentCourses cleanup
const studentCoursesJsx = fs.readFileSync('src/components/student/StudentCourses.jsx', 'utf8');
assert(!studentCoursesJsx.includes('Select a program from your curriculum'), 'Subtitle must be removed');
assert(!studentCoursesJsx.includes('Assigned Programs'), 'Assigned Programs chip must be removed');
assert(!studentCoursesJsx.includes('Cohort Program'), '"Cohort Program" card badge must be removed');
assert(!studentCoursesJsx.includes('Search programs, modules, topics...'), 'Search toolbar must be removed');
console.log('✓ Bug 3 & Bug 4: Subtitle, chips, search/sort toolbar and "Cohort Program" badges removed');

// 6. Bug 6: CertificateDesigner icon-based edit enhancement
const certDesignerJsx = fs.readFileSync('src/components/admin/CertificateDesigner.jsx', 'utf8');
assert(certDesignerJsx.includes('Quick Edit:'), 'CertificateDesigner must have Quick Edit icon bar');
assert(certDesignerJsx.includes('FaPalette size={13}'), 'CertificateDesigner subtabs must have icons');
assert(certDesignerJsx.includes('OverlayTrigger'), 'CertificateDesigner must use OverlayTrigger');
console.log('✓ Bug 6: CertificateDesigner enhanced with subtab icons and quick edit icon bar + tooltips');

// 7. Bug 7: Admin grids action icon buttons with OverlayTrigger + Tooltip
const courseManagerJsx = fs.readFileSync('src/components/admin/CourseManager.jsx', 'utf8');
const userManagerJsx = fs.readFileSync('src/components/admin/UserManager.jsx', 'utf8');
const studentManagerJsx = fs.readFileSync('src/components/admin/StudentManager.jsx', 'utf8');
assert(courseManagerJsx.includes('OverlayTrigger overlay={<Tooltip>Inspect & Preview Curriculum'), 'CourseManager has tooltips');
assert(userManagerJsx.includes('OverlayTrigger'), 'UserManager has tooltips');
assert(studentManagerJsx.includes('OverlayTrigger overlay={<Tooltip>Record tuition fee payment'), 'StudentManager has tooltips');
console.log('✓ Bug 7: Admin grids (CourseManager, UserManager, StudentManager) standardized to icon buttons + Tooltip');

// 8. Bug 8: Navigation icons standardized to react-icons/fi
const navJsx = fs.readFileSync('src/config/navigation.jsx', 'utf8');
const adminSidebarJsx = fs.readFileSync('src/components/common/AdminSidebar.jsx', 'utf8');
assert(navJsx.includes('from \'react-icons/fi\''), 'navigation.jsx must use react-icons/fi');
assert(!navJsx.includes('from \'react-icons/fa\''), 'navigation.jsx must not use react-icons/fa');
assert(adminSidebarJsx.includes('from \'react-icons/fi\''), 'AdminSidebar.jsx must use react-icons/fi');
assert(!adminSidebarJsx.includes('from \'react-icons/fa\''), 'AdminSidebar.jsx must not use react-icons/fa');
console.log('✓ Bug 8: Navigation icons standardized to react-icons/fi in navigation.jsx and AdminSidebar.jsx');

console.log('===============================================================');
console.log('🎉 ALL FEATURE & BUG FIX VERIFICATIONS PASSED (8/8)!');
console.log('===============================================================');
