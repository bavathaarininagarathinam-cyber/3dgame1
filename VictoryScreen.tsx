import React, { useEffect, useState } from 'react';
import { Trophy, Clock, Lightbulb, Heart, RotateCcw, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryScreenProps {
  score: number;
  timeSeconds: number;
  hintsUsed: number;
  heartsRemaining: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  score,
  timeSeconds,
  hintsUsed,
  heartsRemaining,
  bestScore,
  isNewBest,
  onPlayAgain
}) => {
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);

  useEffect(() => {
    sound.playVictory();
    const timer = setTimeout(() => {
      setIsChestOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Compute rank title based on score
  let explorerRank = "Novice Explorer";
  if (score >= 2600) {
    explorerRank = "Legendary Island Architect";
  } else if (score >= 2200) {
    explorerRank = "Master Code Detective";
  } else if (score >= 1800) {
    explorerRank = "Senior Syntax Adventurer";
  } else {
    explorerRank = "Junior Algorithmic Pioneer";
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 border-2 border-yellow-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden text-white animate-fade-in">
      {/* Golden divine light beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* ANIMATED TREASURE CHEST SVG */}
      <div className="relative w-48 h-44 mx-auto my-3 flex items-center justify-center">
        <svg
          viewBox="0 0 200 180"
          className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(245,158,11,0.5)]"
        >
          <defs>
            <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="goldCoins" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="glowGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Golden glow pouring out when open */}
          {isChestOpen && (
            <polygon
              points="100,50 30,0 170,0"
              fill="url(#glowGlow)"
              className="animate-pulse"
            />
          )}

          {/* Chest Base */}
          <rect x="35" y="90" width="130" height="70" rx="8" fill="url(#chestWood)" stroke="#1E293B" strokeWidth="3" />
          {/* Iron corner braces */}
          <rect x="35" y="90" width="16" height="70" rx="2" fill="#334155" />
          <rect x="149" y="90" width="16" height="70" rx="2" fill="#334155" />
          <rect x="92" y="90" width="16" height="70" rx="2" fill="#334155" />

          {/* Glowing Coins inside */}
          {isChestOpen && (
            <g fill="url(#goldCoins)">
              <ellipse cx="100" cy="90" rx="45" ry="12" fill="#FDE047" />
              <circle cx="85" cy="85" r="9" />
              <circle cx="102" cy="82" r="11" />
              <circle cx="118" cy="86" r="9" />
              <circle cx="95" cy="76" r="8" />
              <circle cx="108" cy="74" r="7" />
              {/* Floating coin sparklers */}
              <circle cx="65" cy="55" r="5" fill="#FEF08A" className="animate-bounce" />
              <circle cx="135" cy="50" r="6" fill="#FEF08A" className="animate-pulse" />
              <polygon points="100,45 103,52 110,55 103,58 100,65 97,58 90,55 97,52" fill="#FFFFFF" />
            </g>
          )}

          {/* Chest Lid (Flips open with CSS transition) */}
          <g
            className="transition-all duration-700 ease-out origin-[100px_90px]"
            style={{
              transform: isChestOpen ? 'rotate(-65deg) translateY(-20px)' : 'rotate(0deg)',
            }}
          >
            <path
              d="M 30 90 C 30 40, 170 40, 170 90 Z"
              fill="url(#chestWood)"
              stroke="#1E293B"
              strokeWidth="3"
            />
            {/* Lid Iron Straps */}
            <path d="M 46 90 C 46 48, 54 48, 54 90" stroke="#334155" strokeWidth="8" fill="none" />
            <path d="M 146 90 C 146 48, 154 48, 154 90" stroke="#334155" strokeWidth="8" fill="none" />
            <path d="M 96 90 C 96 42, 104 42, 104 90" stroke="#334155" strokeWidth="8" fill="none" />

            {/* Brass Keyhole Clasp */}
            <rect x="93" y="85" width="14" height="20" rx="3" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="100" cy="92" r="3" fill="#451A03" />
            <polygon points="98,92 102,92 101,98 99,98" fill="#451A03" />
          </g>
        </svg>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Treasure Chamber Unlocked!
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-tight">
          Victory, Explorer!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          You mastered C syntax, loop logic, code debugging, and algorithm patterns to conquer the Isle of C!
        </p>
      </div>

      {/* Rank Badge */}
      <div className="my-5 p-3 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 rounded-2xl border border-amber-500/30 inline-flex items-center gap-3">
        <Award className="w-6 h-6 text-yellow-400 shrink-0" />
        <div className="text-left">
          <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block">
            Conferred Explorer Title
          </span>
          <span className="text-base font-black text-yellow-300 font-sans">
            {explorerRank}
          </span>
        </div>
      </div>

      {/* Score and Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {/* Final Score */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Score</span>
          </div>
          <span className="text-2xl font-black text-yellow-300 font-mono tabular-nums">
            {score.toLocaleString()}
          </span>
          {isNewBest && (
            <span className="block text-[10px] font-bold text-emerald-400 mt-0.5">
              ⭐ New High Score!
            </span>
          )}
        </div>

        {/* Time Taken */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-center gap-1 text-sky-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Time</span>
          </div>
          <span className="text-xl font-black text-sky-300 font-mono tabular-nums">
            {formatTime(timeSeconds)}
          </span>
        </div>

        {/* Hearts Left */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Lives Left</span>
          </div>
          <span className="text-xl font-black text-red-400 font-mono tabular-nums">
            {heartsRemaining}/3
          </span>
        </div>

        {/* Hints Used */}
        <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Lightbulb className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Hints</span>
          </div>
          <span className="text-xl font-black text-amber-300 font-mono tabular-nums">
            {hintsUsed}
          </span>
        </div>
      </div>

      {bestScore > 0 && (
        <p className="text-xs text-slate-400 font-mono mb-4">
          All-time Personal Best: <strong className="text-amber-400">{bestScore.toLocaleString()}</strong>
        </p>
      )}

      {/* Play Again Button */}
      <button
        onClick={() => {
          sound.playClick();
          onPlayAgain();
        }}
        className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
      >
        <RotateCcw className="w-5 h-5" />
        Play Again (New Expedition)
      </button>
    </div>
  );
};
