// Logical Validity — decide whether each conclusion follows from its premises,
// regardless of whether it sounds true. Trains resistance to belief bias.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { cx, sample } from '../../lib/utils';
import { SYLLOGISMS, Syllogism } from './data';

const META = getModule('syllogisms')!;
const ROUND_SIZE = 8;
type Phase = 'idle' | 'play' | 'result';

export default function Syllogisms() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<Syllogism[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  const current = queue[index];

  function begin() {
    setQueue(sample(SYLLOGISMS, ROUND_SIZE));
    setIndex(0);
    setAnswer(null);
    setCorrect(0);
    setStartedAt(Date.now());
    setPhase('play');
  }

  function choose(valid: boolean) {
    if (answer !== null) return;
    setAnswer(valid);
    if (valid === current.valid) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      const score = normalizeScore('syllogisms', correct / queue.length);
      recordSession('syllogisms', score, Date.now() - startedAt, { round: queue.length });
      setPhase('result');
      return;
    }
    setIndex(index + 1);
    setAnswer(null);
  }

  const gotIt = answer !== null && answer === current?.valid;
  const finalScore = queue.length ? normalizeScore('syllogisms', correct / queue.length) : 0;

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              You'll see two premises and a conclusion. Decide whether the conclusion{' '}
              <strong>logically follows</strong> — assume the premises are true and ask only whether
              the conclusion is <em>forced</em> by them. Ignore whether it sounds true in the real
              world; that instinct (belief bias) is exactly what trips people up.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start ({ROUND_SIZE} arguments)
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
            <div className="space-y-2 text-lg text-ink-800 dark:text-ink-100">
              {current.premises.map((prem, i) => (
                <p key={i} className="flex gap-2">
                  <span className="text-brass-500">{i + 1}.</span>
                  <span>{prem}</span>
                </p>
              ))}
              <p className="mt-3 border-t border-ink-200 pt-3 font-medium dark:border-ink-700">
                {current.conclusion}
              </p>
            </div>
          </Panel>

          {answer === null ? (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="lg" onClick={() => choose(true)}>
                ✓ Follows (valid)
              </Button>
              <Button variant="outline" size="lg" onClick={() => choose(false)}>
                ✗ Doesn't follow
              </Button>
            </div>
          ) : (
            <>
              <Panel
                className={cx(
                  'animate-fade-up p-4 text-sm',
                  gotIt ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5',
                )}
              >
                <div
                  className={cx(
                    'mb-1 font-medium',
                    gotIt ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {gotIt ? '✓ Correct' : '✗ Not quite'} — this argument is{' '}
                  {current.valid ? 'valid' : 'invalid'}.
                </div>
                <p className="text-ink-600 dark:text-ink-300">{current.explanation}</p>
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
            <ScoreMeaning moduleId="syllogisms" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
