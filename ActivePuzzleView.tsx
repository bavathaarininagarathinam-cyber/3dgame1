import React, { useState, useEffect } from 'react';
import { ClueData, CLUES } from '../types/game';
import { Lightbulb, CheckCircle2, AlertTriangle, ArrowUp, ArrowDown, Lock, KeyRound, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ActivePuzzleViewProps {
  clue: ClueData;
  onCorrectAnswer: (clueId: number, hintUsed: boolean) => void;
  onWrongAnswer: () => void;
  isCompleted: boolean;
  onContinueToNext: () => void;
  hasNextLocation: boolean;
}

export const ActivePuzzleView: React.FC<ActivePuzzleViewProps> = ({
  clue,
  onCorrectAnswer,
  onWrongAnswer,
  isCompleted,
  onContinueToNext,
  hasNextLocation
}) => {
  // Common state
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsedThisClue, setHintUsedThisClue] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Puzzle 1: Multiple Choice
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Puzzle 2: Predict Output
  const [predictInput, setPredictInput] = useState<string>('');

  // Puzzle 3: Find Bug
  const [selectedBugLine, setSelectedBugLine] = useState<number | null>(null);

  // Puzzle 4: Sequence
  const [sequenceInput, setSequenceInput] = useState<string>('');

  // Puzzle 5: Reorder Lines
  const [linesOrder, setLinesOrder] = useState<Array<{ id: string; code: string; correctIndex: number }>>([]);
  const [draggedLineIdx, setDraggedLineIdx] = useState<number | null>(null);

  // Puzzle 6: 4-digit Vault Lock
  const [vaultDigits, setVaultDigits] = useState<string[]>(['', '', '', '']);

  // Reset local state when clue changes
  useEffect(() => {
    setShowHint(false);
    setHintUsedThisClue(false);
    setStatusMessage(null);
    setSelectedOption(null);
    setPredictInput('');
    setSelectedBugLine(null);
    setSequenceInput('');
    setVaultDigits(['', '', '', '']);

    if (clue.type === 'reorder_code' && clue.jumbledLines) {
      // Shuffle lines initially if not completed
      setLinesOrder([...clue.jumbledLines]);
    }
  }, [clue.id, clue.type]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleUseHint = () => {
    if (!showHint) {
      sound.playHint();
      setShowHint(true);
      setHintUsedThisClue(true);
    } else {
      setShowHint(false);
    }
  };

  // Puzzle 1: Submit Multiple Choice
  const handleSubmitMC = () => {
    if (selectedOption === null) return;
    if (selectedOption === clue.correctOptionId) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({ type: 'error', text: 'Not quite! That is not the standard C printing function.' });
      onWrongAnswer();
    }
  };

  // Puzzle 2: Submit Output Prediction
  const handleSubmitPredict = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = predictInput.trim();
    if (!clean) return;

    if (clean === clue.expectedOutput) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({
        type: 'error',
        text: `Incorrect output "${clean}". Remember to trace all 3 loop iterations!`
      });
      onWrongAnswer();
    }
  };

  // Puzzle 3: Submit Bug Line
  const handleSubmitBug = () => {
    if (selectedBugLine === null) return;
    const line = clue.bugLines?.find((l) => l.lineNum === selectedBugLine);
    if (line && line.isBug) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({
        type: 'error',
        text: `Line ${selectedBugLine} is valid C code. Look for where a condition accidentally alters a variable!`
      });
      onWrongAnswer();
    }
  };

  // Puzzle 4: Submit Sequence Answer
  const handleSubmitSequence = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = sequenceInput.trim();
    if (!clean) return;

    if (clean === clue.correctSequenceAnswer) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({
        type: 'error',
        text: `"${clean}" does not fit the doubling ratio (1 -> 2 -> 4 -> ?). Try again!`
      });
      onWrongAnswer();
    }
  };

  // Puzzle 5: Move line up / down for mobile touch & drag-and-drop
  const moveLine = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= linesOrder.length) return;

    const updated = [...linesOrder];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setLinesOrder(updated);
  };

  const handleDragStart = (idx: number) => {
    setDraggedLineIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedLineIdx === null || draggedLineIdx === idx) return;
    const updated = [...linesOrder];
    const draggedItem = updated[draggedLineIdx];
    updated.splice(draggedLineIdx, 1);
    updated.splice(idx, 0, draggedItem);
    setDraggedLineIdx(idx);
    setLinesOrder(updated);
  };

  const handleSubmitReorder = () => {
    const isCorrect = linesOrder.every((item, idx) => item.correctIndex === idx);
    if (isCorrect) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({
        type: 'error',
        text: 'The code structure is out of order. Preprocessor headers must come before main() and statements before return 0;!'
      });
      onWrongAnswer();
    }
  };

  // Puzzle 6: Vault Lock
  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const updated = [...vaultDigits];
    updated[index] = clean;
    setVaultDigits(updated);

    // Auto-focus next input if filled
    if (clean && index < 3) {
      const nextInput = document.getElementById(`vault-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmitVault = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = vaultDigits.join('');
    if (fullCode.length < 4) {
      setStatusMessage({ type: 'error', text: 'Please fill all 4 dials with digits!' });
      return;
    }

    if (fullCode === clue.expectedOutput) {
      sound.playSuccess();
      onCorrectAnswer(clue.id, hintUsedThisClue);
    } else {
      sound.playWrong();
      triggerShake();
      setStatusMessage({
        type: 'error',
        text: `Code [ ${fullCode} ] is incorrect! The heavy lock clicks back into place. Check your Explorer's Quest Journal for the 4 digits!`
      });
      onWrongAnswer();
    }
  };

  return (
    <div
      className={`w-full bg-white rounded-3xl border-2 border-amber-900/20 shadow-xl overflow-hidden transition-all duration-300 ${
        isShaking ? 'animate-game-shake ring-4 ring-red-400' : ''
      }`}
    >
      {/* Clue Header Bar */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{clue.itemIcon}</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-300">
              {clue.locationName} · Location #{clue.id + 1}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-amber-100 tracking-tight mt-0.5">
            {clue.promptTitle}
          </h2>
        </div>

        {/* Hint button */}
        {!isCompleted && (
          <button
            onClick={handleUseHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showHint
                ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md'
                : 'bg-amber-800/80 hover:bg-amber-700 text-amber-200 border-amber-600'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-300" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint? (-150 pts)'}</span>
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Hint Box (if active) */}
        {showHint && !isCompleted && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 text-amber-950 animate-fade-in flex items-start gap-3 shadow-inner">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <strong className="block font-bold text-amber-900 mb-1">
                Explorer's Hint (Score penalty applied):
              </strong>
              <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                {clue.hintText}
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED SUCCESS STATE BANNER */}
        {isCompleted ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-emerald-950 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-emerald-900">
                    Challenge Conquered! 🎉
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    Solved
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-800 mt-1">
                  Artifact Unlocked: <strong>{clue.itemName}</strong> {clue.itemIcon}
                </p>
                {/* One line explanation */}
                <div className="mt-2.5 p-3 bg-white/90 rounded-xl border border-emerald-300 text-xs sm:text-sm text-slate-800">
                  <strong className="text-emerald-900 block mb-0.5 font-bold">Why this answer is correct:</strong>
                  {clue.explanation}
                </div>
                {/* Cipher digit reminder */}
                <div className="mt-2 text-xs font-mono font-semibold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 inline-block">
                  🔑 {clue.digitNote}
                </div>
              </div>
            </div>

            {hasNextLocation ? (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    onContinueToNext();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Continue to Next Location
                </button>
              </div>
            ) : (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sound.playClick();
                    onContinueToNext();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Open the Grand Treasure Chest! 🏆
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE INTERACTIVE PUZZLE FORM */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {clue.promptDescription}
            </p>

            {/* Error Message Notice */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-semibold animate-fade-in ${
                  statusMessage.type === 'error'
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* PUZZLE TYPE 1: MULTIPLE CHOICE (BEACH) */}
            {clue.type === 'multiple_choice' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clue.mcOptions?.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedOption(opt.id);
                        setStatusMessage(null);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                        selectedOption === opt.id
                          ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                          Option #{opt.id}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === opt.id
                              ? 'border-amber-600 bg-amber-600'
                              : 'border-slate-400'
                          }`}
                        >
                          {selectedOption === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {opt.text}
                        </span>
                        {opt.code && (
                          <pre className="mt-1 text-[11px] font-mono text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200 overflow-x-auto">
                            {opt.code}
                          </pre>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmitMC}
                  disabled={selectedOption === null}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer text-sm"
                >
                  Verify Answer
                </button>
              </div>
            )}

            {/* PUZZLE TYPE 2: PREDICT LOOP OUTPUT (JUNGLE) */}
            {clue.type === 'predict_output' && (
              <div className="space-y-4">
                {/* Code Window */}
                <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden font-mono text-xs sm:text-sm">
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-slate-300 text-xs">
                    <span className="font-semibold text-emerald-400">jungle_loop.c</span>
                    <span className="text-slate-400 text-[11px]">C99 Standard</span>
                  </div>
                  <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{clue.codeSnippet}</code>
                  </pre>
                </div>

                <form onSubmit={handleSubmitPredict} className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Console Output Value:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={predictInput}
                      onChange={(e) => {
                        setPredictInput(e.target.value);
                        setStatusMessage(null);
                      }}
                      placeholder="Type the number printed to screen..."
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-mono text-base font-bold"
                    />
                    <button
                      type="submit"
                      disabled={!predictInput.trim()}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm whitespace-nowrap"
                    >
                      Submit Output
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PUZZLE TYPE 3: FIND THE BUG (CAVE) */}
            {clue.type === 'find_bug' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 italic">
                  Tip: Click directly on the line of code you believe has the bug, then click "Confirm Buggy Line".
                </p>

                <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden font-mono text-xs sm:text-sm">
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-slate-300 text-xs">
                    <span className="font-semibold text-indigo-400">cave_door.c</span>
                    <span className="text-slate-400 text-[11px]">Click a line to inspect</span>
                  </div>
                  <div className="divide-y divide-slate-800">
                    {clue.bugLines?.map((line) => {
                      const isSelected = selectedBugLine === line.lineNum;
                      return (
                        <div
                          key={line.lineNum}
                          onClick={() => {
                            sound.playClick();
                            setSelectedBugLine(line.lineNum);
                            setStatusMessage(null);
                          }}
                          className={`flex items-center px-4 py-2 transition-colors cursor-pointer select-none ${
                            isSelected
                              ? 'bg-amber-500/30 text-amber-200 border-l-4 border-amber-400'
                              : 'hover:bg-slate-800/60 text-slate-300'
                          }`}
                        >
                          <span className="w-8 text-slate-500 select-none text-[11px] font-mono text-right mr-3">
                            {line.lineNum}
                          </span>
                          <span className="flex-1 font-mono">{line.code}</span>
                          {isSelected && (
                            <span className="text-[10px] font-sans font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleSubmitBug}
                  disabled={selectedBugLine === null}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer text-sm"
                >
                  {selectedBugLine ? `Confirm Bug on Line ${selectedBugLine}` : 'Select a line with a bug above'}
                </button>
              </div>
            )}

            {/* PUZZLE TYPE 4: SEQUENCE PUZZLE (WATERFALL) */}
            {clue.type === 'pattern_sequence' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-6 bg-gradient-to-r from-cyan-900 to-sky-900 rounded-2xl border-2 border-cyan-700 text-white text-center">
                  <span className="text-xs uppercase tracking-widest text-cyan-300 font-semibold block mb-2">
                    Dynamic Buffer Expansion Pattern
                  </span>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 font-mono text-xl sm:text-3xl font-black">
                    <span className="bg-cyan-800/80 px-3 py-2 rounded-xl border border-cyan-600">1</span>
                    <span className="text-cyan-400">→</span>
                    <span className="bg-cyan-800/80 px-3 py-2 rounded-xl border border-cyan-600">2</span>
                    <span className="text-cyan-400">→</span>
                    <span className="bg-cyan-800/80 px-3 py-2 rounded-xl border border-cyan-600">4</span>
                    <span className="text-cyan-400">→</span>
                    <span className="bg-amber-400 text-slate-950 px-4 py-2 rounded-xl border border-amber-300 animate-pulse">
                      ?
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Next number in sequence:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={sequenceInput}
                      onChange={(e) => {
                        setSequenceInput(e.target.value);
                        setStatusMessage(null);
                      }}
                      placeholder="Enter next integer..."
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none font-mono text-base font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => handleSubmitSequence()}
                      disabled={!sequenceInput.trim()}
                      className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-sm whitespace-nowrap"
                    >
                      Submit Number
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PUZZLE TYPE 5: REORDER CODE (ANCIENT TEMPLE) */}
            {clue.type === 'reorder_code' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Drag items or use the ▲/▼ buttons to arrange into a valid C program:</span>
                </div>

                <div className="space-y-2">
                  {linesOrder.map((line, idx) => (
                    <div
                      key={line.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      className="flex items-center gap-2 p-3 bg-slate-900 border-2 border-slate-700 hover:border-amber-400 rounded-xl text-amber-200 font-mono text-xs sm:text-sm cursor-grab active:cursor-grabbing transition-all shadow-sm"
                    >
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveLine(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 cursor-pointer"
                          title="Move Line Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveLine(idx, 'down')}
                          disabled={idx === linesOrder.length - 1}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 cursor-pointer"
                          title="Move Line Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="w-5 text-slate-500 text-center font-bold text-xs select-none">
                        {idx + 1}
                      </span>

                      <pre className="flex-1 whitespace-pre-wrap select-none overflow-x-auto text-amber-100">
                        {line.code}
                      </pre>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmitReorder}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer text-sm"
                >
                  Verify Program Structure
                </button>
              </div>
            )}

            {/* PUZZLE TYPE 6: TREASURE CHAMBER 4-DIGIT LOCK */}
            {clue.type === 'treasure_lock' && (
              <div className="space-y-5">
                {/* Journal Clue Review Panel */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-700" />
                    Explorer's Clue Journal (Earlier Discoveries):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-amber-200">
                      <span className="text-amber-800 font-bold block">1. Beach Oracle:</span>
                      <span className="text-slate-600">printf was Option #<strong>2</strong></span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-amber-200">
                      <span className="text-amber-800 font-bold block">2. Jungle Loop:</span>
                      <span className="text-slate-600">Final count printed was <strong>6</strong></span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-amber-200">
                      <span className="text-amber-800 font-bold block">3. Cave Bug:</span>
                      <span className="text-slate-600">The bug was located on Line #<strong>4</strong></span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-amber-200">
                      <span className="text-amber-800 font-bold block">4. Waterfall Pattern:</span>
                      <span className="text-slate-600">Doubling sequence completed with <strong>8</strong></span>
                    </div>
                  </div>
                </div>

                {/* 4 Dials Cipher Form */}
                <form onSubmit={handleSubmitVault} className="space-y-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-4">
                    {[0, 1, 2, 3].map((idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-amber-900 mb-1">
                          Dial {idx + 1}
                        </span>
                        <input
                          id={`vault-digit-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={vaultDigits[idx]}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          className="w-12 h-14 sm:w-16 sm:h-20 text-center text-2xl sm:text-4xl font-mono font-black text-amber-950 bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-600 rounded-2xl shadow-inner focus:ring-4 focus:ring-amber-400 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    Turn Vault Dial & Unlock Treasure!
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
