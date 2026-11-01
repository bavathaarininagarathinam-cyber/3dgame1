export interface ClueData {
  id: number;
  locationName: string;
  subtitle: string;
  itemName: string;
  itemIcon: string;
  itemLore: string;
  digitAwarded: string; // The digit revealed for the final code
  digitNote: string;    // Explains how this digit connects to the puzzle
  promptTitle: string;
  promptDescription: string;
  hintText: string;
  explanation: string;
  type: 'multiple_choice' | 'predict_output' | 'find_bug' | 'pattern_sequence' | 'reorder_code' | 'treasure_lock';
  // Specific puzzle data
  mcOptions?: { id: number; text: string; code?: string }[];
  correctOptionId?: number;
  codeSnippet?: string;
  expectedOutput?: string;
  bugLines?: { lineNum: number; code: string; isBug: boolean }[];
  sequencePrefix?: string;
  sequenceTerms?: string[];
  correctSequenceAnswer?: string;
  jumbledLines?: { id: string; code: string; correctIndex: number }[];
}

export interface LocationInfo {
  id: number;
  name: string;
  shortName: string;
  x: number; // Percent on SVG map (0-100)
  y: number; // Percent on SVG map (0-100)
  themeColor: string;
  bgGradient: string;
  icon: string;
  description: string;
}

export const ISLAND_LOCATIONS: LocationInfo[] = [
  {
    id: 0,
    name: "Golden Palm Beach",
    shortName: "Beach",
    x: 14,
    y: 72,
    themeColor: "#f59e0b",
    bgGradient: "from-amber-100 to-amber-200",
    icon: "shell",
    description: "The shores where your expedition begins. Ancient footprints lead past weathered driftwood."
  },
  {
    id: 1,
    name: "Whispering Jungle",
    shortName: "Jungle",
    x: 32,
    y: 42,
    themeColor: "#10b981",
    bgGradient: "from-emerald-100 to-emerald-200",
    icon: "map",
    description: "Vines weave like infinite recursive loops through ancient canopy shadows."
  },
  {
    id: 2,
    name: "Echoing Cave",
    shortName: "Cave",
    x: 52,
    y: 68,
    themeColor: "#6366f1",
    bgGradient: "from-indigo-100 to-indigo-200",
    icon: "flame",
    description: "A dark cavern illuminated by bioluminescent moss where stray syntax bugs lurk in the cracks."
  },
  {
    id: 3,
    name: "Crystal Waterfall",
    shortName: "Waterfall",
    x: 62,
    y: 28,
    themeColor: "#06b6d4",
    bgGradient: "from-cyan-100 to-cyan-200",
    icon: "key",
    description: "Cascading torrents pouring into a pristine lagoon in rhythmically doubling pulses."
  },
  {
    id: 4,
    name: "Ancient Sun Temple",
    shortName: "Ancient Temple",
    x: 78,
    y: 52,
    themeColor: "#eab308",
    bgGradient: "from-yellow-100 to-amber-200",
    icon: "gem",
    description: "Mystic stone altars carved with fragmented C routines that await harmonious order."
  },
  {
    id: 5,
    name: "Vault of the Treasure Chamber",
    shortName: "Treasure Chamber",
    x: 88,
    y: 22,
    themeColor: "#f97316",
    bgGradient: "from-amber-200 to-yellow-300",
    icon: "crown",
    description: "The summit vault sealed with a brass four-dial cipher requiring the 4 quest digits."
  }
];

export const CLUES: ClueData[] = [
  {
    id: 0,
    locationName: "Beach",
    subtitle: "Clue #1: The Marine Oracle's Riddle",
    itemName: "Conch of Standard I/O",
    itemIcon: "🐚",
    itemLore: "Whispers the foundational truths of C input/output streams.",
    digitAwarded: "2",
    digitNote: "Awarded from Option #2 (printf) — First digit of the Vault Lock: 2",
    promptTitle: "The Voice in the Sand",
    promptDescription: "An ancient nautical riddle is inscribed upon a weathered driftwood signboard:",
    type: "multiple_choice",
    mcOptions: [
      { id: 1, text: "scanf()", code: "scanf(\"%d\", &x);" },
      { id: 2, text: "printf()", code: "printf(\"Hello World!\\n\");" },
      { id: 3, text: "cout", code: "cout << \"Hello World!\";" },
      { id: 4, text: "print()", code: "print(\"Hello World!\")" },
    ],
    correctOptionId: 2,
    hintText: "Remember: In C, we include <stdio.h> for standard I/O. One function reads keyboard input, while another prints formatted output to screen. C++ uses 'cout' and Python uses 'print()'.",
    explanation: "`printf()` is the standard C library function declared in `<stdio.h>` used to output formatted text to stdout."
  },
  {
    id: 1,
    locationName: "Jungle",
    subtitle: "Clue #2: The Vine Loop Oracle",
    itemName: "Island Map Fragment",
    itemIcon: "🗺️",
    itemLore: "A parchment revealing the winding trails of control flow.",
    digitAwarded: "6",
    digitNote: "Awarded from the loop's final count output — Second digit of the Vault Lock: 6",
    promptTitle: "Predict the Jungle Loop Output",
    promptDescription: "Monkeys have carved a short C loop onto a bamboo stalk. Trace its execution carefully:",
    type: "predict_output",
    codeSnippet: `#include <stdio.h>

int main() {
    int count = 0;
    for (int i = 1; i <= 3; i++) {
        count += 2;
    }
    printf("%d", count);
    return 0;
}`,
    expectedOutput: "6",
    hintText: "Trace each step of the loop:\n• Before loop: count = 0\n• i = 1: count becomes 0 + 2 = 2\n• i = 2: count becomes 2 + 2 = 4\n• i = 3: count becomes 4 + 2 = 6\n• i = 4: loop terminates (4 <= 3 is false).\nWhat number is printed?",
    explanation: "The loop iterates exactly 3 times (i = 1, 2, 3). In each iteration, `count` increases by 2. Total: 2 + 2 + 2 = 6."
  },
  {
    id: 2,
    locationName: "Cave",
    subtitle: "Clue #3: The Bug in the Shadows",
    itemName: "Torch of Debugging",
    itemIcon: "🔥",
    itemLore: "Its fire illuminates sneaky assignment errors disguised as comparisons.",
    digitAwarded: "4",
    digitNote: "Awarded from Buggy Line #4 — Third digit of the Vault Lock: 4",
    promptTitle: "Find the Critical Bug",
    promptDescription: "Click on the line containing the notorious logic error that confuses many first-year C programmers:",
    type: "find_bug",
    bugLines: [
      { lineNum: 1, code: "#include <stdio.h>", isBug: false },
      { lineNum: 2, code: "int main() {", isBug: false },
      { lineNum: 3, code: "    int treasure_found = 0;", isBug: false },
      { lineNum: 4, code: "    if (treasure_found = 1) {", isBug: true },
      { lineNum: 5, code: "        printf(\"Treasure unlocked!\\n\");", isBug: false },
      { lineNum: 6, code: "    }", isBug: false },
      { lineNum: 7, code: "    return 0;", isBug: false },
      { lineNum: 8, code: "}", isBug: false }
    ],
    hintText: "Examine line 4 carefully! In C, '=' is the assignment operator, whereas '==' is the relational equality operator. Putting a single '=' inside an if condition assigns the value rather than checking it!",
    explanation: "Line 4 has a critical bug: `if (treasure_found = 1)` assigns 1 to `treasure_found` instead of testing equality with `==`. In C, this assignment yields 1 (truthy), so the if-block executes unconditionally!"
  },
  {
    id: 3,
    locationName: "Waterfall",
    subtitle: "Clue #4: The Memory Expansion Sequence",
    itemName: "Key of Loops",
    itemIcon: "🗝️",
    itemLore: "Unlocks the secret of exponential capacity growth.",
    digitAwarded: "8",
    digitNote: "Awarded from the sequence answer — Fourth digit of the Vault Lock: 8",
    promptTitle: "Complete the Sequence",
    promptDescription: "The waterfall splashes across stone stepping stones marked with doubling numbers, mimicking dynamic memory buffer expansion in C:",
    type: "pattern_sequence",
    sequencePrefix: "Sequence:",
    sequenceTerms: ["1", "2", "4", "?"],
    correctSequenceAnswer: "8",
    hintText: "Observe the ratio between consecutive numbers: 1 * 2 = 2, 2 * 2 = 4. What is 4 * 2? This is the powers-of-2 sequence (2⁰, 2¹, 2², 2³).",
    explanation: "The terms follow powers of 2 ($2^0=1, 2^1=2, 2^2=4, 2^3=8$). Geometric doubling is commonly used when reallocating dynamic arrays with `realloc()` in C to achieve amortized O(1) push time."
  },
  {
    id: 4,
    locationName: "Ancient Temple",
    subtitle: "Clue #5: The Jumbled Spell of Order",
    itemName: "Sun Gem of Order",
    itemIcon: "💎",
    itemLore: "Harmonizes compilation units and unlocks the path to the Vault.",
    digitAwarded: "KEY",
    digitNote: "The Sun Gem unlocks the door to the final Treasure Chamber!",
    promptTitle: "Assemble the Sacred Program",
    promptDescription: "Arrange the 4 scrambled fragments of this C program in their correct structural compilation order:",
    type: "reorder_code",
    jumbledLines: [
      { id: "line-ret", code: "    return 0;\n}", correctIndex: 3 },
      { id: "line-inc", code: "#include <stdio.h>", correctIndex: 0 },
      { id: "line-prn", code: "    printf(\"Open the sacred gate!\\n\");", correctIndex: 2 },
      { id: "line-main", code: "int main() {", correctIndex: 1 },
    ],
    hintText: "Standard C programs follow a clear hierarchy: 1. Preprocessor headers (#include), 2. main() function entry point, 3. Executable body statements (printf), 4. Exit code (return 0; }).",
    explanation: "A valid C program starts with preprocessor directives (`#include <stdio.h>`), followed by the `main()` signature, executable statements inside braces, and `return 0;` to indicate successful termination."
  },
  {
    id: 5,
    locationName: "Treasure Chamber",
    subtitle: "Final Clue: The Grand 4-Digit Cipher Lock",
    itemName: "Golden Treasure",
    itemIcon: "🏆",
    itemLore: "The mythical treasure of the Isle of C: infinite knowledge and adventure glory!",
    digitAwarded: "WIN",
    digitNote: "Code: 2 6 4 8",
    promptTitle: "Crack the Chamber Vault",
    promptDescription: "The brass vault door has 4 tumbler dials. Enter the 4 secret digits you discovered across your expedition:",
    type: "treasure_lock",
    expectedOutput: "2648",
    hintText: "Review your Quest Journal:\n• Beach: Option #2 (printf)\n• Jungle: Loop output 6\n• Cave: Buggy line 4\n• Waterfall: Pattern term 8\nCombine them: 2 - 6 - 4 - 8!",
    explanation: "The vault door unseals! You combined all 4 digits (2, 6, 4, 8) gathered through C basics, loops, debugging, and memory growth logic."
  }
];

export interface PlayerStats {
  score: number;
  hintsUsed: number;
  wrongAttempts: number;
  elapsedSeconds: number;
  bestScore: number;
}
