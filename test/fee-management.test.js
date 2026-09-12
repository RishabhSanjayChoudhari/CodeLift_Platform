/**
 * Fee Management & Ledger Synchronization Unit Tests
 */

import assert from 'assert';

export async function runFeeManagementTests() {
  console.log('\n🔵 RUNNING SUITE: Fee Recording & Ledger Synchronization');

  let passed = 0;

  // Mock initial state
  const mockStudents = [
    {
      id: 'stu-test-1',
      name: 'Rohan Mehta',
      email: 'rohan@example.com',
      batchId: 'batch-web-101',
      totalFee: 45000,
      paidFee: 0,
      feeStatus: 'Pending'
    }
  ];

  let mockFees = [];

  const syncStudentFeeRecord = (studentId, feesList) => {
    const student = mockStudents.find((s) => s.id === studentId);
    if (!student) return;
    const studentFees = feesList.filter((f) => f.studentId === studentId);
    const totalPaid = studentFees
      .filter((f) => f.status === 'PAID')
      .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const totalFee = Number(student.totalFee) || 45000;
    const feeStatus = totalPaid >= totalFee ? 'Paid' : totalPaid > 0 ? 'Partial' : 'Pending';
    student.paidFee = totalPaid;
    student.feeStatus = feeStatus;
  };

  let idCounter = 1;
  const addFee = (feeData) => {
    const newFee = {
      id: feeData.id || `fee-${Date.now()}-${idCounter++}`,
      studentId: feeData.studentId,
      amount: Number(feeData.amount) || 0,
      paidAt: feeData.paidAt || '2026-03-01',
      mode: feeData.mode || 'UPI',
      status: feeData.status || 'PAID',
      receiptNo: feeData.receiptNo || 'REC-100001'
    };
    mockFees = [newFee, ...mockFees];
    syncStudentFeeRecord(newFee.studentId, mockFees);
    return newFee;
  };

  const updateFee = (feeId, updates) => {
    mockFees = mockFees.map((f) => (f.id === feeId ? { ...f, ...updates } : f));
    const target = mockFees.find((f) => f.id === feeId);
    if (target) syncStudentFeeRecord(target.studentId, mockFees);
  };

  const deleteFee = (feeId) => {
    const target = mockFees.find((f) => f.id === feeId);
    const studentId = target ? target.studentId : null;
    mockFees = mockFees.filter((f) => f.id !== feeId);
    if (studentId) syncStudentFeeRecord(studentId, mockFees);
  };

  // Test 1: Record initial pending fee invoice
  const inv = addFee({
    studentId: 'stu-test-1',
    amount: 45000,
    status: 'PENDING',
    mode: 'Bank Transfer'
  });
  assert.strictEqual(mockFees.length, 1);
  assert.strictEqual(mockStudents[0].paidFee, 0);
  assert.strictEqual(mockStudents[0].feeStatus, 'Pending');
  console.log('  ✓ Recording PENDING fee invoice does not count toward paid amount');
  passed++;

  // Test 2: Record partial payment installment
  const part1 = addFee({
    studentId: 'stu-test-1',
    amount: 20000,
    status: 'PAID',
    mode: 'UPI'
  });
  assert.strictEqual(mockStudents[0].paidFee, 20000);
  assert.strictEqual(mockStudents[0].feeStatus, 'Partial');
  console.log('  ✓ Recording partial installment of ₹20,000 updates feeStatus to "Partial"');
  passed++;

  // Test 3: Record second installment completing the tuition
  const part2 = addFee({
    studentId: 'stu-test-1',
    amount: 25000,
    status: 'PAID',
    mode: 'UPI'
  });
  assert.strictEqual(mockStudents[0].paidFee, 45000);
  assert.strictEqual(mockStudents[0].feeStatus, 'Paid');
  console.log('  ✓ Final installment totaling full fee sets status to "Paid"');
  passed++;

  // Test 4: Editing fee payment amount recalculates student balance
  updateFee(part2.id, { amount: 15000 });
  assert.strictEqual(mockStudents[0].paidFee, 35000);
  assert.strictEqual(mockStudents[0].feeStatus, 'Partial');
  console.log('  ✓ Editing fee record down to ₹15,000 dynamically updates student paid amount to ₹35,000');
  passed++;

  // Test 5: Deleting fee record recalculates student status
  deleteFee(part2.id);
  assert.strictEqual(mockStudents[0].paidFee, 20000);
  assert.strictEqual(mockStudents[0].feeStatus, 'Partial');
  console.log('  ✓ Deleting a fee record immediately recalculates student balance from remaining ledger');
  passed++;

  // Test 6: Deleting all paid fees returns student to Pending
  deleteFee(part1.id);
  assert.strictEqual(mockStudents[0].paidFee, 0);
  assert.strictEqual(mockStudents[0].feeStatus, 'Pending');
  console.log('  ✓ Removing all paid entries returns student to "Pending" status');
  passed++;

  console.log(`✨ All ${passed}/6 Fee Management & Ledger tests PASSED!`);
  return { passedCount: passed, totalCount: 6 };
}
