// The single source of truth for which modules exist and how they're described
// on the dashboard. Adding a module = add an entry here + a component file +
// one line in components/ModuleRoutes.tsx.

import { ModuleMeta } from '../types';

export const MODULES: ModuleMeta[] = [
  {
    id: 'kims-game',
    name: "Kim's Game",
    emoji: '🔍',
    tagline: 'Memorise a tray of objects, then recall what was there.',
    skill: 'Visual attention & working memory',
    category: 'Observation',
    core: true,
    why: "Kim's Game comes from Kipling's novel Kim, where a spy-in-training is drilled on a tray of jewels. It builds the habit of encoding a scene deliberately rather than glancing. Real observation is active: you decide what to notice.",
    book: 'Maria Konnikova — Mastermind: How to Think Like Sherlock Holmes',
  },
  {
    id: 'room-recall',
    name: 'Room Recall',
    emoji: '🪑',
    tagline: 'Study a scene, then answer questions about its details.',
    skill: 'Deliberate observation & recall under questioning',
    category: 'Observation',
    core: true,
    why: 'Eyewitnesses are famously unreliable because attention is selective. Practising recall of a whole scene — counts, colours, positions — trains you to observe broadly and resist filling gaps with assumptions.',
    book: 'Maria Konnikova — Mastermind',
  },
  {
    id: 'memory-palace',
    name: 'Memory Palace',
    emoji: '🏛️',
    tagline: 'Use the method of loci to memorise a deck of cards in order.',
    skill: 'Associative long-term memory (mnemonics)',
    category: 'Memory',
    core: true,
    why: 'Every memory champion uses the method of loci: converting abstract data into vivid images placed along a familiar route. It exploits our strong spatial and visual memory. The PAO (person–action–object) system compresses cards into memorable scenes.',
    book: 'Joshua Foer — Moonwalking with Einstein',
  },
  {
    id: 'calibration-journal',
    name: 'Calibration Journal',
    emoji: '🎯',
    tagline: 'Log predictions with a confidence %, then see if you were right.',
    skill: 'Probabilistic thinking & calibrated confidence',
    category: 'Reasoning',
    core: true,
    why: 'The single most transferable "mentalist" skill is thinking in probabilities and knowing how much to trust your own certainty. Tracking predictions and plotting stated confidence against real hit-rate reveals over- and under-confidence you cannot feel from the inside.',
    book: 'Philip Tetlock — Superforecasting; Daniel Kahneman — Thinking, Fast and Slow',
  },
  {
    id: 'emotion-reader',
    name: 'Emotion Reader',
    emoji: '🎭',
    tagline: 'Identify the emotion behind a scenario, against the clock.',
    skill: 'Reading affect & microexpressions',
    category: 'People-reading',
    core: true,
    why: 'A small set of emotions (happiness, fear, anger, contempt, disgust, sadness, surprise) recur across cultures. Learning their signatures — and, crucially, spotting deviations from a person\'s baseline — is the foundation of people-reading. Track which emotions you miss to find your blind spots.',
    book: 'Paul Ekman — Emotions Revealed',
  },
  {
    id: 'cold-reading',
    name: 'Cold Reading Studio',
    emoji: '🔮',
    tagline: 'Learn the mechanics of Barnum statements — to recognise them.',
    skill: 'Detecting persuasion & vague-language tricks',
    category: 'People-reading',
    core: false,
    why: 'Cold reading works by using statements that feel personal but apply to almost anyone (the Barnum effect), plus high-probability guesses. Understanding the mechanics inoculates you against psychics, con artists, and cult recruiters. This module teaches you to classify the trick, not perform it on people.',
    book: 'Ian Rowland — The Full Facts Book of Cold Reading',
  },
  {
    id: 'abductive-puzzles',
    name: 'Abductive Puzzles',
    emoji: '🧩',
    tagline: 'Generate three explanations before the answer is revealed.',
    skill: 'Abductive reasoning & hypothesis generation',
    category: 'Problem-solving',
    core: false,
    why: 'Abduction is inference to the best explanation. The classic failure is falling in love with your first theory. Forcing yourself to produce three distinct explanations before evaluating any of them keeps the search space open — the habit behind good detectives and diagnosticians.',
    book: 'Maria Konnikova — Mastermind; C. S. Peirce on abduction',
  },
  {
    id: 'deduction-drills',
    name: 'Deduction Drills',
    emoji: '🕵️',
    tagline: 'Pick the best-supported conclusion and name the clue behind it.',
    skill: 'Evidence-based inference vs. guessing',
    category: 'Observation',
    core: false,
    why: 'Holmesian "deduction" is really careful inference: separating what the evidence actually supports from a plausible-sounding leap. Naming exactly which clue backs a conclusion trains you to keep your reasoning traceable instead of intuitive.',
    book: 'Maria Konnikova — Mastermind',
  },
];

export function getModule(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id);
}

export const CORE_MODULES = MODULES.filter((m) => m.core);
