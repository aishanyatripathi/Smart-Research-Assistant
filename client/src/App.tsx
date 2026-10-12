import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { AuthPage } from './components/ui/auth-page';
import { SourceUploadModal } from './components/SourceUploadModal';
import { CitationPopover } from './components/CitationPopover';
import { QuizView } from './components/QuizView';
import { FlashcardView } from './components/FlashcardView';
import { AudioOverviewPlayer } from './components/AudioOverviewPlayer';
import { CollaborativeRoomModal } from './components/CollaborativeRoomModal';
import { Notebook, Source, ChatMessage } from './types';
import { 
  FileText, UploadCloud, Plus, Send, Sparkles, BrainCircuit, 
  HelpCircle, Layers, FileDown, CheckCircle2, AlertCircle, Trash2, ToggleLeft, ToggleRight, Bookmark
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'profile' | 'workspace'>('home');
  const [currentUser, setCurrentUser] = useState({
    name: 'Aishanya Tripathi',
    email: 'aishanya.tripathi@example.com',
    title: 'Lead AI Researcher & GEO Strategist',
    bio: 'Pioneering generative engine optimization, Socratic automated learning, and multimodal research intelligence across top AI models.'
  });

  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [activeNotebook, setActiveNotebook] = useState<Notebook | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  
  // UI Controls & Modals
  const [socraticMode, setSocraticMode] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'quiz' | 'flashcards' | 'briefing'>('quiz');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isStudyRoomOpen, setIsStudyRoomOpen] = useState(false);
  
  // Chat input
  const [inputQuery, setInputQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotebooks();

    const hash = window.location.hash.replace('#', '');
    if (['home', 'auth', 'profile', 'workspace'].includes(hash)) {
      setCurrentView(hash as any);
    }
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (['home', 'auth', 'profile', 'workspace'].includes(newHash)) {
        setCurrentView(newHash as any);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: 'home' | 'auth' | 'profile' | 'workspace') => {
    setCurrentView(view);
    window.location.hash = view;
  };

  useEffect(() => {
    if (activeNotebook) {
      fetchSources(activeNotebook.id);
      fetchChats(activeNotebook.id);
    }
  }, [activeNotebook]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, chatLoading]);

  const fetchNotebooks = async () => {
    try {
      const res = await axios.get('/api/notebooks');
      setNotebooks(res.data);
      if (res.data.length > 0) {
        setActiveNotebook(res.data[0]);
      }
    } catch (err) {
      console.warn('Error loading notebooks:', err);
    }
  };

  const fetchSources = async (nbId: string) => {
    try {
      const res = await axios.get(`/api/notebooks/${nbId}/sources`);
      setSources(res.data);
    } catch (err) {
      console.warn('Error loading sources:', err);
    }
  };

  const fetchChats = async (nbId: string) => {
    try {
      const res = await axios.get(`/api/notebooks/${nbId}/chats`);
      setChats(res.data);
    } catch (err) {
      console.warn('Error loading chats:', err);
    }
  };

  const handleToggleSource = async (sourceId: string) => {
    try {
      const res = await axios.patch(`/api/sources/${sourceId}/toggle`);
      setSources(sources.map(s => s.id === sourceId ? res.data : s));
    } catch (err) {
      console.warn('Error toggling source:', err);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    try {
      await axios.delete(`/api/sources/${sourceId}`);
      setSources(sources.filter(s => s.id !== sourceId));
    } catch (err) {
      console.warn('Error deleting source:', err);
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || !activeNotebook || chatLoading) return;

    setInputQuery('');
    setChatLoading(true);

    // Optimistic user chat addition
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      notebookId: activeNotebook.id,
      sender: 'user',
      text: q,
      timestamp: new Date().toISOString()
    };
    setChats(prev => [...prev, tempUserMsg]);

    try {
      const res = await axios.post(`/api/notebooks/${activeNotebook.id}/chat`, {
        question: q,
        socraticMode
      });
      setChats(prev => [...prev.filter(c => c.id !== tempUserMsg.id), tempUserMsg, res.data]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        notebookId: activeNotebook.id,
        sender: 'ai',
        text: '⚠️ An error occurred while generating grounded response. Please verify active sources.',
        timestamp: new Date().toISOString()
      };
      setChats(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const activeSourcesCount = sources.filter(s => s.active).length;

  if (currentView === 'home') {
    return (
      <HomePage
        onNavigateAuth={() => navigateTo('auth')}
        onNavigateProfile={() => navigateTo('profile')}
        onNavigateWorkspace={() => navigateTo('workspace')}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPage
        onNavigateHome={() => navigateTo('home')}
        onLoginSuccess={(u) => {
          if (u) {
            setCurrentUser(prev => ({
              ...prev,
              name: u.name || prev.name,
              email: u.email || prev.email,
            }));
          }
          navigateTo('profile');
        }}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={currentUser}
        notebooks={notebooks}
        onNavigateHome={() => navigateTo('home')}
        onNavigateWorkspace={(nb) => {
          if (nb) setActiveNotebook(nb);
          navigateTo('workspace');
        }}
        onSignOut={() => {
          navigateTo('home');
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] overflow-auto font-sans">
      {/* Top Navigation Header */}
      <Header
        notebooks={notebooks}
        activeNotebook={activeNotebook}
        onSelectNotebook={(nb) => setActiveNotebook(nb)}
        onOpenNewNotebookModal={() => setIsUploadOpen(true)}
        socraticMode={socraticMode}
        onToggleSocraticMode={() => setSocraticMode(!socraticMode)}
        onOpenAudioOverview={() => setIsAudioOpen(true)}
        onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
        onNavigateHome={() => navigateTo('home')}
        onNavigateProfile={() => navigateTo('profile')}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: Document Sources Panel */}
        <aside className="w-72 border-r border-[#27272a] bg-[#0c0c0e] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#dd6b47]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Sources ({sources.length})</h2>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold flex items-center space-x-1 shadow-md transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sources.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-[#27272a] rounded-xl space-y-2">
                <UploadCloud className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-medium text-zinc-400">No sources added yet.</p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="text-xs text-[#dd6b47] hover:underline font-semibold"
                >
                  Upload PDFs or Study Notes
                </button>
              </div>
            ) : (
              sources.map((src) => (
                <div
                  key={src.id}
                  className={`p-3 rounded-xl border transition group flex flex-col justify-between ${
                    src.active
                      ? 'bg-[#141418] border-[#dd6b47]/40 shadow-sm'
                      : 'bg-[#0e0e11] border-[#222226] opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <span className="text-base">{src.type === 'pdf' ? '📕' : '📝'}</span>
                      <span className="text-xs font-semibold text-zinc-200 truncate">{src.title}</span>
                    </div>

                    <button
                      onClick={() => handleToggleSource(src.id)}
                      className={`text-zinc-400 hover:text-white transition ${src.active ? 'text-[#dd6b47]' : ''}`}
                      title={src.active ? 'Disable Source for RAG' : 'Enable Source for RAG'}
                    >
                      {src.active ? <ToggleRight className="w-5 h-5 text-[#dd6b47]" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#27272a] text-[10px] text-zinc-400">
                    <span className="bg-[#1c1c22] px-1.5 py-0.5 rounded text-[#dd6b47] font-mono">
                      {src.chunkCount} RAG Chunks
                    </span>
                    <button
                      onClick={() => handleDeleteSource(src.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition"
                      title="Delete Source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Status Footer */}
          <div className="p-3 border-t border-[#27272a] bg-[#09090b] text-[10px] text-zinc-400 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${activeSourcesCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{activeSourcesCount} Active Grounding Sources</span>
            </span>
          </div>
        </aside>

        {/* CENTER MAIN PANE: RAG Conversational Engine */}
        <main className="flex-1 flex flex-col bg-[#09090b] relative">
          {/* Socratic Mode Banner */}
          {socraticMode && (
            <div className="bg-[#321d15] border-b border-[#4f3327] px-4 py-2 flex items-center justify-between text-xs text-[#dd6b47]">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-[#dd6b47] animate-pulse" />
                <span className="font-semibold">Socratic Tutor Mode Activated</span>
                <span className="text-zinc-300 opacity-90 text-[11px]">— The AI will ask probing questions to test critical thinking.</span>
              </div>
              <button onClick={() => setSocraticMode(false)} className="text-[#dd6b47] hover:text-white text-[11px] underline">
                Turn Off
              </button>
            </div>
          )}

          {/* Chat History Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                    chat.sender === 'user'
                      ? 'bg-[#dd6b47] text-white rounded-br-none font-medium'
                      : 'bg-[#121215] border border-[#27272a] text-zinc-200 rounded-bl-none'
                  }`}
                >
                  {/* AI Badge Header */}
                  {chat.sender === 'ai' && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#27272a]">
                      <div className="flex items-center space-x-1.5 text-[#dd6b47] font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Smart Assistant {chat.socraticMode ? '(Socratic Tutor)' : '(Grounded RAG)'}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {chat.text}
                  </div>

                  {/* Grounded Citations Badges */}
                  {chat.citations && chat.citations.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#27272a] flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold text-[#dd6b47] uppercase tracking-wider self-center mr-1">
                        Citations:
                      </span>
                      {chat.citations.map((cit, idx) => (
                        <CitationPopover key={idx} citation={cit} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center space-x-2 text-xs text-[#dd6b47] bg-[#121215] border border-[#27272a] rounded-xl p-3 max-w-xs animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Searching vector store & synthesizing answer...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts Pill Container */}
          <div className="px-4 py-2 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
            <span className="text-zinc-500 shrink-0 font-semibold">Suggested:</span>
            <button
              onClick={() => handleSendQuery('Summarize the core concepts in the active documents.')}
              className="px-3 py-1 bg-[#141418] hover:bg-[#1d1d22] border border-[#27272a] rounded-full text-zinc-300 shrink-0 transition"
            >
              💡 Summarize Core Concepts
            </button>
            <button
              onClick={() => handleSendQuery('What are the key technical objectives and methodology?')}
              className="px-3 py-1 bg-[#141418] hover:bg-[#1d1d22] border border-[#27272a] rounded-full text-zinc-300 shrink-0 transition"
            >
              🎯 Technical Objectives & Methodology
            </button>
            <button
              onClick={() => handleSendQuery('How does the RAG retrieval pipeline calculate citations?')}
              className="px-3 py-1 bg-[#141418] hover:bg-[#1d1d22] border border-[#27272a] rounded-full text-zinc-300 shrink-0 transition"
            >
              📚 RAG Citation Calculation
            </button>
          </div>

          {/* Chat Query Bar */}
          <div className="p-4 border-t border-[#27272a] bg-[#0c0c0e]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  socraticMode
                    ? 'Ask a question for Socratic guided feedback...'
                    : 'Ask anything about your study notes...'
                }
                className="w-full bg-[#121215] border border-[#27272a] rounded-2xl py-3 pl-4 pr-12 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#dd6b47] shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || chatLoading}
                className="absolute right-2 p-2 rounded-xl bg-[#dd6b47] hover:bg-[#c85330] text-white disabled:opacity-40 transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Active Recall Studio & Briefings */}
        <aside className="w-80 border-l border-[#27272a] bg-[#0c0c0e] flex flex-col shrink-0">
          {/* Tab Navigation Header */}
          <div className="flex border-b border-[#27272a] bg-[#09090b] p-1">
            <button
              onClick={() => setActiveRightTab('quiz')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition ${
                activeRightTab === 'quiz' ? 'bg-[#dd6b47] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI Quiz</span>
            </button>

            <button
              onClick={() => setActiveRightTab('flashcards')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition ${
                activeRightTab === 'flashcards' ? 'bg-[#dd6b47] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveRightTab('briefing')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition ${
                activeRightTab === 'briefing' ? 'bg-[#dd6b47] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Briefing</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeRightTab === 'quiz' && activeNotebook && (
              <QuizView notebookId={activeNotebook.id} />
            )}

            {activeRightTab === 'flashcards' && activeNotebook && (
              <FlashcardView notebookId={activeNotebook.id} />
            )}

            {activeRightTab === 'briefing' && (
              <div className="p-4 space-y-4 text-xs">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                    <Bookmark className="w-4 h-4" />
                    <h4>Notebook Executive Briefing</h4>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    This notebook compiles active materials grounded with semantic vector embeddings. Every answer and quiz question is indexed directly to your uploaded sources.
                  </p>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Total Active Documents:</span>
                      <span className="font-bold text-slate-200">{activeSourcesCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Active Recall Flashcards:</span>
                      <span className="font-bold text-slate-200">5 SM-2 Decks</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Modals */}
      {activeNotebook && (
        <>
          <SourceUploadModal
            notebookId={activeNotebook.id}
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onSourceUploaded={() => {
              fetchSources(activeNotebook.id);
            }}
          />

          <AudioOverviewPlayer
            notebookId={activeNotebook.id}
            isOpen={isAudioOpen}
            onClose={() => setIsAudioOpen(false)}
          />

          <CollaborativeRoomModal
            isOpen={isStudyRoomOpen}
            onClose={() => setIsStudyRoomOpen(false)}
          />
        </>
      )}
    </div>
  );
};
