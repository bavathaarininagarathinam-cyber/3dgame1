import React from 'react';
import { Lock, Check, Compass, Sparkles } from 'lucide-react';
import { ISLAND_LOCATIONS, LocationInfo } from '../types/game';

interface IslandMapProps {
  currentLocationId: number;
  completedLocations: number[];
  onSelectLocation: (locationId: number) => void;
  isShaking: boolean;
}

// Map SVG dimensions
const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

// Explicit SVG coordinates corresponding to the 6 locations
export const NODE_COORDINATES: Record<number, { x: number; y: number }> = {
  0: { x: 150, y: 440 }, // Beach
  1: { x: 320, y: 290 }, // Jungle
  2: { x: 480, y: 420 }, // Cave
  3: { x: 630, y: 230 }, // Waterfall
  4: { x: 770, y: 370 }, // Ancient Temple
  5: { x: 880, y: 170 }, // Treasure Chamber
};

// Dotted path linking the nodes in sequence
const PATH_DATA = `
  M 150 440
  C 200 370, 240 330, 320 290
  C 380 260, 420 370, 480 420
  C 530 460, 580 300, 630 230
  C 680 180, 720 310, 770 370
  C 810 410, 840 250, 880 170
`;

export const IslandMap: React.FC<IslandMapProps> = ({
  currentLocationId,
  completedLocations,
  onSelectLocation,
  isShaking
}) => {
  const currentCoords = NODE_COORDINATES[currentLocationId] || NODE_COORDINATES[0];

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border-4 border-amber-900/30 bg-sky-200 shadow-2xl transition-transform ${isShaking ? 'animate-game-shake' : ''}`}>
      {/* Ocean backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-teal-400 opacity-90" />

      {/* SVG Canvas Map */}
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="relative z-10 w-full h-auto select-none block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Island sand gradient */}
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Jungle foliage gradient */}
          <linearGradient id="jungleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Mountain & Cave gradient */}
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="60%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Water stream gradient */}
          <linearGradient id="waterfallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          {/* Temple Stone Gradient */}
          <linearGradient id="templeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="activeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle drop shadow */}
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="6" stdDeviation="4" floodOpacity="0.3" floodColor="#0F172A" />
          </filter>
        </defs>

        {/* Ocean Waves Decor */}
        <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" fill="none">
          <path d="M 50 100 Q 80 85 110 100 T 170 100" />
          <path d="M 80 180 Q 110 165 140 180 T 200 180" />
          <path d="M 820 480 Q 850 465 880 480 T 940 480" />
          <path d="M 720 540 Q 750 525 780 540 T 840 540" />
          <path d="M 400 80 Q 430 65 460 80 T 520 80" />
        </g>

        {/* Small Sailing Ship / Boat in ocean */}
        <g transform="translate(60, 50)" filter="url(#dropShadow)">
          <path d="M 0 25 L 35 25 L 28 35 L 7 35 Z" fill="#78350F" />
          <path d="M 17 25 L 17 5 L 30 15 Z" fill="#FEF08A" />
          <path d="M 15 25 L 15 8 L 4 18 Z" fill="#FDE047" />
        </g>

        {/* MAIN ISLAND SHORELINE & SHADOW */}
        <path
          d="
            M 110 460
            C 70 380, 100 280, 190 220
            C 250 180, 310 140, 420 120
            C 530 100, 620 90, 740 110
            C 860 130, 960 210, 950 330
            C 940 430, 870 510, 780 540
            C 690 570, 560 560, 470 550
            C 360 540, 240 570, 150 530
            C 120 510, 110 490, 110 460
            Z
          "
          fill="#3B82F6"
          opacity="0.25"
          transform="translate(10, 15)"
        />

        {/* Sandy Island Base */}
        <path
          d="
            M 110 460
            C 70 380, 100 280, 190 220
            C 250 180, 310 140, 420 120
            C 530 100, 620 90, 740 110
            C 860 130, 960 210, 950 330
            C 940 430, 870 510, 780 540
            C 690 570, 560 560, 470 550
            C 360 540, 240 570, 150 530
            C 120 510, 110 490, 110 460
            Z
          "
          fill="url(#sandGradient)"
          stroke="#B45309"
          strokeWidth="4"
          filter="url(#dropShadow)"
        />

        {/* Lush Green Jungle Interior */}
        <path
          d="
            M 180 430
            C 140 330, 180 250, 280 200
            C 380 150, 500 140, 610 140
            C 720 140, 840 170, 880 270
            C 910 350, 850 440, 760 480
            C 670 520, 550 500, 450 480
            C 330 460, 240 480, 180 430
            Z
          "
          fill="url(#jungleGradient)"
          stroke="#065F46"
          strokeWidth="3"
        />

        {/* Rocky Mountains around the Cave and Summit */}
        {/* Mountain 1 (Cave Ridge) */}
        <polygon points="410,480 480,350 540,480" fill="url(#mountainGradient)" stroke="#1E293B" strokeWidth="2" />
        <polygon points="480,350 500,480 540,480" fill="#334155" opacity="0.6" />
        {/* Mountain 2 (Summit Peak) */}
        <polygon points="790,260 880,120 940,260" fill="url(#mountainGradient)" stroke="#1E293B" strokeWidth="2" />
        <polygon points="880,120 900,260 940,260" fill="#334155" opacity="0.7" />
        {/* Snow/Gold cap on summit */}
        <polygon points="860,150 880,120 900,150 888,145 880,153 872,145" fill="#FEF08A" />

        {/* Cave Opening Drawing */}
        <ellipse cx="480" cy="435" rx="22" ry="16" fill="#0F172A" />
        <ellipse cx="480" cy="433" rx="14" ry="10" fill="#020617" />
        {/* Torch flicker inside cave */}
        <circle cx="480" cy="430" r="4" fill="#F59E0B" opacity="0.9" />

        {/* Waterfall Stream */}
        <path
          d="M 640 150 C 645 190, 625 210, 630 260 C 635 300, 610 340, 600 370"
          stroke="url(#waterfallGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lagoon pool */}
        <ellipse cx="600" cy="375" rx="35" ry="18" fill="#38BDF8" opacity="0.8" />
        <ellipse cx="600" cy="375" rx="22" ry="10" fill="#7DD3FC" opacity="0.9" />

        {/* Ancient Temple Pillars & Steppes */}
        <g transform="translate(735, 340)">
          {/* Temple Base */}
          <rect x="0" y="40" width="70" height="12" rx="2" fill="#78350F" />
          <rect x="8" y="30" width="54" height="10" rx="2" fill="#92400E" />
          {/* Pillars */}
          <rect x="12" y="10" width="6" height="20" fill="#D97706" />
          <rect x="26" y="10" width="6" height="20" fill="#D97706" />
          <rect x="40" y="10" width="6" height="20" fill="#D97706" />
          <rect x="54" y="10" width="6" height="20" fill="#D97706" />
          {/* Pediment roof */}
          <polygon points="5,10 35,0 67,10" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
          <polygon points="30,4 35,0 40,4" fill="#FDE047" />
        </g>

        {/* Palm Trees on Beach */}
        <g transform="translate(110, 410)">
          {/* Trunk */}
          <path d="M 20 40 Q 28 20 22 5" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Fronds */}
          <path d="M 22 5 Q 5 0 0 10" stroke="#047857" strokeWidth="3" fill="none" />
          <path d="M 22 5 Q 35 -5 45 5" stroke="#059669" strokeWidth="3" fill="none" />
          <path d="M 22 5 Q 22 -10 20 -15" stroke="#10B981" strokeWidth="3" fill="none" />
          <path d="M 22 5 Q 10 -8 5 -5" stroke="#047857" strokeWidth="3" fill="none" />
          <path d="M 22 5 Q 38 12 40 20" stroke="#059669" strokeWidth="3" fill="none" />
        </g>

        <g transform="translate(190, 480)">
          <path d="M 15 35 Q 8 18 16 3" stroke="#78350F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 16 3 Q 0 -2 -5 6" stroke="#047857" strokeWidth="2.5" fill="none" />
          <path d="M 16 3 Q 28 -5 36 3" stroke="#059669" strokeWidth="2.5" fill="none" />
          <path d="M 16 3 Q 16 -10 14 -14" stroke="#10B981" strokeWidth="2.5" fill="none" />
        </g>

        {/* Jungle Foliage Clusters */}
        <g fill="#065F46" opacity="0.4">
          <circle cx="280" cy="330" r="18" />
          <circle cx="300" cy="320" r="22" />
          <circle cx="340" cy="340" r="16" />
          <circle cx="440" cy="270" r="18" />
          <circle cx="460" cy="260" r="22" />
          <circle cx="700" cy="310" r="20" />
        </g>

        {/* CONNECTING DOTTED PATH */}
        {/* Outer shadow path */}
        <path
          d={PATH_DATA}
          fill="none"
          stroke="#451A03"
          strokeWidth="6"
          strokeDasharray="10 12"
          strokeLinecap="round"
          opacity="0.3"
          transform="translate(1, 2)"
        />
        {/* Main Dotted Quest Path */}
        <path
          d={PATH_DATA}
          fill="none"
          stroke="#FEF3C7"
          strokeWidth="4"
          strokeDasharray="10 12"
          strokeLinecap="round"
        />

        {/* LOCATION NODES */}
        {ISLAND_LOCATIONS.map((loc) => {
          const coords = NODE_COORDINATES[loc.id];
          const isCompleted = completedLocations.includes(loc.id);
          const isCurrent = currentLocationId === loc.id;
          const isLocked = loc.id > currentLocationId && !isCompleted;
          const isClickable = !isLocked || isCompleted;

          return (
            <g
              key={loc.id}
              transform={`translate(${coords.x}, ${coords.y})`}
              className={`transition-all duration-300 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => {
                if (isClickable) {
                  onSelectLocation(loc.id);
                }
              }}
            >
              {/* Pulsing beacon glow ring for active current node */}
              {isCurrent && (
                <circle
                  cx="0"
                  cy="0"
                  r="34"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  className="animate-ping"
                  opacity="0.6"
                />
              )}

              {/* Base drop shadow */}
              <circle cx="0" cy="4" r="24" fill="#0F172A" opacity="0.35" />

              {/* Node Outer Ring */}
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={
                  isCompleted
                    ? '#10B981' // Emerald for completed
                    : isCurrent
                    ? '#F59E0B' // Amber for current
                    : '#64748B' // Slate for locked
                }
                stroke={
                  isCompleted
                    ? '#064E3B'
                    : isCurrent
                    ? '#FFFBEB'
                    : '#334155'
                }
                strokeWidth={isCurrent ? 4 : 3}
                filter={isCurrent ? 'url(#activeGlow)' : undefined}
                className={isCurrent ? 'animate-pulse-glow' : ''}
              />

              {/* Inner Circle Disc */}
              <circle
                cx="0"
                cy="0"
                r="18"
                fill={
                  isCompleted
                    ? '#059669'
                    : isCurrent
                    ? '#D97706'
                    : '#475569'
                }
              />

              {/* Node Icon / State Representation */}
              {isCompleted ? (
                <g transform="translate(-10, -10)">
                  {/* Green Tick Checkmark */}
                  <path
                    d="M 4 10 L 8 14 L 16 6"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ) : isCurrent ? (
                <g transform="translate(-8, -8)">
                  {/* Glowing Star/Sparkle for Active Location */}
                  <path
                    d="M 8 0 L 10 5 L 16 8 L 10 11 L 8 16 L 6 11 L 0 8 L 6 5 Z"
                    fill="#FEF08A"
                  />
                </g>
              ) : (
                <g transform="translate(-7, -8)">
                  {/* Lock Icon */}
                  <rect x="2" y="6" width="10" height="9" rx="1.5" fill="#CBD5E1" />
                  <path
                    d="M 4 6 L 4 3 C 4 1.5, 10 1.5, 10 3 L 10 6"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Name Label Ribbon Below/Above Node */}
              <g
                transform={`translate(0, ${coords.y > 400 ? -34 : 36})`}
                filter="url(#dropShadow)"
              >
                {/* Background pill/card */}
                <rect
                  x="-65"
                  y="-12"
                  width="130"
                  height="24"
                  rx="6"
                  fill={isCurrent ? '#78350F' : isCompleted ? '#064E3B' : '#1E293B'}
                  stroke={isCurrent ? '#FCD34D' : '#94A3B8'}
                  strokeWidth="1.5"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  letterSpacing="0.3"
                  className="font-sans"
                >
                  {loc.id + 1}. {loc.shortName}
                </text>
              </g>
            </g>
          );
        })}

        {/* ANIMATED EXPLORER CHARACTER */}
        {/* Moves smoothly to currentCoords with SVG/CSS transition */}
        <g
          className="transition-all duration-700 ease-out pointer-events-none"
          style={{
            transform: `translate(${currentCoords.x}px, ${currentCoords.y - 28}px)`,
          }}
        >
          {/* Explorer drop shadow */}
          <ellipse cx="0" cy="18" rx="14" ry="5" fill="#000000" opacity="0.3" />

          {/* Explorer Sprite / Avatar */}
          {/* Backpack */}
          <rect x="-14" y="-8" width="7" height="12" rx="2" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          
          {/* Body Coat (Khaki / Adventure vest) */}
          <rect x="-8" y="-7" width="16" height="14" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
          <path d="M 0 -7 L 0 7" stroke="#FEF3C7" strokeWidth="1.5" />
          {/* Red neck bandana */}
          <polygon points="-5,-7 5,-7 0,-3" fill="#EF4444" />

          {/* Head & Face */}
          <circle cx="0" cy="-14" r="8" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          {/* Eyes */}
          <circle cx="-3" cy="-14" r="1.2" fill="#1E293B" />
          <circle cx="3" cy="-14" r="1.2" fill="#1E293B" />
          {/* Smile */}
          <path d="M -3 -11 Q 0 -9 3 -11" stroke="#1E293B" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Explorer Pith Helmet / Safari Hat */}
          <ellipse cx="0" cy="-21" rx="14" ry="3.5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <path d="M -9 -21 Q 0 -30 9 -21 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <line x1="-9" y1="-21" x2="9" y2="-21" stroke="#FEF3C7" strokeWidth="1.5" />

          {/* Handheld Brass Compass / Magnifying Glass */}
          <circle cx="9" cy="0" r="4" fill="#FEF08A" stroke="#B45309" strokeWidth="1.2" />
          <line x1="9" y1="-2" x2="9" y2="2" stroke="#DC2626" strokeWidth="1" />
          <line x1="7" y1="0" x2="11" y2="0" stroke="#1D4ED8" strokeWidth="1" />

          {/* "YOU ARE HERE" Pointer Tag */}
          <g transform="translate(0, -36)">
            <rect x="-35" y="-14" width="70" height="17" rx="4" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="-4,3 4,3 0,7" fill="#DC2626" />
            <text x="0" y="-2" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="900">
              EXPLORER
            </text>
          </g>
        </g>

        {/* Legend in corner */}
        <g transform="translate(20, 20)" opacity="0.95">
          <rect x="0" y="0" width="160" height="70" rx="8" fill="#0F172A" opacity="0.85" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="12" y="18" fill="#FCD34D" fontSize="10" fontWeight="bold">ISLAND MAP LEGEND</text>
          
          {/* Completed */}
          <circle cx="20" cy="32" r="5" fill="#10B981" />
          <text x="32" y="35" fill="#E2E8F0" fontSize="9">Completed (Solved)</text>

          {/* Current */}
          <circle cx="20" cy="46" r="5" fill="#F59E0B" />
          <text x="32" y="49" fill="#E2E8F0" fontSize="9">Active Clue (Glowing)</text>

          {/* Locked */}
          <circle cx="20" cy="59" r="5" fill="#64748B" />
          <text x="32" y="62" fill="#E2E8F0" fontSize="9">Locked (Ahead)</text>
        </g>
      </svg>
    </div>
  );
};
