import React, { useState } from 'react';
import { X, UploadCloud, FileText, File, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { Source } from '../types';

interface SourceUploadModalProps {
  notebookId: string;
  isOpen: boolean;
  onClose: () => void;
  onSourceUploaded: (newSource: Source) => void;
}

export const SourceUploadModal: React.FC<SourceUploadModalProps> = ({
  notebookId,
  isOpen,
  onClose,
  onSourceUploaded
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'file') {
        if (!file) {
          setError('Please select a PDF or text file to upload');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        if (title) formData.append('title', title);

        const res = await axios.post(`/api/notebooks/${notebookId}/sources/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onSourceUploaded(res.data);
      } else {
        if (!textContent.trim()) {
          setError('Please enter note text');
          setLoading(false);
          return;
        }
        const res = await axios.post(`/api/notebooks/${notebookId}/sources/upload`, {
          title: title || 'Custom Notes',
          content: textContent
        });
        onSourceUploaded(res.data);
      }

      onClose();
      setFile(null);
      setTitle('');
      setTextContent('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload source material');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleStudyNotes = () => {
    setTitle('Machine_Learning_Lecture_Notes.txt');
    setTextContent(`Deep Learning & Convolutional Neural Networks (CNN) Overview:
1. Feature Extraction: Convolutional layers apply learnable filters over input images (e.g. brain MRI scans) to detect low-level edges, textures, and high-level structural patterns.
2. U-Net Architecture: Developed by Ronneberger et al., U-Net utilizes a symmetric contracting path (encoder) for spatial feature capture and an expanding path (decoder) with skip-connections for precise pixel-level image segmentation.
3. Dice Coefficient & Loss: Used as a standard metric to evaluate segmentation precision between predicted boundaries and ground truth masks.
4. Active Recall Study Strategy: Flashcards and spaced-repetition intervals enhance long-term memory retention by challenging the brain to reconstruct neural pathways.`);
    setActiveTab('text');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden glass-panel animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Add Source Material</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'file' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📄 Upload Document (PDF / TXT)
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ✍️ Paste Notes / Text
          </button>
        </div>

        <form onSubmit={handleFileUpload} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Source Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 - Neural Networks.pdf"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {activeTab === 'file' ? (
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-6 text-center bg-slate-950/30 transition cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-xs font-semibold">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <FileText className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-300">
                    Click to browse or drag & drop PDF, TXT, or MD files
                  </p>
                  <p className="text-[10px] text-slate-500">Max size 25MB • Grounded RAG index ready</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lecture Notes / Study Content</label>
              <textarea
                rows={6}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste research paper excerpts, definitions, or study notes..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={loadSampleStudyNotes}
              className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Study Notes</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition disabled:opacity-50 flex items-center space-x-1.5"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Ingest & Index</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
