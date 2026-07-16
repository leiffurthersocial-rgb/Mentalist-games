// A single rendered playing card.

import { Card, isRed } from './cards';
import { cx } from '../../lib/utils';

export function CardFace({
  card,
  size = 'md',
  dim = false,
  selected = false,
}: {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  dim?: boolean;
  selected?: boolean;
}) {
  const red = isRed(card.suit);
  const sizes = {
    sm: 'w-10 h-14 text-sm rounded-md',
    md: 'w-16 h-24 text-lg rounded-lg',
    lg: 'w-40 h-56 text-3xl rounded-2xl',
  };
  return (
    <div
      className={cx(
        'relative flex flex-col justify-between border bg-white p-1.5 shadow-soft dark:bg-ink-100',
        sizes[size],
        selected && 'ring-2 ring-brass-500',
        dim && 'opacity-30',
        red ? 'text-red-600' : 'text-ink-900',
        'border-ink-200',
      )}
    >
      <span className="font-semibold leading-none">{card.rank}</span>
      <span className={cx('self-center', size === 'lg' ? 'text-6xl' : 'text-2xl')}>{card.suit}</span>
      <span className="self-end font-semibold leading-none">{card.rank}</span>
    </div>
  );
}
