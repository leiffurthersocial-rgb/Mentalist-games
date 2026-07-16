// Cold Reading Studio — learn the mechanics (to recognise them, not use them).
// Mode 1: classify a statement as Barnum/high-probability vs. a specific claim.
// Mode 2: pick the highest-probability "hit" for a target profile.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx, sample, shuffle } from '../../lib/utils';
import { PROFILE_ROUNDS, ProfileRound, STATEMENTS, Statement } from './data';

const META = getModule('cold-reading')!;
const ROUND_SIZE = 10;
type Mode = 'classify' | 'profile';
type Phase = 'idle' | 'play' | 'result';

function EthicsNote() {
  return (
    <Panel className="border-red-400/40 bg-red-500/5 p-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
      <p>
        <span className="font-medium text-red-600 dark:text-red-400">⚠ Ethics.</span> These are the
        real tools of psychics, con artists, and cult recruiters. The point of studying them is{' '}
        <strong>self-defence</strong> — to feel the moment a vague statement is dressed up as
        personal insight. Learn the mechanics so they can't be used on you. Don't use them to
        deceive people.
      </p>
    </Panel>
  );
}

export default function ColdReading() {
  const [mode, setMode] = useState<Mode>('classify');
  const [phase, setPhase] = useState<Phase>('idle');

  return (
    <ModuleShell meta={META}>
      <div className="space-y-6">
        <EthicsNote />

        {phase === 'idle' && (
          <>
            <div className="flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
              {(
                [
                  ['classify', 'Spot the Barnum'],
                  ['profile', 'Pick the hit'],
                ] as [Mode, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={cx(
                    'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    mode === id
                      ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-900 dark:text-ink-50'
                      : 'text-ink-500 dark:text-ink-400',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Panel className="p-4 text-sm text-ink-500 dark:text-ink-400">
              {mode === 'classify'
                ? 'You\'ll see statements one at a time. Decide whether each is a Barnum / high-probability guess (fits almost anyone) or a specific, falsifiable claim.'
                : 'You\'ll see a target profile and three statements. Pick the one a cold reader would lead with — the highest-probability "hit".'}
            </Panel>
            <div className="flex justify-center">
              <Button size="lg" onClick={() => setPhase('play')}>
                Start
              </Button>
            </div>
          </>
        )}

        {phase === 'play' && mode === 'classify' && (
          <ClassifyGame onDone={() => setPhase('result')} onExit={() => setPhase('idle')} />
        )}
        {phase === 'play' && mode === 'profile' && (
          <ProfileGame onDone={() => setPhase('result')} onExit={() => setPhase('idle')} />
        )}

        {phase === 'result' && <FinishedPanel onReplay={() => setPhase('play')} onExit={() => setPhase('idle')} />}
      </div>
    </ModuleShell>
  );
}

// --- Mode 1: classify -------------------------------------------------------

function ClassifyGame({ onDone, onExit }: { onDone: () => void; onExit: () => void }) {
  const { recordSession } = useApp();
  const [queue] = useState<Statement[]>(() => sample(STATEMENTS, ROUND_SIZE));
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt] = useState(Date.now());

  const current = queue[index];

  function answer(saidBarnum: boolean) {
    if (answered !== null) return;
    const right = saidBarnum === current.barnum;
    setAnswered(saidBarnum);
    if (right) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      const finalCorrect = correct;
      const score = normalizeScore('cold-reading', finalCorrect / queue.length);
      recordSession('cold-reading', score, Date.now() - startedAt, { mode: 'classify' });
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(null);
  }

  const isRight = answered !== null && answered === current.barnum;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-ink-500 dark:text-ink-400">
        <span>
          {index + 1} / {queue.length}
        </span>
        <span>{correct} correct</span>
      </div>
      <Panel className="p-6">
        <p className="text-center text-lg italic leading-relaxed text-ink-800 dark:text-ink-100">
          “{current.text}”
        </p>
      </Panel>

      {answered === null ? (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" onClick={() => answer(true)}>
            Barnum / high-probability
          </Button>
          <Button variant="outline" size="lg" onClick={() => answer(false)}>
            Specific claim
          </Button>
        </div>
      ) : (
        <>
          <Panel
            className={cx(
              'p-4 text-sm',
              isRight ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5',
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <span className={isRight ? 'text-emerald-500' : 'text-red-500'}>
                {isRight ? '✓ Correct' : '✗ Not quite'}
              </span>
              <Pill tone={current.barnum ? 'brass' : 'neutral'}>
                {current.barnum ? 'Barnum / high-probability' : 'Specific claim'}
              </Pill>
            </div>
            <p className="text-ink-600 dark:text-ink-300">{current.why}</p>
          </Panel>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onExit}>
              Exit
            </Button>
            <Button onClick={next}>{index + 1 >= queue.length ? 'See score' : 'Next'}</Button>
          </div>
        </>
      )}
    </div>
  );
}

// --- Mode 2: pick the hit ---------------------------------------------------

function ProfileGame({ onDone, onExit }: { onDone: () => void; onExit: () => void }) {
  const { recordSession } = useApp();
  const [queue] = useState<{ round: ProfileRound; options: ProfileRound['options'] }[]>(() =>
    shuffle(PROFILE_ROUNDS).map((round) => ({ round, options: shuffle(round.options) })),
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [startedAt] = useState(Date.now());

  const item = queue[index];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (item.options[i].hitProbability === 'high') setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      const score = normalizeScore('cold-reading', correct / queue.length);
      recordSession('cold-reading', score, Date.now() - startedAt, { mode: 'profile' });
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  return (
    <div className="space-y-5">
      <div className="text-sm text-ink-500 dark:text-ink-400">
        {index + 1} / {queue.length}
      </div>
      <Panel className="p-5">
        <p className="text-xs uppercase tracking-wide text-ink-400">The target</p>
        <p className="mt-1 text-base text-ink-800 dark:text-ink-100">{item.round.profile}</p>
      </Panel>
      <p className="text-sm text-ink-500 dark:text-ink-400">
        Which statement would a cold reader lead with?
      </p>
      <div className="space-y-2">
        {item.options.map((opt, i) => {
          const revealed = picked !== null;
          const isHigh = opt.hitProbability === 'high';
          const isPicked = picked === i;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => pick(i)}
              className={cx(
                'flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                !revealed && 'border-ink-200 hover:border-brass-400 dark:border-ink-800',
                revealed && isHigh && 'border-emerald-500 bg-emerald-500/10',
                revealed && isPicked && !isHigh && 'border-red-500 bg-red-500/10',
                revealed && !isHigh && !isPicked && 'border-ink-200 opacity-50 dark:border-ink-800',
              )}
            >
              <span>{opt.text}</span>
              {revealed && (
                <Pill tone={isHigh ? 'good' : opt.hitProbability === 'medium' ? 'brass' : 'bad'}>
                  {opt.hitProbability}
                </Pill>
              )}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <>
          <Panel className="animate-fade-up p-4 text-sm text-ink-600 dark:text-ink-300">
            {item.round.lesson}
          </Panel>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={onExit}>
              Exit
            </Button>
            <Button onClick={next}>{index + 1 >= queue.length ? 'See score' : 'Next'}</Button>
          </div>
        </>
      )}
    </div>
  );
}

function FinishedPanel({ onReplay, onExit }: { onReplay: () => void; onExit: () => void }) {
  const { data } = useApp();
  const last = [...data.sessions].reverse().find((s) => s.moduleId === 'cold-reading');
  const score = last?.score ?? 0;
  return (
    <div className="space-y-6">
      <Panel className="p-6">
        <ScoreBanner
          score={score}
          detail={score >= 72 ? 'Sharp eye — you can feel the trick now.' : 'Keep drilling — recognition gets faster.'}
        />
        <ScoreMeaning moduleId="cold-reading" score={score} />
      </Panel>
      <div className="flex justify-center gap-3">
        <Button onClick={onReplay}>Play again</Button>
        <Button variant="outline" onClick={onExit}>
          Switch mode
        </Button>
      </div>
    </div>
  );
}
