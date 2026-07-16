// Generator for everyday mental-arithmetic problems: plain sums plus real-life
// framings (tips, discounts, splitting bills, percentages). Every problem has
// an integer answer so checking is unambiguous.

import { randInt, randomOf } from '../../lib/utils';

export interface MathProblem {
  text: string;
  answer: number;
}

function add(): MathProblem {
  const a = randInt(12, 89);
  const b = randInt(12, 89);
  return { text: `${a} + ${b}`, answer: a + b };
}

function subtract(): MathProblem {
  const a = randInt(30, 99);
  const b = randInt(5, a - 1);
  return { text: `${a} − ${b}`, answer: a - b };
}

function multiply(): MathProblem {
  const a = randInt(3, 12);
  const b = randInt(3, 12);
  return { text: `${a} × ${b}`, answer: a * b };
}

function percentOf(): MathProblem {
  const pct = randomOf([10, 20, 25, 50, 5]);
  const base = randInt(2, 20) * 20; // multiple of 20 keeps it integer
  return { text: `${pct}% of ${base}`, answer: (pct * base) / 100 };
}

function tip(): MathProblem {
  const pct = randomOf([10, 15, 20]);
  const bill = randInt(2, 12) * 10; // multiple of 10
  return { text: `A ${pct}% tip on a $${bill} bill`, answer: (pct * bill) / 100 };
}

function discount(): MathProblem {
  const pct = randomOf([10, 20, 25, 50]);
  const price = randInt(2, 16) * 20; // multiple of 20
  const off = (pct * price) / 100;
  return { text: `A $${price} jacket is ${pct}% off. Final price?`, answer: price - off };
}

function split(): MathProblem {
  const people = randomOf([2, 3, 4, 5]);
  const each = randInt(4, 20);
  const total = each * people;
  return { text: `Split a $${total} bill ${people} ways. Each pays?`, answer: each };
}

function doubleIt(): MathProblem {
  const a = randInt(24, 78);
  return { text: `Double ${a}`, answer: a * 2 };
}

const GENERATORS = [add, add, subtract, subtract, multiply, multiply, percentOf, tip, discount, split, doubleIt];

export function generateProblem(): MathProblem {
  return randomOf(GENERATORS)();
}
