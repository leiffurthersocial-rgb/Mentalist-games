// Calibration & Prediction Journal — log a forecast with a confidence %, a
// resolution date, then mark it true/false later. The app plots stated
// confidence against real hit-rate and reports a Brier score.

import { useMemo, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { brierLabel, brierScore, calibrationBuckets } from '../../lib/stats';
import { normalizeScore } from '../../lib/scoring';
import { cx, dayKey, formatDate, uid } from '../../lib/utils';
import { Prediction } from '../../types';
import { CalibrationChart } from './CalibrationChart';

const META = getModule('calibration-journal')!;

export default function CalibrationJournal() {
  const { data, setData, recordSession } = useApp();
  const [text, setText] = useState('');
  const [confidence, setConfidence] = useState(70);
  const [resolveBy, setResolveBy] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return dayKey(d);
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const predictions = data.predictions;
  const buckets = useMemo(() => calibrationBuckets(predictions), [predictions]);
  const brier = useMemo(() => brierScore(predictions), [predictions]);
  const resolvedCount = predictions.filter((p) => p.outcome !== 'pending').length;

  function addPrediction() {
    if (!text.trim()) return;
    const p: Prediction = {
      id: uid(),
      text: text.trim(),
      confidence,
      createdAt: Date.now(),
      resolveBy: new Date(resolveBy + 'T00:00:00').getTime(),
      outcome: 'pending',
    };
    setData((d) => ({ ...d, predictions: [p, ...d.predictions] }));
    setText('');
    setConfidence(70);
  }

  function resolve(id: string, outcome: 'true' | 'false') {
    setData((d) => ({
      ...d,
      predictions: d.predictions.map((p) =>
        p.id === id ? { ...p, outcome, resolvedAt: Date.now() } : p,
      ),
    }));
    // Resolving a forecast is itself a practice event: score it by how right
    // the stated confidence turned out to be (100 = perfectly confident & correct).
    const p = data.predictions.find((x) => x.id === id);
    if (p) {
      const forecast = p.confidence / 100;
      const actual = outcome === 'true' ? 1 : 0;
      const brierContribution = (forecast - actual) ** 2; // lower is better
      const score = normalizeScore('calibration-journal', brierContribution);
      recordSession('calibration-journal', score, 0, { confidence: p.confidence, outcome });
    }
  }

  function reopen(id: string) {
    setData((d) => ({
      ...d,
      predictions: d.predictions.map((p) =>
        p.id === id ? { ...p, outcome: 'pending', resolvedAt: undefined } : p,
      ),
    }));
  }

  function remove(id: string) {
    setData((d) => ({ ...d, predictions: d.predictions.filter((p) => p.id !== id) }));
  }

  const shown = predictions.filter((p) =>
    filter === 'all' ? true : filter === 'pending' ? p.outcome === 'pending' : p.outcome !== 'pending',
  );

  return (
    <ModuleShell meta={META}>
      <div className="space-y-6">
        {/* New prediction */}
        <Panel className="p-5">
          <h3 className="mb-3 font-serif text-lg">Log a prediction</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. “It will rain here on Saturday” or “My team ships the release by Friday”"
            rows={2}
            className="mb-4 w-full rounded-lg border border-ink-200 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center justify-between text-sm font-medium">
                <span>Confidence</span>
                <span className="font-serif text-lg text-brass-600 dark:text-brass-300">
                  {confidence}%
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={99}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-ink-400">
                How likely is it to come true? 50% = a coin flip.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Resolve by</label>
              <input
                type="date"
                value={resolveBy}
                onChange={(e) => setResolveBy(e.target.value)}
                className="w-full rounded-lg border border-ink-200 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={addPrediction} disabled={!text.trim()}>
              Save prediction
            </Button>
          </div>
        </Panel>

        {/* Calibration report */}
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg">Your calibration</h3>
            <Pill tone={resolvedCount >= 5 ? 'brass' : 'neutral'}>
              {resolvedCount} resolved
            </Pill>
          </div>

          {resolvedCount === 0 ? (
            <p className="py-8 text-center text-sm text-ink-500 dark:text-ink-400">
              Resolve a few predictions to see your calibration curve. The goal: when you say 70%,
              it should come true about 70% of the time.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-[1fr,auto] sm:items-center">
              <CalibrationChart buckets={buckets} />
              <div className="space-y-4">
                <div>
                  <div className="font-serif text-4xl text-ink-900 dark:text-ink-50">
                    {brier !== null ? brier.toFixed(3) : '—'}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-ink-500 dark:text-ink-400">
                    Brier score (lower is better)
                  </div>
                  <p className="mt-1 text-sm text-brass-600 dark:text-brass-300">
                    {brierLabel(brier)}
                  </p>
                </div>
                <div className="flex gap-6">
                  <Stat
                    value={`${Math.round(
                      (predictions.filter((p) => p.outcome === 'true').length /
                        Math.max(1, resolvedCount)) *
                        100,
                    )}%`}
                    label="came true"
                  />
                  <Stat value={resolvedCount} label="resolved" />
                </div>
                <p className="max-w-xs text-xs text-ink-500 dark:text-ink-400">
                  Dashed line = perfect calibration. Points above it mean you were under-confident;
                  below means over-confident.
                </p>
              </div>
            </div>
          )}
        </Panel>

        {/* Prediction list */}
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg">Predictions</h3>
            <div className="flex gap-1 rounded-lg bg-ink-100 p-0.5 text-xs dark:bg-ink-800">
              {(['all', 'pending', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cx(
                    'rounded-md px-2.5 py-1 capitalize transition-colors',
                    filter === f
                      ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-900 dark:text-ink-50'
                      : 'text-ink-500 dark:text-ink-400',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-500 dark:text-ink-400">
              No predictions here yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {shown.map((p) => {
                const due = p.resolveBy < Date.now() && p.outcome === 'pending';
                return (
                  <li
                    key={p.id}
                    className="rounded-xl border border-ink-200 p-3 dark:border-ink-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-ink-800 dark:text-ink-100">{p.text}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          <Pill tone="brass">{p.confidence}% sure</Pill>
                          <span className="text-ink-400">
                            resolve by {formatDate(p.resolveBy)}
                          </span>
                          {due && <Pill tone="bad">due</Pill>}
                          {p.outcome === 'true' && <Pill tone="good">Came true ✓</Pill>}
                          {p.outcome === 'false' && <Pill tone="bad">Didn't ✗</Pill>}
                        </div>
                      </div>
                      <button
                        onClick={() => remove(p.id)}
                        className="shrink-0 text-ink-300 hover:text-red-500"
                        aria-label="Delete prediction"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {p.outcome === 'pending' ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => resolve(p.id, 'true')}>
                            It came true
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => resolve(p.id, 'false')}>
                            It didn't
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => reopen(p.id)}>
                          Reopen
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </ModuleShell>
  );
}
