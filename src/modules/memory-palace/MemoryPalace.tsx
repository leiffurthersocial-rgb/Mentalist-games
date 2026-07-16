// Memory Palace — a method-of-loci trainer built around memorising a sequence
// of playing cards in order. Includes an explainer, a palace editor (saved to
// app data), and the flash-then-recall drill with fastest-time tracking.

import { useEffect, useRef, useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, Pill, ScoreBanner, Stat } from '../../components/ui';
import { useApp } from '../../context/AppState';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx, formatDuration, uid } from '../../lib/utils';
import { MemoryPalace as Palace } from '../../types';
import { Card, fullDeck, shuffleDeck } from './cards';
import { CardFace } from './CardFace';

const META = getModule('memory-palace')!;
type Tab = 'train' | 'palaces' | 'learn';
type Phase = 'idle' | 'flash' | 'recall' | 'result';

export default function MemoryPalace() {
  const [tab, setTab] = useState<Tab>('train');
  return (
    <ModuleShell meta={META}>
      <div className="mb-6 flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-ink-800">
        {(
          [
            ['train', 'Train'],
            ['palaces', 'My Palaces'],
            ['learn', 'Learn the method'],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cx(
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              tab === id
                ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-900 dark:text-ink-50'
                : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'train' && <Trainer />}
      {tab === 'palaces' && <PalaceEditor />}
      {tab === 'learn' && <Learn />}
    </ModuleShell>
  );
}

// --- The flash-and-recall drill --------------------------------------------

function Trainer() {
  const { data, recordSession, getSetting, setSetting } = useApp();
  const count = getSetting('memory-palace', 'count', 10) as number;
  const speedMs = getSetting('memory-palace', 'speedMs', 2000) as number;
  const fastestMs = getSetting('memory-palace', 'fastestDeckMs', 0) as number;

  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<Card[]>([]);
  const [flashIndex, setFlashIndex] = useState(0);
  const [recall, setRecall] = useState<Card[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const flashTimer = useRef<number>(0);

  // Drive the flashing sequence.
  useEffect(() => {
    if (phase !== 'flash') return;
    if (flashIndex >= sequence.length) {
      setPhase('recall');
      setStartedAt(Date.now());
      return;
    }
    flashTimer.current = window.setTimeout(() => setFlashIndex((i) => i + 1), speedMs);
    return () => clearTimeout(flashTimer.current);
  }, [phase, flashIndex, sequence.length, speedMs]);

  function begin() {
    const seq = shuffleDeck(fullDeck()).slice(0, count);
    setSequence(seq);
    setRecall([]);
    setFlashIndex(0);
    setPhase('flash');
  }

  function pick(card: Card) {
    if (recall.find((c) => c.id === card.id)) return; // each card appears once
    setRecall((r) => [...r, card]);
  }
  function undo() {
    setRecall((r) => r.slice(0, -1));
  }

  const correctPositions = recall.filter((c, i) => sequence[i]?.id === c.id).length;
  const rawAcc = count > 0 ? correctPositions / count : 0;
  const score = normalizeScore('memory-palace', rawAcc);
  const perfect = correctPositions === count;

  function submit() {
    const duration = Date.now() - startedAt;
    setElapsedMs(duration);
    setPhase('result');
    recordSession('memory-palace', score, duration, { count, speedMs });
    // Track fastest *perfect* full-deck run.
    if (count === 52 && perfect) {
      if (fastestMs === 0 || duration < fastestMs) {
        setSetting('memory-palace', 'fastestDeckMs', duration);
      }
    }
  }

  const remainingDeck = fullDeck().filter((c) => !recall.find((r) => r.id === c.id));

  return (
    <div className="space-y-6">
      {phase === 'idle' && (
        <>
          <Panel className="p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Cards to memorise: {count}</label>
                <input
                  type="range"
                  min={5}
                  max={52}
                  step={1}
                  value={count}
                  onChange={(e) => setSetting('memory-palace', 'count', Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-ink-400">
                  <span>5</span>
                  <span>full deck (52)</span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Seconds per card: {(speedMs / 1000).toFixed(1)}
                </label>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={250}
                  value={speedMs}
                  onChange={(e) => setSetting('memory-palace', 'speedMs', Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-ink-400">
                  <span>fast</span>
                  <span>slow</span>
                </div>
              </div>
            </div>
          </Panel>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" onClick={begin}>
              Begin drill
            </Button>
            {fastestMs > 0 && (
              <Pill tone="brass">Fastest perfect deck: {formatDuration(fastestMs)}</Pill>
            )}
          </div>
          {data.palaces.length === 0 && (
            <p className="text-center text-sm text-ink-500 dark:text-ink-400">
              Tip: build a memory palace first (the “My Palaces” tab) and place each card as a vivid
              image along your route.
            </p>
          )}
        </>
      )}

      {phase === 'flash' && (
        <div className="flex flex-col items-center gap-6 py-6">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Card {Math.min(flashIndex + 1, count)} of {count} — place it in your palace
          </p>
          {sequence[flashIndex] && <CardFace card={sequence[flashIndex]} size="lg" />}
          <div className="h-1 w-48 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            <div
              className="h-full bg-brass-500"
              style={{ width: `${((flashIndex + 1) / count) * 100}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStartedAt(Date.now());
              setPhase('recall');
            }}
          >
            Skip to recall
          </Button>
        </div>
      )}

      {phase === 'recall' && (
        <div className="space-y-5">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Rebuild the sequence in order ({recall.length}/{count}). Walk your palace and read off
            each card.
          </p>
          <Panel className="p-4">
            <div className="flex min-h-[3.5rem] flex-wrap gap-1.5">
              {recall.length === 0 && (
                <span className="text-sm text-ink-400">Your recalled order appears here…</span>
              )}
              {recall.map((c, i) => (
                <div key={c.id} className="relative">
                  <CardFace card={c} size="sm" />
                  <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brass-500 text-[10px] font-bold text-ink-950">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="flex flex-wrap gap-1.5">
              {remainingDeck.map((c) => (
                <button key={c.id} onClick={() => pick(c)} aria-label={`Pick ${c.id}`}>
                  <CardFace card={c} size="sm" />
                </button>
              ))}
            </div>
          </Panel>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={undo} disabled={recall.length === 0}>
              Undo
            </Button>
            <Button size="lg" onClick={submit} disabled={recall.length < count}>
              Check sequence
            </Button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={score}
              detail={
                <div className="mt-4 flex justify-center gap-8">
                  <Stat value={`${correctPositions}/${count}`} label="in position" />
                  <Stat value={formatDuration(elapsedMs)} label="recall time" />
                </div>
              }
            />
            <ScoreMeaning moduleId="memory-palace" score={score} />
            {count === 52 && perfect && (
              <p className="mt-4 text-center text-sm text-brass-600 dark:text-brass-300">
                🏅 Perfect full deck! {elapsedMs <= fastestMs || fastestMs === elapsedMs
                  ? 'A new personal best.'
                  : `Your best is ${formatDuration(fastestMs)}.`}
              </p>
            )}
          </Panel>

          <Panel className="p-4">
            <h3 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-400">
              The true order
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {sequence.map((c, i) => (
                <CardFace key={c.id} card={c} size="sm" selected={recall[i]?.id === c.id} dim={recall[i]?.id !== c.id} />
              ))}
            </div>
          </Panel>

          <div className="flex justify-center gap-3">
            <Button onClick={begin}>Again</Button>
            <Button variant="outline" onClick={() => setPhase('idle')}>
              Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Palace editor ----------------------------------------------------------

function PalaceEditor() {
  const { data, setData } = useApp();
  const [name, setName] = useState('');
  const [lociText, setLociText] = useState('');

  function addPalace() {
    const loci = lociText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (!name.trim() || loci.length === 0) return;
    const palace: Palace = { id: uid(), name: name.trim(), loci };
    setData((d) => ({ ...d, palaces: [...d.palaces, palace] }));
    setName('');
    setLociText('');
  }

  function remove(id: string) {
    setData((d) => ({ ...d, palaces: d.palaces.filter((p) => p.id !== id) }));
  }

  return (
    <div className="space-y-6">
      <Panel className="p-5">
        <h3 className="mb-2 font-serif text-lg">Build a palace</h3>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
          Pick a route you know by heart — your home, a walk to work. List the stops (loci) in the
          exact order you'd pass them. Aim for 10–26. You'll place one card at each stop.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Palace name (e.g. “My flat”)"
          className="mb-3 w-full rounded-lg border border-ink-200 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
        />
        <textarea
          value={lociText}
          onChange={(e) => setLociText(e.target.value)}
          placeholder={'One locus per line:\nFront door\nCoat rack\nKitchen sink\nFridge\n…'}
          rows={6}
          className="mb-3 w-full rounded-lg border border-ink-200 bg-transparent px-3 py-2 text-sm dark:border-ink-700"
        />
        <Button onClick={addPalace} disabled={!name.trim() || !lociText.trim()}>
          Save palace
        </Button>
      </Panel>

      {data.palaces.length === 0 ? (
        <p className="text-center text-sm text-ink-500 dark:text-ink-400">
          No palaces yet. Your first one unlocks the loci technique for the card drill.
        </p>
      ) : (
        <div className="space-y-4">
          {data.palaces.map((p) => (
            <Panel key={p.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{p.name}</h4>
                  <Pill>{p.loci.length} loci</Pill>
                </div>
                <button
                  onClick={() => remove(p.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <ol className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-600 dark:text-ink-300 sm:grid-cols-3">
                {p.loci.map((l, i) => (
                  <li key={i} className="truncate">
                    <span className="text-brass-500">{i + 1}.</span> {l}
                  </li>
                ))}
              </ol>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Learn the method -------------------------------------------------------

function Learn() {
  return (
    <div className="space-y-4">
      <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        <h3 className="mb-2 font-serif text-lg text-ink-900 dark:text-ink-50">
          The method of loci (memory palace)
        </h3>
        <p>
          We remember <em>places</em> and <em>images</em> far better than abstract lists. The method
          of loci turns anything you want to memorise into vivid images and places them, in order,
          along a route you already know by heart. To recall, you simply take the walk again and
          "read off" each image.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5">
          <li>Choose a familiar route with distinct stops (loci).</li>
          <li>Convert each item into an exaggerated, multisensory image.</li>
          <li>Place one image at each stop, interacting with the location.</li>
          <li>To recall, walk the route in order.</li>
        </ol>
      </Panel>
      <Panel className="p-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        <h3 className="mb-2 font-serif text-lg text-ink-900 dark:text-ink-50">
          PAO — Person · Action · Object
        </h3>
        <p>
          For decks of cards, memory athletes assign every card a fixed{' '}
          <strong>Person</strong>, <strong>Action</strong>, and <strong>Object</strong>. Cards then
          combine three at a time: the person of the first card performs the action of the second
          card on the object of the third. One rich scene encodes three cards, so a full deck
          becomes ~17 scenes placed along your palace.
        </p>
        <p className="mt-3">
          Example: if A♠ = "a detective / handcuffing / a pocket-watch", a run of three cards might
          be <em>the detective handcuffing a pocket-watch</em> — a single memorable image at one
          locus.
        </p>
      </Panel>
    </div>
  );
}
