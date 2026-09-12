import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ProgressBar, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  FaBook,
  FaGraduationCap,
  FaCheckCircle,
  FaAward,
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaListUl,
  FaCalendarAlt,
  FaCheck,
  FaRegFileAlt,
  FaClipboardList,
  FaBars
} from 'react-icons/fa';
import CurriculumNavigator from './CurriculumNavigator';

// ── Simple Markdown Renderer for Lecture Content ──
function LectureMarkdown({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          style={{
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            borderRadius: 8,
            padding: '14px 16px',
            overflowX: 'auto',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            margin: '14px 0',
            border: '1px solid var(--border-color, #334155)'
          }}
        >
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Markdown Table
    if (line.includes('|') && lines[i + 1] && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
      const tableRows = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableRows.push(lines[i]);
        i++;
      }
      const headerCols = tableRows[0].split('|').filter(c => c.trim().length > 0);
      const dataRows = tableRows.slice(2).map(r => r.split('|').filter(c => c.trim().length > 0));

      elements.push(
        <div key={`table-${i}`} className="table-responsive my-3">
          <table className="table table-bordered table-sm align-middle" style={{ borderColor: 'var(--border-color)' }}>
            <thead style={{ backgroundColor: 'var(--card-bg-alt, rgba(0,0,0,0.02))' }}>
              <tr>
                {headerCols.map((col, cIdx) => (
                  <th key={cIdx} className="small fw-bold px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                    {col.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="small px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h2 key={i} className="fw-bold mt-4 mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>
          {line.replace('# ', '')}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h4 key={i} className="fw-bold mt-3 mb-2" style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>
          {line.replace('## ', '')}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h5 key={i} className="fw-semibold mt-3 mb-2" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
          {line.replace('### ', '')}
        </h5>
      );
      i++;
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ms-3 mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          {line.replace(/^[-*]\s+/, '')}
        </li>
      );
      i++;
      continue;
    }

    // Ordered lists
    if (/^\d+\.\s+/.test(line)) {
      elements.push(
        <li key={i} className="ms-3 mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          {line.replace(/^\d+\.\s+/, '')}
        </li>
      );
      i++;
      continue;
    }

    // Paragraphs
    if (line.trim().length > 0) {
      elements.push(
        <p key={i} className="mb-2.5" style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.65 }}>
          {line}
        </p>
      );
    }

    i++;
  }

  return <div className="lecture-content-body">{elements}</div>;
}

export default function StudentCourses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth();
  const { students = [], courses = [], batches = [], markTopicComplete, saveQuizAttempt } = useData();

  const student = students.find((s) => s.id === auth?.studentId);
  const batch = batches.find((b) => b.id === student?.batchId);

  // All courses assigned to student's current batch
  const allAvailableCourses = useMemo(() => {
    if (!student?.batchId) return [];
    return courses.filter((c) => {
      if (Array.isArray(batch?.courseIds)) {
        return batch.courseIds.includes(c.id);
      }
      return (
        c.batchId === student.batchId ||
        (Array.isArray(c.batchIds) && c.batchIds.includes(student.batchId))
      );
    });
  }, [courses, student?.batchId, batch?.courseIds]);

  // Read selected course from URL parameter ?id=...
  const selectedCourseId = searchParams.get('id');
  const activeCourse = allAvailableCourses.find((c) => c.id === selectedCourseId);

  // ── Udemy-Style Navigator State ──
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState(() => new Set([0]));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [isSidebarHidden, setIsSidebarHidden] = useState(
    () => (typeof window !== 'undefined' && window.innerWidth < 768) || false
  );

  const toggleSidebar = () => {
    setIsSidebarHidden((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('codelift_course_sidebar_hidden', String(next));
      } catch {}
      return next;
    });
  };

  // Reset to first module/topic when course changes
  useEffect(() => {
    setCurrentModuleIndex(0);
    setCurrentTopicIndex(0);
    setExpandedSections(new Set([0]));
    setMobileDrawerOpen(false);
  }, [selectedCourseId]);

  // Scroll to top on topic or module navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentModuleIndex, currentTopicIndex]);

  // Current course modules and active lecture
  const modules = activeCourse?.modules || [];
  const currentModule = modules[currentModuleIndex] || modules[0];
  const topics = currentModule?.topics || [];
  const currentTopic = topics[currentTopicIndex] || topics[0];

  // Helper to compute course completion stats
  const getCourseStats = (course) => {
    const allTopics = (course.modules || []).flatMap((m) => m.topics || []);
    const totalTopics = allTopics.length;
    const completedTopics = allTopics.filter(
      (t) =>
        student?.progress?.[t.id] === 'completed' ||
        student?.progress?.[t.id] === true ||
        student?.quizAttempts?.[t.id]?.passed
    ).length;
    const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      totalModules: course.modules?.length || 0,
      totalTopics,
      completedTopics,
      progressPct
    };
  };

  const activeStats = activeCourse ? getCourseStats(activeCourse) : { totalTopics: 0, completedTopics: 0, progressPct: 0 };

  const isCurrentTopicCompleted = currentTopic
    ? student?.progress?.[currentTopic.id] === 'completed' ||
      student?.progress?.[currentTopic.id] === true ||
      student?.quizAttempts?.[currentTopic.id]?.passed
    : false;

  // Handlers for active course interactions
  const handleSelectCourse = (courseId) => {
    setSearchParams({ id: courseId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourses = () => {
    setSearchParams({});
  };

  const handleToggleSection = (mIdx) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(mIdx)) {
        next.delete(mIdx);
      } else {
        next.add(mIdx);
      }
      return next;
    });
  };

  const handleSelectLecture = (mIdx, tIdx) => {
    setCurrentModuleIndex(mIdx);
    setCurrentTopicIndex(tIdx);
    setExpandedSections((prev) => new Set([...prev, mIdx]));
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = () => {
    if (student && activeCourse && currentTopic) {
      markTopicComplete(student.id, currentTopic.id, activeCourse.id);
    }
  };

  // Sequential Next and Previous Navigation
  const isFirstLecture = currentModuleIndex === 0 && currentTopicIndex === 0;
  const isLastModule = currentModuleIndex === modules.length - 1;
  const isLastTopicInModule = currentTopicIndex === topics.length - 1;
  const isLastLecture = isLastModule && isLastTopicInModule;

  const handleNextLecture = () => {
    if (isLastLecture) return;

    // Auto-complete: navigating past the last lecture of a section marks it complete
    if (student && activeCourse && currentTopic) {
      markTopicComplete(student.id, currentTopic.id, activeCourse.id);
    }

    if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex((prev) => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      const nextMod = currentModuleIndex + 1;
      setCurrentModuleIndex(nextMod);
      setCurrentTopicIndex(0);
      setExpandedSections((prev) => new Set([...prev, nextMod]));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevLecture = () => {
    if (isFirstLecture) return;

    if (currentTopicIndex > 0) {
      setCurrentTopicIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      const prevMod = currentModuleIndex - 1;
      const prevTopics = modules[prevMod]?.topics || [];
      setCurrentModuleIndex(prevMod);
      setCurrentTopicIndex(Math.max(0, prevTopics.length - 1));
      setExpandedSections((prev) => new Set([...prev, prevMod]));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // VIEW 2: UDEMY-STYLE COURSE LEARNING VIEW WITH CURRICULUM NAVIGATOR
  // ═════════════════════════════════════════════════════════════════════════════
  if (selectedCourseId) {
    if (!activeCourse) {
      return (
        <div className="card border rounded-4 p-5 text-center shadow-sm my-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <FaBook size={48} className="text-muted mb-3 opacity-50 mx-auto" />
          <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>Course Not Found</h4>
          <p className="text-muted mb-4">The selected course is either unpublished or not accessible in your current curriculum.</p>
          <button
            onClick={handleBackToCourses}
            className="btn btn-primary d-inline-flex align-items-center gap-2 mx-auto px-4 py-2 rounded-pill shadow-sm"
          >
            <FaArrowLeft size={14} />
            <span>Return to Courses</span>
          </button>
        </div>
      );
    }

    return (
      <div className="udemy-course-viewer pb-5">
        {/* ── 1. Top Bar ── */}
        <div
          className="udemy-topbar card border-0 shadow-sm rounded-3 px-3 py-2.5 mb-3"
          style={{
            backgroundColor: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)'
          }}
        >
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            {/* Left: Back button & Course Title */}
            <div className="d-flex align-items-center gap-3 min-w-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 rounded-pill px-3 py-1"
                onClick={handleBackToCourses}
              >
                <FaArrowLeft size={12} />
                <span>Back to Courses</span>
              </button>
              <h5 className="mb-0 fw-bold text-truncate" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                {activeCourse.title}
              </h5>
            </div>

            {/* Right: Progress Badge & Actions */}
            <div className="d-flex align-items-center gap-2.5">
              <div
                className="d-none d-sm-flex align-items-center gap-2 px-2.5 py-1 rounded-pill border"
                style={{
                  backgroundColor: 'var(--card-bg-alt, rgba(0,0,0,0.02))',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div style={{ width: 60 }}>
                  <ProgressBar now={activeStats.progressPct} style={{ height: 5 }} />
                </div>
                <span className="small fw-bold" style={{ color: 'var(--bs-primary)', fontSize: '0.78rem' }}>
                  Progress {activeStats.progressPct}%
                </span>
              </div>

              {/* Desktop Sidebar Toggle */}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-none d-lg-flex align-items-center gap-1.5 rounded-pill px-3 py-1"
                onClick={toggleSidebar}
                title={isSidebarHidden ? "Show Curriculum Sidebar" : "Hide Curriculum Sidebar"}
              >
                <FaListUl size={12} />
                <span>{isSidebarHidden ? 'Show Sidebar' : 'Hide Sidebar'}</span>
              </button>

              {/* Only show if a test exists for this module */}
              {(currentModule?.testId || currentModule?.test || currentModule?.hasTest) && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1.5 rounded-pill px-3 py-1"
                  onClick={() => navigate(currentModule?.testId ? `/student/tests?testId=${currentModule.testId}` : '/student/tests')}
                >
                  <FaClipboardList size={12} />
                  <span>Take Test</span>
                </button>
              )}

              {/* Mobile Drawer Trigger (< 992px) */}
              <button
                type="button"
                className="btn btn-sm btn-primary d-flex d-lg-none align-items-center gap-1.5 rounded-pill px-3 py-1"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open curriculum navigator"
              >
                <FaBars size={12} />
                <span>Curriculum</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Main Content + Right Navigator Side-by-Side ── */}
        <div className={`course-view-layout d-flex flex-column flex-lg-row align-items-start gap-3 position-relative ${isSidebarHidden ? 'sidebar-hidden' : ''}`}>
          {/* Floating Show Sidebar Button when collapsed */}
          {isSidebarHidden && (
            <button
              type="button"
              className="btn btn-primary course-floating-sidebar-btn d-none d-lg-flex"
              onClick={toggleSidebar}
            >
              <FaListUl size={14} />
              <span>Show Curriculum</span>
            </button>
          )}

          {/* LEFT MAIN PANEL: Content Viewer */}
          <div className="course-content-area udemy-main-panel flex-grow-1 w-100 min-w-0">
            <div
              className="card border rounded-3 shadow-sm overflow-hidden p-3 p-md-4"
              style={{
                backgroundColor: 'var(--card-bg, #ffffff)',
                borderColor: 'var(--border-color, #e2e8f0)'
              }}
            >
              {/* Lecture Title Header */}
              <div className="mb-3 border-bottom pb-3" style={{ borderColor: 'var(--border-color)' }}>
                <div className="small fw-bold text-uppercase tracking-wider mb-1" style={{ color: 'var(--bs-primary)' }}>
                  Section {currentModuleIndex + 1} • Lecture {currentTopicIndex + 1}
                </div>
                <h3 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>
                  {currentTopic?.title || 'Lecture Content'}
                </h3>
              </div>

              {/* Markdown Content Viewer */}
              <div className="udemy-content-body mb-4">
                <LectureMarkdown
                  content={currentTopic?.contentMd || currentTopic?.description || 'No lecture content specified.'}
                />
              </div>

              {/* Sequential Prev & Next Navigation Buttons */}
              <div
                className="course-nav-buttons d-flex justify-content-between align-items-center py-3 my-3 border-top border-bottom"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 rounded-2"
                  onClick={handlePrevLecture}
                  disabled={isFirstLecture}
                >
                  <FaArrowLeft size={12} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-2"
                  onClick={handleNextLecture}
                  disabled={isLastLecture}
                >
                  <span>Next</span>
                  <FaArrowRight size={12} />
                </button>
              </div>

              {/* ── Bottom Action Bar ── */}
              <div className="udemy-bottom-actions mt-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-3 mb-3" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge px-3 py-2 fw-semibold text-uppercase" style={{ background: 'rgba(var(--bs-primary-rgb), 0.12)', color: 'var(--bs-primary)' }}>
                      <FaRegFileAlt className="me-1.5" /> Lecture Notes & Takeaways
                    </span>
                  </div>

                  {/* Completion & Test CTAs */}
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${isCurrentTopicCompleted ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2`}
                      onClick={handleToggleComplete}
                    >
                      <FaCheckCircle size={13} />
                      <span>{isCurrentTopicCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                    </button>

                    {(currentModule?.testId || currentModule?.test || currentModule?.hasTest) && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-2"
                        onClick={() => navigate(currentModule?.testId ? `/student/tests?testId=${currentModule.testId}` : '/student/tests')}
                      >
                        <FaClipboardList size={13} />
                        <span>Take Module Test</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-3" style={{ backgroundColor: 'var(--card-bg-alt, rgba(0,0,0,0.02))' }}>
                  <h6 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Lecture Overview & Key Concepts
                  </h6>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    Complete this lecture, examine all code snippets, and solve the assigned module problems. Mark this lecture complete above to update your course progress tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Sticky Curriculum Navigator (350px) */}
          {!isSidebarHidden && (
            <div className="course-module-sidebar sticky-sidebar-wrapper">
              <div className="d-flex justify-content-between align-items-center mb-2 px-1 d-none d-lg-flex">
                <span className="small fw-bold text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                  Curriculum Navigator
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted p-0 text-decoration-none"
                  onClick={toggleSidebar}
                  title="Collapse sidebar"
                  style={{ fontSize: '0.75rem' }}
                >
                  Collapse ✕
                </button>
              </div>
              <CurriculumNavigator
                course={activeCourse}
                modules={modules}
                currentModuleIndex={currentModuleIndex}
                currentTopicIndex={currentTopicIndex}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
                onSelectLecture={handleSelectLecture}
                studentProgress={student?.progress || {}}
                quizAttempts={student?.quizAttempts || {}}
                progressPct={activeStats.progressPct}
                isOpen={false}
                onClose={() => {}}
              />
            </div>
          )}

          {/* Mobile Drawer (Always accessible via mobile Curriculum button) */}
          <div className="d-lg-none">
            <CurriculumNavigator
              course={activeCourse}
              modules={modules}
              currentModuleIndex={currentModuleIndex}
              currentTopicIndex={currentTopicIndex}
              expandedSections={expandedSections}
              onToggleSection={handleToggleSection}
              onSelectLecture={handleSelectLecture}
              studentProgress={student?.progress || {}}
              quizAttempts={student?.quizAttempts || {}}
              progressPct={activeStats.progressPct}
              isOpen={mobileDrawerOpen}
              onClose={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // VIEW 1: MY COURSES CATALOG HUB (Clean Cards Layout)
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="student-courses-hub pb-5 space-y-4">
      {/* 1. Crisp Clean Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <FaBook style={{ color: 'var(--bs-primary)' }} />
          <span>My Courses</span>
        </h4>
      </div>

      {/* 2. Course Grid - Clean, Spacious Cards */}
      {allAvailableCourses.length === 0 ? (
        <div className="empty-state">
          <FaBook size={48} />
          <h3>No courses enrolled yet</h3>
          <p>Your cohort has not been assigned any courses yet. Check back once your batch commences.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          {allAvailableCourses.map((course) => {
            const stats = getCourseStats(course);
            const isCompleted = stats.progressPct === 100;

            return (
              <div key={course.id} className="col d-flex">
                <div
                  className="card border rounded-3 shadow-sm w-100 d-flex flex-column transition-all course-catalog-card"
                  style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  {/* Card Header Top Row */}
                  <div
                    className="px-3.5 py-2.5 border-bottom d-flex justify-content-end align-items-center"
                    style={{
                      background: 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.03)',
                      borderColor: 'var(--border-color)',
                      minHeight: '42px'
                    }}
                  >
                    {isCompleted ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill">
                        <FaCheck size={10} />
                        <span>Completed</span>
                      </span>
                    ) : stats.completedTopics > 0 ? (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill">
                        <FaPlay size={9} />
                        <span>In Progress</span>
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-muted border border-secondary-subtle d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill">
                        <span>Not Started</span>
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold mb-2 line-clamp-2" style={{ color: 'var(--text-primary)', minHeight: '3rem' }}>
                      {course.title}
                    </h5>

                    <p className="text-muted small mb-4 line-clamp-2" style={{ minHeight: '2.5rem' }}>
                      {course.description}
                    </p>

                    {/* Progress Bar & Counter */}
                    <div className="mt-auto mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-1.5 small">
                        <span className="text-muted fw-semibold">Progress</span>
                        <span className="fw-bold" style={{ color: 'var(--bs-primary)' }}>
                          {stats.progressPct}%
                        </span>
                      </div>
                      <div className="progress" style={{ height: '7px', backgroundColor: 'var(--hover-bg, rgba(0,0,0,0.06))' }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${stats.progressPct}%`,
                            backgroundColor: 'var(--bs-primary)'
                          }}
                          aria-valuenow={stats.progressPct}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                      <div className="d-flex justify-content-between text-muted mt-1.5" style={{ fontSize: '0.75rem' }}>
                        <span>{stats.completedTopics} of {stats.totalTopics} lectures</span>
                        <span>{stats.totalModules} sections</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2"
                      onClick={() => handleSelectCourse(course.id)}
                    >
                      <FaPlay size={11} />
                      <span>{stats.completedTopics > 0 ? 'Continue Learning' : 'Start Course'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
