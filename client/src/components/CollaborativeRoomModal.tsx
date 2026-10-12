import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, X, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import axios from 'axios';
import { StudyRoom } from '../types';

interface CollaborativeRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollaborativeRoomModal: React.FC<CollaborativeRoomModalProps> = ({ isOpen, onClose }) => {
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get('/api/study-rooms');
      if (res.data.length > 0) {
        setRoom(res.data[0]);
      }
    } catch (err) {
      console.warn('Error fetching room:', err);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !userName) {
      setError('Please enter both room code and your name');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/study-rooms/join', { code: joinCode, userName });
      setRoom(res.data);
      setJoinCode('');
      setUserName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join study room');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden glass-panel animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Collaborative Study Room</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {room && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{room.name}</h4>
                  <p className="text-[10px] text-slate-400">Host: {room.host}</p>
                </div>
                <div className="flex items-center space-x-1.5 bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  <span>Code: {room.code}</span>
                  <button onClick={copyCode} className="hover:text-white ml-1">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Active Participants List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Connected Students ({room.participants.length}):</span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real-time Sync</span>
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {room.participants.map((person, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs">
                      <div className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold text-[9px] flex items-center justify-center">
                        {person.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 truncate">{person}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Join Room Form */}
          <form onSubmit={handleJoin} className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-300">Join Another Study Room</p>

            {error && (
              <p className="text-[11px] text-rose-400 bg-rose-950/60 p-2 rounded border border-rose-800">{error}</p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Room Code (STUDY-7892)"
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Full Name"
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition flex items-center justify-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Joining...' : 'Join Study Session'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
