import React from 'react';
import { Notebook } from '../types';
import { BookOpen, Sparkles, Headphones, Users, Plus, BrainCircuit } from 'lucide-react';

interface HeaderProps {
  notebooks: Notebook[];
  activeNotebook: Notebook | null;
  onSelectNotebook: (nb: Notebook) => void;
  onOpenNewNotebookModal: () => void;
  socraticMode: boolean;
  onToggleSocraticMode: () => void;
  onOpenAudioOverview: () => void;
  onOpenStudyRoom: () => void;
  onNavigateHome?: () => void;
  onNavigateProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notebooks,
  activeNotebook,
  onSelectNotebook,
  onOpenNewNotebookModal,
  socraticMode,
  onToggleSocraticMode,
  onOpenAudioOverview,
  onOpenStudyRoom,
  onNavigateHome,
  onNavigateProfile,
}) => {
  return (
    <header className="h-16 border-b border-[#27272a] bg-[#101013]/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Notebook Selector */}
      <div className="flex items-center space-x-3.5">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-[#18181c] border border-[#27272a] hover:bg-[#202026] transition flex items-center gap-1.5"
            title="Return to Landing Page"
          >
            <span>← Home</span>
          </button>
        )}

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#dd6b47] to-[#ec5c2e] flex items-center justify-center shadow-lg shadow-[#dd6b47]/20 text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">
              Smart Research Assistant
            </h1>
            <p className="text-[10px] text-[#dd6b47] font-semibold tracking-wider uppercase">
              NotebookLLM RAG Engine
            </p>
          </div>
        </div>

        <div className="h-5 w-px bg-[#27272a]" />

        {/* Notebook Dropdown Switcher */}
        <div className="flex items-center space-x-2">
          <select
            value={activeNotebook?.id || ''}
            onChange={(e) => {
              const selected = notebooks.find(n => n.id === e.target.value);
              if (selected) onSelectNotebook(selected);
            }}
            className="bg-[#141418] border border-[#27272a] text-zinc-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#dd6b47] font-medium cursor-pointer"
          >
            {notebooks.map((nb) => (
              <option key={nb.id} value={nb.id}>
                📖 {nb.title} ({nb.sourcesCount} sources)
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewNotebookModal}
            className="p-1.5 rounded-lg bg-[#141418] hover:bg-[#202026] text-zinc-400 hover:text-[#dd6b47] border border-[#27272a] transition"
            title="Create New Study Notebook"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feature Toggles & Actions */}
      <div className="flex items-center space-x-3">
        {/* Socratic Tutor Switch */}
        <button
          onClick={onToggleSocraticMode}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            socraticMode
              ? 'bg-[#321d15] border-[#dd6b47] text-[#dd6b47]'
              : 'bg-[#141418] border-[#27272a] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BrainCircuit className={`w-3.5 h-3.5 ${socraticMode ? 'text-[#dd6b47] animate-pulse' : ''}`} />
          <span>Socratic Tutor</span>
          <span className={`px-1.5 py-0.5 text-[9px] rounded-full uppercase tracking-wider font-bold ${
            socraticMode ? 'bg-[#dd6b47] text-white' : 'bg-[#27272a] text-zinc-400'
          }`}>
            {socraticMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Audio Overview Podcast Button */}
        <button
          onClick={onOpenAudioOverview}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#321d15]/60 hover:bg-[#321d15] border border-[#4f3327] text-[#dd6b47] text-xs font-medium transition"
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Audio Podcast</span>
        </button>

        {/* Study Room Collaboration */}
        <button
          onClick={onOpenStudyRoom}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1d1d22] border border-[#27272a] text-zinc-300 text-xs font-medium transition"
        >
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>Study Room</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        <div className="h-5 w-px bg-[#27272a]" />

        {/* Team Member Avatar Badge */}
        <div 
          onClick={onNavigateProfile}
          className="flex items-center space-x-2 bg-[#141418] hover:bg-[#1d1d22] border border-[#27272a] rounded-lg px-2.5 py-1 cursor-pointer transition"
          title="Click to view Profile"
        >
          <div className="w-6 h-6 rounded-full bg-[#dd6b47] flex items-center justify-center text-[10px] font-bold text-white">
            AT
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[11px] font-semibold text-zinc-200 leading-tight">Aishanya Tripathi</p>
            <p className="text-[9px] text-zinc-400">Lead Researcher</p>
          </div>
        </div>
      </div>
    </header>
  );
};
