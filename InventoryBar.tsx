import React, { useState } from 'react';
import { CLUES } from '../types/game';
import { Sparkles, Info } from 'lucide-react';

interface InventoryBarProps {
  completedLocations: number[];
  currentLocationId: number;
}

export const InventoryBar: React.FC<InventoryBarProps> = ({ completedLocations, currentLocationId }) => {
  const [activeItemDetails, setActiveItemDetails] = useState<number | null>(null);

  return (
    <div className="w-full bg-amber-950/20 border border-amber-900/30 rounded-2xl p-3 sm:p-4 backdrop-blur-sm shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Explorer's Quest Bag ({completedLocations.length}/5 Artifacts)
          </span>
        </div>
        <span className="text-xs text-amber-800 font-medium">
          Tap an item to inspect the clue & cipher digit
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {CLUES.slice(0, 5).map((clue) => {
          const isEarned = completedLocations.includes(clue.id);
          const isSelected = activeItemDetails === clue.id;

          return (
            <button
              key={clue.id}
              onClick={() => setActiveItemDetails(isSelected ? null : clue.id)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                isEarned
                  ? 'bg-amber-100/90 border-amber-400 hover:bg-amber-200/90 shadow-sm cursor-pointer hover:scale-105'
                  : 'bg-slate-200/50 border-slate-300 opacity-50 cursor-not-allowed'
              } ${isSelected ? 'ring-2 ring-amber-500 scale-105' : ''}`}
            >
              <span className={`text-2xl sm:text-3xl transition-transform ${isEarned ? 'filter drop-shadow' : 'grayscale'}`}>
                {clue.itemIcon}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-amber-950 mt-1 line-clamp-1 w-full">
                {isEarned ? clue.itemName.split(' ')[0] : '???'}
              </span>
              {isEarned && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-white shadow">
                  {clue.digitAwarded}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Item Lore & Secret Clue Note */}
      {activeItemDetails !== null && (
        <div className="mt-3 p-3 bg-white/90 border border-amber-300 rounded-xl shadow-sm animate-fade-in flex items-start gap-3">
          <span className="text-3xl">{CLUES[activeItemDetails].itemIcon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-950">
                {completedLocations.includes(activeItemDetails)
                  ? CLUES[activeItemDetails].itemName
                  : 'Mysterious Island Artifact'}
              </h4>
              <button
                onClick={() => setActiveItemDetails(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                ✕
              </button>
            </div>
            {completedLocations.includes(activeItemDetails) ? (
              <>
                <p className="text-xs text-slate-600 mt-0.5">
                  {CLUES[activeItemDetails].itemLore}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-300 text-xs font-semibold text-amber-900">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Cipher Memory: <strong className="font-mono text-amber-700">{CLUES[activeItemDetails].digitNote}</strong></span>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">
                Solve the clue at {CLUES[activeItemDetails].locationName} to uncover this artifact and its cipher clue!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
