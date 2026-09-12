import React, { useEffect, useRef } from 'react';
import { ProgressBar, Badge } from 'react-bootstrap';
import {
  FaCheckCircle,
  FaPlay,
  FaRegCircle,
  FaChevronDown,
  FaChevronRight,
  FaTimes,
  FaBook,
  FaFileAlt
} from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';

export default function CurriculumNavigator({
  course,
  modules = [],
  currentModuleIndex = 0,
  currentTopicIndex = 0,
  expandedSections = new Set(),
  onToggleSection,
  onSelectLecture,
  studentProgress = {},
  quizAttempts = {},
  progressPct = 0,
  isOpen = false,
  onClose
}) {
  const activeLectureRef = useRef(null);

  // Auto-scroll sidebar to the active lecture whenever current selection changes
  useEffect(() => {
    if (activeLectureRef.current) {
      activeLectureRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [currentModuleIndex, currentTopicIndex]);

  // Calculate lecture status: 'completed' | 'in-progress' | 'not-started'
  const getLectureStatus = (topic, mIdx, tIdx) => {
    const isCompleted =
      studentProgress[topic.id] === 'completed' ||
      studentProgress[topic.id] === true ||
      quizAttempts[topic.id]?.passed;

    if (isCompleted) return 'completed';
    if (mIdx === currentModuleIndex && tIdx === currentTopicIndex) return 'in-progress';
    return 'not-started';
  };

  // Compute section statistics
  const getSectionStats = (module) => {
    const topics = module.topics || [];
    const completedCount = topics.filter(
      (t) =>
        studentProgress[t.id] === 'completed' ||
        studentProgress[t.id] === true ||
        quizAttempts[t.id]?.passed
    ).length;

    // Estimate duration: 5-8 min per lecture if not specified
    const totalMinutes = topics.reduce((acc, t) => acc + (t.durationMinutes || 7), 0);
    const durationStr = totalMinutes > 60
      ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
      : `${totalMinutes} min`;

    return {
      total: topics.length,
      completed: completedCount,
      isAllCompleted: topics.length > 0 && completedCount === topics.length,
      durationStr
    };
  };

  const content = (
    <div className="curriculum-navigator-content d-flex flex-column h-100">
      {/* 1. Header with Course Progress */}
      <div
        className="curriculum-nav-header p-3 border-bottom flex-shrink-0"
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderColor: 'var(--border-color, #e2e8f0)'
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Course Content
          </span>
          {onClose && (
            <button
              type="button"
              className="btn btn-sm btn-link text-muted p-0 d-lg-none"
              onClick={onClose}
              aria-label="Close navigator"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>

        {/* Overall Progress */}
        <div className="d-flex align-items-center justify-content-between small mb-1.5">
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Overall Progress</span>
          <span className="fw-bold" style={{ color: 'var(--bs-primary)', fontSize: '0.82rem' }}>
            {progressPct}% Complete
          </span>
        </div>
        <ProgressBar
          now={progressPct}
          style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.06)' }}
        />
      </div>

      {/* 2. Scrollable Sections and Lectures List */}
      <div
        className="curriculum-nav-sections flex-grow-1 overflow-y-auto"
        style={{ backgroundColor: 'var(--card-bg, #ffffff)' }}
      >
        {modules.length === 0 ? (
          <div className="p-4 text-center text-muted small">
            No sections available in this course.
          </div>
        ) : (
          modules.map((module, mIdx) => {
            const isExpanded = expandedSections.has(mIdx);
            const stats = getSectionStats(module);
            const isCurrentModule = mIdx === currentModuleIndex;

            return (
              <div
                key={module.id || `section-${mIdx}`}
                className="curriculum-section-group border-bottom"
                style={{ borderColor: 'var(--border-color, #e2e8f0)' }}
              >
                {/* Collapsible Section Header */}
                <button
                  type="button"
                  className="w-100 text-start p-3 border-0 d-flex align-items-start gap-2.5 transition-all"
                  style={{
                    backgroundColor: isCurrentModule ? 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.04)' : 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onToggleSection && onToggleSection(mIdx)}
                  aria-expanded={isExpanded}
                >
                  <div className="mt-1 text-muted" style={{ transition: 'transform 0.2s ease' }}>
                    {isExpanded ? <FaChevronDown size={11} /> : <FaChevronRight size={11} />}
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-0.5">
                      <span className="fw-bold small text-truncate" style={{ color: 'var(--text-primary)' }}>
                        Section {mIdx + 1}: {module.title}
                      </span>
                      {stats.isAllCompleted && (
                        <span className="text-success flex-shrink-0" title="Section Completed">
                          <FaCheckCircle size={13} />
                        </span>
                      )}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {stats.completed}/{stats.total} | {stats.durationStr}
                    </div>
                  </div>
                </button>

                {/* Section Lectures List */}
                {isExpanded && (
                  <div
                    className="curriculum-lectures-list"
                    style={{ backgroundColor: 'var(--card-bg-alt, rgba(0,0,0,0.02))' }}
                  >
                    {(module.topics || []).map((topic, tIdx) => {
                      const isCurrent = mIdx === currentModuleIndex && tIdx === currentTopicIndex;
                      const status = getLectureStatus(topic, mIdx, tIdx);

                      return (
                        <button
                          key={topic.id || `lec-${mIdx}-${tIdx}`}
                          ref={isCurrent ? activeLectureRef : null}
                          type="button"
                          className="w-100 text-start px-3 py-2.5 border-0 d-flex align-items-center gap-2.5 transition-all curriculum-lecture-row"
                          style={{
                            backgroundColor: isCurrent
                              ? 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.12)'
                              : 'transparent',
                            borderLeft: isCurrent
                              ? '3px solid var(--bs-primary, #15803d)'
                              : '3px solid transparent',
                            color: isCurrent ? 'var(--bs-primary, #15803d)' : 'var(--text-primary)',
                            fontWeight: isCurrent ? 700 : 500,
                            cursor: 'pointer',
                            fontSize: '0.82rem'
                          }}
                          onClick={() => onSelectLecture && onSelectLecture(mIdx, tIdx)}
                        >
                          {/* Lecture Icon State */}
                          <div className="flex-shrink-0 d-flex align-items-center justify-content-center" style={{ width: 18 }}>
                            {status === 'completed' ? (
                              <FaCheckCircle className="text-success" size={13} />
                            ) : status === 'in-progress' ? (
                              <FaPlay size={10} style={{ color: 'var(--bs-primary)' }} />
                            ) : (
                              <FaRegCircle className="text-muted" size={12} />
                            )}
                          </div>

                          {/* Lecture Title & Type */}
                          <div className="flex-grow-1 text-truncate">
                            <span>
                              {tIdx + 1}. {topic.title}
                            </span>
                          </div>

                          {/* Duration */}
                          {topic.durationMinutes && (
                            <span className="text-muted ms-auto flex-shrink-0" style={{ fontSize: '0.72rem' }}>
                              {topic.durationMinutes}m
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (Sticky, 340px width) ── */}
      <aside
        className="curriculum-navigator-desktop d-none d-lg-flex flex-column border rounded-3 shadow-sm"
        style={{
          width: '340px',
          minWidth: '340px',
          maxWidth: '340px',
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderColor: 'var(--border-color, #e2e8f0)',
          position: 'sticky',
          top: '72px',
          height: 'calc(100vh - 90px)',
          overflow: 'hidden'
        }}
        aria-label="Course Curriculum Navigator"
      >
        {content}
      </aside>

      {/* ── MOBILE OFF-CANVAS DRAWER (< 992px) ── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1060,
              backdropFilter: 'blur(3px)'
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            className="curriculum-navigator-mobile position-fixed top-0 end-0 h-100 d-lg-none shadow-lg d-flex flex-column"
            style={{
              width: '85vw',
              maxWidth: '360px',
              zIndex: 1070,
              backgroundColor: 'var(--card-bg, #ffffff)',
              borderLeft: '1px solid var(--border-color, #e2e8f0)'
            }}
          >
            {content}
          </div>
        </>
      )}
    </>
  );
}
