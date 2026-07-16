// Daily routine: a queued short session from each core module. A module counts
// as "done today" once it has a session recorded on the current calendar day.

import { Link } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { CORE_MODULES } from '../lib/registry';
import { Panel, Pill, ProgressBar } from '../components/ui';
import { dayKey } from '../lib/utils';

export default function DailyRoutine() {
  const { data } = useApp();
  const today = dayKey();

  const doneToday = (moduleId: string) =>
    data.sessions.some((s) => s.moduleId === moduleId && dayKey(new Date(s.timestamp)) === today);

  const completed = CORE_MODULES.filter((m) => doneToday(m.id)).length;
  const allDone = completed === CORE_MODULES.length;

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up px-4 pb-16 pt-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brass-500 dark:text-ink-400"
      >
        ← Dashboard
      </Link>

      <header className="mb-6">
        <h1 className="font-serif text-2xl text-ink-900 dark:text-ink-50">Today's routine</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          A short session from each core skill. Small, daily reps beat rare marathons.
        </p>
      </header>

      <Panel className="mb-6 p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {completed} / {CORE_MODULES.length} done today
          </span>
          {allDone && <Pill tone="good">Routine complete 🎉</Pill>}
        </div>
        <ProgressBar value={completed} max={CORE_MODULES.length} />
        {allDone && (
          <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
            Nicely done — you've touched every core skill today. Come back tomorrow to keep the
            streak alive.
          </p>
        )}
      </Panel>

      <ol className="space-y-3">
        {CORE_MODULES.map((m, i) => {
          const done = doneToday(m.id);
          return (
            <li key={m.id}>
              <Link
                to={`/m/${m.id}`}
                className="flex items-center gap-4 rounded-2xl border border-ink-200 p-4 transition-colors hover:border-brass-400 dark:border-ink-800"
              >
                <span
                  className={
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ' +
                    (done
                      ? 'bg-emerald-500 text-white'
                      : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300')
                  }
                >
                  {done ? '✓' : i + 1}
                </span>
                <span className="text-2xl" aria-hidden>
                  {m.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink-900 dark:text-ink-50">{m.name}</div>
                  <div className="truncate text-sm text-ink-500 dark:text-ink-400">{m.skill}</div>
                </div>
                <span className="text-ink-300">{done ? '' : '→'}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
