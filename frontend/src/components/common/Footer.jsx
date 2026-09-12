import React from 'react';
import { Code2, Database, Shield, Zap, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">CodeLift Engineering Platform</span>
          </div>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Engineered with a high-performance <strong>JSON-First Architecture</strong> using Supabase Object Storage as an atomic document repository, powered by Vercel Serverless Functions.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-brand-400">
              <Database className="w-3 h-3" /> Supabase Storage: app-data
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400">
              <Zap className="w-3 h-3" /> Vercel Edge/Serverless
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-purple-400">
              <Shield className="w-3 h-3" /> Optimistic OCC
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Curriculum</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-white transition-colors cursor-pointer">Async JS & Concurrency</li>
            <li className="hover:text-white transition-colors cursor-pointer">React Fiber Architecture</li>
            <li className="hover:text-white transition-colors cursor-pointer">Serverless API Design</li>
            <li className="hover:text-white transition-colors cursor-pointer">Storage Bucket Databases</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-white transition-colors cursor-pointer">Supabase Auth Integrated</li>
            <li className="hover:text-white transition-colors cursor-pointer">Direct Signed Uploads</li>
            <li className="hover:text-white transition-colors cursor-pointer">Automated Quiz Grading</li>
            <li className="hover:text-white transition-colors cursor-pointer">Cryptographic Certificates</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 CodeLift Platform. Phase 1 JSON-First Architecture.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Crafted with <Sparkles className="w-3 h-3 text-brand-400" /> for full-stack engineers.
        </p>
      </div>
    </footer>
  );
}
