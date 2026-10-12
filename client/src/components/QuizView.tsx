import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import axios from 'axios';

interface QuizViewProps {
  notebookId: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ notebookId }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, [notebookId]);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/notebooks/${notebookId}/quizzes`);
      if (res.data.length > 0) {
        setQuestions(res.data[0].questions);
      } else {
        await generateNewQuiz();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const generateNewQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuizFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);

    try {
      const res = await axios.post(`/api/notebooks/${notebookId}/quizzes/generate`);
      setQuestions(res.data.questions || res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Enable document sources to generate a quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const current = questions[currentIndex];
    if (index === current.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score + 1 >= Math.ceil(questions.length * 0.7)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-3 text-slate-400">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-xs font-semibold text-slate-300">Generating AI Active-Recall Quiz...</p>
        <p className="text-[10px] text-slate-500">Extracting core concepts from active sources</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-300 font-medium">{error}</p>
        <button
          onClick={generateNewQuiz}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate New Quiz</span>
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-xs text-slate-400">No active quiz available.</p>
        <button
          onClick={generateNewQuiz}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Generate AI Quiz
        </button>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="p-6 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">Quiz Completed!</h3>
          <p className="text-xs text-slate-400 mt-1">Active Recall Score</p>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">{score} / {questions.length}</div>
          <p className="text-xs font-semibold text-emerald-400 mt-1">{percentage}% Knowledge Mastery</p>
        </div>

        <button
          onClick={generateNewQuiz}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Fresh Quiz</span>
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="p-4 space-y-4">
      {/* Progress & Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Question {currentIndex + 1} of {questions.length}</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          q.difficulty === 'Easy' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
          q.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
          'bg-rose-950 text-rose-300 border border-rose-800'
        }`}>
          {q.difficulty}
        </span>
      </div>

      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-bold text-slate-100 leading-relaxed">{q.question}</h4>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {q.options.map((opt, idx) => {
            let style = 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 text-slate-300';
            if (isAnswered) {
              if (idx === q.correctAnswer) {
                style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
              } else if (idx === selectedOption) {
                style = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                style = 'bg-slate-950/30 border-slate-900 opacity-50 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-3 rounded-lg border text-left text-xs transition flex items-start space-x-2.5 ${style}`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="mt-3 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1 animate-in fade-in">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded Source Explanation</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5"
        >
          <span>{currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
