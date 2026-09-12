import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';

export default function CourseViewer({ courses = [], initialTopicId = null }) {
  const { student, refreshStudent, user } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicContent, setTopicContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [marking, setMarking] = useState(false);

  // Initialize selected course / module / topic
  useEffect(() => {
    if (courses.length > 0 && !selectedTopic) {
      const firstCourse = courses[0];
      const firstModule = firstCourse.modules?.[0];
      const firstTopic = firstModule?.topics?.[0];

      if (firstModule && firstTopic) {
        setSelectedModule(firstModule);
        setSelectedTopic(firstTopic);
        setExpandedModules({ [firstModule.id]: true });
      }
    }
  }, [courses]);

  // Fetch topic content whenever selectedTopic changes
  useEffect(() => {
    if (selectedTopic?.contentUrl) {
      setLoadingContent(true);
      api.courses
        .list(selectedTopic.contentUrl)
        .then((res) => {
          setTopicContent(res.content || '# No content available');
        })
        .catch(() => {
          setTopicContent('# Error loading topic content');
        })
        .finally(() => setLoadingContent(false));
    }
  }, [selectedTopic]);

  const progress = student?.progress || {};
  const isCompleted = (topicId) => progress[topicId] === 'completed';

  async function handleToggleComplete(topicId) {
    if (!user) return;
    setMarking(true);
    try {
      const nextStatus = isCompleted(topicId) ? undefined : 'completed';
      const updatedProgress = { ...progress };
      if (nextStatus) {
        updatedProgress[topicId] = nextStatus;
      } else {
        delete updatedProgress[topicId];
      }

      await api.students.update(student?.id || user.id, {
        progress: updatedProgress
      });
      await refreshStudent();
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setMarking(false);
    }
  }

  const toggleExpand = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
      {/* Curriculum Sidebar */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-full">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" /> Course Curriculum
          </h3>
          <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
            {Object.keys(progress).length} Completed
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider px-1">
                {course.title}
              </p>
              {course.modules?.map((mod, modIdx) => {
                const isOpen = expandedModules[mod.id] !== false;
                return (
                  <div key={mod.id} className="rounded-xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
                    <button
                      onClick={() => toggleExpand(mod.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/40 transition-colors"
                    >
                      <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {mod.title}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-800/60 divide-y divide-slate-800/40">
                        {mod.topics?.map((topic) => {
                          const active = selectedTopic?.id === topic.id;
                          const done = isCompleted(topic.id);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => {
                                setSelectedModule(mod);
                                setSelectedTopic(topic);
                              }}
                              className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all ${
                                active
                                  ? 'bg-brand-500/10 border-l-2 border-brand-400 text-brand-300'
                                  : 'hover:bg-slate-800/30 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleComplete(topic.id);
                                  }}
                                  className="focus:outline-none"
                                >
                                  {done ? (
                                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                  )}
                                </button>
                                <span className={`text-xs truncate ${done ? 'line-through text-slate-500' : ''}`}>
                                  {topic.title}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Reader */}
      <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
        {selectedTopic ? (
          <div>
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-mono text-brand-400 uppercase tracking-wide">
                  {selectedModule?.title || 'Course Module'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedTopic.title}
                </h2>
              </div>

              <button
                onClick={() => handleToggleComplete(selectedTopic.id)}
                disabled={marking}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isCompleted(selectedTopic.id)
                    ? 'bg-slate-800 text-brand-300 border border-brand-500/30 hover:bg-slate-700'
                    : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-brand-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isCompleted(selectedTopic.id) ? 'Completed (Undo)' : 'Mark as Completed'}
                </span>
              </button>
            </div>

            {/* Topic Images if any */}
            {selectedTopic.imageUrls && selectedTopic.imageUrls.length > 0 && (
              <div className="mb-6 rounded-xl overflow-hidden border border-slate-800">
                <img
                  src={selectedTopic.imageUrls[0]}
                  alt={selectedTopic.title}
                  className="w-full h-56 object-cover object-center"
                />
              </div>
            )}

            {/* Markdown Body */}
            {loadingContent ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Loading topic from Supabase Storage...</p>
              </div>
            ) : (
              <div className="prose-custom whitespace-pre-line">
                {topicContent}
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 text-center">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Select a topic from the curriculum to start reading.</p>
          </div>
        )}
      </div>
    </div>
  );
}
