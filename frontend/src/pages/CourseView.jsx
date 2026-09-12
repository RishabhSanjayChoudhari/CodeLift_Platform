import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CourseViewer from '../components/courses/CourseViewer';
import { BookOpen, Loader2 } from 'lucide-react';

export default function CourseView() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.courses
      .list()
      .then((res) => {
        setCourses(res.courses || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Interactive Classroom
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-brand-400" />
            <span>Curriculum & Learning Content</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Content topics are loaded on-demand from the Supabase Storage bucket and stored directly in your progress matrix.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading course curriculum from Storage...</p>
        </div>
      ) : (
        <CourseViewer courses={courses} />
      )}
    </div>
  );
}
