// Settings: theme toggle, export/import all data as JSON, and a guarded reset.

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { Button, Panel } from '../components/ui';
import { exportData } from '../lib/storage';
import { overallStats } from '../lib/stats';

export default function Settings() {
  const { data, setTheme, resetProgress, importJSON } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const stats = overallStats(data);

  function download() {
    const blob = new Blob([exportData(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mentalist-gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage({ kind: 'ok', text: 'Backup downloaded.' });
  }

  function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJSON(String(reader.result));
        setMessage({ kind: 'ok', text: 'Data imported successfully.' });
      } catch {
        setMessage({ kind: 'err', text: 'That file could not be read as valid backup JSON.' });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // allow re-importing the same file
  }

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up px-4 pb-16 pt-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brass-500 dark:text-ink-400"
      >
        ← Dashboard
      </Link>
      <h1 className="mb-6 font-serif text-2xl text-ink-900 dark:text-ink-50">Settings</h1>

      {message && (
        <div
          className={
            'mb-6 rounded-xl px-4 py-3 text-sm ' +
            (message.kind === 'ok'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'bg-red-500/10 text-red-700 dark:text-red-300')
          }
        >
          {message.text}
        </div>
      )}

      {/* Appearance */}
      <Panel className="mb-6 p-5">
        <h2 className="mb-1 font-serif text-lg">Appearance</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
          Choose the mood of your study.
        </p>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={
                'flex-1 rounded-xl border p-3 text-sm capitalize transition-colors ' +
                (data.theme === t
                  ? 'border-brass-500 bg-brass-500/10'
                  : 'border-ink-200 hover:border-ink-300 dark:border-ink-800')
              }
            >
              {t === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          ))}
        </div>
      </Panel>

      {/* Data */}
      <Panel className="mb-6 p-5">
        <h2 className="mb-1 font-serif text-lg">Your data</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
          Everything is stored only in this browser ({stats.totalSessions} sessions,{' '}
          {data.predictions.length} predictions, {data.palaces.length} palaces). Export a backup or
          move it to another device.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={download}>⬇ Export JSON</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            ⬆ Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onImportFile}
          />
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Importing replaces your current data with the contents of the backup file.
        </p>
      </Panel>

      {/* Danger zone */}
      <Panel className="border-red-400/30 p-5">
        <h2 className="mb-1 font-serif text-lg text-red-600 dark:text-red-400">Reset progress</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">
          Permanently erase all scores, streaks, predictions, palaces, and settings. This cannot be
          undone — export a backup first if unsure.
        </p>
        {!confirmReset ? (
          <Button variant="outline" onClick={() => setConfirmReset(true)}>
            Reset everything…
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink-600 dark:text-ink-300">Are you sure?</span>
            <Button
              variant="danger"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setMessage({ kind: 'ok', text: 'All progress has been reset.' });
              }}
            >
              Yes, erase everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Panel>
    </div>
  );
}
