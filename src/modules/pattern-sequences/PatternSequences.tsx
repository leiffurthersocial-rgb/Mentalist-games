// Pattern Sequences — infer the rule behind a run of numbers and pick the next.
// Puzzles are generated on the fly across several rule families.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { cx } from '../../lib/utils';
import { generateSequence, Sequence } from './sequences';

const META = getModule('pattern-sequences')!;
const ROUND_SIZE = 8;
type Phase = 'idle' | 'play' | 'result';

export default function PatternSequences() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [puzzle, setPuzzle] = useState<Sequence>(() => generateSequence());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  function begin() {
    setPuzzle(generateSequence());
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setStartedAt(Date.now());
    setPhase('play');
  }

  function pick(value: number) {
    if (picked !== null) return;
    setPicked(value);
    if (value === puzzle.answer) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= ROUND_SIZE) {
      const score = Math.round((correct / ROUND_SIZE) * 100);
      recordSession('pattern-sequences', score, Date.now() - startedAt, { round: ROUND_SIZE });
      setPhase('result');
      return;
    }
    setPuzzle(generateSequence());
    setIndex(index + 1);
    setPicked(null);
  }

  const gotIt = picked !== null && picked === puzzle.answer;
  const finalScore = Math.round((correct / ROUND_SIZE) * 100);

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              Each puzzle shows a run of numbers following a hidden rule. Work out the rule — the{' '}
              <em>simplest</em> one that fits — and choose the next number. Rules include arithmetic
              steps, doubling, sums of previous terms, alternating jumps, and growing differences.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start ({ROUND_SIZE} sequences)
            </Button>
          </div>
        </div>
      )}

      {phase === 'play' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
            <span>
              {index + 1} / {ROUND_SIZE}
            </span>
            <span>{correct} correct</span>
          </div>

          <Panel className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {puzzle.terms.map((t, i) => (
                <span
                  key={i}
                  className="flex h-14 min-w-[3.5rem] items-center justify-center rounded-xl bg-ink-100 px-3 font-serif text-2xl text-ink-900 dark:bg-ink-800 dark:text-ink-50"
                >
                  {t}
                </span>
              ))}
              <span className="text-2xl text-ink-400">→</span>
              <span
                className={cx(
                  'flex h-14 min-w-[3.5rem] items-center justify-center rounded-xl px-3 font-serif text-2xl',
                  picked === null
                    ? 'border-2 border-dashed border-brass-400 text-brass-500'
                    : gotIt
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white',
                )}
              >
                {picked === null ? '?' : puzzle.answer}
              </span>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {puzzle.options.map((opt) => {
              const revealed = picked !== null;
              const isAnswer = opt === puzzle.answer;
              const isPicked = opt === picked;
              return (
                <button
                  key={opt}
                  disabled={revealed}
                  onClick={() => pick(opt)}
                  className={cx(
                    'rounded-xl border py-3 font-serif text-xl transition-colors',
                    !revealed && 'border-ink-200 hover:border-brass-400 hover:bg-brass-500/5 dark:border-ink-800',
                    revealed && isAnswer && 'border-emerald-500 bg-emerald-500/15',
                    revealed && isPicked && !isAnswer && 'border-red-500 bg-red-500/15',
                    revealed && !isAnswer && !isPicked && 'border-ink-200 opacity-50 dark:border-ink-800',
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <>
              <Panel className="animate-fade-up p-4 text-center text-sm text-ink-600 dark:text-ink-300">
                <span className="font-medium text-ink-900 dark:text-ink-50">The rule:</span>{' '}
                {puzzle.rule}.
              </Panel>
              <div className="flex justify-center">
                <Button onClick={next}>{index + 1 >= ROUND_SIZE ? 'See score' : 'Next'}</Button>
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
              detail={<Stat value={`${correct}/${ROUND_SIZE}`} label="correct" />}
            />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
