// Kim's Game — study a grid of objects, then select which were present from a
// larger set. Difficulty raises object count and shrinks study time.

import { useMemo, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { TimerRing } from '../../components/TimerRing';
import { useApp } from '../../context/AppState';
import { useCountdown } from '../../lib/useCountdown';
import { getModule } from '../../lib/registry';
import { cx } from '../../lib/utils';
import { makeRound } from './objects';

const META = getModule('kims-game')!;
type Phase = 'idle' | 'study' | 'recall' | 'result';

// Difficulty presets: [object count, study seconds].
const LEVELS = [
  { name: 'Warm-up', count: 8, study: 30 },
  { name: 'Steady', count: 12, study: 25 },
  { name: 'Sharp', count: 16, study: 18 },
  { name: 'Elite', count: 20, study: 12 },
  { name: 'Master', count: 24, study: 8 },
];

export default function KimsGame() {
  const { recordSession, getSetting, setSetting } = useApp();
  const level = getSetting('kims-game', 'level', 0) as number;
  const preset = LEVELS[level] ?? LEVELS[0];

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(() => makeRound(preset.count));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState<{ score: number; hits: number; falsePos: number } | null>(
    null,
  );

  const timer = useCountdown(() => setPhase('recall'));

  const presentSet = useMemo(() => new Set(round.present), [round]);

  function begin() {
    const r = makeRound(preset.count);
    setRound(r);
    setSelected(new Set());
    setResult(null);
    setStartedAt(Date.now());
    setPhase('study');
    timer.start(preset.study);
  }

  function toggle(obj: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(obj)) next.delete(obj);
      else next.add(obj);
      return next;
    });
  }

  function submit() {
    let hits = 0;
    let falsePos = 0;
    selected.forEach((obj) => {
      if (presentSet.has(obj)) hits += 1;
      else falsePos += 1;
    });
    // Accuracy rewards true hits and penalises false positives, normalised to
    // the number of objects that were actually present.
    const raw = (hits - falsePos) / preset.count;
    const score = Math.max(0, Math.round(raw * 100));
    setResult({ score, hits, falsePos });
    setPhase('result');
    recordSession('kims-game', score, Date.now() - startedAt, {
      level: preset.name,
      count: preset.count,
    });
  }

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5">
            <h3 className="mb-3 font-serif text-lg">Choose a difficulty</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LEVELS.map((l, i) => (
                <button
                  key={l.name}
                  onClick={() => setSetting('kims-game', 'level', i)}
                  className={cx(
                    'rounded-xl border p-3 text-left transition-colors',
                    i === level
                      ? 'border-brass-500 bg-brass-500/10'
                      : 'border-ink-200 hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-700',
                  )}
                >
                  <div className="text-sm font-medium">{l.name}</div>
                  <div className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                    {l.count} objects · {l.study}s
                  </div>
                </button>
              ))}
            </div>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start round
            </Button>
          </div>
          <p className="text-center text-sm text-ink-500 dark:text-ink-400">
            Study the tray, then pick every object you saw from the larger set.
          </p>
        </div>
      )}

      {phase === 'study' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Memorise these {preset.count} objects…
            </p>
            <TimerRing remaining={timer.remaining} total={preset.study} />
          </div>
          <Panel className="p-5">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {round.present.map((obj, i) => (
                <div
                  key={obj + i}
                  className="flex aspect-square items-center justify-center rounded-xl bg-ink-100 text-4xl dark:bg-ink-800 sm:text-5xl"
                >
                  {obj}
                </div>
              ))}
            </div>
          </Panel>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setPhase('recall')}>
              I'm ready →
            </Button>
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div className="space-y-5">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Select every object that was on the tray. ({selected.size} selected)
          </p>
          <Panel className="p-5">
            <div className="grid grid-cols-5 gap-3 sm:grid-cols-6">
              {round.choices.map((obj, i) => {
                const isSel = selected.has(obj);
                return (
                  <button
                    key={obj + i}
                    onClick={() => toggle(obj)}
                    aria-pressed={isSel}
                    className={cx(
                      'flex aspect-square items-center justify-center rounded-xl text-3xl transition-all sm:text-4xl',
                      isSel
                        ? 'bg-brass-500/25 ring-2 ring-brass-500'
                        : 'bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700',
                    )}
                  >
                    {obj}
                  </button>
                );
              })}
            </div>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={submit}>
              Check my recall
            </Button>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={result.score}
              detail={
                <div className="mt-4 flex justify-center gap-8">
                  <Stat value={`${result.hits}/${preset.count}`} label="correct" />
                  <Stat value={result.falsePos} label="false picks" />
                </div>
              }
            />
          </Panel>
          <Panel className="p-5">
            <h3 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-400">
              The tray held:
            </h3>
            <div className="flex flex-wrap gap-2">
              {round.present.map((obj, i) => (
                <span
                  key={obj + i}
                  className={cx(
                    'flex h-11 w-11 items-center justify-center rounded-lg text-2xl',
                    selected.has(obj)
                      ? 'bg-emerald-500/20 ring-1 ring-emerald-500'
                      : 'bg-red-500/15 ring-1 ring-red-400',
                  )}
                  title={selected.has(obj) ? 'You got it' : 'You missed this'}
                >
                  {obj}
                </span>
              ))}
            </div>
          </Panel>
          <div className="flex justify-center gap-3">
            <Button onClick={begin}>Play again</Button>
            <Button variant="outline" onClick={() => setPhase('idle')}>
              Change difficulty
            </Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
