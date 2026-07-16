// Speed Matrix — a spatial working-memory drill inspired by the Kyoto chimp
// experiments. Numbers appear on a grid, flash briefly, then hide; you tap the
// cells in ascending order from memory. Clear a round and the count grows.

import { useEffect, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx, sample } from '../../lib/utils';

const META = getModule('speed-matrix')!;
const COLS = 5;
const ROWS = 5;
const CELLS = COLS * ROWS;
const START_N = 4;

type Phase = 'idle' | 'study' | 'recall' | 'feedback' | 'result';

interface Placement {
  cell: number; // 0..CELLS-1
  value: number; // 1..N
}

export default function SpeedMatrix() {
  const { recordSession, getSetting, setSetting } = useApp();
  const revealMode = getSetting('speed-matrix', 'revealMode', 'timed') as string;

  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(START_N);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [next, setNext] = useState(1);
  const [cleared, setCleared] = useState<Set<number>>(new Set());
  const [failed, setFailed] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const studyTimer = useRef<number>(0);

  const byCell = new Map(placements.map((p) => [p.cell, p.value]));

  useEffect(() => {
    if (phase !== 'study' || revealMode !== 'timed') return;
    const ms = 900 + count * 350;
    studyTimer.current = window.setTimeout(() => setPhase('recall'), ms);
    return () => clearTimeout(studyTimer.current);
  }, [phase, count, revealMode]);

  function begin() {
    setCount(START_N);
    setStartedAt(Date.now());
    presentRound(START_N);
  }

  function presentRound(n: number) {
    const cells = sample(
      Array.from({ length: CELLS }, (_, i) => i),
      n,
    );
    setPlacements(cells.map((cell, i) => ({ cell, value: i + 1 })));
    setNext(1);
    setCleared(new Set());
    setFailed(false);
    // Timed mode shows a study flash first; click mode goes straight to recall
    // with numbers visible until the first tap.
    setPhase(revealMode === 'click' ? 'recall' : 'study');
  }

  function clickCell(cell: number) {
    if (phase !== 'recall') return;
    const value = byCell.get(cell);
    if (value === next) {
      const nc = new Set(cleared);
      nc.add(cell);
      setCleared(nc);
      if (next === count) {
        // Round cleared — advance.
        window.setTimeout(() => {
          const nextN = count + 1;
          setCount(nextN);
          presentRound(nextN);
        }, 450);
      } else {
        setNext(next + 1);
      }
    } else {
      // Wrong tile — end the run at the count last fully cleared.
      setFailed(true);
      setPhase('feedback');
      const clearedCount = count - START_N; // fully cleared rounds
      const score = normalizeScore('speed-matrix', count - 1);
      recordSession('speed-matrix', score, Date.now() - startedAt, {
        reached: count,
        roundsCleared: clearedCount,
      });
      window.setTimeout(() => setPhase('result'), 1100);
    }
  }

  const reached = count - 1;
  const finalScore = normalizeScore('speed-matrix', reached);

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5">
            <label className="mb-2 block text-sm font-medium">Reveal style</label>
            <div className="flex gap-2">
              {(
                [
                  ['timed', 'Timed flash'],
                  ['click', 'Hide on first tap'],
                ] as [string, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setSetting('speed-matrix', 'revealMode', id)}
                  className={cx(
                    'flex-1 rounded-xl border p-3 text-sm transition-colors',
                    revealMode === id
                      ? 'border-brass-500 bg-brass-500/10'
                      : 'border-ink-200 hover:border-ink-300 dark:border-ink-800',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
              Numbers appear on the grid. In <strong>Timed flash</strong> they vanish after a moment;
              in <strong>Hide on first tap</strong> they stay until you tap “1”, then all hide. Tap
              the rest in order from memory. Each cleared round adds a number.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start
            </Button>
          </div>
        </div>
      )}

      {(phase === 'study' || phase === 'recall' || phase === 'feedback') && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Pill tone="brass">{count} numbers</Pill>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              {phase === 'study'
                ? 'Memorise…'
                : phase === 'recall'
                  ? revealMode === 'click' && next === 1
                    ? 'Tap 1 when ready'
                    : `Tap ${next}`
                  : failed
                    ? 'Missed!'
                    : ''}
            </span>
          </div>

          <div
            className="mx-auto grid aspect-square w-full max-w-md gap-2"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: CELLS }, (_, cell) => {
              const value = byCell.get(cell);
              const active = value !== undefined;
              const isCleared = cleared.has(cell);
              // Numbers are visible during the timed study flash, during the
              // click-mode "pre-tap" moment, and on the reveal after a miss.
              const showNumber =
                active &&
                (phase === 'study' ||
                  (revealMode === 'click' && phase === 'recall' && next === 1) ||
                  (phase === 'feedback' && failed));
              const clickable = phase === 'recall';
              return (
                <button
                  key={cell}
                  onClick={() => clickCell(cell)}
                  disabled={!clickable}
                  aria-label={showNumber ? `Cell ${value}` : active ? 'Hidden number cell' : 'Empty cell'}
                  className={cx(
                    'flex items-center justify-center rounded-lg font-serif text-xl transition-colors sm:text-2xl',
                    isCleared
                      ? 'bg-emerald-500 text-white'
                      : showNumber
                        ? 'bg-brass-500/20 text-ink-900 dark:text-ink-50'
                        : active && clickable
                          ? 'bg-ink-200 hover:bg-brass-500/30 dark:bg-ink-700'
                          : 'bg-ink-100 dark:bg-ink-800/60',
                    phase === 'feedback' && failed && active && !isCleared && 'ring-1 ring-red-400',
                  )}
                >
                  {showNumber ? value : ''}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={finalScore}
              detail={<Stat value={reached} label="numbers reached" />}
            />
            <ScoreMeaning moduleId="speed-matrix" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
