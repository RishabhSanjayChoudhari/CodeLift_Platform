import { mockStorage } from './mockStorage';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch wrapper that attaches the Auth token and falls back to mock storage
 * when the serverless API is unreachable during local Vite-only dev.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('codelift_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (res.ok) {
      return await res.json();
    }

    // If server responded with error status, try to parse JSON error message
    const errorData = await res.json().catch(() => null);
    const errorMsg = errorData?.error || errorData?.message || `HTTP ${res.status}`;

    // If 404, might be running without a serverless backend proxy, fallback below
    if (res.status === 404) {
      throw new Error(`API_NOT_FOUND: ${endpoint}`);
    }

    throw new Error(errorMsg);
  } catch (err) {
    // If running in local Vite-only mode without Vercel Serverless proxy active,
    // gracefully route to our mockStorage client.
    if (
      err.message.includes('API_NOT_FOUND') ||
      err.message.includes('Failed to fetch') ||
      err.message.includes('NetworkError')
    ) {
      return handleMockFallback(endpoint, options);
    }
    throw err;
  }
}

/**
 * Local development fallback handler simulating the Vercel Functions
 */
function handleMockFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // Auth Me
  if (path === '/auth/me') {
    const userStr = localStorage.getItem('codelift_user');
    if (!userStr) throw new Error('Unauthorized');
    const user = JSON.parse(userStr);
    const students = mockStorage.get('students');
    const student = students.find((s) => s.id === user.id || s.email === user.email);
    return { user, isAdmin: user.isAdmin, student };
  }

  // Auth Sync
  if (path === '/auth/sync' && method === 'POST') {
    const students = mockStorage.get('students');
    const idx = students.findIndex((s) => s.id === body.id || s.email === body.email);
    let record;
    if (idx >= 0) {
      record = { ...students[idx], ...body };
      students[idx] = record;
    } else {
      record = {
        id: body.id,
        email: body.email,
        name: body.name || body.email.split('@')[0],
        phone: body.phone || '',
        batchId: body.batchId || 'batch-alpha-2026',
        progress: {},
        isActive: true,
        joinedAt: new Date().toISOString()
      };
      students.push(record);
    }
    mockStorage.set('students', students);
    return { message: 'Synced', student: record };
  }

  // Courses List
  if (path === '/courses/list') {
    const contentUrl = params.get('contentUrl');
    if (contentUrl) {
      return { content: mockStorage.getText(contentUrl) };
    }
    return { courses: mockStorage.get('courses') };
  }

  // Batches List & Update
  if (path === '/batches/list') {
    return { batches: mockStorage.get('batches') };
  }
  if (path === '/batches/update' && method === 'POST') {
    const batches = mockStorage.get('batches');
    const idx = batches.findIndex((b) => b.id === body.id);
    let batch;
    if (idx >= 0) {
      batch = { ...batches[idx], ...body };
      batches[idx] = batch;
    } else {
      batch = {
        id: `batch-${Date.now()}`,
        ...body,
        isActive: true
      };
      batches.push(batch);
    }
    mockStorage.set('batches', batches);
    return { batch };
  }

  // Students List & Update
  if (path === '/students/list') {
    return { students: mockStorage.get('students') };
  }
  if (path === '/students/update' && method === 'POST') {
    const students = mockStorage.get('students');
    const idx = students.findIndex((s) => s.id === body.studentId);
    if (idx >= 0) {
      students[idx] = {
        ...students[idx],
        ...body.updates,
        progress: { ...students[idx].progress, ...(body.updates?.progress || {}) }
      };
      mockStorage.set('students', students);
      return { student: students[idx] };
    }
    return { student: null };
  }

  // Assignments List & Submit
  if (path === '/assignments/list') {
    const descUrl = params.get('descriptionUrl');
    if (descUrl) {
      return { description: mockStorage.getText(descUrl) };
    }
    const batchId = params.get('batchId');
    let list = mockStorage.get('assignments');
    if (batchId) {
      list = list.filter((a) => !a.batchIds || a.batchIds.includes(batchId));
    }
    return { assignments: list };
  }
  if (path === '/assignments/submit' && method === 'POST') {
    const submissions = mockStorage.get('submissions');
    const userStr = localStorage.getItem('codelift_user');
    const user = userStr ? JSON.parse(userStr) : { id: 'std-001-rahul' };
    const subRecord = {
      id: `sub-${Date.now()}`,
      studentId: user.id,
      assignmentId: body.assignmentId,
      fileUrls: body.fileUrls || [],
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: null
    };
    submissions.push(subRecord);
    mockStorage.set('submissions', submissions);
    return { submission: subRecord };
  }

  // Submissions List
  if (path === '/submissions/list') {
    const submissions = mockStorage.get('submissions');
    const asgnId = params.get('assignmentId');
    let list = submissions;
    if (asgnId) list = list.filter((s) => s.assignmentId === asgnId);
    return { submissions: list };
  }

  // Admin Stats
  if (path === '/admin/stats') {
    const students = mockStorage.get('students');
    const batches = mockStorage.get('batches');
    const submissions = mockStorage.get('submissions');
    const fees = mockStorage.get('fees');
    return {
      stats: {
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.isActive).length,
        totalBatches: batches.length,
        totalSubmissions: submissions.length,
        pendingGrading: submissions.filter((s) => s.grade == null).length,
        totalRevenue: fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0),
        avgRating: '4.9'
      }
    };
  }

  // Admin Upload URL Mock
  if (path === '/admin/upload-url') {
    const filename = params.get('filename') || 'submission.pdf';
    return {
      signedUrl: `https://mock-storage.codelift.local/upload/${filename}`,
      fileUrl: `https://storage.codelift.com/uploads/${Date.now()}_${filename}`,
      path: `submissions/${filename}`,
      mock: true
    };
  }

  // Admin Publish Grade
  if (path === '/admin/publish-grade' && method === 'POST') {
    const submissions = mockStorage.get('submissions');
    const idx = submissions.findIndex((s) => s.id === body.submissionId);
    if (idx >= 0) {
      submissions[idx].grade = Number(body.grade);
      submissions[idx].feedback = body.feedback;
      mockStorage.set('submissions', submissions);
      return { submission: submissions[idx] };
    }
    throw new Error('Submission not found');
  }

  // Tests List & Attempt
  if (path === '/tests/list') {
    const testId = params.get('testId');
    if (testId && params.get('loadQuestions')) {
      const tests = mockStorage.get('tests');
      const test = tests.find((t) => t.id === testId);
      const questions = mockStorage.getTestQuestions(test?.questionsUrl);
      return { test, questions };
    }
    return { tests: mockStorage.get('tests') };
  }
  if (path === '/tests/attempt' && method === 'POST') {
    const attempts = mockStorage.get('attempts');
    const userStr = localStorage.getItem('codelift_user');
    const user = userStr ? JSON.parse(userStr) : { id: 'std-001-rahul' };
    const attemptRecord = {
      id: `att-${Date.now()}`,
      studentId: user.id,
      testId: body.testId,
      attemptUrl: `content/attempts/att-${Date.now()}.json`,
      score: 100,
      submittedAt: new Date().toISOString()
    };
    attempts.push(attemptRecord);
    mockStorage.set('attempts', attempts);
    return { attempt: attemptRecord, score: 100 };
  }

  // Certificates List & Generate
  if (path === '/certificates/generate') {
    const certificates = mockStorage.get('certificates');
    if (method === 'POST') {
      const cert = {
        id: `CERT-${Date.now().toString(36).toUpperCase()}`,
        studentId: body.studentId,
        studentName: body.studentName || 'Student',
        courseTitle: body.courseTitle || 'Modern Full-Stack Web Engineering',
        pdfUrl: `certificates/CERT-${Date.now()}.pdf`,
        issuedAt: new Date().toISOString(),
        isRevoked: false
      };
      certificates.push(cert);
      mockStorage.set('certificates', certificates);
      return { certificate: cert };
    }
    return { certificates };
  }

  // Coupons Validate
  if (path === '/coupons/validate' && method === 'POST') {
    const coupons = mockStorage.get('coupons');
    const c = coupons.find((cpn) => cpn.code.toUpperCase() === body.code?.toUpperCase() && !cpn.usedBy);
    if (!c) throw new Error('Invalid or expired coupon code');
    return { valid: true, code: c.code, discount: c.discount };
  }

  // Fees List & Record
  if (path === '/fees/list') {
    return { fees: mockStorage.get('fees') };
  }
  if (path === '/fees/record' && method === 'POST') {
    const fees = mockStorage.get('fees');
    const userStr = localStorage.getItem('codelift_user');
    const user = userStr ? JSON.parse(userStr) : { id: 'std-001-rahul' };
    const feeRecord = {
      id: `fee-${Date.now()}`,
      studentId: user.id,
      amount: Number(body.amount || 5000),
      paidAt: new Date().toISOString(),
      status: 'PAID'
    };
    fees.push(feeRecord);
    mockStorage.set('fees', fees);
    return { fee: feeRecord };
  }

  // Feedback List & Submit
  if (path === '/feedback/list') {
    return { feedback: mockStorage.get('feedback') };
  }
  if (path === '/feedback/submit' && method === 'POST') {
    const feedback = mockStorage.get('feedback');
    const userStr = localStorage.getItem('codelift_user');
    const user = userStr ? JSON.parse(userStr) : { id: 'std-001-rahul', email: 'student@codelift.com' };
    const item = {
      id: `fbk-${Date.now()}`,
      studentId: user.id,
      studentName: user.name || 'Verified Student',
      rating: Number(body.rating || 5),
      comment: body.comment,
      isAnonymous: Boolean(body.isAnonymous),
      isPublished: true,
      createdAt: new Date().toISOString()
    };
    feedback.push(item);
    mockStorage.set('feedback', feedback);
    return { feedback: item };
  }

  return { message: 'Mock response OK' };
}

export const api = {
  auth: {
    me: () => request('/auth/me'),
    sync: (data) => request('/auth/sync', { method: 'POST', body: JSON.stringify(data) })
  },
  courses: {
    list: (contentUrl) => request(`/courses/list${contentUrl ? `?contentUrl=${encodeURIComponent(contentUrl)}` : ''}`),
    update: (courses) => request('/courses/update', { method: 'POST', body: JSON.stringify({ courses }) })
  },
  batches: {
    list: () => request('/batches/list'),
    update: (data) => request('/batches/update', { method: 'POST', body: JSON.stringify(data) })
  },
  students: {
    list: (batchId) => request(`/students/list${batchId ? `?batchId=${batchId}` : ''}`),
    update: (studentId, updates) => request('/students/update', { method: 'POST', body: JSON.stringify({ studentId, updates }) })
  },
  assignments: {
    list: (batchId, descriptionUrl) => {
      const q = new URLSearchParams();
      if (batchId) q.append('batchId', batchId);
      if (descriptionUrl) q.append('descriptionUrl', descriptionUrl);
      return request(`/assignments/list?${q.toString()}`);
    },
    create: (data) => request('/assignments/create', { method: 'POST', body: JSON.stringify(data) }),
    submit: (assignmentId, fileUrls) => request('/assignments/submit', { method: 'POST', body: JSON.stringify({ assignmentId, fileUrls }) })
  },
  submissions: {
    list: (assignmentId, studentId) => {
      const q = new URLSearchParams();
      if (assignmentId) q.append('assignmentId', assignmentId);
      if (studentId) q.append('studentId', studentId);
      return request(`/submissions/list?${q.toString()}`);
    }
  },
  admin: {
    getStats: () => request('/admin/stats'),
    getUploadUrl: (folder, filename) => request(`/admin/upload-url?folder=${folder}&filename=${encodeURIComponent(filename)}`),
    publishGrade: (submissionId, grade, feedback) => request('/admin/publish-grade', { method: 'POST', body: JSON.stringify({ submissionId, grade, feedback }) }),
    async uploadFile(signedUrl, file) {
      // Direct PUT upload to storage signed URL
      if (signedUrl.includes('mock-storage')) {
        // Mock simulated delay
        await new Promise((r) => setTimeout(r, 600));
        return true;
      }
      const res = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file
      });
      if (!res.ok) throw new Error('File upload to storage failed');
      return true;
    }
  },
  tests: {
    list: (testId, loadQuestions = false) => {
      const q = new URLSearchParams();
      if (testId) q.append('testId', testId);
      if (loadQuestions) q.append('loadQuestions', 'true');
      return request(`/tests/list?${q.toString()}`);
    },
    attempt: (testId, answers) => request('/tests/attempt', { method: 'POST', body: JSON.stringify({ testId, answers }) })
  },
  certificates: {
    list: (studentId) => request(`/certificates/generate${studentId ? `?studentId=${studentId}` : ''}`),
    generate: (studentId, courseTitle) => request('/certificates/generate', { method: 'POST', body: JSON.stringify({ studentId, courseTitle }) })
  },
  coupons: {
    validate: (code) => request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code }) })
  },
  fees: {
    list: (studentId) => request(`/fees/list${studentId ? `?studentId=${studentId}` : ''}`),
    record: (amount, couponCode) => request('/fees/record', { method: 'POST', body: JSON.stringify({ amount, couponCode }) })
  },
  feedback: {
    list: () => request('/feedback/list'),
    submit: (rating, comment, isAnonymous) => request('/feedback/submit', { method: 'POST', body: JSON.stringify({ rating, comment, isAnonymous }) })
  }
};
