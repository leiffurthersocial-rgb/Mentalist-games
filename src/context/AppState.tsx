// App-wide state: the single AppData object, persisted to localStorage on every
// change, exposed through a React context with typed helper actions.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { AppData, ModuleId, Theme } from '../types';
import {
  applyTheme,
  defaultData,
  importData as parseImport,
  loadData,
  saveData,
} from '../lib/storage';
import { recordSession as recordSessionPure } from '../lib/stats';

interface AppStateValue {
  data: AppData;
  setData: (updater: (prev: AppData) => AppData) => void;
  recordSession: (
    moduleId: ModuleId,
    score: number,
    durationMs: number,
    meta?: Record<string, unknown>,
  ) => void;
  getSetting: <T extends number | string | boolean>(
    moduleId: string,
    key: string,
    fallback: T,
  ) => T;
  setSetting: (moduleId: string, key: string, value: number | string | boolean) => void;
  setTheme: (theme: Theme) => void;
  resetProgress: () => void;
  importJSON: (json: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<AppData>(() => loadData());

  // Apply the persisted theme on first mount.
  useEffect(() => {
    applyTheme(data.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change (debounced via microtask batching by React).
  useEffect(() => {
    saveData(data);
  }, [data]);

  const setData = useCallback((updater: (prev: AppData) => AppData) => {
    setDataState((prev) => updater(prev));
  }, []);

  const recordSession = useCallback<AppStateValue['recordSession']>(
    (moduleId, score, durationMs, meta) => {
      setDataState((prev) => recordSessionPure(prev, moduleId, score, durationMs, meta));
    },
    [],
  );

  const getSetting = useCallback<AppStateValue['getSetting']>(
    (moduleId, key, fallback) => {
      const v = data.settings[moduleId]?.[key];
      return (v === undefined ? fallback : v) as typeof fallback;
    },
    [data.settings],
  );

  const setSetting = useCallback<AppStateValue['setSetting']>((moduleId, key, value) => {
    setDataState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [moduleId]: { ...(prev.settings[moduleId] ?? {}), [key]: value },
      },
    }));
  }, []);

  const setTheme = useCallback<AppStateValue['setTheme']>((theme) => {
    applyTheme(theme);
    setDataState((prev) => ({ ...prev, theme }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = defaultData();
    // Preserve the current theme choice across a reset.
    setDataState((prev) => ({ ...fresh, theme: prev.theme }));
  }, []);

  const importJSON = useCallback<AppStateValue['importJSON']>((json) => {
    const imported = parseImport(json);
    applyTheme(imported.theme);
    setDataState(imported);
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      data,
      setData,
      recordSession,
      getSetting,
      setSetting,
      setTheme,
      resetProgress,
      importJSON,
    }),
    [data, setData, recordSession, getSetting, setSetting, setTheme, resetProgress, importJSON],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useApp(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useApp must be used within AppStateProvider');
  return ctx;
}

export type { AppStateValue };
