import React from 'react';
import { X, MapPin, Heart, Lightbulb, Key, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border-2 border-amber-500/40 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="text-lg font-black tracking-tight">How to Play Code Quest</h3>
              <p className="text-xs text-amber-100">Explorer's Guide for Computer Engineering</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block font-bold text-sm">1. Follow the Island Trail</strong>
              <p className="text-slate-600 text-xs mt-0.5">
                Journey through 6 sequential locations: Beach, Jungle, Cave, Waterfall, Ancient Temple, and the Treasure Chamber.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Heart className="w-5 h-5 text-red-500 fill-red-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block font-bold text-sm">2. Guard Your 3 Hearts</strong>
              <p className="text-slate-600 text-xs mt-0.5">
                Each incorrect guess loses one heart. If you lose all 3 hearts, you will have to restart your expedition!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block font-bold text-sm">3. Use Hints Strategically</strong>
              <p className="text-slate-600 text-xs mt-0.5">
                Stuck on a tricky C loop or bug? Click the Hint button for valuable guidance (each hint subtracts 150 points from your score).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Key className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block font-bold text-sm">4. Collect the 4 Vault Digits</strong>
              <p className="text-slate-600 text-xs mt-0.5">
                The final Treasure Chamber requires a 4-digit code. The digits are generated from your previous answers:
                Beach option, Jungle loop count, Cave bug line, and Waterfall sequence number!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-2xl border border-amber-200">
            <Trophy className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 block font-bold text-sm">5. Beat the High Score</strong>
              <p className="text-slate-600 text-xs mt-0.5">
                Complete the quest as fast as possible with remaining hearts and minimal hints to earn a legendary rank on the leaderboard!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            Start Exploring! ⛵
          </button>
        </div>
      </div>
    </div>
  );
};
