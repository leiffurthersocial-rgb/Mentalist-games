// Normalised scoring. Every module produces a "raw" performance metric in its
// own natural units (an accuracy fraction, a digit span, a count of correct
// answers…). This file maps that raw metric onto a common 0–100 scale anchored
// so that:
//
//   • 50  ≈ what a typical, untrained adult scores
//   • 90  ≈ strong, well-practised performance
//   • 0   ≈ pure guessing / the floor for that task
//
// That means a 50 is genuinely meaningful across games whose raw accuracy would
// never naturally be 50% (e.g. lie detection, where humans hover barely above
// chance, or memory-span tasks measured in items rather than percentages).

import { ModuleId } from '../types';

export interface ScoreModel {
  /** Raw metric a pure guesser / the task floor reaches → maps to 0. */
  chance: number;
  /** Raw metric a typical untrained adult reaches → maps to 50. */
  average: number;
  /** Raw metric indicating strong, practised performance → maps to 90. */
  strong: number;
  /** Plain-language note about the metric and the human baseline. */
  meaning: string;
}

export const SCORE_MODELS: Record<ModuleId, ScoreModel> = {
  // Fraction-based (raw = accuracy 0–1) --------------------------------------
  'kims-game': {
    chance: 0.15,
    average: 0.6,
    strong: 0.92,
    meaning: 'Most people recall roughly 60% of a tray accurately — that earns about 50.',
  },
  'room-recall': {
    chance: 0.3,
    average: 0.6,
    strong: 0.92,
    meaning: 'A typical observer answers about 6 in 10 detail questions correctly (≈50).',
  },
  'memory-palace': {
    chance: 0.05,
    average: 0.35,
    strong: 0.85,
    meaning: 'Without a technique, people place only about a third of a sequence correctly (≈50).',
  },
  'emotion-reader': {
    chance: 0.14,
    average: 0.6,
    strong: 0.9,
    meaning: 'People read basic emotions correctly about 60% of the time (≈50).',
  },
  'cold-reading': {
    chance: 0.4,
    average: 0.62,
    strong: 0.92,
    meaning: 'Untrained, most people classify these a little above chance (≈50).',
  },
  'deduction-drills': {
    chance: 0.28,
    average: 0.55,
    strong: 0.9,
    meaning: 'Picking the conclusion AND its supporting clue is hard — average lands near 50.',
  },
  'lie-spotter': {
    chance: 0.33,
    average: 0.5,
    strong: 0.85,
    meaning: 'Humans detect lies barely above chance (~54%), so average here is about 50.',
  },
  'pattern-sequences': {
    chance: 0.25,
    average: 0.6,
    strong: 0.95,
    meaning: 'People solve about 6 in 10 of these sequences (≈50).',
  },
  'abductive-puzzles': {
    chance: 0.15,
    average: 0.5,
    strong: 0.9,
    meaning: 'Scored on how many explanations you generate and whether you reach the best one.',
  },
  'calibration-journal': {
    // Metric is the Brier contribution (forecast − outcome)²; LOWER is better,
    // so strong sits below average and the model auto-inverts. A 50%-confident
    // "coin flip" always yields 0.25 → about 50.
    chance: 1.0,
    average: 0.25,
    strong: 0.05,
    meaning: 'Based on your Brier accuracy — a 50/50 coin-flip forecast scores about 50.',
  },
  'fermi-estimation': {
    chance: 0.1,
    average: 0.4,
    strong: 0.85,
    meaning: 'Most people are overconfident — only ~40% of their 90% ranges actually contain the truth (≈50).',
  },
  'syllogisms': {
    chance: 0.5,
    average: 0.62,
    strong: 0.92,
    meaning: 'Belief-bias trips people up — average validity judgement is a little above chance (≈50).',
  },
  'analogies': {
    chance: 0.25,
    average: 0.6,
    strong: 0.95,
    meaning: 'A typical adult gets about 6 in 10 verbal analogies (≈50).',
  },
  // Count-based (raw = a count in the metric's own units) --------------------
  'number-memory': {
    chance: 2,
    average: 7,
    strong: 12,
    meaning: 'The classic digit span is 7 ± 2, so a span of 7 scores about 50.',
  },
  'speed-matrix': {
    chance: 3,
    average: 6,
    strong: 11,
    meaning: 'Reaching about 6 numbers is typical (≈50); trained players push well past 10.',
  },
  'n-back': {
    chance: 0.5,
    average: 0.72,
    strong: 0.95,
    meaning: 'Guessing scores ~50% accuracy; a typical first attempt at 2-back is around 72% (≈50 here).',
  },
  'mental-math': {
    chance: 2,
    average: 9,
    strong: 20,
    meaning: 'Solving about 9 problems in the time limit is average (≈50).',
  },
};

/** Map a raw metric to the 0–100 scale for the given module. */
export function normalizeScore(moduleId: ModuleId, raw: number): number {
  return applyModel(raw, SCORE_MODELS[moduleId]);
}

export function applyModel(raw: number, m: ScoreModel): number {
  const { chance, average, strong } = m;
  // Support "lower is better" metrics (e.g. Brier score) by detecting when the
  // strong anchor sits below the average anchor and inverting the direction.
  const inverted = strong < average;
  let s: number;
  if (!inverted) {
    if (raw <= chance) s = 0;
    else if (raw <= average) s = ((raw - chance) / (average - chance)) * 50;
    else s = 50 + ((raw - average) / (strong - average)) * 40;
  } else {
    if (raw >= chance) s = 0;
    else if (raw >= average) s = ((chance - raw) / (chance - average)) * 50;
    else s = 50 + ((average - raw) / (average - strong)) * 40;
  }
  return Math.round(Math.max(0, Math.min(100, s)));
}

/** A short qualitative band for a normalised score. */
export function scoreBand(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 72) return 'Well above average';
  if (score >= 56) return 'Above average';
  if (score >= 44) return 'About average';
  if (score >= 28) return 'Below average';
  return 'Room to grow';
}

export function scoreMeaning(moduleId: ModuleId): string {
  return SCORE_MODELS[moduleId].meaning;
}
