// Deduction Drills — choose the best-supported conclusion, THEN name the clue
// that supports it. Both must be right to score the item, separating real
// inference from a lucky guess.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx, sample } from '../../lib/utils';
import { DRILLS, Drill } from './data';

const META = getModule('deduction-drills')!;
const ROUND_SIZE = 6;
type Phase = 'idle' | 'conclude' | 'evidence' | 'reveal' | 'result';

export default function DeductionDrills() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<Drill[]>([]);
  const [index, setIndex] = useState(0);
  const [pickedConclusion, setPickedConclusion] = useState<number | null>(null);
  const [pickedClue, setPickedClue] = useState<number | null>(null);
  const [score, setScore] = useState(0); // points: 1 per correct conclusion, 1 per correct clue
  const [startedAt, setStartedAt] = useState(0);

  const drill = queue[index];

  function begin() {
    setQueue(sample(DRILLS, Math.min(ROUND_SIZE, DRILLS.length)));
    setIndex(0);
    setPickedConclusion(null);
    setPickedClue(null);
    setScore(0);
    setStartedAt(Date.now());
    setPhase('conclude');
  }

  function chooseConclusion(i: number) {
    setPickedConclusion(i);
    setPhase('evidence');
  }

  function chooseClue(i: number) {
    setPickedClue(i);
    const conclusionRight = pickedConclusion === drill.answer;
    const clueRight = i === drill.keyClue;
    setScore((s) => s + (conclusionRight ? 1 : 0) + (clueRight ? 1 : 0));
    setPhase('reveal');
  }

  function next() {
    if (index + 1 >= queue.length) {
      const finalPct = normalizeScore('deduction-drills', score / (queue.length * 2));
      recordSession('deduction-drills', finalPct, Date.now() - startedAt, {
        drills: queue.length,
      });
      setPhase('result');
      return;
    }
    setIndex((i) => i + 1);
    setPickedConclusion(null);
    setPickedClue(null);
    setPhase('conclude');
  }

  const finalPct = queue.length ? normalizeScore('deduction-drills', score / (queue.length * 2)) : 0;

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              Each drill gives you a scene and a few clues. First pick the conclusion the evidence{' '}
              <em>best supports</em> — not merely one that sounds plausible. Then name the single
              clue that most directly backs it. Traceable reasoning beats a good hunch.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Begin drills
            </Button>
          </div>
        </div>
      )}

      {drill && phase !== 'idle' && phase !== 'result' && (
        <div className="space-y-5">
          <div className="text-sm text-ink-500 dark:text-ink-400">
            Drill {index + 1} / {queue.length}
          </div>

          <Panel className="p-5">
            <p className="mb-3 font-serif text-lg">{drill.scene}</p>
            <ul className="space-y-2">
              {drill.clues.map((c, i) => {
                const highlight =
                  phase === 'reveal' &&
                  (i === drill.keyClue || i === pickedClue);
                const isKey = i === drill.keyClue;
                return (
                  <li
                    key={i}
                    className={cx(
                      'flex gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                      phase === 'evidence'
                        ? 'cursor-pointer hover:bg-ink-100 dark:hover:bg-ink-800'
                        : '',
                      highlight && isKey && 'bg-emerald-500/15',
                      highlight && !isKey && i === pickedClue && 'bg-red-500/15',
                      !highlight && 'bg-ink-50 dark:bg-ink-900/40',
                    )}
                    onClick={phase === 'evidence' ? () => chooseClue(i) : undefined}
                    role={phase === 'evidence' ? 'button' : undefined}
                    tabIndex={phase === 'evidence' ? 0 : undefined}
                    onKeyDown={
                      phase === 'evidence'
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              chooseClue(i);
                            }
                          }
                        : undefined
                    }
                  >
                    <span className="text-brass-500">{String.fromCharCode(65 + i)}.</span>
                    <span>{c}</span>
                  </li>
                );
              })}
            </ul>
            {phase === 'evidence' && (
              <p className="mt-3 text-xs text-brass-600 dark:text-brass-300">
                Now click the clue that most supports your conclusion.
              </p>
            )}
          </Panel>

          {phase === 'conclude' && (
            <div className="space-y-2">
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Which conclusion does the evidence best support?
              </p>
              {drill.conclusions.map((c, i) => (
                <button
                  key={i}
                  onClick={() => chooseConclusion(i)}
                  className="flex w-full items-center gap-3 rounded-xl border border-ink-200 p-3 text-left text-sm transition-colors hover:border-brass-400 dark:border-ink-800"
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {phase === 'evidence' && (
            <Panel className="p-3 text-sm text-ink-600 dark:text-ink-300">
              Your conclusion:{' '}
              <span className="font-medium text-ink-900 dark:text-ink-50">
                {drill.conclusions[pickedConclusion!]}
              </span>
            </Panel>
          )}

          {phase === 'reveal' && (
            <>
              <Panel
                className={cx(
                  'p-4 text-sm',
                  pickedConclusion === drill.answer
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-red-500/40 bg-red-500/5',
                )}
              >
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  <span
                    className={
                      pickedConclusion === drill.answer ? 'text-emerald-500' : 'text-red-500'
                    }
                  >
                    Conclusion {pickedConclusion === drill.answer ? '✓' : '✗'}
                  </span>
                  <span className={pickedClue === drill.keyClue ? 'text-emerald-500' : 'text-red-500'}>
                    Key clue {pickedClue === drill.keyClue ? '✓' : '✗'}
                  </span>
                </div>
                <p className="mb-1 text-ink-800 dark:text-ink-100">
                  Best conclusion:{' '}
                  <span className="font-medium">{drill.conclusions[drill.answer]}</span>{' '}
                  (clue {String.fromCharCode(65 + drill.keyClue)})
                </p>
                <p className="text-ink-600 dark:text-ink-300">{drill.explanation}</p>
              </Panel>
              <div className="flex justify-center">
                <Button onClick={next}>
                  {index + 1 >= queue.length ? 'See score' : 'Next drill'}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={finalPct}
              detail={<Stat value={`${score}/${queue.length * 2}`} label="points" />}
            />
            <ScoreMeaning moduleId="deduction-drills" score={finalPct} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
