// Top navigation shell shared by every page.

import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppState';
import { cx } from '../lib/utils';

function ThemeToggle() {
  const { data, setTheme } = useApp();
  const isDark = data.theme === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navItem = (to: string, label: string) => (
    <Link
      to={to}
      className={cx(
        'rounded-lg px-3 py-1.5 text-sm transition-colors',
        pathname === to
          ? 'bg-ink-100 text-ink-900 dark:bg-ink-800 dark:text-ink-50'
          : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100',
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-ink-800/70 dark:bg-ink-950/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="group flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🧠
            </span>
            <span className="font-serif text-lg tracking-tight text-ink-900 dark:text-ink-50">
              The Mentalist Gym
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItem('/', 'Dashboard')}
            {navItem('/daily', 'Daily')}
            {navItem('/settings', 'Settings')}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-ink-200/60 py-6 text-center text-xs text-ink-400 dark:border-ink-800/60 dark:text-ink-600">
        The Mentalist Gym · train observation, memory & reasoning · all data stays in your browser
      </footer>
    </div>
  );
}
