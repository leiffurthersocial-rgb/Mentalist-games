// A circular countdown indicator used by timed modules.

export function TimerRing({
  remaining,
  total,
  size = 64,
}: {
  remaining: number;
  total: number;
  size?: number;
}) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const frac = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const seconds = Math.ceil(remaining);
  const urgent = remaining <= 5;

  return (
    <div className="relative inline-flex items-center justify-center" aria-hidden>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-ink-200 dark:stroke-ink-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - frac)}
          className={urgent ? 'stroke-red-500 transition-all' : 'stroke-brass-500 transition-all'}
        />
      </svg>
      <span
        className={
          'absolute font-serif text-lg tabular-nums ' +
          (urgent ? 'text-red-500' : 'text-ink-800 dark:text-ink-100')
        }
      >
        {seconds}
      </span>
    </div>
  );
}
