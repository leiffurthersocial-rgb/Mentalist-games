// Analogies — "A is to B as C is to ?". Find the relationship in the first pair
// and map it onto the second.

import { useMemo, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { cx, sample, shuffle } from '../../lib/utils';
import { ANALOGIES, Analogy } from './data';

const META = getModule('analogies')!;
const ROUND_SIZE = 10;
type Phase = 'idle' | 'play' | 'result';

export default function Analogies() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<Analogy[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const current = queue[index];
  // Shuffle options once per question.
  const options = useMemo(() => (current ? shuffle(current.options) : []), [current]);

  function begin() {
    setQueue(sample(ANALOGIES, ROUND_SIZE));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setStartedAt(Date.now());
    setPhase('play');
  }

  function pick(opt: string) {
    if (picked !== null) return;
    setPicked(opt);
    if (opt === current.answer) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      const score = normalizeScore('analogies', correct / queue.length);
      recordSession('analogies', score, Date.now() - startedAt, { round: queue.length });
      setPhase('result');
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  const gotIt = picked !== null && picked === current?.answer;
  const finalScore = queue.length ? normalizeScore('analogies', correct / queue.length) : 0;

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              Each puzzle gives you a pair with a hidden relationship, then a third word. Find the
              relationship in the first pair and pick the word that completes the second pair the same
              way. The skill is abstracting the <em>relationship</em>, not the words themselves.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start ({ROUND_SIZE} analogies)
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
            <span>{correct} correct</span>
          </div>

          <Panel className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 font-serif text-xl text-ink-900 dark:text-ink-50 sm:text-2xl">
              <span className="rounded-lg bg-ink-100 px-3 py-1.5 dark:bg-ink-800">{current.a}</span>
              <span className="text-ink-400">is to</span>
              <span className="rounded-lg bg-ink-100 px-3 py-1.5 dark:bg-ink-800">{current.b}</span>
              <span className="mx-1 text-brass-500">::</span>
              <span className="rounded-lg bg-ink-100 px-3 py-1.5 dark:bg-ink-800">{current.c}</span>
              <span className="text-ink-400">is to</span>
              <span
                className={cx(
                  'rounded-lg px-3 py-1.5',
                  picked === null
                    ? 'border-2 border-dashed border-brass-400 text-brass-500'
                    : gotIt
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white',
                )}
              >
                {picked === null ? '?' : current.answer}
              </span>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {options.map((opt) => {
              const revealed = picked !== null;
              const isAnswer = opt === current.answer;
              const isPicked = opt === picked;
              return (
                <button
                  key={opt}
                  disabled={revealed}
                  onClick={() => pick(opt)}
                  className={cx(
                    'rounded-xl border py-3 text-base transition-colors',
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
                <span className="font-medium text-ink-900 dark:text-ink-50">{current.a}</span> {current.relation}{' '}
                <span className="font-medium text-ink-900 dark:text-ink-50">{current.b}</span>, just as{' '}
                <span className="font-medium text-ink-900 dark:text-ink-50">{current.c}</span> {current.relation}{' '}
                <span className="font-medium text-ink-900 dark:text-ink-50">{current.answer}</span>.
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
              detail={<Stat value={`${correct}/${queue.length}`} label="correct" />}
            />
            <ScoreMeaning moduleId="analogies" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
