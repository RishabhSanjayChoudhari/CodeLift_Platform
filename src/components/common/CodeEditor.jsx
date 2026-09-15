/**
 * CodeEditor.jsx — Smart Code Editor with Line Numbers & Auto-Indent
 *
 * Features:
 *  - Line numbers sidebar (synced scroll)
 *  - Tab key → inserts 4 spaces
 *  - Shift+Tab → removes up to 4 leading spaces
 *  - Enter after `:` → auto-indents to match + 4 extra spaces
 *  - Bracket/quote auto-close: `(`, `[`, `{`, `"`, `'`
 *  - Ctrl+/ → toggle line comment (#)
 *  - Monospace font, dark theme compatible
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';

const INDENT = '    '; // 4 spaces

export default function CodeEditor({
  value,
  onChange,
  language = 'python',
  minRows = 15,
  fontSize = 14,
}) {
  const textareaRef = useRef(null);
  const lineNumRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);

  // Keep line count up-to-date
  useEffect(() => {
    const lines = (value || '').split('\n').length;
    setLineCount(Math.max(lines, minRows));
  }, [value, minRows]);

  // Sync line-number column scroll with textarea scroll
  const syncScroll = useCallback(() => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      const ta = e.target;
      const { selectionStart: start, selectionEnd: end, value: val } = ta;

      // ── Tab / Shift+Tab ───────────────────────────────────────────────
      if (e.key === 'Tab') {
        e.preventDefault();

        if (e.shiftKey) {
          // Remove up to 4 leading spaces from selection lines
          const lineStart = val.lastIndexOf('\n', start - 1) + 1;
          const before = val.slice(0, lineStart);
          const line = val.slice(lineStart, end);
          const deindented = line.replace(/^ {1,4}/, '');
          const removed = line.length - deindented.length;
          const newVal = before + deindented + val.slice(end);
          onChange(newVal);
          // Restore cursor
          requestAnimationFrame(() => {
            ta.selectionStart = Math.max(start - removed, lineStart);
            ta.selectionEnd = Math.max(end - removed, lineStart);
          });
        } else {
          // Insert INDENT at cursor
          const newVal = val.slice(0, start) + INDENT + val.slice(end);
          onChange(newVal);
          requestAnimationFrame(() => {
            ta.selectionStart = start + INDENT.length;
            ta.selectionEnd = start + INDENT.length;
          });
        }
        return;
      }

      // ── Enter — smart indent ──────────────────────────────────────────
      if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const currentLine = val.slice(lineStart, start);
        const leadingSpaces = currentLine.match(/^(\s*)/)[1];
        const endsWithColon = currentLine.trimEnd().endsWith(':');

        let insertIndent = leadingSpaces;
        if (endsWithColon) insertIndent += INDENT;

        const insertion = '\n' + insertIndent;
        const newVal = val.slice(0, start) + insertion + val.slice(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          const newPos = start + insertion.length;
          ta.selectionStart = newPos;
          ta.selectionEnd = newPos;
        });
        return;
      }

      // ── Bracket / Quote Auto-Close ────────────────────────────────────
      const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };
      if (pairs[e.key] && start === end) {
        e.preventDefault();
        const close = pairs[e.key];
        const newVal = val.slice(0, start) + e.key + close + val.slice(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = start + 1;
          ta.selectionEnd = start + 1;
        });
        return;
      }

      // ── Ctrl+/ — Toggle Comment ───────────────────────────────────────
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = val.indexOf('\n', start);
        const end2 = lineEnd === -1 ? val.length : lineEnd;
        const line = val.slice(lineStart, end2);

        let newLine;
        let cursorDelta;
        if (line.trimStart().startsWith('# ')) {
          newLine = line.replace(/^(\s*)# /, '$1');
          cursorDelta = -2;
        } else if (line.trimStart().startsWith('#')) {
          newLine = line.replace(/^(\s*)#/, '$1');
          cursorDelta = -1;
        } else {
          newLine = line.replace(/^(\s*)/, '$1# ');
          cursorDelta = 2;
        }

        const newVal = val.slice(0, lineStart) + newLine + val.slice(end2);
        onChange(newVal);
        requestAnimationFrame(() => {
          const newPos = Math.max(lineStart, start + cursorDelta);
          ta.selectionStart = newPos;
          ta.selectionEnd = newPos;
        });
      }
    },
    [value, onChange]
  );

  // Copy code to clipboard
  const [copied, setCopied] = useState(false);
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(value || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [value]);

  return (
    <div
      className="cl-code-editor-wrap"
      style={{ '--editor-font-size': `${fontSize}px` }}
    >
      {/* ── Toolbar ── */}
      <div className="cl-code-editor-toolbar">
        <span className="cl-code-lang-badge">{language}</span>
        <button
          type="button"
          className="cl-code-copy-btn"
          onClick={copyCode}
          title="Copy code"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* ── Editor Body ── */}
      <div className="cl-code-editor-body" style={{ display: 'flex' }}>
        {/* Line Numbers */}
        <div
          ref={lineNumRef}
          className="cl-code-line-numbers"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="cl-code-line-num">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          id="cl-code-textarea"
          className="cl-code-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={`# Write your ${language} solution here...\n# Tab = 4 spaces  |  Enter after ':' = auto-indent  |  Ctrl+/ = comment`}
          rows={minRows}
        />
      </div>
    </div>
  );
}
