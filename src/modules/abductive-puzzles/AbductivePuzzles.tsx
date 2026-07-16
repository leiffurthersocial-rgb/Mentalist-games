// Abductive Reasoning Puzzles — the user must type at least THREE distinct
// explanations before the app reveals the intended best one, enforcing the
// "don't fall in love with your first theory" discipline.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner } from '../../components/ui';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { randomOf } from '../../lib/utils';
import puzzlesRaw from './puzzles.json';

const META = getModule('abductive-puzzles')!;
const MIN_THEORIES = 3;

interface Puzzle {
  id: string;
  title: string;
  facts: string[];
  best: string;
  hint: string;
}
const PUZZLES = puzzlesRaw as Puzzle[];

type Phase = 'solving' | 'revealed' | 'scored';

export default function AbductivePuzzles() {
  const { recordSession } = useApp();
  const [puzzle, setPuzzle] = useState<Puzzle>(() => randomOf(PUZZLES));
  const [phase, setPhase] = useState<Phase>('solving');
  const [theories, setTheories] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [lastScore, setLastScore] = useState(0);

  const canReveal = theories.length >= MIN_THEORIES;

  function addTheory() {
    const t = draft.trim();
    if (t.length < 3) return;
    setTheories((prev) => [...prev, t]);
    setDraft('');
  }

  function reveal() {
    if (!canReveal) return;
    setPhase('revealed');
  }

  function selfRate(gotIt: boolean) {
    // Raw performance rewards generating many theories AND reaching the best
    // one; breadth alone (without the answer) still earns partial credit.
    const breadth = Math.min(theories.length, 5) / 5; // up to 1.0 at 5 theories
    const raw = (gotIt ? 0.6 : 0) + breadth * 0.4;
    const score = normalizeScore('abductive-puzzles', raw);
    setLastScore(score);
    recordSession('abductive-puzzles', score, Date.now() - startedAt, {
      puzzle: puzzle.id,
      theories: theories.length,
      gotIt,
    });
    setPhase('scored');
  }

  function nextPuzzle() {
    let next = randomOf(PUZZLES);
    // Avoid immediately repeating the same puzzle.
    if (PUZZLES.length > 1) {
      while (next.id === puzzle.id) next = randomOf(PUZZLES);
    }
    setPuzzle(next);
    setPhase('solving');
    setTheories([]);
    setDraft('');
    setShowHint(false);
    setStartedAt(Date.now());
  }

  const remaining = Math.max(0, MIN_THEORIES - theories.length);

  return (
    <ModuleShell meta={META}>
      <div className="space-y-6">
        <Panel className="p-5">
          <h3 className="mb-3 font-serif text-xl">{puzzle.title}</h3>
          <ul className="space-y-2">
            {puzzle.facts.map((f, i) => (
              <li key={i} className="flex gap-2 text-ink-700 dark:text-ink-200">
                <span className="text-brass-500">▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {phase === 'solving' && (
          <>
            <Panel className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Your explanations
                  {remaining > 0 && (
                    <span className="ml-2 text-ink-400">
                      ({remaining} more needed before the reveal)
                    </span>
                  )}
                </h4>
                <Pill tone={canReveal ? 'good' : 'neutral'}>{theories.length} / {MIN_THEORIES}+</Pill>
              </div>
              <p className="mb-3 text-xs text-ink-500 dark:text-ink-400">
                Generate at least three <em>distinct</em> theories before looking at the answer.
                Breadth is the skill — the first idea is rarely the best.
              </p>

              <ol className="mb-4 space-y-2">
                {theories.map((t, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg bg-ink-100 px-3 py-2 text-sm dark:bg-ink-800"
                  >
                    <span className="font-medium text-brass-600 dark:text-brass-300">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>

              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTheory();
                    }
                  }}
                  placeholder="Type an explanation and press Enter…"
                  className="flex-1 rounded-lg border border-ink-200 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
                />
                <Button variant="outline" onClick={addTheory} disabled={draft.trim().length < 3}>
                  Add
                </Button>
              </div>
            </Panel>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={reveal} disabled={!canReveal}>
                {canReveal ? 'Reveal the intended answer' : `Add ${remaining} more to reveal`}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowHint((v) => !v)}
              >
                {showHint ? 'Hide hint' : 'Need a hint?'}
              </Button>
            </div>
            {showHint && (
              <Panel className="p-4 text-center text-sm text-ink-600 dark:text-ink-300">
                💡 {puzzle.hint}
              </Panel>
            )}
          </>
        )}

        {phase === 'revealed' && (
          <>
            <Panel className="border-emerald-500/40 bg-emerald-500/5 p-5">
              <h4 className="mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                The intended best explanation
              </h4>
              <p className="text-ink-800 dark:text-ink-100">{puzzle.best}</p>
            </Panel>

            <Panel className="p-5">
              <h4 className="mb-3 text-sm font-medium">Did one of your {theories.length} theories capture it?</h4>
              <div className="mb-4 space-y-1.5">
                {theories.map((t, i) => (
                  <div key={i} className="text-sm text-ink-600 dark:text-ink-300">
                    {i + 1}. {t}
                  </div>
                ))}
              </div>
              <p className="mb-3 text-xs text-ink-500 dark:text-ink-400">
                Be honest — the point isn't to be right first, it's to keep generating options.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => selfRate(true)}>Yes, I had it</Button>
                <Button variant="outline" onClick={() => selfRate(false)}>
                  No, I missed it
                </Button>
              </div>
            </Panel>
          </>
        )}

        {phase === 'scored' && (
          <>
            <Panel className="border-emerald-500/40 bg-emerald-500/5 p-5">
              <h4 className="mb-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                The intended best explanation
              </h4>
              <p className="text-ink-800 dark:text-ink-100">{puzzle.best}</p>
            </Panel>
            <Panel className="p-6">
              <ScoreBanner score={lastScore} />
              <ScoreMeaning moduleId="abductive-puzzles" score={lastScore} />
            </Panel>
            <div className="flex justify-center">
              <Button size="lg" onClick={nextPuzzle}>
                Next puzzle →
              </Button>
            </div>
          </>
        )}
      </div>
    </ModuleShell>
  );
}
