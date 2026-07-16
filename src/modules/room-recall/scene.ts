// Procedurally generate an observable "scene" plus a set of multiple-choice
// questions derived from its ground-truth details. Everything is generated
// together so the questions can never disagree with what was shown.

import { randInt, randomOf, sample, shuffle } from '../../lib/utils';

const COLORS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'grey', 'orange', 'teal'];
const HAIR = ['blonde', 'brown', 'black', 'red', 'grey', 'silver'];
const TABLE_OBJECTS = ['📕', '☕', '🔑', '📱', '🕯️', '🍎', '💐', '🍷', '📷', '🖊️', '🎩', '🧦', '🔦', '🧭', '🍇', '🕹️'];
const WALL_ITEMS = ['🖼️ a painting', '🕰️ a clock', '🪞 a mirror', '🗺️ a map', '📅 a calendar', '📜 a certificate'];
const WEATHER = ['sunny', 'raining', 'snowing', 'foggy', 'overcast', 'windy'];
const PETS = ['a cat', 'a dog', 'no pet', 'a parrot', 'a goldfish', 'a rabbit'];
const CARRIED = ['a briefcase', 'an umbrella', 'a bunch of flowers', 'a laptop bag', 'nothing', 'a small suitcase'];
const LIGHTING = ['a bright overhead light', 'a single desk lamp', 'candlelight', 'daylight only'];
const FLOOR = ['bare wood', 'a red rug', 'a chequered tile', 'a blue carpet', 'grey concrete'];
const SOUNDS = ['music playing softly', 'a ticking clock', 'complete silence', 'rain on the glass', 'a distant television'];

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
  const peopleCount = randInt(2, 6);
  const sittingCount = randInt(0, peopleCount);
  const shirtColor = randomOf(COLORS);
  const hair = randomOf(HAIR);
  const carried = randomOf(CARRIED);
  const tableObjects = sample(TABLE_OBJECTS, randInt(3, 5));
  const wall = randomOf(WALL_ITEMS);
  const weather = randomOf(WEATHER);
  const pet = randomOf(PETS);
  const lighting = randomOf(LIGHTING);
  const floor = randomOf(FLOOR);
  const sound = randomOf(SOUNDS);
  const clockTime = `${randInt(1, 12)}:${randomOf(['00', '15', '30', '45'])}`;
  const windowOpen = Math.random() < 0.5;

  const lines = [
    `There are ${peopleCount} people in the room; ${sittingCount} of them are seated.`,
    `One person stands out in a ${shirtColor} shirt, with ${hair} hair, carrying ${carried}.`,
    `On the table you can see: ${tableObjects.join('  ')}.`,
    `On the wall hangs ${wall}, reading ${clockTime}.`,
    `Through the window it is ${weather}; the window is ${windowOpen ? 'open' : 'closed'}.`,
    `The room is lit by ${lighting}, the floor is ${floor}.`,
    `In the corner there is ${pet}, and you can hear ${sound}.`,
  ];

  // Build a pool of questions; a random six are shown each round so repeated
  // plays of the same scene still feel fresh.
  const questions: Question[] = [
    q('How many people were in the room?', String(peopleCount), ['1', '2', '3', '4', '5', '6', '7']),
    q('How many people were seated?', String(sittingCount), ['0', '1', '2', '3', '4', '5', '6']),
    q('What colour was the standout shirt?', shirtColor, COLORS),
    q("What was the standout person's hair colour?", hair, HAIR),
    q('What was the standout person carrying?', carried, CARRIED),
    q('What time did the wall clock read?', clockTime, [
      `${randInt(1, 12)}:00`,
      `${randInt(1, 12)}:30`,
      `${randInt(1, 12)}:15`,
      `${randInt(1, 12)}:45`,
    ]),
    q('What hung on the wall?', wall, WALL_ITEMS),
    q('What was the weather through the window?', weather, WEATHER),
    q('Was the window open or closed?', windowOpen ? 'open' : 'closed', ['open', 'closed']),
    q('How was the room lit?', lighting, LIGHTING),
    q('What was the floor?', floor, FLOOR),
    q('What could you hear?', sound, SOUNDS),
    q('What was in the corner?', pet, PETS),
    q(
      'Which of these was NOT on the table?',
      randomOf(TABLE_OBJECTS.filter((o) => !tableObjects.includes(o))),
      tableObjects,
    ),
  ];

  return { lines, tableObjects, questions: shuffle(questions).slice(0, 8) };
}
