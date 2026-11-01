import React, { useState, useEffect, useRef } from 'react';
import { ISLAND_LOCATIONS, CLUES } from './types/game';
import { IslandMap } from './components/IslandMap';
import { HeaderHud } from './components/HeaderHud';
import { InventoryBar } from './components/InventoryBar';
import { ActivePuzzleView } from './components/ActivePuzzleView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryScreen } from './components/VictoryScreen';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { sound } from './utils/audio';
import { Compass, Sparkles, MapPin, ChevronRight, Play } from 'lucide-react';

const STORAGE_KEY_BEST_SCORE = 'code_quest_best_score_v1';
const STORAGE_KEY_HAS_SEEN_GUIDE = 'code_quest_seen_guide';

export default function App() {
  // Game progress state
  const [currentLocationId, setCurrentLocationId] = useState<number>(0);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(0);
  const [completedLocations, setCompletedLocations] = useState<number[]>([]);

  // Health and score
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Status flags
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [isHeartDamaged, setIsHeartDamaged] = useState<boolean>(false);
  const [isMapShaking, setIsMapShaking] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [confettiType, setConfettiType] = useState<'celebration' | 'coins'>('celebration');

  // Load high score and guide preference safely from localStorage
  useEffect(() => {
    try {
      const savedBest = localStorage.getItem(STORAGE_KEY_BEST_SCORE);
      if (savedBest) {
        setBestScore(parseInt(savedBest, 10) || 0);
      }
      const hasSeenGuide = localStorage.getItem(STORAGE_KEY_HAS_SEEN_GUIDE);
      if (!hasSeenGuide) {
        setShowHowToPlay(true);
        localStorage.setItem(STORAGE_KEY_HAS_SEEN_GUIDE, 'true');
      }
    } catch {
      // Storage access blocked or restricted - proceed with defaults
    }
  }, []);

  // Timer loop: runs while game is active
  useEffect(() => {
    if (isGameOver || isVictory) return;

    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isVictory]);

  // Handle wrong answer
  const handleWrongAnswer = () => {
    sound.playHeartLoss();
    setIsHeartDamaged(true);
    setIsMapShaking(true);
    setTimeout(() => {
      setIsHeartDamaged(false);
      setIsMapShaking(false);
    }, 600);

    setScore((prev) => Math.max(0, prev - 50));

    setHearts((prevHearts) => {
      const nextHearts = prevHearts - 1;
      if (nextHearts <= 0) {
        setIsGameOver(true);
      }
      return nextHearts;
    });
  };

  // Handle correct answer
  const handleCorrectAnswer = (clueId: number, hintUsed: boolean) => {
    sound.playStep();

    // Trigger celebration burst
    setConfettiType(clueId === 5 ? 'coins' : 'celebration');
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);

    // Calculate score addition
    let scoreAddition = 500;
    if (hintUsed) {
      scoreAddition -= 150;
      setHintsUsed((prev) => prev + 1);
    }
    // Time efficiency bonus (earlier solves get modest bonus)
    if (timeSeconds < 300) {
      scoreAddition += 50;
    }

    setScore((prev) => prev + scoreAddition);

    // Mark completed
    if (!completedLocations.includes(clueId)) {
      setCompletedLocations((prev) => [...prev, clueId]);
    }

    // If final clue (Chamber) was solved, trigger victory!
    if (clueId === 5) {
      const finalScore = score + scoreAddition + hearts * 200;
      setScore(finalScore);

      try {
        if (finalScore > bestScore) {
          setBestScore(finalScore);
          setIsNewBest(true);
          localStorage.setItem(STORAGE_KEY_BEST_SCORE, finalScore.toString());
        }
      } catch {
        // Storage unavailable
      }

      setTimeout(() => {
        setIsVictory(true);
      }, 1000);
    }
  };

  // Continue to next location
  const handleContinueToNext = () => {
    if (currentLocationId < ISLAND_LOCATIONS.length - 1) {
      const nextId = currentLocationId + 1;
      setCurrentLocationId(nextId);
      setSelectedLocationId(nextId);
      sound.playStep();
    } else {
      setIsVictory(true);
    }
  };

  // User clicked a location node on the map
  const handleSelectLocation = (locationId: number) => {
    sound.playClick();
    setSelectedLocationId(locationId);
  };

  // Reset / Play Again
  const handleRestartGame = () => {
    setCurrentLocationId(0);
    setSelectedLocationId(0);
    setCompletedLocations([]);
    setHearts(3);
    setScore(0);
    setHintsUsed(0);
    setTimeSeconds(0);
    setIsGameOver(false);
    setIsVictory(false);
    setIsNewBest(false);
    setConfettiActive(false);
  };

  const currentClue = CLUES[selectedLocationId] || CLUES[0];
  const isSelectedCompleted = completedLocations.includes(selectedLocationId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50/50 to-amber-100 text-slate-900 flex flex-col font-sans">
      {/* Confetti & Coin particles */}
      <ConfettiCanvas active={confettiActive} type={confettiType} />

      {/* Top HUD */}
      <HeaderHud
        score={score}
        hearts={hearts}
        maxHearts={3}
        timeSeconds={timeSeconds}
        bestScore={bestScore}
        isMuted={isMuted}
        onToggleSound={() => setIsMuted(sound.toggleMute())}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onRestartGame={handleRestartGame}
        isHeartDamaged={isHeartDamaged}
      />

      {/* Main Adventure Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {isVictory ? (
          /* VICTORY SCREEN */
          <VictoryScreen
            score={score}
            timeSeconds={timeSeconds}
            hintsUsed={hintsUsed}
            heartsRemaining={hearts}
            bestScore={bestScore}
            isNewBest={isNewBest}
            onPlayAgain={handleRestartGame}
          />
        ) : (
          /* ACTIVE EXPEDITION VIEW */
          <div className="space-y-6">
            {/* Expedition Header & Mission Statement */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-amber-900/10 border border-amber-900/20 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2 text-amber-950">
                <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
                <span className="text-sm font-bold tracking-tight">
                  Mission: Uncover all 6 clues on the Isle of C to unlock the Ancient Treasure Chamber!
                </span>
              </div>
              <div className="text-xs font-semibold text-amber-800">
                Current Waypoint:{' '}
                <strong className="text-amber-950 font-black">
                  {ISLAND_LOCATIONS[currentLocationId].name} (#{currentLocationId + 1}/6)
                </strong>
              </div>
            </div>

            {/* Top Interactive Island Map */}
            <section aria-label="Interactive Island Map">
              <IslandMap
                currentLocationId={currentLocationId}
                completedLocations={completedLocations}
                onSelectLocation={handleSelectLocation}
                isShaking={isMapShaking}
              />
            </section>

            {/* Collected Artifacts Inventory Bar */}
            <section aria-label="Collected Artifacts">
              <InventoryBar
                completedLocations={completedLocations}
                currentLocationId={currentLocationId}
              />
            </section>

            {/* Active Location Clue Puzzle */}
            <section aria-label="Active Location Clue">
              <ActivePuzzleView
                clue={currentClue}
                onCorrectAnswer={handleCorrectAnswer}
                onWrongAnswer={handleWrongAnswer}
                isCompleted={isSelectedCompleted}
                onContinueToNext={handleContinueToNext}
                hasNextLocation={selectedLocationId < ISLAND_LOCATIONS.length - 1}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800 mt-auto">
        <p>
          Code Quest: The Treasure Hunt · Designed for First-Year Computer Engineering Explorers
        </p>
      </footer>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

      {/* Game Over "Try Again" Modal */}
      <GameOverModal
        isOpen={isGameOver}
        onRestart={handleRestartGame}
        completedCount={completedLocations.length}
      />
    </div>
  );
}
