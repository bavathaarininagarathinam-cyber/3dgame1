import React from 'react';
import { RotateCcw, HeartOff, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  onRestart: () => void;
  completedCount: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onRestart,
  completedCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden animate-game-shake">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mb-4 text-red-400">
          <HeartOff className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight">
          Expedition Interrupted!
        </h3>
        <p className="text-sm font-semibold text-red-400 mt-1">
          You ran out of lives (0/3 Hearts)
        </p>

        <div className="my-5 p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs sm:text-sm text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Engineer's Field Note:</span>
          </div>
          <p className="leading-relaxed">
            Every master programmer encounters syntax errors and off-by-one bugs.
            You solved <strong className="text-emerald-400">{completedCount} of 6</strong> island clues before falling!
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:brightness-110 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-900/40 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again (Restart Quest)
        </button>
      </div>
    </div>
  );
};
