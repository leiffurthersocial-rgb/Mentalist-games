// Dashboard: a card per module.

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { MODULES } from '../lib/registry';
import { Pill } from '../components/ui';
import { cx, relativeDay } from '../lib/utils';

export default function Home() {
  const { data } = useApp();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8">
      {/* Hero */}
      <section className="mb-8 text-center animate-fade-up">
        <h1 className="font-serif text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
          Train like a mentalist
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">
          Eight drills for observation, memory, calibrated reasoning, and reading people — the real
          skills behind the mind-reading act. A quiet study, not an arcade.
        </p>
      </section>

      {/* Daily routine CTA */}
      <Link
        to="/daily"
        className="mb-8 flex items-center justify-between rounded-2xl border border-brass-500/30 bg-brass-500/5 p-4 transition-colors hover:bg-brass-500/10"
      >
        <div>
          <div className="font-medium text-ink-900 dark:text-ink-50">Today's routine</div>
          <div className="text-sm text-ink-500 dark:text-ink-400">
            One short session from each core skill.
          </div>
        </div>
        <span className="text-brass-500">→</span>
      </Link>

      {/* Module grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m, i) => {
          const p = data.progress[m.id];
          return (
            <Link
              key={m.id}
              to={`/m/${m.id}`}
              className={cx(
                'group flex flex-col rounded-2xl border border-ink-200 bg-white/70 p-5 shadow-soft transition-all',
                'hover:-translate-y-0.5 hover:border-brass-400 hover:shadow-md',
                'dark:border-ink-800 dark:bg-ink-900/60 dark:shadow-soft-dark',
                'animate-fade-up',
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="text-3xl" aria-hidden>
                  {m.emoji}
                </span>
                {m.core && <Pill tone="brass">core</Pill>}
              </div>
              <h3 className="font-serif text-lg text-ink-900 dark:text-ink-50">{m.name}</h3>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{m.tagline}</p>

              <div className="mt-3 text-xs text-ink-400">
                <span className="font-medium text-ink-500 dark:text-ink-300">Trains:</span> {m.skill}
              </div>

              <div className="mt-auto flex items-center gap-2 pt-4 text-xs">
                <Pill tone={p ? 'good' : 'neutral'}>
                  {p ? `Best ${p.bestScore}` : 'Not started'}
                </Pill>
                <span className="text-ink-400">{relativeDay(p?.lastPracticed ?? null)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
