// Persistence layer: load/save the single AppData blob to localStorage,
// with schema-versioned migrations and JSON export/import.

import { AppData, SCHEMA_VERSION, Theme } from '../types';

const STORAGE_KEY = 'mentalist-gym:data';

export function defaultData(): AppData {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: Date.now(),
    theme: 'dark',
    progress: {},
    sessions: [],
    predictions: [],
    palaces: [],
    settings: {},
    emotionStats: {},
    streak: { current: 0, longest: 0, lastDay: null },
    dailyRoutine: { lastCompletedDay: null },
  };
}

/**
 * Migrate an older save forward. Each version bump adds a case that transforms
 * data from the previous shape. Keeping this pure and additive means updates
 * never silently discard a user's history.
 */
function migrate(raw: unknown): AppData {
  const base = defaultData();
  if (!raw || typeof raw !== 'object') return base;

  const data = raw as Partial<AppData> & { schemaVersion?: number };

  // Merge conservatively so any field missing from an older save falls back to
  // the current default rather than becoming undefined.
  const merged: AppData = {
    ...base,
    ...data,
    progress: { ...base.progress, ...(data.progress ?? {}) },
    sessions: data.sessions ?? base.sessions,
    predictions: data.predictions ?? base.predictions,
    palaces: data.palaces ?? base.palaces,
    settings: { ...base.settings, ...(data.settings ?? {}) },
    emotionStats: { ...base.emotionStats, ...(data.emotionStats ?? {}) },
    streak: { ...base.streak, ...(data.streak ?? {}) },
    dailyRoutine: { ...base.dailyRoutine, ...(data.dailyRoutine ?? {}) },
  };

  // --- Migration ladder -----------------------------------------------------
  // Example for future versions:
  //   if (merged.schemaVersion < 2) { /* transform */ merged.schemaVersion = 2; }
  // ------------------------------------------------------------------------

  merged.schemaVersion = SCHEMA_VERSION;
  return merged;
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    return migrate(JSON.parse(raw));
  } catch (err) {
    console.warn('Could not read saved data; starting fresh.', err);
    return defaultData();
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Could not persist data.', err);
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear data.', err);
  }
}

/** Serialise all data to a formatted JSON string for download. */
export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

/** Parse and validate an imported JSON string, running it through migration. */
export function importData(json: string): AppData {
  const parsed = JSON.parse(json);
  return migrate(parsed);
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}
