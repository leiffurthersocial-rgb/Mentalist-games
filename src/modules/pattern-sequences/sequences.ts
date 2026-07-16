// Procedural generator for number-sequence puzzles. Each puzzle shows a few
// terms and asks for the next; several rule families keep them varied. Every
// puzzle is generated together with its answer and plausible distractors, so
// they're always internally consistent.

import { randInt, randomOf, shuffle } from '../../lib/utils';

export interface Sequence {
  terms: number[];
  answer: number;
  options: number[];
  rule: string;
}

/** Build 4 unique options including the answer, seeded with plausible wrongs. */
function makeOptions(answer: number, candidates: number[]): number[] {
  const set = new Set<number>([answer]);
  for (const c of candidates) {
    if (set.size >= 4) break;
    if (c !== answer && Number.isFinite(c)) set.add(c);
  }
  let k = 1;
  while (set.size < 4) {
    const cand = answer + (k % 2 === 0 ? k : -k);
    if (cand !== answer) set.add(cand);
    k++;
  }
  return shuffle([...set]);
}

type Generator = () => Sequence;

const arithmetic: Generator = () => {
  const a = randInt(1, 12);
  const d = randomOf([2, 3, 4, 5, 6, 7, -3, -4]);
  const terms = Array.from({ length: 5 }, (_, i) => a + i * d);
  const answer = a + 5 * d;
  return {
    terms,
    answer,
    options: makeOptions(answer, [answer + d, answer - d, answer + 2 * d]),
    rule: `Add ${d} each step`,
  };
};

const geometric: Generator = () => {
  const a = randInt(1, 4);
  const r = randomOf([2, 3]);
  const terms = Array.from({ length: 5 }, (_, i) => a * r ** i);
  const answer = a * r ** 5;
  return {
    terms,
    answer,
    options: makeOptions(answer, [answer + terms[4], answer - terms[4], terms[4] * (r + 1)]),
    rule: `Multiply by ${r} each step`,
  };
};

const fibonacci: Generator = () => {
  let x = randInt(1, 4);
  let y = randInt(2, 6);
  const terms = [x, y];
  for (let i = 0; i < 3; i++) {
    const next = x + y;
    terms.push(next);
    x = y;
    y = next;
  }
  const answer = x + y;
  return {
    terms,
    answer,
    options: makeOptions(answer, [answer + terms[4], answer - terms[3], terms[4] + terms[3] + 1]),
    rule: 'Each term is the sum of the previous two',
  };
};

const alternating: Generator = () => {
  const a = randInt(1, 8);
  const d1 = randInt(2, 6);
  const d2 = randInt(3, 9);
  const terms = [a];
  for (let i = 1; i < 6; i++) {
    terms.push(terms[i - 1] + (i % 2 === 1 ? d1 : d2));
  }
  const answer = terms[5] + d1; // next step uses d1 again
  return {
    terms,
    answer,
    options: makeOptions(answer, [terms[5] + d2, answer + 1, answer - d1]),
    rule: `Alternately add ${d1} and ${d2}`,
  };
};

const quadratic: Generator = () => {
  // Differences increase by a constant (e.g. 2, 5, 10, 17 → +3, +5, +7).
  const a = randInt(1, 6);
  const firstDiff = randInt(2, 5);
  const step = randInt(1, 3);
  const terms = [a];
  let diff = firstDiff;
  for (let i = 1; i < 5; i++) {
    terms.push(terms[i - 1] + diff);
    diff += step;
  }
  const answer = terms[4] + diff;
  return {
    terms,
    answer,
    options: makeOptions(answer, [terms[4] + diff - step, answer + step, answer - 1]),
    rule: `Differences grow by ${step} each step`,
  };
};

const doubleMinus: Generator = () => {
  const a = randInt(2, 6);
  const sub = randInt(1, 3);
  const terms = [a];
  for (let i = 1; i < 5; i++) terms.push(terms[i - 1] * 2 - sub);
  const answer = terms[4] * 2 - sub;
  return {
    terms,
    answer,
    options: makeOptions(answer, [terms[4] * 2, answer + sub, answer - sub]),
    rule: `Double, then subtract ${sub}`,
  };
};

const GENERATORS: Generator[] = [
  arithmetic,
  arithmetic,
  geometric,
  fibonacci,
  alternating,
  quadratic,
  doubleMinus,
];

export function generateSequence(): Sequence {
  return randomOf(GENERATORS)();
}
