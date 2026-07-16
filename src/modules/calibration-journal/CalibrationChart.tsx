// An SVG calibration plot: stated confidence (x) vs. observed hit-rate (y),
// with the y=x "perfect calibration" diagonal for reference. Bubble size
// encodes how many predictions fall in each bucket.

import { CalibrationBucket } from '../../lib/stats';

export function CalibrationChart({ buckets }: { buckets: CalibrationBucket[] }) {
  const size = 320;
  const pad = 36;
  const plot = size - pad * 2;
  const x = (v: number) => pad + v * plot;
  const y = (v: number) => size - pad - v * plot;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto w-full max-w-sm"
      role="img"
      aria-label="Calibration curve: stated confidence versus actual hit-rate"
    >
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line
            x1={x(t)}
            y1={y(0)}
            x2={x(t)}
            y2={y(1)}
            className="stroke-ink-200 dark:stroke-ink-800"
            strokeWidth={1}
          />
          <line
            x1={x(0)}
            y1={y(t)}
            x2={x(1)}
            y2={y(t)}
            className="stroke-ink-200 dark:stroke-ink-800"
            strokeWidth={1}
          />
          <text x={x(t)} y={size - pad + 16} textAnchor="middle" className="fill-ink-400 text-[9px]">
            {Math.round(t * 100)}%
          </text>
          <text x={pad - 8} y={y(t) + 3} textAnchor="end" className="fill-ink-400 text-[9px]">
            {Math.round(t * 100)}%
          </text>
        </g>
      ))}

      {/* perfect-calibration diagonal */}
      <line
        x1={x(0)}
        y1={y(0)}
        x2={x(1)}
        y2={y(1)}
        className="stroke-brass-400"
        strokeWidth={1.5}
        strokeDasharray="4 4"
      />

      {/* connecting path through the user's buckets */}
      {buckets.length > 1 && (
        <polyline
          fill="none"
          className="stroke-emerald-500"
          strokeWidth={2}
          points={buckets.map((b) => `${x(b.stated)},${y(b.actual)}`).join(' ')}
        />
      )}

      {/* bucket bubbles */}
      {buckets.map((b, i) => (
        <g key={i}>
          <circle
            cx={x(b.stated)}
            cy={y(b.actual)}
            r={4 + Math.min(10, b.count * 1.5)}
            className="fill-emerald-500/30 stroke-emerald-500"
            strokeWidth={1.5}
          />
          <title>
            Stated {Math.round(b.stated * 100)}% · actual {Math.round(b.actual * 100)}% · n={b.count}
          </title>
        </g>
      ))}

      {/* axis labels */}
      <text x={size / 2} y={size - 4} textAnchor="middle" className="fill-ink-500 text-[10px]">
        Stated confidence
      </text>
      <text
        x={12}
        y={size / 2}
        textAnchor="middle"
        transform={`rotate(-90 12 ${size / 2})`}
        className="fill-ink-500 text-[10px]"
      >
        Actual hit-rate
      </text>
    </svg>
  );
}
