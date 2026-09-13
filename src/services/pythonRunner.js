// src/services/pythonRunner.js
// Singleton Pyodide loader and execution engine for CodeLift Python IDE & Judging

let pyodideInstance = null;
let loadPromise = null;

export async function getPyodide(onProgress) {
  if (pyodideInstance) {
    return pyodideInstance;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise(async (resolve, reject) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Pyodide can only run in a browser environment.');
      }

      // Check if pyodide script is already present in document
      if (!window.loadPyodide) {
        if (onProgress) onProgress('Fetching Python runtime...');
        await new Promise((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.async = true;
          script.onload = () => res();
          script.onerror = () => rej(new Error('Failed to load Pyodide script from CDN. Please check your internet connection.'));
          document.head.appendChild(script);
        });
      }

      if (onProgress) onProgress('Initializing WebAssembly Python engine...');
      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
      });

      if (onProgress) onProgress('Python engine ready!');
      pyodideInstance = pyodide;
      resolve(pyodideInstance);
    } catch (err) {
      loadPromise = null;
      reject(err);
    }
  });

  return loadPromise;
}

/**
 * Execute Python code and capture stdout, stderr and return values.
 */
export async function executePython(code) {
  const pyodide = await getPyodide();
  const startTime = performance.now();

  // Python wrapper to capture stdout, stderr safely
  const pythonWrapper = `
import sys, io

_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr

sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

_exec_error = None

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as _e:
    _exec_error = str(_e)
    import traceback
    traceback.print_exc(file=_stderr_buffer)
finally:
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr

_out = _stdout_buffer.getvalue()
_err = _stderr_buffer.getvalue()
`;

  try {
    await pyodide.runPythonAsync(pythonWrapper);
    const stdout = pyodide.globals.get('_out') || '';
    const stderr = pyodide.globals.get('_err') || '';
    const execError = pyodide.globals.get('_exec_error');
    const executionTime = Math.round(performance.now() - startTime);

    return {
      success: !execError,
      stdout: String(stdout),
      stderr: String(stderr),
      error: execError ? String(execError) : null,
      executionTime
    };
  } catch (err) {
    const executionTime = Math.round(performance.now() - startTime);
    return {
      success: false,
      stdout: '',
      stderr: err.message || String(err),
      error: err.message || String(err),
      executionTime
    };
  }
}

/**
 * Prepare student code for test cases that inject alternate inputs
 */
export function prepareCodeForInject(studentCode, inject) {
  if (!inject || !inject.trim()) return studentCode;

  // Extract variable names from inject (e.g. numbers, search, list_a, list_b, sentence, value, threshold)
  const varNames = [];
  const lines = inject.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (match && !varNames.includes(match[1])) {
      varNames.push(match[1]);
    }
  }

  // Remove first assignment to those variables in student code so inject takes precedence
  let modifiedCode = studentCode;
  for (const v of varNames) {
    const regex = new RegExp('^(\\s*)' + v + '\\s*=[^\\r\\n]*', 'm');
    modifiedCode = modifiedCode.replace(regex, `# [Injected: ${v}]`);
  }

  return `${inject}\n${modifiedCode}`;
}

/**
 * Normalize output string for comparison:
 * - strip leading/trailing whitespace
 * - standardize line breaks to \n
 * - normalize list formatting e.g. [1, 2, 3] vs [1,2,3]
 */
export function normalizeOutput(str) {
  if (typeof str !== 'string') str = String(str || '');
  return str
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/,\s+/g, ', ')
    .trim();
}

/**
 * Run judging on visible and hidden test cases
 */
export async function judgeProblem({ studentCode, visibleTestCases = [], hiddenTestCases = [] }) {
  const visibleResults = [];
  let allVisiblePassed = true;

  // Run visible tests
  for (let i = 0; i < visibleTestCases.length; i++) {
    const tc = visibleTestCases[i];
    const codeToRun = tc.inject ? prepareCodeForInject(studentCode, tc.inject) : studentCode;
    const res = await executePython(codeToRun);
    
    const actualNorm = normalizeOutput(res.stdout);
    const expectedNorm = normalizeOutput(tc.expected);
    const passed = res.success && actualNorm === expectedNorm;

    if (!passed) allVisiblePassed = false;

    visibleResults.push({
      testIndex: i + 1,
      input: tc.input || 'Default',
      expected: tc.expected,
      actual: res.stdout.trim(),
      passed,
      error: res.error,
      executionTime: res.executionTime
    });
  }

  // Run hidden tests
  const hiddenResults = [];
  let allHiddenPassed = true;

  for (let i = 0; i < hiddenTestCases.length; i++) {
    const tc = hiddenTestCases[i];
    const codeToRun = tc.inject ? prepareCodeForInject(studentCode, tc.inject) : studentCode;
    const res = await executePython(codeToRun);

    const actualNorm = normalizeOutput(res.stdout);
    const expectedNorm = normalizeOutput(tc.expected);
    const passed = res.success && actualNorm === expectedNorm;

    if (!passed) allHiddenPassed = false;

    hiddenResults.push({
      testIndex: i + 1,
      passed,
      executionTime: res.executionTime
      // Intentionally omit expected and actual to keep hidden test cases secure
    });
  }

  const allPassed = (visibleTestCases.length === 0 || allVisiblePassed) && 
                    (hiddenTestCases.length === 0 || allHiddenPassed);

  return {
    allPassed,
    visibleResults,
    hiddenResults,
    visiblePassedCount: visibleResults.filter(r => r.passed).length,
    visibleTotalCount: visibleResults.length,
    hiddenPassedCount: hiddenResults.filter(r => r.passed).length,
    hiddenTotalCount: hiddenResults.length
  };
}
