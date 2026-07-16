// Scoring, streak, and calibration math.

import { AppData, ModuleId, Prediction, SessionRecord } from '../types';
import { dayKey, daysBetween } from './utils';

/**
 * Fold a finished session into AppData: append the record, update the module's
 * rolled-up progress, and advance the daily streak. Returns a new AppData
 * (callers should treat state as immutable).
 */
export function recordSession(
  data: AppData,
  moduleId: ModuleId,
  score: number,
  durationMs: number,
  meta?: Record<string, unknown>,
): AppData {
  const session: SessionRecord = {
    id: Math.random().toString(36).slice(2),
    moduleId,
    score: Math.round(score),
    durationMs,
    timestamp: Date.now(),
    meta,
  };

  const prev = data.progress[moduleId];
  const progress = {
    bestScore: Math.max(prev?.bestScore ?? 0, Math.round(score)),
    sessions: (prev?.sessions ?? 0) + 1,
    lastPracticed: session.timestamp,
    totalTimeMs: (prev?.totalTimeMs ?? 0) + durationMs,
  };

  return {
    ...data,
    sessions: [...data.sessions, session],
    progress: { ...data.progress, [moduleId]: progress },
    streak: advanceStreak(data.streak),
  };
}

/** Advance the day-streak given a practice happening "now". */
export function advanceStreak(streak: AppData['streak']): AppData['streak'] {
  const today = dayKey();
  if (streak.lastDay === today) return streak; // already counted today

  let current = 1;
  if (streak.lastDay) {
    const gap = daysBetween(streak.lastDay, today);
    current = gap === 1 ? streak.current + 1 : 1;
  }
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastDay: today,
  };
}

/** If the user skipped a day, the *displayed* streak should read 0. */
export function effectiveStreak(streak: AppData['streak']): number {
  if (!streak.lastDay) return 0;
  const gap = daysBetween(streak.lastDay, dayKey());
  if (gap <= 0) return streak.current;
  if (gap === 1) return streak.current; // still today-able; grace of one day
  return 0;
}

export interface OverallStats {
  totalSessions: number;
  totalTimeMs: number;
  streak: number;
  longestStreak: number;
  modulesPracticed: number;
}

export function overallStats(data: AppData): OverallStats {
  const totalTimeMs = data.sessions.reduce((sum, s) => sum + s.durationMs, 0);
  const modulesPracticed = new Set(data.sessions.map((s) => s.moduleId)).size;
  return {
    totalSessions: data.sessions.length,
    totalTimeMs,
    streak: effectiveStreak(data.streak),
    longestStreak: data.streak.longest,
    modulesPracticed,
  };
}

// --- Calibration & Brier ----------------------------------------------------

export interface CalibrationBucket {
  /** Bucket centre label, e.g. "70%". */
  label: string;
  low: number;
  high: number;
  stated: number; // mean stated confidence in bucket (0–1)
  actual: number; // observed hit-rate (0–1)
  count: number;
}

/**
 * Group resolved predictions into confidence buckets and compute the observed
 * hit-rate for each — the raw material for a calibration curve.
 */
export function calibrationBuckets(predictions: Prediction[]): CalibrationBucket[] {
  const resolved = predictions.filter((p) => p.outcome !== 'pending');
  const edges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const buckets: CalibrationBucket[] = [];

  for (let i = 0; i < edges.length - 1; i++) {
    const low = edges[i];
    const high = edges[i + 1];
    const inBucket = resolved.filter((p) => {
      // Confidence below 50 is treated symmetrically: a 20%-confident "true"
      // prediction still belongs in the 20% bucket. We bucket by the stated
      // number directly. Upper edge inclusive only for the final bucket.
      return i === edges.length - 2
        ? p.confidence >= low && p.confidence <= high
        : p.confidence >= low && p.confidence < high;
    });
    if (inBucket.length === 0) continue;
    const stated = inBucket.reduce((s, p) => s + p.confidence, 0) / inBucket.length / 100;
    const actual = inBucket.filter((p) => p.outcome === 'true').length / inBucket.length;
    buckets.push({
      label: `${Math.round(((low + high) / 2))}%`,
      low,
      high,
      stated,
      actual,
      count: inBucket.length,
    });
  }
  return buckets;
}

/**
 * Brier score: mean squared error between stated probability and outcome.
 * 0 is perfect, 0.25 is a coin-flip guesser, 1 is confidently always wrong.
 * Returns null when there is nothing resolved yet.
 */
export function brierScore(predictions: Prediction[]): number | null {
  const resolved = predictions.filter((p) => p.outcome !== 'pending');
  if (resolved.length === 0) return null;
  const sum = resolved.reduce((acc, p) => {
    const forecast = p.confidence / 100;
    const outcome = p.outcome === 'true' ? 1 : 0;
    return acc + (forecast - outcome) ** 2;
  }, 0);
  return sum / resolved.length;
}

/** A short qualitative read on a Brier score. */
export function brierLabel(brier: number | null): string {
  if (brier === null) return 'No resolved predictions yet';
  if (brier <= 0.1) return 'Excellent calibration';
  if (brier <= 0.18) return 'Well calibrated';
  if (brier <= 0.25) return 'Better than a coin flip';
  if (brier <= 0.33) return 'Room to improve';
  return 'Overconfident — trust your certainty less';
}
