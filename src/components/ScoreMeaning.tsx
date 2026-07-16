// A small explainer shown under a result score: the qualitative band plus the
// per-module note about what the number means (50 = a typical adult).

import { ModuleId } from '../types';
import { scoreBand, scoreMeaning } from '../lib/scoring';

export function ScoreMeaning({ moduleId, score }: { moduleId: ModuleId; score: number }) {
  const band = scoreBand(score);
  return (
    <div className="mt-4 text-center">
      <div className="font-serif text-lg text-brass-600 dark:text-brass-300">{band}</div>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-ink-500 dark:text-ink-400">
        On this scale <strong>50 is a typical adult's result</strong> and 90+ is exceptional.{' '}
        {scoreMeaning(moduleId)}
      </p>
    </div>
  );
}
