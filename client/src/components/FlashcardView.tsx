import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Layers, RotateCw, CheckCircle2, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import axios from 'axios';

interface FlashcardViewProps {
  notebookId: string;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ notebookId }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashcards();
  }, [notebookId]);

  const fetchFlashcards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/notebooks/${notebookId}/flashcards`);
      if (res.data.length > 0) {
        setCards(res.data);
      } else {
        await generateFlashcards();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcards = async () => {
    setLoading(true);
    setError(null);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const res = await axios.post(`/api/notebooks/${notebookId}/flashcards/generate`);
      setCards(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Enable document sources to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSM2 = async (rating: number) => {
    if (cards.length === 0) return;
    const currentCard = cards[currentIndex];

    try {
      const res = await axios.post(`/api/flashcards/${currentCard.id}/review`, { rating });
      // Update local card state with new SM-2 values
      const updatedCards = [...cards];
      updatedCards[currentIndex] = res.data;
      setCards(updatedCards);
    } catch (err) {
      console.warn('SM2 save warning:', err);
    }

    // Move to next card
    setIsFlipped(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-3 text-slate-400">
        <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-xs font-semibold text-slate-300">Building SM-2 Spaced-Repetition Deck...</p>
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-purple-400">
          <Layers className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-300 font-medium">{error || 'No flashcards generated yet.'}</p>
        <button
          onClick={generateFlashcards}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate Flashcard Deck</span>
        </button>
      </div>
    );
  }

  const current = cards[currentIndex];

  return (
    <div className="p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Card {currentIndex + 1} of {cards.length}</span>
        <div className="flex items-center space-x-1.5 text-[11px] text-purple-400 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Interval: {current.interval} days</span>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-52 perspective-1000 cursor-pointer"
      >
        <div
          className={`w-full h-full relative transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Question) */}
          <div className="absolute inset-0 w-full h-full bg-slate-900 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between backface-hidden glass-panel shadow-xl">
            <div className="flex items-center justify-between text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              <span>{current.docTitle}</span>
              <span className="bg-purple-950 px-2 py-0.5 rounded border border-purple-800">Front (Concept)</span>
            </div>
            <p className="text-xs font-bold text-slate-100 leading-relaxed text-center my-auto">
              {current.front}
            </p>
            <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-400">
              <RotateCw className="w-3 h-3 text-purple-400" />
              <span>Click to reveal answer</span>
            </div>
          </div>

          {/* Card Back (Answer) */}
          <div className="absolute inset-0 w-full h-full bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 glass-panel shadow-xl">
            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span>Grounded Explanation</span>
              <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Back (Answer)</span>
            </div>
            <p className="text-xs font-medium text-slate-200 leading-relaxed overflow-y-auto max-h-28 pr-1 my-auto">
              {current.back}
            </p>
            <div className="text-[9px] text-slate-400 text-center font-mono">
              Repetitions: {current.repetition} • Ease Factor: {current.easeFactor.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* SM-2 Rating Buttons */}
      {isFlipped ? (
        <div className="space-y-1.5 animate-in fade-in">
          <p className="text-[10px] text-center text-slate-400 font-semibold">Rate Recall Difficulty (SuperMemo SM-2):</p>
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => handleReviewSM2(0)}
              className="py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-lg transition"
            >
              🔴 Again
            </button>
            <button
              onClick={() => handleReviewSM2(1)}
              className="py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-semibold rounded-lg transition"
            >
              🟠 Hard
            </button>
            <button
              onClick={() => handleReviewSM2(2)}
              className="py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-lg transition"
            >
              🟢 Good
            </button>
            <button
              onClick={() => handleReviewSM2(3)}
              className="py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800 text-indigo-300 text-xs font-semibold rounded-lg transition"
            >
              🔵 Easy
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(prev => (prev > 0 ? prev - 1 : cards.length - 1));
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={generateFlashcards}
            className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Regenerate Deck</span>
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(prev => (prev + 1 < cards.length ? prev + 1 : 0));
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
