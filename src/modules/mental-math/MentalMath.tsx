// Mental Math Sprint — solve as many everyday arithmetic problems as possible
// before the timer runs out. Score is the count of correct answers, mapped to
// the human baseline (about 9 in the time limit is average).

import { useEffect, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { TimerRing } from '../../components/TimerRing';
import { useApp } from '../../context/AppState';
import { useCountdown } from '../../lib/useCountdown';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { cx } from '../../lib/utils';
import { generateProblem, MathProblem } from './problems';

const META = getModule('mental-math')!;
const DURATION = 60;
type Phase = 'idle' | 'play' | 'result';

export default function MentalMath() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [problem, setProblem] = useState<MathProblem>(() => generateProblem());
  const [entry, setEntry] = useState('');
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [flash, setFlash] = useState<'ok' | 'no' | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const startedAt = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const correctRef = useRef(0);

  const timer = useCountdown(() => finish());

  function begin() {
    setCorrect(0);
    correctRef.current = 0;
    setAttempted(0);
    setEntry('');
    setFlash(null);
    setProblem(generateProblem());
    startedAt.current = Date.now();
    setPhase('play');
    timer.start(DURATION);
  }

  useEffect(() => {
    if (phase === 'play') inputRef.current?.focus();
  }, [phase, problem]);

  function submit() {
    if (entry.trim() === '') return;
    const val = Number(entry);
    const isRight = val === problem.answer;
    setAttempted((a) => a + 1);
    if (isRight) {
      correctRef.current += 1;
      setCorrect(correctRef.current);
      setFlash('ok');
    } else {
      setFlash('no');
    }
    setEntry('');
    setProblem(generateProblem());
    window.setTimeout(() => setFlash(null), 250);
  }

  function finish() {
    const score = normalizeScore('mental-math', correctRef.current);
    setFinalScore(score);
    recordSession('mental-math', score, DURATION * 1000, { correct: correctRef.current });
    setPhase('result');
  }

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              You have <strong>{DURATION} seconds</strong> to solve as many problems as you can — a
              mix of sums, times-tables, and real-life figures like tips, discounts, and splitting a
              bill. Type your answer and press Enter. Every answer is a whole number.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start the sprint
            </Button>
          </div>
        </div>
      )}

      {phase === 'play' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-500 dark:text-ink-400">{correct} solved</span>
            <TimerRing remaining={timer.remaining} total={DURATION} />
          </div>

          <Panel
            className={cx(
              'p-8 text-center transition-colors',
              flash === 'ok' && 'border-emerald-500/50 bg-emerald-500/5',
              flash === 'no' && 'border-red-500/50 bg-red-500/5',
            )}
          >
            <div className="font-serif text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
              {problem.text}
            </div>
          </Panel>

          <div className="flex flex-col items-center gap-3">
            <input
              ref={inputRef}
              inputMode="numeric"
              value={entry}
              onChange={(e) => setEntry(e.target.value.replace(/[^0-9-]/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              className="w-48 rounded-xl border border-ink-300 bg-transparent px-4 py-3 text-center font-serif text-2xl dark:border-ink-700"
              placeholder="?"
            />
            <Button size="lg" onClick={submit} disabled={entry.trim() === ''}>
              Enter
            </Button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={finalScore}
              detail={
                <div className="mt-3 flex justify-center gap-8">
                  <Stat value={correct} label="solved" />
                  <Stat value={`${attempted ? Math.round((correct / attempted) * 100) : 0}%`} label="accuracy" />
                </div>
              }
            />
            <ScoreMeaning moduleId="mental-math" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
