// Lie Spotter — three statements, one deceptive. Pick the lie, then see the
// verbal statement-analysis cue that gives it away.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { cx, sample } from '../../lib/utils';
import { LIE_SCENARIOS, LieScenario } from './data';

const META = getModule('lie-spotter')!;
const ROUND_SIZE = 6;
type Phase = 'idle' | 'play' | 'result';

export default function LieSpotter() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<LieScenario[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const current = queue[index];

  function begin() {
    setQueue(sample(LIE_SCENARIOS, ROUND_SIZE));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setStartedAt(Date.now());
    setPhase('play');
  }

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === current.lie) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      const score = Math.round((correct / queue.length) * 100);
      recordSession('lie-spotter', score, Date.now() - startedAt, { round: queue.length });
      setPhase('result');
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  const finalScore = queue.length ? Math.round((correct / queue.length) * 100) : 0;
  const gotItRight = picked !== null && picked === current?.lie;

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              Forget the myth of the perfect "body-language tell". Deception leaks through{' '}
              <strong>language</strong>: distancing words, over-precise detail, unnecessary oaths,
              answering questions nobody asked, and appeals to one's own honesty. You'll read three
              statements and pick the deceptive one, then see the cue that flagged it.
            </p>
            <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
              Real deception detection weighs many weak cues — no single word proves a lie. Treat
              these as signals to investigate, never as verdicts.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start ({ROUND_SIZE} scenarios)
            </Button>
          </div>
        </div>
      )}

      {phase === 'play' && current && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
            <span>
              {index + 1} / {queue.length}
            </span>
            <span>{correct} spotted</span>
          </div>

          <Panel className="p-5">
            <p className="text-xs uppercase tracking-wide text-ink-400">The situation</p>
            <p className="mt-1 text-base text-ink-800 dark:text-ink-100">{current.context}</p>
          </Panel>

          <p className="text-sm text-ink-500 dark:text-ink-400">Which statement is the lie?</p>
          <div className="space-y-2">
            {current.statements.map((s, i) => {
              const revealed = picked !== null;
              const isLie = i === current.lie;
              const isPicked = picked === i;
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => pick(i)}
                  className={cx(
                    'flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                    !revealed && 'border-ink-200 hover:border-brass-400 dark:border-ink-800',
                    revealed && isLie && 'border-red-500 bg-red-500/10',
                    revealed && isPicked && !isLie && 'border-ink-300 bg-ink-100 dark:border-ink-700 dark:bg-ink-800',
                    revealed && !isLie && !isPicked && 'border-ink-200 opacity-50 dark:border-ink-800',
                  )}
                >
                  <span className="mt-0.5 text-ink-400">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-ink-800 dark:text-ink-100">“{s}”</span>
                  {revealed && isLie && <span className="ml-auto text-red-500">🤥</span>}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <>
              <Panel
                className={cx(
                  'animate-fade-up p-4 text-sm',
                  gotItRight ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5',
                )}
              >
                <div className={cx('mb-1 font-medium', gotItRight ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
                  {gotItRight ? '✓ Spotted it' : '✗ That one was true'}
                </div>
                <p className="text-ink-600 dark:text-ink-300">{current.tell}</p>
              </Panel>
              <div className="flex justify-center">
                <Button onClick={next}>{index + 1 >= queue.length ? 'See score' : 'Next'}</Button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={finalScore}
              detail={<Stat value={`${correct}/${queue.length}`} label="lies spotted" />}
            />
            <p className="mt-4 text-center text-sm text-ink-500 dark:text-ink-400">
              {finalScore >= 80
                ? 'A sharp ear for verbal leakage.'
                : 'Watch for distancing language, over-precision, and unprompted honesty claims.'}
            </p>
          </Panel>
          <div className="flex justify-center gap-3">
            <Button onClick={begin}>Another round</Button>
            <Button variant="outline" onClick={() => setPhase('idle')}>
              Done
            </Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
