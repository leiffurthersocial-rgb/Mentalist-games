// Procedurally generate an observable "scene" plus a set of multiple-choice
// questions derived from its ground-truth details. Everything is generated
// together so the questions can never disagree with what was shown.

import { randInt, randomOf, sample, shuffle } from '../../lib/utils';

const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'grey'];
const HAIR = ['blonde', 'brown', 'black', 'red', 'grey'];
const TABLE_OBJECTS = ['📕', '☕', '🔑', '📱', '🕯️', '🍎', '💐', '🍷', '📷', '🖊️', '🎩', '🧦'];
const WALL_ITEMS = ['🖼️ a painting', '🕰️ a clock', '🪞 a mirror', '🗺️ a map', '📅 a calendar'];
const WEATHER = ['sunny', 'raining', 'snowing', 'foggy'];
const PETS = ['a cat', 'a dog', 'no pet', 'a parrot'];

export interface Question {
  prompt: string;
  answer: string;
  options: string[];
}

export interface Scene {
  /** Human-readable lines describing the room. */
  lines: string[];
  /** Emoji objects on the table (for a visual row). */
  tableObjects: string[];
  questions: Question[];
}

function q(prompt: string, answer: string, distractors: string[]): Question {
  const options = shuffle([answer, ...sample(distractors.filter((d) => d !== answer), 3)]);
  return { prompt, answer, options };
}

export function generateScene(): Scene {
  const peopleCount = randInt(2, 5);
  const sittingCount = randInt(0, peopleCount);
  const shirtColor = randomOf(COLORS);
  const hair = randomOf(HAIR);
  const tableObjects = sample(TABLE_OBJECTS, randInt(3, 5));
  const wall = randomOf(WALL_ITEMS);
  const weather = randomOf(WEATHER);
  const pet = randomOf(PETS);
  const clockTime = `${randInt(1, 12)}:${randomOf(['00', '15', '30', '45'])}`;
  const windowOpen = Math.random() < 0.5;

  const lines = [
    `There are ${peopleCount} people in the room; ${sittingCount} of them are seated.`,
    `One person stands out in a ${shirtColor} shirt, with ${hair} hair.`,
    `On the table you can see: ${tableObjects.join('  ')}.`,
    `On the wall hangs ${wall}, reading ${clockTime}.`,
    `Through the window it is ${weather}; the window is ${windowOpen ? 'open' : 'closed'}.`,
    `In the corner there is ${pet}.`,
  ];

  const questions: Question[] = [
    q('How many people were in the room?', String(peopleCount), ['1', '2', '3', '4', '5', '6']),
    q('How many people were seated?', String(sittingCount), ['0', '1', '2', '3', '4', '5']),
    q('What colour was the standout shirt?', shirtColor, COLORS),
    q("What was the standout person's hair colour?", hair, HAIR),
    q('What time did the wall clock read?', clockTime, [
      `${randInt(1, 12)}:00`,
      `${randInt(1, 12)}:30`,
      `${randInt(1, 12)}:15`,
      `${randInt(1, 12)}:45`,
    ]),
    q('What was the weather through the window?', weather, WEATHER),
    q('Was the window open or closed?', windowOpen ? 'open' : 'closed', ['open', 'closed']),
    q('What was in the corner?', pet, PETS),
    q(
      'Which of these was NOT on the table?',
      randomOf(TABLE_OBJECTS.filter((o) => !tableObjects.includes(o))),
      tableObjects,
    ),
  ];

  return { lines, tableObjects, questions: shuffle(questions).slice(0, 6) };
}
