// Emotion & Microexpression Reader — classify the emotion behind a described
// expression or scenario, against the clock. Tracks per-emotion accuracy so
// users can see their blind spots, and includes a baseline-vs-deviation lesson.

import { useEffect, useMemo, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { TimerRing } from '../../components/TimerRing';
import { useApp } from '../../context/AppState';
import { useCountdown } from '../../lib/useCountdown';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx, sample } from '../../lib/utils';
import { EMOTIONS, EMOTION_EMOJI, Emotion, STIMULI, Stimulus } from './data';

const META = getModule('emotion-reader')!;
const ROUND_SIZE = 10;
const PER_QUESTION_SECONDS = 8;

type Phase = 'idle' | 'play' | 'result';

export default function EmotionReader() {
  const { data, setData, recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<Stimulus[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Emotion | null>(null);
  const [results, setResults] = useState<{ stim: Stimulus; answer: Emotion | null }[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const advanceRef = useRef<number>(0);

  const timer = useCountdown(() => lockIn(null));

  const current = queue[index];

  function begin() {
    setQueue(sample(STIMULI, ROUND_SIZE));
    setIndex(0);
    setPicked(null);
    setResults([]);
    setStartedAt(Date.now());
    setPhase('play');
    timer.start(PER_QUESTION_SECONDS);
  }

  // Lock in the current answer (from a click or a timeout), reveal briefly,
  // then advance. We compute the next results array here and thread it forward
  // so the round-end tally never reads a stale value.
  function lockIn(answer: Emotion | null) {
    if (picked !== null) return; // already answered
    timer.stop();
    setPicked(answer ?? ('__timeout__' as Emotion));
    const stim = queue[index];
    const nextResults = [...results, { stim, answer }];
    setResults(nextResults);
    const isLast = index + 1 >= queue.length;
    advanceRef.current = window.setTimeout(() => {
      if (isLast) finishRound(nextResults);
      else {
        setIndex((i) => i + 1);
        setPicked(null);
        timer.start(PER_QUESTION_SECONDS);
      }
    }, 1400);
  }

  function finishRound(finalResults: { stim: Stimulus; answer: Emotion | null }[]) {
    setPhase('result');
    const correct = finalResults.filter((r) => r.answer === r.stim.emotion).length;
    const score = normalizeScore('emotion-reader', correct / queue.length);
    recordSession('emotion-reader', score, Date.now() - startedAt, { round: queue.length });

    // Fold per-emotion tallies into persistent stats for the blind-spot chart.
    setData((d) => {
      const stats = { ...d.emotionStats };
      for (const r of finalResults) {
        const key = r.stim.emotion;
        const prev = stats[key] ?? { correct: 0, total: 0 };
        stats[key] = {
          correct: prev.correct + (r.answer === r.stim.emotion ? 1 : 0),
          total: prev.total + 1,
        };
      }
      return { ...d, emotionStats: stats };
    });
  }

  useEffect(() => () => clearTimeout(advanceRef.current), []);

  const correctCount = results.filter((r) => r.answer === r.stim.emotion).length;
  const score = queue.length ? normalizeScore('emotion-reader', correctCount / queue.length) : 0;

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && <Intro data={data} onStart={begin} />}

      {phase === 'play' && current && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {index + 1} / {queue.length}
            </p>
            <TimerRing remaining={timer.remaining} total={PER_QUESTION_SECONDS} />
          </div>

          <Panel className="p-6">
            <p className="text-center text-lg leading-relaxed text-ink-800 dark:text-ink-100">
              {current.text}
            </p>
          </Panel>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {EMOTIONS.map((e) => {
              const answered = picked !== null;
              const isCorrect = e === current.emotion;
              const isPicked = e === picked;
              return (
                <button
                  key={e}
                  disabled={answered}
                  onClick={() => lockIn(e)}
                  className={cx(
                    'flex flex-col items-center gap-1 rounded-xl border p-3 text-sm capitalize transition-colors',
                    !answered &&
                      'border-ink-200 hover:border-brass-400 hover:bg-brass-500/5 dark:border-ink-800',
                    answered && isCorrect && 'border-emerald-500 bg-emerald-500/15',
                    answered && isPicked && !isCorrect && 'border-red-500 bg-red-500/15',
                    answered && !isCorrect && !isPicked && 'border-ink-200 opacity-50 dark:border-ink-800',
                  )}
                >
                  <span className="text-2xl">{EMOTION_EMOJI[e]}</span>
                  {e}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <Panel className="animate-fade-up p-4 text-center text-sm text-ink-600 dark:text-ink-300">
              <span className="font-medium capitalize text-ink-900 dark:text-ink-50">
                {current.emotion}
              </span>{' '}
              — {current.tell}
            </Panel>
          )}
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={score}
              detail={<Stat value={`${correctCount}/${queue.length}`} label="correct" />}
            />
            <ScoreMeaning moduleId="emotion-reader" score={score} />
          </Panel>
          <BlindSpots data={data} />
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

function Intro({ data, onStart }: { data: ReturnType<typeof useApp>['data']; onStart: () => void }) {
  return (
    <div className="space-y-6">
      <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        <h3 className="mb-2 font-serif text-lg text-ink-900 dark:text-ink-50">
          Baseline vs. deviation
        </h3>
        <p>
          Reading people is <em>not</em> about a lookup table of expressions. First establish a
          person's <strong>baseline</strong> — their normal face, posture, and speech at rest. What
          matters is the <strong>deviation</strong>: a sudden clench, a flash of a one-sided smile,
          a brow that lifts for a fraction of a second. Microexpressions leak in that gap between
          baseline and reaction, often before the person is even aware of the feeling.
        </p>
        <p className="mt-2">
          Below, you'll classify described expressions and scenarios into seven basic emotions.
          Speed matters — real tells are fleeting.
        </p>
      </Panel>
      <BlindSpots data={data} />
      <div className="flex justify-center">
        <Button size="lg" onClick={onStart}>
          Start a round
        </Button>
      </div>
    </div>
  );
}

function BlindSpots({ data }: { data: ReturnType<typeof useApp>['data'] }) {
  const rows = useMemo(
    () =>
      EMOTIONS.map((e) => {
        const s = data.emotionStats[e];
        const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null;
        return { emotion: e, pct, total: s?.total ?? 0 };
      }),
    [data.emotionStats],
  );

  const anyData = rows.some((r) => r.total > 0);
  if (!anyData) {
    return (
      <Panel className="p-4 text-center text-sm text-ink-500 dark:text-ink-400">
        Your per-emotion accuracy will appear here once you've played a round — revealing which
        emotions you tend to miss.
      </Panel>
    );
  }

  return (
    <Panel className="p-5">
      <h3 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-400">
        Accuracy by emotion (your blind spots)
      </h3>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.emotion} className="flex items-center gap-3">
            <span className="w-24 text-sm capitalize">
              {EMOTION_EMOJI[r.emotion]} {r.emotion}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
              {r.pct !== null && (
                <div
                  className={cx(
                    'h-full rounded-full',
                    r.pct >= 70 ? 'bg-emerald-500' : r.pct >= 40 ? 'bg-brass-500' : 'bg-red-500',
                  )}
                  style={{ width: `${r.pct}%` }}
                />
              )}
            </div>
            <span className="w-16 text-right text-xs text-ink-500 dark:text-ink-400">
              {r.pct === null ? '—' : `${r.pct}%`} {r.total > 0 && `(${r.total})`}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
