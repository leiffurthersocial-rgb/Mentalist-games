// Number Memory — a digit-span trainer. A number is flashed briefly, then you
// type it from memory. Each correct answer adds a digit; one mistake ends the
// run. Your score scales with the longest span you reach.

import { useEffect, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx } from '../../lib/utils';

const META = getModule('number-memory')!;
type Phase = 'idle' | 'show' | 'input' | 'feedback' | 'result';

function randomNumber(length: number): string {
  // First digit non-zero so the displayed length is unambiguous.
  let s = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 1; i < length; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export default function NumberMemory() {
  const { recordSession, getSetting, setSetting } = useApp();
  const startLen = getSetting('number-memory', 'startLength', 3) as number;

  const [phase, setPhase] = useState<Phase>('idle');
  const [length, setLength] = useState(startLen);
  const [target, setTarget] = useState('');
  const [entry, setEntry] = useState('');
  const [lastCorrect, setLastCorrect] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const showTimer = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show the number for ~1s per digit, then switch to input.
  useEffect(() => {
    if (phase !== 'show') return;
    const ms = 900 + target.length * 700;
    showTimer.current = window.setTimeout(() => {
      setPhase('input');
    }, ms);
    return () => clearTimeout(showTimer.current);
  }, [phase, target]);

  useEffect(() => {
    if (phase === 'input') inputRef.current?.focus();
  }, [phase]);

  function begin() {
    setLength(startLen);
    presentRound(startLen);
    setStartedAt(Date.now());
  }

  function presentRound(len: number) {
    setTarget(randomNumber(len));
    setEntry('');
    setPhase('show');
  }

  function submit() {
    const correct = entry === target;
    setLastCorrect(correct);
    setPhase('feedback');
    if (correct) {
      window.setTimeout(() => {
        const next = length + 1;
        setLength(next);
        presentRound(next);
      }, 900);
    } else {
      // Reached span = length; score rewards the longest length cleared.
      const cleared = length - 1;
      const score = normalizeScore('number-memory', cleared);
      recordSession('number-memory', score, Date.now() - startedAt, { span: cleared });
      window.setTimeout(() => setPhase('result'), 300);
    }
  }

  const clearedSpan = length - 1;
  const finalScore = normalizeScore('number-memory', clearedSpan);

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5">
            <label className="mb-2 block text-sm font-medium">
              Starting length: {startLen} digits
            </label>
            <input
              type="range"
              min={2}
              max={7}
              value={startLen}
              onChange={(e) => setSetting('number-memory', 'startLength', Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
              A number flashes on screen, then vanishes. Type it back exactly. Each success adds a
              digit; a single slip ends the run. Try chunking the digits into pairs or turning them
              into images.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start
            </Button>
          </div>
        </div>
      )}

      {phase === 'show' && (
        <div className="flex flex-col items-center gap-4 py-12">
          <Pill tone="brass">{target.length} digits</Pill>
          <div className="font-serif text-5xl tracking-[0.25em] text-ink-900 dark:text-ink-50 sm:text-6xl">
            {target}
          </div>
          <p className="text-sm text-ink-400">Memorising…</p>
        </div>
      )}

      {phase === 'input' && (
        <div className="flex flex-col items-center gap-5 py-10">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Type the {target.length}-digit number
          </p>
          <input
            ref={inputRef}
            inputMode="numeric"
            pattern="[0-9]*"
            value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && entry.length > 0) submit();
            }}
            className="w-64 rounded-xl border border-ink-300 bg-transparent px-4 py-3 text-center font-serif text-3xl tracking-[0.2em] dark:border-ink-700"
          />
          <Button size="lg" onClick={submit} disabled={entry.length === 0}>
            Submit
          </Button>
        </div>
      )}

      {phase === 'feedback' && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className={cx('font-serif text-4xl', lastCorrect ? 'text-emerald-500' : 'text-red-500')}>
            {lastCorrect ? '✓ Correct' : '✗'}
          </div>
          {!lastCorrect && (
            <div className="text-center text-sm text-ink-500 dark:text-ink-400">
              You typed <span className="line-through">{entry || '—'}</span> · it was{' '}
              <span className="font-medium text-ink-800 dark:text-ink-100">{target}</span>
            </div>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={finalScore}
              detail={<Stat value={clearedSpan} label="digit span reached" />}
            />
            <ScoreMeaning moduleId="number-memory" score={finalScore} />
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>Try again</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
