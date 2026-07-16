// Shared, presentational building blocks. Kept in one file so modules can pull
// a consistent visual language from a single import.

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../lib/utils';

// --- Panel / Card -----------------------------------------------------------

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        'rounded-2xl border border-ink-200 bg-white/70 shadow-soft',
        'dark:border-ink-800 dark:bg-ink-900/60 dark:shadow-soft-dark',
        'backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Button -----------------------------------------------------------------

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors ' +
    'focus-visible:outline focus-visible:outline-2 disabled:opacity-40 disabled:cursor-not-allowed select-none';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };
  const variants = {
    primary: 'bg-brass-500 text-ink-950 hover:bg-brass-400 active:bg-brass-600',
    ghost: 'text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800',
    outline:
      'border border-ink-300 text-ink-800 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800',
    danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
  };
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

// --- Section heading --------------------------------------------------------

export function SectionTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-xl text-ink-900 dark:text-ink-50">{children}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{subtitle}</p>}
    </div>
  );
}

// --- Pill / badge -----------------------------------------------------------

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brass' | 'good' | 'bad';
}) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
    brass: 'bg-brass-500/15 text-brass-700 dark:text-brass-300',
    good: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    bad: 'bg-red-500/15 text-red-700 dark:text-red-300',
  };
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

// --- Big stat display -------------------------------------------------------

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-2xl text-ink-900 dark:text-ink-50 sm:text-3xl">{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wide text-ink-500 dark:text-ink-400">
        {label}
      </div>
    </div>
  );
}

// --- Progress bar -----------------------------------------------------------

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
      <div
        className="h-full rounded-full bg-brass-500 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}

// --- Score result banner ----------------------------------------------------

export function ScoreBanner({
  score,
  detail,
}: {
  score: number;
  detail?: ReactNode;
}) {
  const tone = score >= 80 ? 'good' : score >= 50 ? 'brass' : 'bad';
  const toneClass = {
    good: 'text-emerald-600 dark:text-emerald-400',
    brass: 'text-brass-600 dark:text-brass-300',
    bad: 'text-red-600 dark:text-red-400',
  }[tone];
  return (
    <div className="text-center">
      <div className={cx('font-serif text-5xl font-semibold', toneClass)}>{Math.round(score)}</div>
      <div className="mt-1 text-sm text-ink-500 dark:text-ink-400">out of 100</div>
      {detail && <div className="mt-3 text-sm text-ink-600 dark:text-ink-300">{detail}</div>}
    </div>
  );
}
