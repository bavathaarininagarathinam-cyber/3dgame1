import React from 'react';
import { Heart, Volume2, VolumeX, HelpCircle, RotateCcw, Trophy, Clock } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderHudProps {
  score: number;
  hearts: number;
  maxHearts: number;
  timeSeconds: number;
  bestScore: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
  onRestartGame: () => void;
  isHeartDamaged: boolean;
}

export const HeaderHud: React.FC<HeaderHudProps> = ({
  score,
  hearts,
  maxHearts,
  timeSeconds,
  bestScore,
  isMuted,
  onToggleSound,
  onOpenHowToPlay,
  onRestartGame,
  isHeartDamaged
}) => {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-slate-900/95 text-white border-b-2 border-amber-500/40 backdrop-blur-md sticky top-0 z-40 shadow-xl px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-lg">
            🗺️
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-amber-300 font-sans uppercase flex items-center gap-2">
              Code Quest
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Treasure Hunt
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden md:block">
              For 1st Year Computer Engineering Explorers
            </p>
          </div>
        </div>

        {/* Meters Zone: Hearts, Score, Timer */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Hearts Meter */}
          <div className={`flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 ${isHeartDamaged ? 'animate-game-shake border-red-500' : ''}`}>
            <span className="text-xs font-semibold text-slate-300 mr-1 hidden sm:inline">Lives:</span>
            {Array.from({ length: maxHearts }).map((_, idx) => {
              const filled = idx < hearts;
              return (
                <Heart
                  key={idx}
                  className={`w-5 h-5 transition-all duration-300 ${
                    filled
                      ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]'
                      : 'text-slate-600 fill-slate-800 scale-90 opacity-40'
                  }`}
                />
              );
            })}
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium leading-none">SCORE</span>
              <span className="text-sm sm:text-base font-extrabold text-yellow-400 font-mono tabular-nums leading-none mt-0.5">
                {score.toLocaleString()}
              </span>
            </div>
            {bestScore > 0 && (
              <span className="text-[11px] text-slate-400 font-mono hidden lg:inline ml-1">
                (Best: {bestScore})
              </span>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-xs sm:text-sm font-semibold font-mono tabular-nums text-sky-300">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* How to Play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            title="How to Play"
            aria-label="How to play instructions"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={() => {
              sound.playClick();
              onRestartGame();
            }}
            title="Restart Hunt"
            aria-label="Restart game"
            className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
