import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import CertificateCard from '../components/certificates/CertificateCard';
import { Award, Sparkles, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function CertificatesPage() {
  const { student, user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, [student]);

  async function loadCertificates() {
    try {
      const res = await api.certificates.list(student?.id || user?.id);
      setCertificates(res.certificates || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimCertificate() {
    setGenerating(true);
    try {
      const res = await api.certificates.generate(
        student?.id || user?.id,
        'Modern Full-Stack Web Engineering'
      );
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
      await loadCertificates();
    } catch (err) {
      console.error('Failed to issue certificate:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Verified Credentials
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-brand-400" />
            <span>Accreditation & Certificates</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Certificates are recorded permanently in <code className="text-brand-300">certificates.json</code> with individual cryptographic tracking identifiers.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Claim Your Course Certificate</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ready to generate your verified certificate of completion for Modern Full-Stack Web Engineering?
          </p>
          <button
            onClick={handleClaimCertificate}
            disabled={generating}
            className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-brand-500/20 inline-flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Issuing Certificate to Storage...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Generate Official Certificate</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
