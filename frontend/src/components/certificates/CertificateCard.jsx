import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Printer, ExternalLink } from 'lucide-react';

export default function CertificateCard({ certificate }) {
  if (!certificate) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Outer Certificate Frame */}
      <div className="border-4 border-double border-slate-700/80 rounded-2xl p-6 sm:p-10 bg-slate-950/80 backdrop-blur-md relative text-center">
        {/* Top Emblem */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-xl shadow-brand-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Award className="w-8 h-8 text-brand-400" />
            </div>
          </div>
        </div>

        <span className="text-xs uppercase tracking-widest font-mono text-brand-400 font-semibold">
          Certificate of Mastery
        </span>

        <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-2 mb-1 tracking-tight">
          CodeLift Platform Certification
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
          This document certifies that the named candidate has demonstrated complete practical competency in accordance with Phase 1 standards.
        </p>

        {/* Recipient */}
        <div className="my-6 py-4 border-y border-slate-800/80">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Presented to</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-white to-brand-300">
            {certificate.studentName || 'Certified Engineer'}
          </h2>
          <p className="text-sm font-medium text-brand-400 mt-2">
            for successfully mastering
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-200 mt-1">
            {certificate.courseTitle || 'Modern Full-Stack Web Engineering'}
          </p>
        </div>

        {/* Footer Meta Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-400">
          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase font-mono text-slate-500">Issued On</p>
            <p className="font-semibold text-slate-300 mt-0.5">
              {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center space-x-1 text-brand-400 font-mono text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographically Verified</span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-[10px] uppercase font-mono text-slate-500">Credential ID</p>
            <p className="font-mono text-brand-400 font-bold mt-0.5 select-all">
              {certificate.id}
            </p>
          </div>
        </div>

        {/* Print Button (hidden in print media) */}
        <div className="mt-8 pt-4 flex justify-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print or Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
