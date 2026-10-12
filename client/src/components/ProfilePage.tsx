import React, { useState } from 'react';
import { 
  User, Mail, MapPin, Calendar, BookOpen, Award, Sparkles, 
  Settings, ExternalLink, ChevronLeft, ArrowRight, Share2, 
  FileText, Bot, TrendingUp, CheckCircle, Shield, Key, Bell,
  FolderGit2, Edit3, Save, LogOut
} from 'lucide-react';
import { Notebook } from '../types';

interface ProfilePageProps {
  user?: {
    name: string;
    email: string;
    title?: string;
    bio?: string;
  };
  notebooks: Notebook[];
  onNavigateHome: () => void;
  onNavigateWorkspace: (notebook?: Notebook) => void;
  onSignOut: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user = {
    name: 'Aishanya Tripathi',
    email: 'aishanya.tripathi@example.com',
    title: 'Lead AI Researcher & GEO Strategist',
    bio: 'Pioneering multimodal study synthesis, Socratic automated learning, and Generative Engine Optimization across frontier models.'
  },
  notebooks,
  onNavigateHome,
  onNavigateWorkspace,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notebooks' | 'analytics' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || 'Lead AI Researcher & GEO Strategist');
  const [bio, setBio] = useState(user.bio || 'Pioneering multimodal study synthesis and Socratic automated learning.');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-[#dd6b47]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#27272a] bg-[#09090b]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#141417] border border-[#27272a] hover:bg-[#1f1f25] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <div className="h-4 w-px bg-[#27272a]" />
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#dd6b47]" />
            Researcher Profile
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateWorkspace()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold shadow-md shadow-[#dd6b47]/20 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch Research Assistant</span>
          </button>
          <button
            onClick={onSignOut}
            className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-[#18181b] border border-[#27272a] transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Profile Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div className="relative rounded-2xl border border-[#27272a] bg-[#121215] overflow-hidden backdrop-blur-md mb-8">
          {/* Header Banner Gradient (Terracotta & Carbon) */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-[#241b19] via-[#1c1819] to-[#321d15] relative border-b border-[#27272a]">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied Link!' : 'Share Profile'}</span>
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/10 flex items-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Close' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Profile Details Bar */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
              <div className="flex items-end gap-4">
                {/* Avatar with Status Ring */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#dd6b47] to-[#ec5c2e] p-1 shadow-xl shadow-[#dd6b47]/20">
                    <div className="w-full h-full rounded-[14px] bg-[#101014] flex items-center justify-center text-3xl font-bold text-white uppercase">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AH'}
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121215]" title="Online" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{name}</h1>
                    <span className="px-2.5 py-0.5 rounded-full border border-[#4f3327] bg-[#321d15] text-[#dd6b47] text-[10px] font-bold uppercase tracking-wider">
                      PRO SCHOLAR
                    </span>
                  </div>
                  <p className="text-sm text-[#dd6b47] font-medium">{title}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateWorkspace()}
                  className="px-4 py-2 rounded-xl bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold shadow-md shadow-[#dd6b47]/20 transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Open Study Room</span>
                </button>
              </div>
            </div>

            {/* Editable Bio or Display */}
            {isEditing ? (
              <div className="mt-4 p-4 rounded-xl border border-[#27272a] bg-[#0c0c0e] space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-[#141418] border border-[#27272a] px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#dd6b47]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg bg-[#141418] border border-[#27272a] px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#dd6b47]"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-lg bg-[#141418] border border-[#27272a] px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#dd6b47]"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-300 max-w-3xl leading-relaxed mt-2">
                {bio}
              </p>
            )}

            {/* Info Badges */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#27272a] text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                San Francisco, CA &amp; Remote
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                Member since 2026
              </span>
              <span className="flex items-center gap-1.5 text-[#dd6b47]">
                <Shield className="w-3.5 h-3.5" />
                Verified Scholar #4920
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#121215]">
            <div className="text-xs text-zinc-400 font-medium">AI Citations Indexed</div>
            <div className="text-2xl font-bold text-white mt-1">4,120</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +32% this month
            </div>
          </div>
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#121215]">
            <div className="text-xs text-zinc-400 font-medium">Research Notebooks</div>
            <div className="text-2xl font-bold text-white mt-1">{notebooks.length || 6}</div>
            <div className="text-[11px] text-[#dd6b47] mt-1">Active sync enabled</div>
          </div>
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#121215]">
            <div className="text-xs text-zinc-400 font-medium">Socratic Study Sessions</div>
            <div className="text-2xl font-bold text-white mt-1">134</div>
            <div className="text-[11px] text-amber-400 mt-1">96% quiz mastery</div>
          </div>
          <div className="p-4 rounded-xl border border-[#27272a] bg-[#121215]">
            <div className="text-xs text-zinc-400 font-medium">Model Visibility Score</div>
            <div className="text-2xl font-bold text-[#dd6b47] mt-1">96.4%</div>
            <div className="text-[11px] text-zinc-500 mt-1">Ranked #1 in category</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#27272a] mb-6 space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-[#dd6b47] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Overview &amp; Activity
          </button>
          <button
            onClick={() => setActiveTab('notebooks')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'notebooks'
                ? 'border-[#dd6b47] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Notebooks &amp; Sources ({notebooks.length || 6})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-[#dd6b47] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Search Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-[#dd6b47] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Preferences &amp; Keys
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Pinned Notebooks */}
              <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#dd6b47]" />
                    Pinned Study Notebooks
                  </h3>
                  <button 
                    onClick={() => onNavigateWorkspace()}
                    className="text-xs text-[#dd6b47] hover:text-[#ea7d5c] font-semibold flex items-center gap-1"
                  >
                    Open all <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(notebooks.length > 0 ? notebooks : [
                    { id: '1', title: 'Quantum Computing Foundations', sourcesCount: 4, updatedAt: '2026-03-10' },
                    { id: '2', title: 'Generative Engine Optimization (GEO)', sourcesCount: 7, updatedAt: '2026-03-11' },
                    { id: '3', title: 'Transformer Attention Mechanics', sourcesCount: 3, updatedAt: '2026-03-12' },
                  ]).slice(0, 4).map((nb) => (
                    <div 
                      key={nb.id}
                      onClick={() => onNavigateWorkspace(nb as Notebook)}
                      className="p-3.5 rounded-xl border border-[#27272a] bg-[#0c0c0e] hover:border-[#dd6b47] transition cursor-pointer group"
                    >
                      <div className="text-xs font-semibold text-white group-hover:text-[#dd6b47] transition">
                        📖 {nb.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2">
                        <span>{nb.sourcesCount} indexed sources</span>
                        <span className="text-[#dd6b47] font-medium">Launch →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Research Activity */}
              <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dd6b47]" />
                  Recent Research Log
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#321d15] text-[#dd6b47] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      QZ
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">
                        Completed 10-Question Diagnostic Quiz on Backpropagation
                      </div>
                      <div className="text-[11px] text-zinc-500">Mastery score 95% · 2 hours ago</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#162a1b] text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      SC
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">
                        Completed AI Search Audit for 'Best Socratic Study Assistant'
                      </div>
                      <div className="text-[11px] text-zinc-500">Rank #1 Citation confirmed in ChatGPT · 5 hours ago</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#321d15] text-[#dd6b47] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      AU
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">
                        Synthesized 12-minute Audio Podcast with Socratic debate
                      </div>
                      <div className="text-[11px] text-zinc-500">Two AI voices generated · Yesterday</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-5">
                <h3 className="text-sm font-bold text-white mb-3">Linked AI Engines</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c0c0e] border border-[#27272a]">
                    <span className="font-semibold text-zinc-300">Google Gemini 1.5 Pro</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-[#162a1b] px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c0c0e] border border-[#27272a]">
                    <span className="font-semibold text-zinc-300">OpenAI GPT-4o</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-[#162a1b] px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c0c0e] border border-[#27272a]">
                    <span className="font-semibold text-zinc-300">Claude 3.5 Sonnet</span>
                    <span className="text-emerald-400 font-mono text-[10px] bg-[#162a1b] px-2 py-0.5 rounded">CONNECTED</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#4f3327] bg-[#181315] p-5">
                <div className="text-xs font-bold text-[#dd6b47] uppercase tracking-wider mb-1">
                  STUDY STREAK
                </div>
                <div className="text-2xl font-black text-white">24 Days Active</div>
                <p className="text-xs text-zinc-300 mt-2">
                  You are in the top 3% of researchers conducting active daily Socratic dialogues!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Notebooks */}
        {activeTab === 'notebooks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-300">All Active Research Notebooks</div>
              <button
                onClick={() => onNavigateWorkspace()}
                className="px-3.5 py-1.5 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold shadow-md"
              >
                + New Notebook
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(notebooks.length > 0 ? notebooks : [
                { id: '1', title: 'Quantum Computing Foundations', sourcesCount: 4, updatedAt: '2026-03-10' },
                { id: '2', title: 'Generative Engine Optimization (GEO)', sourcesCount: 7, updatedAt: '2026-03-11' },
                { id: '3', title: 'Transformer Attention Mechanics', sourcesCount: 3, updatedAt: '2026-03-12' },
                { id: '4', title: 'Medical Literature Synthesis (ArXiv)', sourcesCount: 5, updatedAt: '2026-03-13' },
              ]).map((nb) => (
                <div
                  key={nb.id}
                  className="rounded-xl border border-[#27272a] bg-[#121215] p-4 hover:border-[#dd6b47] transition flex flex-col justify-between"
                >
                  <div>
                    <div className="text-base font-bold text-white mb-1">📖 {nb.title}</div>
                    <div className="text-xs text-zinc-400">
                      Last updated {new Date(('updatedAt' in nb && nb.updatedAt) || '2026-03-10').toLocaleDateString()}
                    </div>
                    <div className="mt-3 text-xs text-[#dd6b47]">
                      {nb.sourcesCount} Knowledge Documents Indexed
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigateWorkspace(nb as Notebook)}
                    className="mt-4 w-full py-2 rounded-lg bg-[#1c1c21] hover:bg-[#dd6b47] text-white text-xs font-semibold transition"
                  >
                    Open in Assistant Workspace →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6">
              <h3 className="text-base font-bold text-white mb-2">Model Share of Voice Radar</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Frequency and prominence with which your research papers and brand appear in generative search answers.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-300">Perplexity AI</span>
                    <span className="text-emerald-400">92% Mention Rate</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-300">ChatGPT (GPT-4o)</span>
                    <span className="text-[#dd6b47]">88% Mention Rate</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#dd6b47] h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-300">Google Gemini 1.5 Pro</span>
                    <span className="text-amber-400">84% Mention Rate</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-300">Claude 3.5 Sonnet</span>
                    <span className="text-[#dd6b47]">82% Mention Rate</span>
                  </div>
                  <div className="w-full bg-[#1e1e24] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#dd6b47] h-full rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && (
          <div className="rounded-2xl border border-[#27272a] bg-[#121215] p-6 space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-white">Researcher Preferences</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">Primary Reasoning Model</label>
                <select className="w-full rounded-lg bg-[#0c0c0e] border border-[#27272a] px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#dd6b47]">
                  <option>Gemini 1.5 Pro (Recommended for RAG)</option>
                  <option>Claude 3.5 Sonnet (Deep Socratic synthesis)</option>
                  <option>OpenAI GPT-4o</option>
                  <option>Ollama Local Engine (100% Offline)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1.5">Default Study Mode</label>
                <select className="w-full rounded-lg bg-[#0c0c0e] border border-[#27272a] px-3 py-2 text-zinc-200 focus:outline-none focus:border-[#dd6b47]">
                  <option>Socratic Guided Mode (Asks probing questions)</option>
                  <option>Direct Synthesis (Concise summaries)</option>
                  <option>Quiz &amp; Flashcard Automatic Extraction</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-zinc-200">Daily AI Search Radar Digest</div>
                  <div className="text-zinc-500">Receive alerts when citation frequencies fluctuate</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded accent-[#dd6b47] w-4 h-4" />
              </div>
            </div>

            <button
              onClick={() => alert('Preferences saved!')}
              className="px-5 py-2.5 rounded-lg bg-[#dd6b47] hover:bg-[#c85330] text-white text-xs font-semibold shadow-md transition"
            >
              Save Preferences
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
