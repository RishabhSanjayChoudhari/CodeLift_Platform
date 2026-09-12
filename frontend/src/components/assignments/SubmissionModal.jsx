import React, { useState } from 'react';
import Modal from '../common/Modal';
import { api } from '../../services/api';
import { Upload, CheckCircle2, AlertCircle, FileText, Loader2 } from 'lucide-react';

export default function SubmissionModal({ isOpen, onClose, assignment, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!assignment) return null;

  async function handleUploadAndSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError('Please choose a file to submit.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Request signed upload URL from Supabase Storage
      setStatusText('Requesting signed upload URL from Supabase Storage...');
      const uploadUrlRes = await api.admin.getUploadUrl('submissions', file.name);

      // Step 2: Upload file directly to Storage signed URL
      setStatusText('Uploading file directly to Storage bucket...');
      await api.admin.uploadFile(uploadUrlRes.signedUrl, file);

      // Step 3: Record submission in submissions.json
      setStatusText('Recording submission in submissions.json...');
      const fileUrls = [uploadUrlRes.fileUrl || uploadUrlRes.path];
      await api.assignments.submit(assignment.id, fileUrls);

      setSuccess(true);
      setStatusText('Assignment submitted successfully!');
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
        setFile(null);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit assignment');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Submit Assignment: ${assignment.title}`}
    >
      <form onSubmit={handleUploadAndSubmit} className="space-y-5">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
          <p className="text-slate-400">
            <strong className="text-slate-200">Deadline:</strong>{' '}
            {new Date(assignment.deadline).toLocaleString()}
          </p>
          <p className="text-slate-400">
            <strong className="text-slate-200">Max Marks:</strong> {assignment.maxMarks}
          </p>
          <p className="text-slate-400">
            <strong className="text-slate-200">Submission Type:</strong>{' '}
            <span className="font-mono text-brand-400">{assignment.type}</span>
          </p>
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-slate-700 hover:border-brand-500/50 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
          <input
            type="file"
            id="submission-file"
            onChange={(e) => setFile(e.target.files[0] || null)}
            className="hidden"
          />
          <label htmlFor="submission-file" className="cursor-pointer block">
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-200">
              {file ? file.name : 'Click to browse or drag and drop your submission'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JS, TS, ZIP, PDF, or Markdown files up to 50MB
            </p>
          </label>
        </div>

        {file && (
          <div className="flex items-center justify-between bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
            <div className="flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span className="text-slate-200 truncate">{file.name}</span>
            </div>
            <span className="text-slate-400 text-[11px] font-mono">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        {/* Status / Error / Success Messages */}
        {uploading && (
          <div className="flex items-center space-x-2 text-xs text-brand-400 bg-brand-500/10 p-3 rounded-xl border border-brand-500/20">
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            <span>{statusText}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusText}</span>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !file}
            className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/20 flex items-center gap-1.5"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Submit to Storage</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
