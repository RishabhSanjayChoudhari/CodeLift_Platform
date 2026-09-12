/**
 * Test Suite: Entity Association & Batch Synchronization
 * 
 * Verifies bidirectional relationships across:
 * - Batches <-> Courses (Attachment & Detachment)
 * - Batches <-> Students (Cohort transfer & course visibility)
 * - Batches <-> Benchmark Tests (Assignment & Unassignment)
 * - Assignments <-> Batches (Cross-batch submission protection)
 */

import assert from 'node:assert/strict';

// Helper simulator for DataContext association operations
function createDataStore() {
  let batches = [
    { id: 'batch-web-101', name: 'Web Dev Cohort 1', courseIds: ['course-js', 'course-py'], testIds: ['test-js-1'] },
    { id: 'batch-dsa-202', name: 'DSA & Algorithms', courseIds: ['course-dsa'], testIds: ['test-dsa-1'] }
  ];

  let courses = [
    { id: 'course-js', title: 'JavaScript Mastery', isPublished: true, batchIds: ['batch-web-101'], batchId: 'batch-web-101' },
    { id: 'course-py', title: 'Python for Developers', isPublished: true, batchIds: ['batch-web-101'], batchId: 'batch-web-101' },
    { id: 'course-dsa', title: 'Data Structures & Algorithms', isPublished: true, batchIds: ['batch-dsa-202'], batchId: 'batch-dsa-202' },
    { id: 'course-react', title: 'Advanced React', isPublished: true, batchIds: [], batchId: null }
  ];

  let students = [
    { id: 'std-alice', name: 'Alice', batchId: 'batch-web-101', progress: {}, quizAttempts: {} },
    { id: 'std-bob', name: 'Bob', batchId: 'batch-dsa-202', progress: {}, quizAttempts: {} }
  ];

  let tests = [
    { id: 'test-js-1', title: 'JS Fundamentals Exam', batchIds: ['batch-web-101'] },
    { id: 'test-dsa-1', title: 'Trees & Graphs Benchmark', batchIds: ['batch-dsa-202'] }
  ];

  let assignments = [
    { id: 'asg-web-1', title: 'Build a Portfolio', batchIds: ['batch-web-101'] }
  ];

  let enrollments = [];

  // Core synchronization methods matching DataContext.jsx
  function attachCourseToBatch(courseId, batchId) {
    batches = batches.map(b => {
      if (b.id !== batchId) return b;
      const current = Array.isArray(b.courseIds) ? b.courseIds : [];
      if (!current.includes(courseId)) {
        return { ...b, courseIds: [...current, courseId] };
      }
      return b;
    });

    courses = courses.map(c => {
      if (c.id !== courseId) return c;
      const existing = Array.isArray(c.batchIds) ? c.batchIds : (c.batchId ? [c.batchId] : []);
      const updated = existing.includes(batchId) ? existing : [...existing, batchId];
      return { ...c, batchIds: updated, batchId: updated[0] || null };
    });
  }

  function detachCourseFromBatch(courseId, batchId) {
    batches = batches.map(b => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        courseIds: (b.courseIds || []).filter(id => id !== courseId)
      };
    });

    courses = courses.map(c => {
      if (c.id !== courseId) return c;
      const existing = Array.isArray(c.batchIds) ? c.batchIds : (c.batchId ? [c.batchId] : []);
      const updated = existing.filter(id => id !== batchId);
      return {
        ...c,
        batchIds: updated,
        batchId: c.batchId === batchId ? (updated[0] || null) : c.batchId
      };
    });
  }

  function assignTestToBatch(testId, batchId) {
    batches = batches.map(b => {
      if (b.id !== batchId) return b;
      const cur = Array.isArray(b.testIds) ? b.testIds : [];
      return cur.includes(testId) ? b : { ...b, testIds: [...cur, testId] };
    });
    tests = tests.map(t => {
      if (t.id !== testId) return t;
      const cur = Array.isArray(t.batchIds) ? t.batchIds : [];
      return cur.includes(batchId) ? t : { ...t, batchIds: [...cur, batchId] };
    });
  }

  function unassignTestFromBatch(testId, batchId) {
    batches = batches.map(b => {
      if (b.id !== batchId) return b;
      return { ...b, testIds: (b.testIds || []).filter(id => id !== testId) };
    });
    tests = tests.map(t => {
      if (t.id !== testId) return t;
      return { ...t, batchIds: (t.batchIds || []).filter(id => id !== batchId) };
    });
  }

  function assignStudentToBatch(studentId, batchId) {
    students = students.map(s => s.id === studentId ? { ...s, batchId } : s);
  }

  // Student curriculum selector matching StudentCourses.jsx
  function getStudentCourses(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student?.batchId) return [];
    const batch = batches.find(b => b.id === student.batchId);

    return courses.filter(c => {
      if (Array.isArray(batch?.courseIds)) {
        return batch.courseIds.includes(c.id);
      }
      return (
        c.batchId === student.batchId ||
        (Array.isArray(c.batchIds) && c.batchIds.includes(student.batchId))
      );
    });
  }

  function canStudentSubmitAssignment(studentId, assignmentId) {
    const student = students.find(s => s.id === studentId);
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!student || !assignment) return false;
    return Array.isArray(assignment.batchIds) && assignment.batchIds.includes(student.batchId);
  }

  return {
    get batches() { return batches; },
    get courses() { return courses; },
    get students() { return students; },
    get tests() { return tests; },
    get assignments() { return assignments; },
    attachCourseToBatch,
    detachCourseFromBatch,
    assignTestToBatch,
    unassignTestFromBatch,
    assignStudentToBatch,
    getStudentCourses,
    canStudentSubmitAssignment
  };
}

export async function runEntityAssociationTests() {
  console.log('\n🔵 RUNNING SUITE: Entity Associations & Batch Synchronization');
  let passedCount = 0;
  let totalCount = 0;

  function test(name, fn) {
    totalCount++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passedCount++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      throw err;
    }
  }

  // Test 1: Initial state verification
  test('Initial state: Alice has JavaScript and Python in batch-web-101', () => {
    const store = createDataStore();
    const aliceCourses = store.getStudentCourses('std-alice');
    assert.equal(aliceCourses.length, 2);
    assert.deepEqual(aliceCourses.map(c => c.id).sort(), ['course-js', 'course-py']);
  });

  // Test 2: Course detachment removes course from batch and student view
  test('CRITICAL FIX: Detaching course from batch immediately removes it from student view', () => {
    const store = createDataStore();

    // Detach Python from batch-web-101
    store.detachCourseFromBatch('course-py', 'batch-web-101');

    // 1. Verify batch no longer has course-py
    const batch = store.batches.find(b => b.id === 'batch-web-101');
    assert.ok(!batch.courseIds.includes('course-py'), 'Batch courseIds must NOT contain course-py');
    assert.deepEqual(batch.courseIds, ['course-js']);

    // 2. Verify course-py no longer has batch-web-101
    const course = store.courses.find(c => c.id === 'course-py');
    assert.ok(!course.batchIds.includes('batch-web-101'), 'Course batchIds must NOT contain batch-web-101');
    assert.notEqual(course.batchId, 'batch-web-101');

    // 3. Verify student Alice CANNOT see course-py anymore
    const aliceCourses = store.getStudentCourses('std-alice');
    assert.equal(aliceCourses.length, 1);
    assert.equal(aliceCourses[0].id, 'course-js');
    assert.ok(!aliceCourses.some(c => c.id === 'course-py'), 'Detached course MUST NOT be visible to student');
  });

  // Test 3: Attaching a new course to a batch makes it immediately available to student
  test('Attaching a course to batch immediately makes it visible to cohort students', () => {
    const store = createDataStore();

    // Attach course-react to batch-web-101
    store.attachCourseToBatch('course-react', 'batch-web-101');

    // Verify batch has course-react
    const batch = store.batches.find(b => b.id === 'batch-web-101');
    assert.ok(batch.courseIds.includes('course-react'), 'Batch must contain newly attached course');

    // Verify student Alice now sees course-react
    const aliceCourses = store.getStudentCourses('std-alice');
    assert.equal(aliceCourses.length, 3);
    assert.ok(aliceCourses.some(c => c.id === 'course-react'), 'Student must see newly attached course');
  });

  // Test 4: Student batch transfer changes course curriculum immediately
  test('Transferring student between batches updates curriculum to new batch courses', () => {
    const store = createDataStore();

    // Alice is currently in batch-web-101 (sees JS and Py)
    let aliceCourses = store.getStudentCourses('std-alice');
    assert.ok(aliceCourses.some(c => c.id === 'course-js'));

    // Move Alice to batch-dsa-202
    store.assignStudentToBatch('std-alice', 'batch-dsa-202');

    // Now Alice must ONLY see DSA courses
    aliceCourses = store.getStudentCourses('std-alice');
    assert.equal(aliceCourses.length, 1);
    assert.equal(aliceCourses[0].id, 'course-dsa');
    assert.ok(!aliceCourses.some(c => c.id === 'course-js'), 'Old batch courses must be completely gone');
  });

  // Test 5: Benchmark Test assignment and unassignment
  test('Benchmark test assignment and detachment synchronizes bidirectionally', () => {
    const store = createDataStore();

    // Assign test-dsa-1 to batch-web-101 as well
    store.assignTestToBatch('test-dsa-1', 'batch-web-101');
    let batch = store.batches.find(b => b.id === 'batch-web-101');
    let testItem = store.tests.find(t => t.id === 'test-dsa-1');
    assert.ok(batch.testIds.includes('test-dsa-1'));
    assert.ok(testItem.batchIds.includes('batch-web-101'));

    // Unassign test-dsa-1 from batch-web-101
    store.unassignTestFromBatch('test-dsa-1', 'batch-web-101');
    batch = store.batches.find(b => b.id === 'batch-web-101');
    testItem = store.tests.find(t => t.id === 'test-dsa-1');
    assert.ok(!batch.testIds.includes('test-dsa-1'), 'Test must be removed from batch');
    assert.ok(!testItem.batchIds.includes('batch-web-101'), 'Batch must be removed from test');
  });

  // Test 6: Cross-batch assignment isolation
  test('Assignment submission security prevents cross-batch access', () => {
    const store = createDataStore();

    // Alice in batch-web-101 CAN submit to asg-web-1
    assert.ok(store.canStudentSubmitAssignment('std-alice', 'asg-web-1'), 'Alice in batch-web-101 should have access');

    // Bob in batch-dsa-202 CANNOT submit to asg-web-1
    assert.ok(!store.canStudentSubmitAssignment('std-bob', 'asg-web-1'), 'Bob in batch-dsa-202 must be denied access');
  });

  console.log(`✨ All ${passedCount}/${totalCount} Entity Association tests PASSED!`);
  return { passedCount, totalCount };
}

// Allow direct CLI execution: node test/entity-associations.test.js
if (process.argv[1]?.endsWith('entity-associations.test.js')) {
  runEntityAssociationTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
