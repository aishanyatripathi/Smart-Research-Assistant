import React, { useState, useEffect } from 'react';
import { AudioOverview, AudioScriptTurn } from '../types';
import { Headphones, Play, Pause, RotateCcw, Volume2, Sparkles, X, Mic } from 'lucide-react';
import axios from 'axios';

interface AudioOverviewPlayerProps {
  notebookId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioOverviewPlayer: React.FC<AudioOverviewPlayerProps> = ({
  notebookId,
  isOpen,
  onClose
}) => {
  const [overview, setOverview] = useState<AudioOverview | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !overview) {
      fetchAudioOverview();
    }
  }, [isOpen, notebookId]);

  const fetchAudioOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/notebooks/${notebookId}/audio-overview`);
      setOverview(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Enable document sources to generate audio podcast overview');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!overview || !('speechSynthesis' in window)) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakTurn(currentTurnIndex);
    }
  };

  const speakTurn = (index: number) => {
    if (!overview || index >= overview.script.length) {
      setIsPlaying(false);
      setCurrentTurnIndex(0);
      return;
    }

    setCurrentTurnIndex(index);
    const turn = overview.script[index];
    const utterance = new SpeechSynthesisUtterance(turn.text);

    // Differentiate voices for Host 1 (Alex) vs Host 2 (Maya)
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (turn.speaker.includes('Alex')) {
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      } else {
        utterance.pitch = 1.1;
        utterance.rate = 1.05;
      }
    }

    utterance.onend = () => {
      if (index + 1 < overview.script.length) {
        speakTurn(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentTurnIndex(0);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTurnIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 leading-tight">Notebook Deep-Dive Audio Podcast</h3>
              <p className="text-[10px] text-indigo-300">AI Dual-Host Discussion • Web Speech Synthesis</p>
            </div>
          </div>
          <button onClick={() => { handleReset(); onClose(); }} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-200">Synthesizing Conversational Podcast Script...</p>
            <p className="text-[10px] text-slate-500">Formulating dialogue between Alex & Maya based on source materials</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-rose-300 font-medium">{error}</p>
            <button onClick={fetchAudioOverview} className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-semibold">
              Retry Generation
            </button>
          </div>
        ) : overview ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Visualizer & Controls Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg transition glow-purple"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{overview.title}</h4>
                  <p className="text-[10px] text-slate-400">{overview.duration} • Hosts: {overview.hosts.join(' & ')}</p>
                </div>
              </div>

              {/* Animated Soundwave */}
              <div className="flex items-end space-x-1 h-8 px-2">
                <span className={`w-1.5 bg-indigo-500 rounded-full ${isPlaying ? 'animate-wave-1' : 'h-2'}`} />
                <span className={`w-1.5 bg-purple-500 rounded-full ${isPlaying ? 'animate-wave-2' : 'h-4'}`} />
                <span className={`w-1.5 bg-pink-500 rounded-full ${isPlaying ? 'animate-wave-3' : 'h-3'}`} />
                <span className={`w-1.5 bg-indigo-400 rounded-full ${isPlaying ? 'animate-wave-4' : 'h-2'}`} />
              </div>

              <button
                onClick={handleReset}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
                title="Reset Audio Playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Transcript Timeline */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Live Transcript Script:</p>
              {overview.script.map((turn, idx) => {
                const isActive = isPlaying && currentTurnIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-950/70 border-indigo-500 text-slate-100 shadow-md translate-x-1'
                        : 'bg-slate-950/40 border-slate-850 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-base">{turn.avatar}</span>
                      <span className="font-bold text-[11px] text-indigo-300">{turn.speaker}</span>
                      {isActive && (
                        <span className="flex items-center space-x-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          <Mic className="w-2.5 h-2.5 animate-pulse" />
                          <span>SPEAKING</span>
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-[11px] font-medium pl-6">{turn.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
