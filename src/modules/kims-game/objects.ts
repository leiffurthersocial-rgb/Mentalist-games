// A broad pool of visually distinct emoji "objects" for Kim's Game. Kept
// varied (tools, food, nature, symbols) so distractors are plausible but
// distinguishable.

export const OBJECT_POOL: string[] = [
  '🔑', '🗝️', '⌚', '📎', '✂️', '🔒', '🔦', '🕯️', '🧭', '⏳',
  '📌', '🖊️', '📕', '🔮', '🎲', '🧩', '🪙', '💍', '🔗', '🧵',
  '🪡', '🔨', '🪛', '🔧', '🪝', '🧲', '💡', '🔋', '📷', '🎞️',
  '🗜️', '⚖️', '🔬', '🔭', '📐', '📏', '🧮', '💊', '🩹', '🌡️',
  '🍎', '🍋', '🍒', '🥑', '🌰', '🍄', '🌿', '🍁', '🌸', '🐚',
  '🪶', '🦴', '🥄', '🍶', '🫖', '☕', '🧊', '🧀', '🥨', '🍯',
  '🎹', '🎻', '🥁', '🎺', '🪕', '🎯', '♟️', '🃏', '🎭', '🖼️',
  '📮', '✉️', '📜', '🏺', '⚱️', '🔱', '⚓', '🧿', '📿', '🪬',
  // Extended pool — more categories for larger, harder rounds.
  '🪀', '🎈', '🪁', '🎀', '🏮', '🪔', '⚗️', '🧪', '🩺', '💉',
  '🔩', '⚙️', '🧰', '🪚', '🧯', '🔫', '🗡️', '🛡️', '🏹', '🪃',
  '🧸', '🎁', '🕹️', '💾', '💿', '📼', '☎️', '⏰', '🪺', '🔖',
  '🎷', '🪗', '🎸', '🪈', '🔔', '🎐', '🧶', '🪢', '🖇️', '🪆',
  '🍇', '🍓', '🥝', '🌶️', '🫐', '🥕', '🧄', '🧅', '🌽', '🥜',
  '🐌', '🦋', '🐞', '🕷️', '🦂', '🐢', '🦎', '🐙', '⭐', '🌙',
];

/** Return `count` distinct objects, plus a set of distractors for the recall grid. */
export function makeRound(count: number, distractorRatio = 1) {
  const shuffled = [...OBJECT_POOL].sort(() => Math.random() - 0.5);
  const present = shuffled.slice(0, count);
  const distractorCount = Math.min(
    shuffled.length - count,
    Math.round(count * distractorRatio),
  );
  const distractors = shuffled.slice(count, count + distractorCount);
  const choices = [...present, ...distractors].sort(() => Math.random() - 0.5);
  return { present, choices };
}
