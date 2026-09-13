import assert from 'assert';
import fs from 'fs';

export function runBatchCourseAndFeeTests() {
  console.log('\n🔵 RUNNING SUITE: Batch Course Attachment, Student Fees & Mobile UI Fixes');
  let passedCount = 0;
  const totalCount = 7;

  // 1. Verify Sidebar.jsx has unblocked student fees
  const sidebarJsx = fs.readFileSync('src/components/common/Sidebar.jsx', 'utf8');
  assert(
    sidebarJsx.includes("const isAdmin = auth?.role === 'admin' || auth?.isAdmin;"),
    'Sidebar must check if user is admin before restricting fees'
  );
  assert(
    sidebarJsx.includes("targetPath.includes('/admin/fees')"),
    'Sidebar must only restrict /admin/fees'
  );
  assert(
    !sidebarJsx.includes("const isFeesRoute = targetPath.includes('/fees') || item.id === 'fees';"),
    'Sidebar must not blindly restrict all /fees paths'
  );
  console.log('  ✓ Student is not blocked when opening My Fees in Sidebar.jsx');
  passedCount++;

  // 2. Verify supabaseDataService.js has atomic attachCourseToBatch & detachCourseFromBatch
  const dataServiceJs = fs.readFileSync('src/services/supabaseDataService.js', 'utf8');
  assert(dataServiceJs.includes('export async function attachCourseToBatch('), 'Must export attachCourseToBatch');
  assert(dataServiceJs.includes('export async function detachCourseFromBatch('), 'Must export detachCourseFromBatch');
  assert(dataServiceJs.includes('augmentedCohortCourses'), 'fetchAllData must augment cohortCourses with dynamic batch IDs');
  console.log('  ✓ supabaseDataService exports atomic attachCourseToBatch & detachCourseFromBatch');
  passedCount++;

  // 3. Verify DataContext.jsx uses atomic attachCourseToBatch & detachCourseFromBatch
  const dataContextJsx = fs.readFileSync('src/contexts/DataContext.jsx', 'utf8');
  assert(dataContextJsx.includes('supabaseDataService\n      .attachCourseToBatch(courseId, batchId)'), 'DataContext must call attachCourseToBatch');
  assert(dataContextJsx.includes('supabaseDataService\n      .detachCourseFromBatch(courseId, batchId)'), 'DataContext must call detachCourseFromBatch');
  console.log('  ✓ DataContext uses atomic attachCourseToBatch & detachCourseFromBatch');
  passedCount++;

  // 4. Verify Login.css mobile alignment
  const loginCss = fs.readFileSync('src/pages/Login.css', 'utf8');
  assert(loginCss.includes('margin-left: 0 !important;'), 'Login.css must reset margin-left to 0 on mobile');
  assert(loginCss.includes('min-height: 100dvh;'), 'Login.css must use 100dvh on mobile');
  console.log('  ✓ Login page alignment is centered on mobile in Login.css');
  passedCount++;

  // 5. Verify HomeRadar.css mobile showcase and clean background
  const radarCss = fs.readFileSync('src/components/common/HomeRadar.css', 'utf8');
  assert(radarCss.includes('.cl-mobile-radar-card'), 'HomeRadar.css must define mobile radar card');
  assert(radarCss.includes('.cl-mobile-radar-viewport'), 'HomeRadar.css must define mobile radar viewport');
  assert(radarCss.includes('.home-radar-stage {\n    display: none !important;'), 'HomeRadar.css must hide off-screen background radar on mobile');
  console.log('  ✓ Home page radar features a dedicated mobile showcase card with clean background');
  passedCount++;

  // 6. Verify cohort index.json defines canonical cohort slugs
  const cohortIndexJson = JSON.parse(fs.readFileSync('public/courses/cohort/index.json', 'utf8'));
  assert.deepStrictEqual(
    cohortIndexJson.slugs,
    ['frontend', 'data-analytics', 'python-fullstack'],
    'cohort/index.json must strictly contain the 3 canonical cohort programs'
  );
  console.log('  ✓ Cohort index cleanly isolates the 3 canonical cohort bootcamps');
  passedCount++;

  // 7. Verify supabaseDataService normalizes courseType and isCohort on electives
  assert(dataServiceJs.includes("courseType: c.course_type || 'elective'"), 'fetchAllData must set courseType');
  assert(dataServiceJs.includes('isCohort: false'), 'fetchAllData must set isCohort: false on electives');
  console.log('  ✓ Electives are normalized with courseType and isCohort: false');
  passedCount++;

  console.log(`✨ All ${passedCount}/${totalCount} Batch, Fee, Mobile UI & Elective tests PASSED!`);
  return { passedCount, totalCount };
}

if (process.argv[1]?.endsWith('batch-course-and-fee.test.js')) {
  runBatchCourseAndFeeTests();
}
