import React, { useState } from 'react';
import { 
  Sparkles, Search, ArrowRight, CheckCircle2, ChevronRight, 
  BarChart3, Globe, TrendingUp, ShieldCheck, Zap, Bot, 
  Layers, Users, Star, ArrowUpRight, Check, HelpCircle,
  ChevronDown, MessageSquare, Terminal, RefreshCw,
  ExternalLink, FileText, Share2, Compass, Award, Activity,
  BookOpen, BrainCircuit, Headphones, Flame
} from 'lucide-react';

interface HomePageProps {
  onNavigateAuth: () => void;
  onNavigateProfile: () => void;
  onNavigateWorkspace: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateAuth,
  onNavigateProfile,
  onNavigateWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'prioritize' | 'monitor'>('drafts');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [searchQuery, setSearchQuery] = useState('best AI study assistant for medical research synthesis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setScannedResult(`Prompt verified! 89% citation density indexed across ChatGPT, Gemini, and Claude.`);
    }, 850);
  };

  const faqs = [
    {
      q: "How does Smart Research Assistant ground responses in my documents?",
      a: "Our RAG (Retrieval-Augmented Generation) pipeline chunks, indexes, and semantically embeds your uploaded PDFs, web articles, and research papers. Every answer provides clickable source citations directly pointing to the exact page and excerpt."
    },
    {
      q: "What is Socratic Tutor mode?",
      a: "Instead of simply giving you static answers, Socratic mode acts as an active intellectual coach. It asks probing questions, tests conceptual comprehension, and helps you internalize complex logic."
    },
    {
      q: "Can I generate interactive audio podcast overviews?",
      a: "Yes! With our Audio Overview engine, your uploaded documents are converted into dynamic two-host audio discussions that synthesize key takeaways and debate nuances."
    },
    {
      q: "How does AI Search Visibility & Citation tracking work?",
      a: "Smart Research Assistant runs continuous prompt audits across leading frontier models (ChatGPT, Gemini 1.5 Pro, Perplexity, Claude 3.5), measuring citation share of voice and recommending knowledge base enhancements."
    },
    {
      q: "Can study groups collaborate in real-time rooms?",
      a: "Yes. Our Collaborative Study Rooms feature synchronized notebook exploration, live multiplayer chat, and shared flashcard review decks."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#dd6b47]/30 selection:text-white">
      {/* Top Banner Notice */}
      <div className="border-b border-[#27272a] bg-[#121215] px-4 py-2.5 text-center text-xs text-zinc-300 flex items-center justify-center gap-2">
        <span className="rounded-[5px] border border-[#4f3327] bg-[#321d15] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#dd6b47] uppercase">
          NEW v2.4
        </span>
        <span className="text-zinc-300">
          Smart Research Assistant with Multimodal RAG, Audio Podcasts &amp; AI Citation Radar
        </span>
        <button 
          onClick={onNavigateWorkspace}
          className="text-[#dd6b47] hover:text-[#ea7d5c] font-semibold inline-flex items-center gap-1 ml-1 transition"
        >
          Launch Assistant <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#27272a]/90 bg-[#09090b]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#dd6b47] to-[#ec5c2e] flex items-center justify-center shadow-lg shadow-[#dd6b47]/20 group-hover:scale-105 transition-transform text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight text-white font-bold">
                  Smart Research Assistant
                </span>
                <span className="text-[10px] text-[#dd6b47] font-semibold tracking-wider uppercase">
                  NotebookLLM RAG Engine
                </span>
              </div>
            </a>

            <nav className="hidden lg:flex items-center ml-10 space-x-1 text-sm font-medium">
              <a href="#features" className="px-3.5 py-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-[#18181b] transition">
                Features
              </a>
              <div className="relative group">
                <button className="px-3.5 py-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-[#18181b] flex items-center gap-1 transition">
                  Capabilities <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="invisible group-hover:visible absolute top-full left-0 w-64 pt-2 z-50 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="rounded-xl border border-[#27272a] bg-[#121215] p-2 shadow-2xl backdrop-blur-xl">
                    <button onClick={onNavigateWorkspace} className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#1c1c20] transition text-left">
                      <div className="w-7 h-7 rounded-lg bg-[#321d15] text-[#dd6b47] flex items-center justify-center text-xs font-bold shrink-0">
                        RAG
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Document Synthesis</div>
                        <div className="text-[10px] text-zinc-400">PDF semantic search &amp; citations</div>
                      </div>
                    </button>
                    <button onClick={onNavigateWorkspace} className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#1c1c20] transition text-left">
                      <div className="w-7 h-7 rounded-lg bg-[#321d15] text-[#dd6b47] flex items-center justify-center text-xs font-bold shrink-0">
                        SOC
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Socratic Tutor</div>
                        <div className="text-[10px] text-zinc-400">Adaptive interactive feedback</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <a href="#faq" className="px-3.5 py-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-[#18181b] transition">
                FAQ
              </a>
            </nav>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Workspace Switch */}
            <button
              onClick={onNavigateWorkspace}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1d1d22] border border-[#27272a] text-xs font-medium text-zinc-200 transition"
              title="Open Research Workspace"
            >
              <Bot className="w-3.5 h-3.5 text-[#dd6b47]" />
              <span>Workspace</span>
            </button>

            {/* Profile Navigation Button */}
            <button
              onClick={onNavigateProfile}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141417] hover:bg-[#1d1d22] border border-[#27272a] text-xs font-medium text-zinc-200 transition"
              title="View Person Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#dd6b47] text-white flex items-center justify-center text-[10px] font-bold">
                AT
              </div>
              <span className="hidden md:inline">Aishanya Tripathi</span>
            </button>

            {/* Sign in Button */}
            <button
              onClick={onNavigateAuth}
              className="h-9 px-4 rounded-lg bg-[#141417] hover:bg-[#202026] border border-[#27272a] text-xs sm:text-sm font-medium text-zinc-200 transition"
            >
              Sign In
            </button>

            {/* Get Started Button (Terracotta theme matching template) */}
            <button
              onClick={onNavigateAuth}
              className="h-9 px-4 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#dd6b47]/25 transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-grid-pattern">
          {/* Subtle Warm Terracotta Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[380px] bg-[#dd6b47]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#321d15]/50 rounded-full blur-[110px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#4f3327] bg-[#321d15]/80 text-[#dd6b47] text-xs font-semibold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen RAG Knowledge Engine &amp; AI Search Visibility</span>
              <ChevronRight className="w-3 h-3 text-[#dd6b47]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
              Get recommended by <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#dd6b47]">
                ChatGPT, Gemini &amp; AI Search
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Synthesize multi-source research notes, test your mastery with Socratic dialogues, and track exactly how frontier AI engines cite your knowledge base.
            </p>

            {/* Interactive Prompt Scanner Box */}
            <form onSubmit={handleRunScan} className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center p-1.5 rounded-xl border border-[#27272a] bg-[#121215]/95 shadow-2xl backdrop-blur-xl focus-within:border-[#dd6b47] focus-within:ring-2 focus-within:ring-[#dd6b47]/20 transition">
                <Search className="w-5 h-5 text-zinc-500 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter a research topic or question to scan AI citations..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] disabled:opacity-50 text-white text-xs font-semibold shrink-0 transition flex items-center gap-2 shadow-md shadow-[#dd6b47]/25"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <span>Scan Topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {scannedResult && (
                <div className="mt-3 p-3 rounded-lg bg-[#142318] border border-[#234b2c] text-emerald-300 text-xs text-left flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{scannedResult}</span>
                </div>
              )}

              {/* Prompt Pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
                <span className="text-zinc-500">Popular queries:</span>
                {['"Quantum Computing Foundations"', '"Socratic Active Recall"', '"RAG Pipeline Benchmarks"', '"Transformer Attention Mechanisms"'].map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSearchQuery(pill.replace(/"/g, ''))}
                    className="px-2.5 py-1 rounded-md bg-[#141417] hover:bg-[#1d1d22] border border-[#27272a] text-zinc-300 transition"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </form>

            {/* Hero Dashboard Preview Card */}
            <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-[#27272a] bg-[#101014] shadow-[0_20px_80px_-15px_rgba(221,107,71,0.2)] overflow-hidden backdrop-blur-xl text-left">
              {/* Mock Window Header */}
              <div className="h-11 border-b border-[#27272a] bg-[#0c0c0e] px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-zinc-400 font-mono ml-2">assistant-dashboard // ai-citation-matrix.live</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#4f3327] bg-[#321d15] text-[10px] text-[#dd6b47] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#dd6b47] animate-pulse" />
                    ACTIVE RAG CRAWLER
                  </span>
                </div>
              </div>

              {/* Dashboard Content Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="p-4 rounded-xl border border-[#27272a] bg-[#141418]">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>AI Share of Voice</span>
                    <TrendingUp className="w-4 h-4 text-[#dd6b47]" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">82.4%</div>
                  <div className="mt-2 text-xs text-[#dd6b47] flex items-center gap-1 font-medium">
                    <span>+16.8%</span> <span className="text-zinc-500">vs last 30 days</span>
                  </div>
                  <div className="w-full bg-[#202026] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#dd6b47] h-full rounded-full" style={{ width: '82.4%' }} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl border border-[#27272a] bg-[#141418]">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Ranked Citations</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">4,120</div>
                  <div className="mt-2 text-xs text-zinc-300 font-medium">
                    <span>Across 195+ Study Topics</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-400">
                    <span>ChatGPT: <strong className="text-white">91%</strong></span>
                    <span>Gemini: <strong className="text-white">84%</strong></span>
                    <span>Claude: <strong className="text-white">88%</strong></span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl border border-[#27272a] bg-[#141418]">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>Recall Accuracy</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white">98.2%</div>
                  <div className="mt-2 text-xs text-emerald-400 font-medium">
                    <span>Zero Hallucination Grounding</span>
                  </div>
                  <div className="w-full bg-[#202026] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.2%' }} />
                  </div>
                </div>

                {/* Main Interactive AI Query Breakdown */}
                <div className="md:col-span-3 rounded-xl border border-[#27272a] bg-[#141418] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-zinc-200">
                      Top Verified Prompts &amp; Citations in Frontier Models
                    </div>
                    <button 
                      onClick={onNavigateWorkspace}
                      className="text-xs text-[#dd6b47] hover:text-[#ea7d5c] font-medium inline-flex items-center gap-1"
                    >
                      Open Assistant Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#27272a] text-zinc-400">
                          <th className="pb-2 font-medium">Topic / Question</th>
                          <th className="pb-2 font-medium">Primary Source</th>
                          <th className="pb-2 font-medium">ChatGPT</th>
                          <th className="pb-2 font-medium">Gemini 1.5</th>
                          <th className="pb-2 font-medium">Perplexity</th>
                          <th className="pb-2 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272a]/60">
                        <tr>
                          <td className="py-2.5 font-medium text-zinc-200">"Best platform for synthesizing literature reviews"</td>
                          <td className="py-2.5 text-[#dd6b47]">#1 Top Recommended</td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5 text-right"><span onClick={onNavigateWorkspace} className="text-zinc-400 hover:text-white cursor-pointer font-medium">Inspect</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-zinc-200">"Interactive Socratic study tutor with audio overview"</td>
                          <td className="py-2.5 text-[#dd6b47]">#1 Featured Citation</td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#321d15] text-[#dd6b47] font-mono">Rank #2</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5 text-right"><span onClick={onNavigateWorkspace} className="text-zinc-400 hover:text-white cursor-pointer font-medium">Inspect</span></td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-medium text-zinc-200">"NotebookLLM alternative with MERN stack &amp; flashcards"</td>
                          <td className="py-2.5 text-[#dd6b47]">#1 Cited Resource</td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#321d15] text-[#dd6b47] font-mono">Rank #2</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-[#162a1b] text-emerald-300 font-mono">Rank #1</span></td>
                          <td className="py-2.5 text-right"><span onClick={onNavigateWorkspace} className="text-zinc-400 hover:text-white cursor-pointer font-medium">Inspect</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos & Social Proof */}
        <section className="py-12 border-y border-[#27272a] bg-[#0c0c0e]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-6">
              Empowering forward-thinking researchers &amp; study groups
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-60">
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">STANFORD AI LAB</span>
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">MIT CSAIL</span>
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">LINEAR</span>
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">NOTION</span>
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">SCALE AI</span>
              <span className="text-sm md:text-base font-bold tracking-wider text-zinc-300">VERCEL</span>
            </div>
          </div>
        </section>

        {/* Feature Grid: Everything You Need to Accelerate Research */}
        <section id="features" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything you need to <br className="hidden sm:block" />
              <span className="text-[#dd6b47]">
                master complex research and win AI search
              </span>
            </h2>
            <p className="mt-4 text-zinc-400 text-base">
              A streamlined intelligence suite combining generative search citation analytics with deep multi-source document RAG.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ask the agent anything</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Ground every response in your actual documents. Our RAG engine guarantees zero hallucinations with clickable inline citations.
              </p>
              <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] text-xs font-mono text-zinc-300">
                &gt; "Cite sources from lecture 4 on backpropagation"
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Works with your stack</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Upload PDFs, research papers, ArXiv preprints, Google Drive documents, or web URLs with automatic chunking and vector indexing.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#dd6b47]">
                <Check className="w-4 h-4 text-emerald-400" /> Multi-format embeddings
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Audio Podcast Overviews</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Turn dense textbooks and research papers into lively two-host audio debates with animated soundwave visualizers.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400" /> Multi-speaker synthetic synthesis
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Socratic Guided Tutor</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Active recall mode that challenges you with probing conceptual questions instead of handing out passive answers.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Collaborative Study Rooms</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Sync notebooks, real-time audio podcast discussions, and collaborative study rooms with synchronized chat and shared flashcards.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 hover:border-[#38383e] transition">
              <div className="w-10 h-10 rounded-xl bg-[#321d15] text-[#dd6b47] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero-Training Privacy</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                Your private notes and internal documents are never used to train public LLM models. Encrypted, localized RAG pipeline.
              </p>
            </div>
          </div>
        </section>

        {/* Deep Dive Tabs */}
        <section className="py-20 bg-[#0c0c0e] border-y border-[#27272a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-white">
                Track the right prompts, then act on them first
              </h2>
              <p className="text-zinc-400 text-sm mt-3">
                Switch seamlessly between synthetic prompt simulations, ranking improvements, and multi-model radar.
              </p>
              
              {/* Tab Selector */}
              <div className="inline-flex p-1 rounded-xl bg-[#141417] border border-[#27272a] mt-6">
                <button
                  onClick={() => setActiveTab('drafts')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'drafts' 
                      ? 'bg-[#dd6b47] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Draft follow-ups in seconds
                </button>
                <button
                  onClick={() => setActiveTab('prioritize')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'prioritize' 
                      ? 'bg-[#dd6b47] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Prioritize what moves rankings
                </button>
                <button
                  onClick={() => setActiveTab('monitor')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'monitor' 
                      ? 'bg-[#dd6b47] text-white shadow-md' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Cross-Model Radar
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 md:p-8 max-w-4xl mx-auto">
              {activeTab === 'drafts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                    <div className="text-sm font-semibold text-white">Automated Answer Synthesis</div>
                    <span className="text-xs text-[#dd6b47] bg-[#321d15] border border-[#4f3327] px-2.5 py-1 rounded-full">
                      GPT-4o &amp; Claude 3.5 Sonnet
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Based on recent model responses, your study guide on <em>"Algorithmic Complexity"</em> was missing a comparative Big-O table. Smart Research Assistant has auto-drafted the citation-ready markdown block below:
                  </p>
                  <pre className="p-4 rounded-xl bg-[#09090b] font-mono text-xs text-[#e79174] overflow-x-auto border border-[#27272a]">
{`### Key Takeaway for AI Reasoning Models:
- Best-case search: O(1) via Hash Table mapping
- Worst-case tree traversal: O(N) un-balanced vs O(log N) Red-Black Tree
Citation: [Smart Research Assistant - Lecture Notes v2]`}
                  </pre>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={onNavigateWorkspace}
                      className="px-4 py-2 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold transition shadow-md"
                    >
                      Insert into Research Notebook
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'prioritize' && (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-white">High-Impact Prompts to Optimize This Week</div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">"What is the best alternative to NotebookLM?"</div>
                        <div className="text-[11px] text-zinc-500">Opportunity: High volume (18.4K queries/mo)</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#321d15] border border-[#4f3327] text-[#dd6b47] text-xs font-semibold">
                        Current Rank: #1
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">"How to generate audio podcasts from lecture slides"</div>
                        <div className="text-[11px] text-zinc-500">Opportunity: High intent (6.2K queries/mo)</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#162a1b] border border-[#234b2c] text-emerald-300 text-xs font-semibold">
                        Current Rank: #1
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monitor' && (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-white">Cross-Model Citation Share of Voice</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                      <div className="text-xs text-zinc-400">Your Share</div>
                      <div className="text-xl font-bold text-[#dd6b47]">84.2%</div>
                      <div className="text-[10px] text-emerald-400">+6.4% this week</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                      <div className="text-xs text-zinc-400">Competitors</div>
                      <div className="text-xl font-bold text-zinc-300">11.1%</div>
                      <div className="text-[10px] text-rose-400">-4.2% this week</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                      <div className="text-xs text-zinc-400">Unattributed</div>
                      <div className="text-xl font-bold text-zinc-500">4.7%</div>
                      <div className="text-[10px] text-zinc-500">Generic answers</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>


        {/* FAQ Accordion Section */}
        <section id="faq" className="py-20 bg-[#0c0c0e] border-t border-[#27272a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white">
                Frequently asked questions
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Everything you need to know about Smart Research Assistant, citation tracking, and privacy.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className="rounded-xl border border-[#27272a] bg-[#121215]/80 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between font-semibold text-sm text-zinc-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${openFaq === idx ? 'rotate-180 text-[#dd6b47]' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-[#27272a] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#181214] via-[#0e0d10] to-[#09090b]">
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Your users are already asking AI. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#dd6b47]">
                Make sure your research answers with clarity.
              </span>
            </h2>
            <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-xl mx-auto">
              Start synthesizing high-impact study notebooks and tracking frontier model citations today.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onNavigateAuth}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#dd6b47] hover:bg-[#c85330] text-white font-semibold text-sm shadow-xl shadow-[#dd6b47]/25 transition flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateWorkspace}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141417] hover:bg-[#1d1d22] border border-[#27272a] text-zinc-200 font-semibold text-sm transition"
              >
                Open Research Workspace
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#27272a] bg-[#09090b] py-12 text-zinc-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-base mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#dd6b47] flex items-center justify-center text-xs text-white">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>Smart Research Assistant</span>
            </div>
            <p className="text-zinc-400 max-w-xs text-xs mb-4">
              AI-powered study and research companion inspired by NotebookLM with RAG pipeline and MERN architecture.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-[#4f3327] bg-[#321d15] text-[#dd6b47] text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#dd6b47]" />
              All Systems Operational
            </div>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Features</div>
            <ul className="space-y-2">
              <li><button onClick={onNavigateWorkspace} className="hover:text-white transition">RAG Assistant</button></li>
              <li><button onClick={onNavigateWorkspace} className="hover:text-white transition">Audio Podcasts</button></li>
              <li><button onClick={onNavigateWorkspace} className="hover:text-white transition">Socratic Tutor</button></li>
              <li><button onClick={onNavigateProfile} className="hover:text-white transition">Profile Dashboard</button></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Resources</div>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#features" className="hover:text-white transition">Citation Guide</a></li>

            </ul>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Account</div>
            <ul className="space-y-2">
              <li><button onClick={onNavigateAuth} className="hover:text-white transition">Sign In</button></li>
              <li><button onClick={onNavigateProfile} className="hover:text-white transition">User Profile</button></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-xs">
          <div>© 2026 Smart Research Assistant. All rights reserved.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Docs</a>
            <a href="#" className="hover:text-white">Community</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
