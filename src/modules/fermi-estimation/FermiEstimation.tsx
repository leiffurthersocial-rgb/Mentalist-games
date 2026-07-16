// Fermi Estimation — for each question you give a low/high range you're 90%
// sure contains the true value. The app tracks how often the truth lands inside
// your interval; a well-calibrated estimator hits ~90%.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { sample } from '../../lib/utils';
import { FERMI_QUESTIONS, FermiQuestion } from './data';

const META = getModule('fermi-estimation')!;
const ROUND_SIZE = 10;
type Phase = 'idle' | 'play' | 'result';

interface Answered {
  q: FermiQuestion;
  low: number;
  high: number;
  inside: boolean;
}

export default function FermiEstimation() {
  const { recordSession } = useApp();
  const [phase, setPhase] = useState<Phase>('idle');
  const [queue, setQueue] = useState<FermiQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [low, setLow] = useState('');
  const [high, setHigh] = useState('');
  const [answers, setAnswers] = useState<Answered[]>([]);
  const [startedAt, setStartedAt] = useState(0);

  const current = queue[index];

  function begin() {
    setQueue(sample(FERMI_QUESTIONS, ROUND_SIZE));
    setIndex(0);
    setLow('');
    setHigh('');
    setAnswers([]);
    setStartedAt(Date.now());
    setPhase('play');
  }

  const lowN = Number(low);
  const highN = Number(high);
  const validRange = low !== '' && high !== '' && !Number.isNaN(lowN) && !Number.isNaN(highN) && lowN <= highN;

  function submit() {
    if (!validRange) return;
    const inside = current.answer >= lowN && current.answer <= highN;
    const nextAnswers = [...answers, { q: current, low: lowN, high: highN, inside }];
    setAnswers(nextAnswers);
    setLow('');
    setHigh('');
    if (index + 1 >= queue.length) {
      const insideCount = nextAnswers.filter((a) => a.inside).length;
      const score = normalizeScore('fermi-estimation', insideCount / queue.length);
      recordSession('fermi-estimation', score, Date.now() - startedAt, {
        inside: insideCount,
        total: queue.length,
      });
      setPhase('result');
    } else {
      setIndex(index + 1);
    }
  }

  const insideCount = answers.filter((a) => a.inside).length;
  const insideRate = answers.length ? Math.round((insideCount / answers.length) * 100) : 0;
  const insidePercent = queue.length ? Math.round((insideCount / queue.length) * 100) : 0;
  const finalScore = queue.length ? normalizeScore('fermi-estimation', insideCount / queue.length) : 0;

  // Feedback is about the actual hit-rate versus the 90% target, not the score.
  function calibrationNote(pct: number) {
    if (pct >= 85 && pct <= 95) return 'Beautifully calibrated — right around the 90% target.';
    if (pct === 100) return 'You caught them all — but your ranges may be too wide. Try tightening.';
    if (pct >= 60) return 'A bit overconfident — widen your ranges to catch ~90%.';
    return 'Strongly overconfident — your intervals are far too narrow. Widen them a lot.';
  }

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>
              For each question, give a <strong>low</strong> and <strong>high</strong> value so that
              you are <strong>90% sure</strong> the true answer lies between them. Don't aim to be
              exactly right — aim to be right about 90% of the time.
            </p>
            <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
              The catch: most people make their ranges far too narrow. If you're getting fewer than
              9 in 10 inside, you're overconfident.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Start ({ROUND_SIZE} questions)
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
            {answers.length > 0 && <span>{insideRate}% inside so far</span>}
          </div>

          <Panel className="p-6">
            <p className="text-center text-lg leading-relaxed text-ink-800 dark:text-ink-100">
              {current.question}
            </p>
            <p className="mt-2 text-center text-xs uppercase tracking-wide text-ink-400">
              answer in {current.unit}
            </p>
          </Panel>

          <div className="flex items-end justify-center gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-ink-500 dark:text-ink-400">Low</span>
              <input
                inputMode="decimal"
                value={low}
                onChange={(e) => setLow(e.target.value.replace(/[^0-9.\-]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && validRange && submit()}
                className="w-32 rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-center dark:border-ink-700"
                placeholder="min"
              />
            </label>
            <span className="pb-2 text-ink-400">–</span>
            <label className="text-sm">
              <span className="mb-1 block text-ink-500 dark:text-ink-400">High</span>
              <input
                inputMode="decimal"
                value={high}
                onChange={(e) => setHigh(e.target.value.replace(/[^0-9.\-]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && validRange && submit()}
                className="w-32 rounded-lg border border-ink-300 bg-transparent px-3 py-2 text-center dark:border-ink-700"
                placeholder="max"
              />
            </label>
          </div>
          {low !== '' && high !== '' && !validRange && (
            <p className="text-center text-xs text-red-500">Low must be less than or equal to high.</p>
          )}

          <div className="flex justify-center">
            <Button size="lg" onClick={submit} disabled={!validRange}>
              {index + 1 >= queue.length ? 'Finish' : 'Next'}
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
                  <Stat value={`${insideCount}/${queue.length}`} label="inside your range" />
                  <Stat value="90%" label="the target" />
                </div>
              }
            />
            <p className="mt-4 text-center text-sm text-brass-600 dark:text-brass-300">
              {calibrationNote(insidePercent)}
            </p>
            <ScoreMeaning moduleId="fermi-estimation" score={finalScore} />
          </Panel>

          <Panel className="p-5">
            <h3 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-400">Review</h3>
            <ul className="space-y-3">
              {answers.map((a, i) => (
                <li key={i} className="text-sm">
                  <div className="flex items-start gap-2">
                    <span className={a.inside ? 'text-emerald-500' : 'text-red-500'}>
                      {a.inside ? '✓' : '✗'}
                    </span>
                    <div>
                      <div className="text-ink-700 dark:text-ink-200">{a.q.question}</div>
                      <div className="text-xs text-ink-500 dark:text-ink-400">
                        You said {a.low.toLocaleString()}–{a.high.toLocaleString()} · true value:{' '}
                        <span className="font-medium text-ink-800 dark:text-ink-100">
                          {a.q.answer.toLocaleString()} {a.q.unit}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-400">{a.q.note}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
