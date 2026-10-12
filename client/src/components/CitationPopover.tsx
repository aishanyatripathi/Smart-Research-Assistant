import React from 'react';
import { Citation } from '../types';
import { BookOpen, ExternalLink } from 'lucide-react';

interface CitationPopoverProps {
  citation: Citation;
  onClose?: () => void;
}

export const CitationPopover: React.FC<CitationPopoverProps> = ({ citation }) => {
  return (
    <div className="inline-block relative group">
      <span className="cursor-pointer bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold px-2 py-0.5 rounded-md transition inline-flex items-center space-x-1">
        <BookOpen className="w-3 h-3 text-indigo-400" />
        <span>[{citation.docTitle}, p. {citation.pageNumber}]</span>
      </span>

      {/* Hover preview popover */}
      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-72 p-3 bg-slate-900 border border-indigo-500/50 rounded-xl shadow-2xl z-30 glass-panel animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center space-x-1.5 text-indigo-300 text-xs font-semibold truncate">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{citation.docTitle}</span>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">Page {citation.pageNumber}</span>
        </div>
        <p className="text-[11px] text-slate-300 font-mono italic leading-relaxed bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          "{citation.excerpt}"
        </p>
        <div className="mt-2 text-[9px] text-indigo-400 flex items-center justify-end space-x-1">
          <span>Grounded RAG Evidence Chunk</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  );
};
