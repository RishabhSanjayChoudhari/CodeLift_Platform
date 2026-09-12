// Embedded Initial Datasets mirroring supabase/storage/*.json

const INITIAL_BATCHES = [
  {
    id: "batch-alpha-2026",
    name: "Full Stack Mastery - Spring 2026",
    capacity: 30,
    fee: 5000,
    startDate: "2026-03-15T09:00:00.000Z",
    isActive: true
  },
  {
    id: "batch-beta-2026",
    name: "AI Systems & Python Accelerator",
    capacity: 25,
    fee: 6500,
    startDate: "2026-04-01T09:00:00.000Z",
    isActive: true
  }
];

const INITIAL_STUDENTS = [
  {
    id: "std-001-rahul",
    email: "student@codelift.com",
    name: "Rahul Verma",
    phone: "+919876543210",
    batchId: "batch-alpha-2026",
    progress: {
      "topic-js-async": "completed",
      "topic-react-hooks": "completed"
    },
    isActive: true,
    joinedAt: "2026-02-01T10:00:00.000Z"
  },
  {
    id: "std-002-ananya",
    email: "ananya.sharma@example.com",
    name: "Ananya Sharma",
    phone: "+919876543211",
    batchId: "batch-alpha-2026",
    progress: {
      "topic-js-async": "completed"
    },
    isActive: true,
    joinedAt: "2026-02-05T11:30:00.000Z"
  },
  {
    id: "std-admin-super",
    email: "admin@codelift.com",
    name: "CodeLift Lead Instructor",
    phone: "+919876500000",
    batchId: "batch-alpha-2026",
    progress: {},
    isActive: true,
    joinedAt: "2026-01-01T00:00:00.000Z"
  }
];

const INITIAL_COURSES = [
  {
    id: "course-fullstack-pro",
    title: "Modern Full-Stack Web Engineering",
    modules: [
      {
        id: "mod-1-js-core",
        title: "Module 1: Advanced JavaScript & Asynchronous Architecture",
        topics: [
          {
            id: "topic-js-async",
            title: "Mastering Event Loop, Promises, and Async/Await",
            contentUrl: "content/module-1/async-js.md",
            imageUrls: [
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop"
            ]
          },
          {
            id: "topic-js-memory",
            title: "Memory Management, Closures & Execution Context",
            contentUrl: "content/module-1/memory-management.md",
            imageUrls: []
          }
        ]
      },
      {
        id: "mod-2-react-perf",
        title: "Module 2: React State Machinery & Performance Optimization",
        topics: [
          {
            id: "topic-react-hooks",
            title: "Deep Dive into Hooks, Concurrent Mode & Fiber",
            contentUrl: "content/module-2/react-hooks.md",
            imageUrls: [
              "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop"
            ]
          },
          {
            id: "topic-react-patterns",
            title: "Compound Components & Headless UI Patterns",
            contentUrl: "content/module-2/compound-components.md",
            imageUrls: []
          }
        ]
      },
      {
        id: "mod-3-backend-arch",
        title: "Module 3: Serverless Systems & JSON-First Storage",
        topics: [
          {
            id: "topic-json-storage",
            title: "Supabase Storage as a Primary Store with Optimistic Locking",
            contentUrl: "content/module-3/json-storage.md",
            imageUrls: []
          }
        ]
      }
    ]
  }
];

const INITIAL_ASSIGNMENTS = [
  {
    id: "asgn-001-event-loop",
    title: "Assignment 1: Custom Promise Implementation & Microtask Runner",
    descriptionUrl: "content/assignments/asgn-1-promise.md",
    deadline: "2026-10-15T23:59:59.000Z",
    maxMarks: 10,
    type: "CODING",
    batchIds: ["batch-alpha-2026", "batch-beta-2026"]
  },
  {
    id: "asgn-002-react-perf",
    title: "Assignment 2: Virtualized Infinite Grid with Windowing",
    descriptionUrl: "content/assignments/asgn-2-react.md",
    deadline: "2026-11-01T23:59:59.000Z",
    maxMarks: 10,
    type: "CODING",
    batchIds: ["batch-alpha-2026"]
  },
  {
    id: "asgn-003-storage-arch",
    title: "Assignment 3: Optimistic Concurrency Engine Design",
    descriptionUrl: "content/assignments/asgn-3-concurrency.md",
    deadline: "2026-11-20T23:59:59.000Z",
    maxMarks: 10,
    type: "DESCRIPTIVE",
    batchIds: ["batch-alpha-2026"]
  }
];

const INITIAL_SUBMISSIONS = [
  {
    id: "sub-001-rahul-asgn1",
    studentId: "std-001-rahul",
    assignmentId: "asgn-001-event-loop",
    fileUrls: [
      "https://example.com/submissions/my-promise.js"
    ],
    submittedAt: "2026-03-01T14:20:00.000Z",
    grade: 9,
    feedback: "Outstanding execution of the promise chain unwrapping and rejection handlers. Clean code style!"
  }
];

const INITIAL_TESTS = [
  {
    id: "test-js-01",
    title: "JavaScript Core Internals & Concurrency Assessment",
    timeLimit: 15,
    questionsUrl: "content/tests/test-js-01.json"
  },
  {
    id: "test-react-02",
    title: "React Architecture & Render Lifecycle Quiz",
    timeLimit: 20,
    questionsUrl: "content/tests/test-react-02.json"
  }
];

const INITIAL_ATTEMPTS = [
  {
    id: "att-001-rahul",
    studentId: "std-001-rahul",
    testId: "test-js-01",
    attemptUrl: "content/attempts/att-001-rahul.json",
    score: 90,
    submittedAt: "2026-03-02T16:00:00.000Z"
  }
];

const INITIAL_CERTIFICATES = [
  {
    id: "CERT-2026-001-LIFT",
    studentId: "std-001-rahul",
    studentName: "Rahul Verma",
    courseTitle: "Modern Full-Stack Web Engineering",
    pdfUrl: "certificates/CERT-2026-001.json",
    issuedAt: "2026-03-05T12:00:00.000Z",
    isRevoked: false
  }
];

const INITIAL_COUPONS = [
  {
    id: "cpn-launch-500",
    code: "CODELIFT-500",
    discount: 500,
    expiry: "2026-12-31T23:59:59.000Z",
    createdBy: "std-admin-super",
    usedBy: null
  },
  {
    id: "cpn-super-1000",
    code: "EARLYBIRD-1000",
    discount: 1000,
    expiry: "2026-12-31T23:59:59.000Z",
    createdBy: "std-admin-super",
    usedBy: null
  }
];

const INITIAL_FEES = [
  {
    id: "fee-rec-001",
    studentId: "std-001-rahul",
    amount: 5000,
    paidAt: "2026-02-01T10:15:00.000Z",
    status: "PAID"
  }
];

const INITIAL_FEEDBACK = [
  {
    id: "fbk-001",
    studentId: "std-001-rahul",
    studentName: "Rahul Verma",
    rating: 5,
    comment: "The JSON-first architecture explanation and hands-on assignments are simply phenomenal. I gained huge confidence in system design!",
    isAnonymous: false,
    isPublished: true,
    createdAt: "2026-03-04T18:00:00.000Z"
  },
  {
    id: "fbk-002",
    studentId: "std-002-ananya",
    studentName: "Ananya Sharma",
    rating: 5,
    comment: "Incredible mentorship and structure. The live feedback on assignments makes a huge difference in learning progress.",
    isAnonymous: false,
    isPublished: true,
    createdAt: "2026-03-05T09:30:00.000Z"
  }
];

const MARKDOWN_SNIPPETS = {
  "content/module-1/async-js.md": `# Mastering Event Loop, Promises, and Async/Await\n\nIn modern JavaScript engineering, understanding how asynchronous execution works under the hood is critical for building responsive, high-performance web applications.\n\n### 1. The JavaScript Concurrency Model\nJavaScript is a **single-threaded non-blocking event-driven** runtime.\n- **Call Stack**: Synchronous execution frames.\n- **Microtask Queue**: High priority queue for Promise resolution (\`then\`, \`queueMicrotask\`).\n- **Macrotask Queue**: Lower priority queue for \`setTimeout\`, \`setInterval\`, and I/O events.`,
  "content/module-2/react-hooks.md": `# Deep Dive into Hooks, Concurrent Mode & Fiber Architecture\n\nReact's reconciliation engine transitioned from recursive stack diffing to interruptible **Fiber Work Units**.\n\n### Why Hooks Must Stay at Top Level\nHooks are tracked as a singly linked list inside \`fiber.memoizedState\`. Branching conditions break pointer alignment across renders!`,
  "content/module-3/json-storage.md": `# Supabase Storage as a Primary Store with Optimistic Locking\n\nBy treating Supabase Storage as an atomic JSON document store:\n- Zero idle relational database computing costs.\n- Complete data isolation and effortless versioned backups.\n- Direct signed URL uploads to bypass serverless payload bottlenecks.`,
  "content/assignments/asgn-1-promise.md": `# Assignment 1: Custom Promise Implementation\n\nImplement a compliant \`MyPromise\` class in JavaScript supporting state transitions, executor isolation, \`.then()\` chaining, and microtask scheduling.`
};

const TEST_QUESTIONS = {
  "content/tests/test-js-01.json": [
    {
      id: "q1",
      question: "Which of the following queues has highest execution priority upon completion of current call stack frame?",
      options: [
        "Timer Macrotask Queue",
        "Microtask Queue (Promise handlers, queueMicrotask)",
        "I/O Poll Queue",
        "setImmediate Check Queue"
      ],
      correctIndex: 1,
      explanation: "The JavaScript engine empties the entire microtask queue before processing the next macrotask."
    },
    {
      id: "q2",
      question: "What is the return value of Promise.all([]) when given an empty array?",
      options: [
        "A Promise rejected immediately",
        "A Promise that stays pending forever",
        "A Promise fulfilled synchronously with an empty array []",
        "null"
      ],
      correctIndex: 2,
      explanation: "Promise.all() resolves synchronously to an empty array when passed an empty iterable."
    },
    {
      id: "q3",
      question: "In the V8 engine, where are variables captured by closures stored?",
      options: [
        "Always on the Thread Stack",
        "On the Heap inside Context objects",
        "In global CPU registers",
        "In browser localStorage"
      ],
      correctIndex: 1,
      explanation: "Captured variables outlive the stack frame and are allocated on the V8 heap in Context objects."
    }
  ],
  "content/tests/test-react-02.json": [
    {
      id: "q1",
      question: "What is the primary motivation for the React Fiber rewrite?",
      options: [
        "To switch from JavaScript to WebAssembly",
        "To enable incremental rendering, work prioritization, and interruptible work units",
        "To replace JSX with raw HTML strings",
        "To enforce class components over functional components"
      ],
      correctIndex: 1,
      explanation: "React Fiber introduces virtual stack frames allowing work units to be paused, aborted, or prioritized dynamically."
    },
    {
      id: "q2",
      question: "Why is invoking a Hook inside a conditional statement prohibited?",
      options: [
        "It causes an immediate syntax error in JavaScript",
        "It breaks the index-based order of the Fiber's memoizedState hook linked list",
        "Browsers refuse to allocate memory for conditional closures",
        "React cannot run JSX inside if blocks"
      ],
      correctIndex: 1,
      explanation: "React relies on consistent hook call order between renders to associate state with the correct node in the hook linked list."
    }
  ]
};

class MockStorageStore {
  constructor() {
    this.init('batches', INITIAL_BATCHES);
    this.init('students', INITIAL_STUDENTS);
    this.init('courses', INITIAL_COURSES);
    this.init('assignments', INITIAL_ASSIGNMENTS);
    this.init('submissions', INITIAL_SUBMISSIONS);
    this.init('tests', INITIAL_TESTS);
    this.init('attempts', INITIAL_ATTEMPTS);
    this.init('certificates', INITIAL_CERTIFICATES);
    this.init('coupons', INITIAL_COUPONS);
    this.init('fees', INITIAL_FEES);
    this.init('feedback', INITIAL_FEEDBACK);
  }

  init(key, defaultValue) {
    if (!localStorage.getItem(`codelift_${key}`)) {
      localStorage.setItem(`codelift_${key}`, JSON.stringify(defaultValue));
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(`codelift_${key}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  set(key, data) {
    localStorage.setItem(`codelift_${key}`, JSON.stringify(data));
    return data;
  }

  getText(path) {
    return MARKDOWN_SNIPPETS[path] || `# Content\n\nContent for ${path} is loaded.`;
  }

  getTestQuestions(path) {
    return TEST_QUESTIONS[path] || TEST_QUESTIONS["content/tests/test-js-01.json"];
  }

  resetToDefaults() {
    this.set('batches', INITIAL_BATCHES);
    this.set('students', INITIAL_STUDENTS);
    this.set('courses', INITIAL_COURSES);
    this.set('assignments', INITIAL_ASSIGNMENTS);
    this.set('submissions', INITIAL_SUBMISSIONS);
    this.set('tests', INITIAL_TESTS);
    this.set('attempts', INITIAL_ATTEMPTS);
    this.set('certificates', INITIAL_CERTIFICATES);
    this.set('coupons', INITIAL_COUPONS);
    this.set('fees', INITIAL_FEES);
    this.set('feedback', INITIAL_FEEDBACK);
  }
}

export const mockStorage = new MockStorageStore();
