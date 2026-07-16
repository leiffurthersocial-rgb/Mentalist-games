// Central data model for The Mentalist Gym.
//
// Everything the user generates lives in a single AppData object persisted to
// localStorage. The schema is versioned so future releases can migrate old
// saves instead of wiping them (see lib/storage.ts).

export const SCHEMA_VERSION = 1;

export type ModuleId =
  | 'kims-game'
  | 'room-recall'
  | 'memory-palace'
  | 'calibration-journal'
  | 'emotion-reader'
  | 'cold-reading'
  | 'abductive-puzzles'
  | 'deduction-drills'
  | 'number-memory'
  | 'speed-matrix'
  | 'fermi-estimation'
  | 'lie-spotter'
  | 'pattern-sequences'
  | 'n-back'
  | 'syllogisms'
  | 'analogies'
  | 'mental-math';

/** One completed practice attempt for any module. */
export interface SessionRecord {
  id: string;
  moduleId: ModuleId;
  /** Normalised score 0–100 (usually accuracy). */
  score: number;
  durationMs: number;
  timestamp: number; // epoch ms
  /** Optional module-specific detail (e.g. difficulty level, card count). */
  meta?: Record<string, unknown>;
}

/** Rolled-up progress shown on the dashboard cards. */
export interface ModuleProgress {
  bestScore: number;
  sessions: number;
  lastPracticed: number | null; // epoch ms
  totalTimeMs: number;
}

/** A single forecast tracked by the Calibration & Prediction Journal. */
export interface Prediction {
  id: string;
  text: string;
  confidence: number; // 0–100, the user's stated probability it comes true
  createdAt: number;
  resolveBy: number; // epoch ms
  outcome: 'pending' | 'true' | 'false';
  resolvedAt?: number;
}

/** A user-defined memory palace (an ordered list of loci). */
export interface MemoryPalace {
  id: string;
  name: string;
  loci: string[];
}

/** Per-emotion running tally for the Emotion Reader blind-spot chart. */
export interface EmotionStat {
  correct: number;
  total: number;
}

export type Theme = 'dark' | 'light';

/** The complete, serialisable application state. */
export interface AppData {
  schemaVersion: number;
  createdAt: number;
  theme: Theme;
  progress: Partial<Record<ModuleId, ModuleProgress>>;
  sessions: SessionRecord[];
  predictions: Prediction[];
  palaces: MemoryPalace[];
  /** Free-form per-module settings (difficulty, timers, …). */
  settings: Record<string, Record<string, number | string | boolean>>;
  emotionStats: Record<string, EmotionStat>;
  streak: {
    current: number;
    longest: number;
    lastDay: string | null; // YYYY-MM-DD of last practice
  };
  dailyRoutine: {
    lastCompletedDay: string | null; // YYYY-MM-DD
  };
}

/** Metadata describing a training module for the registry/dashboard. */
export interface ModuleMeta {
  id: ModuleId;
  name: string;
  emoji: string;
  tagline: string;
  /** The real-world skill this module trains. */
  skill: string;
  category:
    | 'Observation'
    | 'Memory'
    | 'Reasoning'
    | 'People-reading'
    | 'Problem-solving'
    | 'Cognitive';
  /** Included in the core daily routine when true. */
  core: boolean;
  /** "Why this works" blurb + recommended reading. */
  why: string;
  book: string;
}
