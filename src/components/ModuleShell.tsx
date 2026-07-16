// Common chrome for every training module: back link, title, the "why this
// works" blurb, best-score badge, and a slot for the module's own UI.

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ModuleMeta } from '../types';
import { useApp } from '../context/AppState';
import { Panel, Pill } from './ui';

export function ModuleShell({
  meta,
  children,
}: {
  meta: ModuleMeta;
  children: ReactNode;
}) {
  const { data } = useApp();
  const [showWhy, setShowWhy] = useState(false);
  const progress = data.progress[meta.id];

  return (
    <div className="mx-auto w-full max-w-3xl animate-fade-up px-4 pb-16 pt-6 sm:pt-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brass-500 dark:text-ink-400"
      >
        ← All modules
      </Link>

      <header className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {meta.emoji}
            </span>
            <div>
              <h1 className="font-serif text-2xl text-ink-900 dark:text-ink-50">{meta.name}</h1>
              <p className="text-sm text-ink-500 dark:text-ink-400">{meta.tagline}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill tone="brass">{meta.category}</Pill>
          <Pill>Trains: {meta.skill}</Pill>
          {progress && <Pill tone="good">Best {progress.bestScore}</Pill>}
        </div>

        <button
          onClick={() => setShowWhy((v) => !v)}
          className="mt-3 text-xs text-brass-600 hover:underline dark:text-brass-300"
          aria-expanded={showWhy}
        >
          {showWhy ? 'Hide' : 'Why this works & what to read →'}
        </button>
        {showWhy && (
          <Panel className="mt-3 p-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
            <p>{meta.why}</p>
            <p className="mt-3 text-xs text-ink-500 dark:text-ink-400">
              <span className="font-medium">Recommended reading:</span> {meta.book}
            </p>
          </Panel>
        )}
      </header>

      {children}
    </div>
  );
}
