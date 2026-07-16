// N-Back — a fluid working-memory task. A square lights up on a grid, one step
// at a time. Flag the step whenever the current position matches the one N
// steps earlier. Accuracy across all trials is scored against the human
// baseline (a first attempt at 2-back is typically ~72% accurate).

import { useEffect, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner, Stat } from '../../components/ui';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { cx, randInt } from '../../lib/utils';

const META = getModule('n-back')!;
const CELLS = 9; // 3×3 grid
const TRIALS = 20;
const SHOW_MS = 650;
const STEP_MS = 2200;

type Phase = 'idle' | 'play' | 'result';

interface Tally {
  correct: number;
  hits: number; // matches correctly flagged
  matches: number; // total match trials
  falseAlarms: number;
}

function buildSequence(total: number, n: number): number[] {
  const seq: number[] = [];
  for (let i = 0; i < total; i++) {
    const canMatch = i >= n;
    const wantMatch = canMatch && Math.random() < 0.32;
    if (wantMatch) {
      seq.push(seq[i - n]);
    } else {
      let pos = randInt(0, CELLS - 1);
      // Avoid an accidental match when we didn't intend one.
      if (canMatch) while (pos === seq[i - n]) pos = randInt(0, CELLS - 1);
      seq.push(pos);
    }
  }
  return seq;
}

export default function NBack() {
  const { recordSession, getSetting, setSetting } = useApp();
  const n = getSetting('n-back', 'n', 2) as number;

  const [phase, setPhase] = useState<Phase>('idle');
  const [seq, setSeq] = useState<number[]>([]);
  const [step, setStep] = useState(-1);
  const [show, setShow] = useState(false);
  const [flashResponse, setFlashResponse] = useState<'hit' | 'miss' | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  const [tally, setTally] = useState<Tally>({ correct: 0, hits: 0, matches: 0, falseAlarms: 0 });

  const pressedRef = useRef(false);
  const tallyRef = useRef<Tally>({ correct: 0, hits: 0, matches: 0, falseAlarms: 0 });
  const startedAt = useRef(0);

  function begin() {
    const s = buildSequence(TRIALS, n);
    tallyRef.current = { correct: 0, hits: 0, matches: 0, falseAlarms: 0 };
    setSeq(s);
    setTally(tallyRef.current);
    startedAt.current = Date.now();
    setPhase('play');
    setStep(0);
  }

  // Evaluate the step that just finished, folding it into the running tally.
  function evaluate(i: number, s: number[]) {
    const isMatch = i >= n && s[i] === s[i - n];
    const pressed = pressedRef.current;
    const correct = isMatch === pressed;
    const t = tallyRef.current;
    tallyRef.current = {
      correct: t.correct + (correct ? 1 : 0),
      hits: t.hits + (isMatch && pressed ? 1 : 0),
      matches: t.matches + (isMatch ? 1 : 0),
      falseAlarms: t.falseAlarms + (!isMatch && pressed ? 1 : 0),
    };
  }

  // Drive the trial sequence.
  useEffect(() => {
    if (phase !== 'play' || step < 0) return;
    if (step >= seq.length) {
      const t = tallyRef.current;
      const raw = t.correct / seq.length;
      const score = normalizeScore('n-back', raw);
      setFinalScore(score);
      setTally(t);
      recordSession('n-back', score, Date.now() - startedAt.current, { n, trials: seq.length });
      setPhase('result');
      return;
    }
    pressedRef.current = false;
    setFlashResponse(null);
    setShow(true);
    const hideT = window.setTimeout(() => setShow(false), SHOW_MS);
    const nextT = window.setTimeout(() => {
      evaluate(step, seq);
      setStep((s) => s + 1);
    }, STEP_MS);
    return () => {
      clearTimeout(hideT);
      clearTimeout(nextT);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, phase]);

  function press() {
    if (phase !== 'play' || pressedRef.current || step < 0 || step >= seq.length) return;
    pressedRef.current = true;
    const isMatch = step >= n && seq[step] === seq[step - n];
    setFlashResponse(isMatch ? 'hit' : 'miss');
  }

  // Spacebar to flag a match.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && phase === 'play') {
        e.preventDefault();
        press();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, step, seq]);

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5">
            <label className="mb-2 block text-sm font-medium">Difficulty: {n}-back</label>
            <input
              type="range"
              min={1}
              max={4}
              value={n}
              onChange={(e) => setSetting('n-back', 'n', Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 flex justify-between text-xs text-ink-400">
              <span>1 (easier)</span>
              <span>4 (very hard)</span>
            </div>
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
              A square lights up each turn. Press <strong>Match</strong> (or the spacebar) whenever
              the square is in the <strong>same position it was {n} step{n > 1 ? 's' : ''} ago</strong>.
              You have to hold the last {n} positions in mind and update them every turn — that's the
              working-memory workout.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start {n}-back
            </Button>
          </div>
        </div>
      )}

      {phase === 'play' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Pill tone="brass">{n}-back</Pill>
            <span className="text-sm text-ink-500 dark:text-ink-400">
              Trial {Math.min(step + 1, seq.length)} / {seq.length}
            </span>
          </div>

          <div className="mx-auto grid aspect-square w-full max-w-xs grid-cols-3 gap-2">
            {Array.from({ length: CELLS }, (_, cell) => {
              const lit = show && seq[step] === cell;
              return (
                <div
                  key={cell}
                  className={cx(
                    'rounded-xl transition-colors duration-100',
                    lit ? 'bg-brass-500' : 'bg-ink-100 dark:bg-ink-800',
                  )}
                />
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              onClick={press}
              className={cx(
                flashResponse === 'hit' && 'bg-emerald-500 hover:bg-emerald-500',
                flashResponse === 'miss' && 'bg-red-500 hover:bg-red-500 text-white',
              )}
            >
              Match ({n}-back)
            </Button>
            <p className="text-xs text-ink-400">Press this or the spacebar when it matches.</p>
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
                  <Stat value={`${tally.hits}/${tally.matches}`} label="matches caught" />
                  <Stat value={tally.falseAlarms} label="false alarms" />
                </div>
              }
            />
            <ScoreMeaning moduleId="n-back" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
